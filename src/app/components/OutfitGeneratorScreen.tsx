import { useState } from "react";
import { Sparkles, Wand2, RefreshCw, Heart, Share2, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const GENERATED_OUTFITS = [
  {
    id: 1,
    name: "Effortless Tailoring",
    vibe: "Business Casual",
    items: [
      { name: "Cream Blazer", brand: "Arket", owned: true, img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=120&h=150&fit=crop&auto=format" },
      { name: "Wide-Leg Trousers", brand: "COS", owned: true, img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=120&h=150&fit=crop&auto=format" },
      { name: "White Sneakers", brand: "Common Projects", owned: true, img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=120&h=150&fit=crop&auto=format" },
    ],
    previewImg: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=500&h=640&fit=crop&auto=format",
    weather: "18°C Partly Cloudy",
    event: "Team Presentation",
    score: 97,
    liked: false,
  },
  {
    id: 2,
    name: "Sunday Softness",
    vibe: "Casual",
    items: [
      { name: "Linen Shirt", brand: "Uniqlo", owned: true, img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=120&h=150&fit=crop&auto=format" },
      { name: "Mom Jeans", brand: "Agolde", owned: true, img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=120&h=150&fit=crop&auto=format" },
      { name: "White Sneakers", brand: "Common Projects", owned: true, img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=120&h=150&fit=crop&auto=format" },
    ],
    previewImg: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=500&h=640&fit=crop&auto=format",
    weather: "22°C Sunny",
    event: "Brunch",
    score: 94,
    liked: true,
  },
  {
    id: 3,
    name: "Evening Silk",
    vibe: "Evening",
    items: [
      { name: "Silk Slip Dress", brand: "Reformation", owned: true, img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=120&h=150&fit=crop&auto=format" },
      { name: "Leather Boots", brand: "Totême", owned: true, img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=120&h=150&fit=crop&auto=format" },
      { name: "Mini Bag", brand: "Bottega", owned: false, price: 180, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&h=150&fit=crop&auto=format" },
    ],
    previewImg: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=500&h=640&fit=crop&auto=format",
    weather: "16°C Clear",
    event: "Dinner",
    score: 91,
    liked: false,
  },
];

const PROMPT_SUGGESTIONS = [
  "Y2K aesthetic with blue jeans",
  "Smart casual for Friday meeting",
  "Cosy autumn layers",
  "Minimalist neutral tones",
];

export function OutfitGeneratorScreen() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState(GENERATED_OUTFITS);
  const [selectedOutfit, setSelectedOutfit] = useState<typeof GENERATED_OUTFITS[0] | null>(null);
  const [shopToggle, setShopToggle] = useState(false);
  const [budget, setBudget] = useState("150");
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const toggleLike = (id: number) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, liked: !o.liked } : o));
  };

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)" }}>
          AI Stylist
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
          Describe your vibe or occasion
        </p>
      </div>

      {/* Prompt Input */}
      <div className="px-5 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--card)", boxShadow: "0 4px 16px rgba(169,139,227,0.12)", border: "1px solid var(--border)" }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g. "Give me a Y2K aesthetic using my blue jeans"'
            rows={3}
            className="w-full bg-transparent outline-none text-sm resize-none"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
          />
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {PROMPT_SUGGESTIONS.slice(0, 2).map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all"
              style={{
                background: generating ? "var(--muted)" : "var(--primary)",
                color: generating ? "var(--muted-foreground)" : "var(--primary-foreground)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
              }}
            >
              {generating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Styling…
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shop Toggle */}
        <div
          className="mt-3 p-4 rounded-2xl flex items-center justify-between"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>
              <ShoppingBag size={14} className="inline mr-1.5" style={{ color: "var(--accent)" }} />
              Shop the Look
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
              Include marketplace items in suggestions
            </p>
          </div>
          <button
            onClick={() => { setShopToggle(!shopToggle); setShowBudgetInput(!shopToggle); }}
            className="w-11 h-6 rounded-full relative transition-all"
            style={{ background: shopToggle ? "var(--accent)" : "var(--muted)" }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-1 transition-all"
              style={{ background: "white", left: shopToggle ? "calc(100% - 1.25rem)" : "0.25rem" }}
            />
          </button>
        </div>

        {showBudgetInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          >
            <span className="text-sm" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>Max budget: £</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
            />
          </motion.div>
        )}
      </div>

      {/* Suggestions row */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PROMPT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
              style={{
                background: prompt === s ? "var(--primary)" : "var(--card)",
                color: prompt === s ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "var(--font-body)",
                border: "1px solid var(--border)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Outfits */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--foreground)" }}>
              {generating ? "Generating outfits…" : "Your Outfits"}
            </h2>
          </div>
          <button
            className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
            style={{ background: "var(--card)", color: "var(--muted-foreground)", fontFamily: "var(--font-body)", border: "1px solid var(--border)" }}
            onClick={handleGenerate}
          >
            <RefreshCw size={11} />
            More
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {outfits.map((outfit, i) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden cursor-pointer"
              style={{
                background: "var(--card)",
                boxShadow: "0 4px 20px rgba(169,139,227,0.15)",
                border: "1.5px solid var(--border)",
              }}
              onClick={() => setSelectedOutfit(outfit)}
            >
              <div className="flex">
                <div className="relative flex-shrink-0" style={{ width: 140, height: 180 }}>
                  <img src={outfit.previewImg} alt={outfit.name} className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, transparent 70%, var(--card))" }}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                        >
                          {outfit.vibe}
                        </span>
                        <h3 className="mt-1.5" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--foreground)" }}>
                          {outfit.name}
                        </h3>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}>
                        <Heart
                          size={18}
                          style={{ color: outfit.liked ? "#e85d87" : "var(--muted-foreground)" }}
                          fill={outfit.liked ? "#e85d87" : "none"}
                        />
                      </button>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                      {outfit.event} · {outfit.weather}
                    </p>
                  </div>

                  <div>
                    <div className="flex gap-1 mt-2">
                      {outfit.items.map((item) => (
                        <div
                          key={item.name}
                          className="w-9 h-9 rounded-xl overflow-hidden"
                          style={{ border: item.owned ? "1.5px solid var(--accent)" : "1.5px solid #e85d87" }}
                        >
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                        {outfit.items.filter(i => !i.owned).length > 0
                          ? `${outfit.items.filter(i => !i.owned).length} item to buy`
                          : "All from your wardrobe"}
                      </p>
                      <div
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)", fontWeight: 600 }}
                      >
                        {outfit.score}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outfit Detail Sheet */}
      <AnimatePresence>
        {selectedOutfit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              style={{ background: "rgba(75,59,97,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setSelectedOutfit(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl overflow-hidden"
              style={{ background: "var(--card)", maxHeight: "85vh", overflowY: "auto" }}
            >
              <div className="relative">
                <img
                  src={selectedOutfit.previewImg}
                  alt={selectedOutfit.name}
                  className="w-full object-cover"
                  style={{ height: 300 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--card) 5%, transparent 60%)" }}
                />
                <button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.8)" }}
                  onClick={() => setSelectedOutfit(null)}
                >
                  <X size={14} style={{ color: "var(--foreground)" }} />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)" }}
                  >
                    {selectedOutfit.vibe}
                  </span>
                  <h2 className="mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--foreground)", fontWeight: 700 }}>
                    {selectedOutfit.name}
                  </h2>
                </div>
              </div>

              <div className="px-5 pb-8 pt-2">
                <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                  {selectedOutfit.event} · {selectedOutfit.weather}
                </p>

                <h3 className="mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--foreground)" }}>Pieces</h3>
                <div className="flex flex-col gap-3 mb-6">
                  {selectedOutfit.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.brand}</p>
                      </div>
                      {item.owned ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                          Owned
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#fce4ec", color: "#e85d87", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                          £{(item as any).price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3.5 rounded-full flex items-center justify-center gap-2 text-sm"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                  >
                    <Sparkles size={15} /> Try On Virtually
                  </button>
                  <button
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { Sun, Wind, Cloud, Wand2, Shirt, ChevronRight, RefreshCw, X, Check, Heart, Share2, Sparkles, Users, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const WARDROBE_ITEMS = [
  { id: 1, name: "Cream Blazer", brand: "Arket", category: "tops", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=200&h=260&fit=crop&auto=format" },
  { id: 2, name: "Wide-Leg Trousers", brand: "COS", category: "bottoms", img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&h=260&fit=crop&auto=format" },
  { id: 3, name: "White Sneakers", brand: "Common Projects", category: "shoes", img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=200&h=260&fit=crop&auto=format" },
  { id: 4, name: "Linen Shirt", brand: "Uniqlo", category: "tops", img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=200&h=260&fit=crop&auto=format" },
  { id: 5, name: "Leather Boots", brand: "Totême", category: "shoes", img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=200&h=260&fit=crop&auto=format" },
  { id: 6, name: "Silk Slip Dress", brand: "Reformation", category: "dresses", img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=200&h=260&fit=crop&auto=format" },
  { id: 7, name: "Chunky Knit", brand: "Zara", category: "tops", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&h=260&fit=crop&auto=format" },
  { id: 8, name: "Mom Jeans", brand: "Agolde", category: "bottoms", img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=200&h=260&fit=crop&auto=format" },
];

const GENERATED_OUTFITS = [
  {
    id: 1,
    name: "Effortless Tailoring",
    vibe: "Business Casual",
    img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=500&h=640&fit=crop&auto=format",
    items: ["Cream Blazer", "Wide-Leg Trousers", "White Sneakers"],
    score: 97,
    liked: false,
  },
  {
    id: 2,
    name: "Sunday Softness",
    vibe: "Casual",
    img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=500&h=640&fit=crop&auto=format",
    items: ["Linen Shirt", "Mom Jeans", "White Sneakers"],
    score: 93,
    liked: true,
  },
  {
    id: 3,
    name: "Evening Silk",
    vibe: "Evening",
    img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=500&h=640&fit=crop&auto=format",
    items: ["Silk Slip Dress", "Leather Boots"],
    score: 91,
    liked: false,
  },
];


interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showWardrobePicker, setShowWardrobePicker] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [outfits, setOutfits] = useState<typeof GENERATED_OUTFITS>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<typeof GENERATED_OUTFITS[0] | null>(null);
  const [likedOutfits, setLikedOutfits] = useState<number[]>([2]);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setHasGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setHasGenerated(true);
      setOutfits(GENERATED_OUTFITS);
    }, 2200);
  };

  const toggleLike = (id: number) => {
    setLikedOutfits((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Monday, June 15
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
              What are you<br />
              <span style={{ color: "var(--accent)" }}>wearing today?</span>
            </h1>
          </div>
          <button
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: "2px solid var(--accent)", marginTop: 4 }}
            onClick={() => onNavigate("profile")}
          >
            <img
              src="https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=80&h=80&fit=crop&auto=format"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Weather Card */}
      <div className="px-5 mb-4">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #a8c8f8 0%, #c4b5f7 100%)",
            boxShadow: "0 4px 16px rgba(169,139,227,0.25)",
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.3)" }}
              >
                <Sun size={20} color="white" />
              </div>
              <div>
                <p className="text-white" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>22°C</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)" }}>Partly Cloudy · London</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <Wind size={11} color="rgba(255,255,255,0.8)" />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>12 km/h</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Cloud size={11} color="rgba(255,255,255,0.8)" />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>65% humidity</span>
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>H:25° L:16°</span>
            </div>
          </div>
          {/* Clothing advice strip */}
          <div
            className="mx-3 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}
          >
            <Sparkles size={12} color="white" style={{ flexShrink: 0 }} />
            <p className="text-xs text-white" style={{ fontFamily: "var(--font-body)", lineHeight: 1.4 }}>
              Light layers today — a linen shirt or light knit with trousers works perfectly. Bring a jacket for the evening drop.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN GENERATOR CARD ── */}
      <div className="px-5 mb-4">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "var(--card)",
            boxShadow: "0 8px 32px rgba(169,139,227,0.22)",
            border: "1.5px solid var(--border)",
          }}
        >
          {/* Card header label */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--border)", background: "linear-gradient(90deg, rgba(169,139,227,0.08), transparent)" }}
          >
            <Sparkles size={14} style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              AI Outfit Generator
            </span>
          </div>

          <div className="p-4">
            {/* Prompt text area */}
            <div
              className="rounded-2xl p-3 mb-3 flex gap-2"
              style={{ background: "var(--background)", border: "1.5px solid var(--border)" }}
            >
              <Wand2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`It's 22°C and partly cloudy in London today. Describe your vibe or occasion…`}
                className="w-full bg-transparent outline-none text-sm resize-none"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}
              />
            </div>

            {/* Wardrobe selector row */}
            <div
              className="flex items-center gap-3 p-3 rounded-2xl mb-4 cursor-pointer transition-all hover:scale-[1.01]"
              style={{ background: "var(--background)", border: "1.5px solid var(--border)" }}
              onClick={() => setShowWardrobePicker(true)}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selectedItems.length > 0 ? "var(--accent)" : "var(--secondary)" }}
              >
                <Shirt size={16} style={{ color: selectedItems.length > 0 ? "white" : "var(--foreground)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>
                  {selectedItems.length > 0 ? `${selectedItems.length} piece${selectedItems.length > 1 ? "s" : ""} selected` : "Must-wear pieces"}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                  {selectedItems.length > 0
                    ? WARDROBE_ITEMS.filter((w) => selectedItems.includes(w.id)).map((w) => w.name).join(", ")
                    : "Tap to pick items you want styled today"}
                </p>
              </div>
              {selectedItems.length > 0 && (
                <div className="flex -space-x-1.5">
                  {WARDROBE_ITEMS.filter((w) => selectedItems.includes(w.id)).slice(0, 3).map((w) => (
                    <div key={w.id} className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1.5px solid var(--card)" }}>
                      <img src={w.img} alt={w.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <ChevronRight size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
              style={{
                background: generating
                  ? "var(--muted)"
                  : "linear-gradient(135deg, var(--accent) 0%, #7e5fbf 100%)",
                color: generating ? "var(--muted-foreground)" : "white",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: generating ? "none" : "0 6px 20px rgba(169,139,227,0.45)",
              }}
            >
              {generating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Styling your outfit…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Outfit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generating shimmer */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 mb-4"
          >
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl"
                  style={{
                    background: "linear-gradient(90deg, var(--muted) 25%, var(--card) 50%, var(--muted) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {hasGenerated && !generating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--foreground)" }}>
                Your Outfits
              </h2>
              <button
                className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                style={{ background: "var(--card)", color: "var(--muted-foreground)", fontFamily: "var(--font-body)", border: "1px solid var(--border)" }}
                onClick={handleGenerate}
              >
                <RefreshCw size={10} /> More
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {outfits.map((outfit, i) => {
                const liked = likedOutfits.includes(outfit.id);
                return (
                  <motion.div
                    key={outfit.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-3xl overflow-hidden cursor-pointer"
                    style={{
                      background: "var(--card)",
                      boxShadow: "0 4px 20px rgba(169,139,227,0.15)",
                      border: "1.5px solid var(--border)",
                    }}
                    onClick={() => setSelectedOutfit(outfit)}
                  >
                    <div className="flex">
                      <div className="relative flex-shrink-0" style={{ width: 120, height: 160 }}>
                        <img src={outfit.img} alt={outfit.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, var(--card))" }} />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                              {outfit.vibe}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}>
                              <Heart size={16} style={{ color: liked ? "#e85d87" : "var(--muted-foreground)" }} fill={liked ? "#e85d87" : "none"} />
                            </button>
                          </div>
                          <p className="mt-1.5" style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)" }}>
                            {outfit.name}
                          </p>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {outfit.items.map((item) => (
                              <span key={item} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--background)", color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>All from wardrobe</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)", fontWeight: 700 }}>
                              {outfit.score}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wardrobe Picker Sheet */}
      <AnimatePresence>
        {showWardrobePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              style={{ background: "rgba(75,59,97,0.45)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowWardrobePicker(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl"
              style={{ background: "var(--card)", maxHeight: "70vh", display: "flex", flexDirection: "column" }}
            >
              <div className="px-5 pt-4 pb-3 flex-shrink-0">
                <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--border)" }} />
                <div className="flex items-center justify-between">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)" }}>
                    Your Wardrobe
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                    {selectedItems.length} selected
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                  Pick pieces you must wear today
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: "none" }}>
                <div className="grid grid-cols-3 gap-2">
                  {WARDROBE_ITEMS.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl overflow-hidden cursor-pointer relative"
                        style={{
                          background: "var(--background)",
                          border: "1.5px solid",
                          borderColor: isSelected ? "var(--accent)" : "var(--border)",
                          boxShadow: isSelected ? "0 4px 12px rgba(169,139,227,0.3)" : "none",
                        }}
                        onClick={() => toggleItem(item.id)}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "var(--accent)" }}
                          >
                            <Check size={10} color="white" />
                          </div>
                        )}
                        <div style={{ height: 100 }}>
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="text-xs truncate" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                          <p className="text-xs truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.brand}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-6 pt-2 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  className="w-full py-3.5 rounded-full text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                  onClick={() => setShowWardrobePicker(false)}
                >
                  {selectedItems.length > 0 ? `Confirm ${selectedItems.length} piece${selectedItems.length > 1 ? "s" : ""}` : "Done"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Outfit Detail Sheet */}
      <AnimatePresence>
        {selectedOutfit && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              style={{ background: "rgba(75,59,97,0.45)", backdropFilter: "blur(4px)" }}
              onClick={() => setSelectedOutfit(null)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl overflow-hidden"
              style={{ background: "var(--card)", maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="relative">
                <img src={selectedOutfit.img} alt={selectedOutfit.name} className="w-full object-cover" style={{ height: 280 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--card) 5%, transparent 60%)" }} />
                <button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                  onClick={() => setSelectedOutfit(null)}
                >
                  <X size={14} style={{ color: "var(--foreground)" }} />
                </button>
                <div className="absolute bottom-4 left-5">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)" }}>
                    {selectedOutfit.vibe}
                  </span>
                  <h2 className="mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--foreground)", fontWeight: 700 }}>
                    {selectedOutfit.name}
                  </h2>
                </div>
              </div>
              <div className="px-5 pb-8 pt-3">
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedOutfit.items.map((item) => (
                    <span key={item} className="text-sm px-3 py-1.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3.5 rounded-full flex items-center justify-center gap-2 text-sm"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                  >
                    <Sparkles size={15} /> Virtual Try-On
                  </button>
                  <button className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                    <Share2 size={16} style={{ color: "var(--foreground)" }} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Style Jams + Discover cards */}
      <div className="px-5 mt-5 flex flex-col gap-3">
        {/* Style Jams */}
        <button
          className="w-full text-left rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #7e5fbf 0%, var(--accent) 100%)",
            boxShadow: "0 6px 20px rgba(126,95,191,0.35)",
          }}
          onClick={() => onNavigate("jams")}
        >
          <div className="p-4 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <Users size={22} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-white" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>
                Style Jams
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.78)", fontFamily: "var(--font-body)" }}>
                Coordinate outfits with friends for any event
              </p>
            </div>
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "var(--font-body)", fontWeight: 600 }}
            >
              Join →
            </div>
          </div>
          {/* decorative circles */}
          <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="absolute -right-2 bottom-2 w-12 h-12 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        </button>

        {/* Discover / Sale */}
        <button
          className="w-full text-left rounded-3xl overflow-hidden relative"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 4px 16px rgba(169,139,227,0.12)",
          }}
          onClick={() => onNavigate("shop")}
        >
          <div className="p-4 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--secondary)" }}
            >
              <ShoppingBag size={22} style={{ color: "var(--foreground)" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>
                  Discover & Shop
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "#fce4ec", color: "#e85d87", fontFamily: "var(--font-body)", fontWeight: 700 }}
                >
                  Sale
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                Mindful gap-fills within your budget
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
          </div>
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { Sparkles, Send, ShoppingBag, Star, Wand2, ShoppingCart, Plus, Minus, Trash2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductDetailScreen } from "./ProductDetailScreen";

const USER_PROFILE = {
  name: "Sophie",
  undertone: "Warm",
  season: "Spring / Autumn",
  palette: ["#E9D9FF", "#CDB7F6", "#A98BE3", "#F4C2A1", "#E8A87C", "#B5D8B8", "#8EC89A"],
  topStyles: ["Minimalist", "Soft Feminine", "Business Casual"],
  sizes: { top: "S", bottom: "36", shoes: "38" },
};

interface ShopItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  sale: boolean;
  salePrice?: number;
  img: string;
  rating: number;
  outfitId: number;
}

const DISCOVER_OUTFITS = [
  {
    id: 1,
    name: "Warm Neutral Edit",
    reason: "Matches your warm undertone & minimalist style",
    img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=500&h=640&fit=crop&auto=format",
    tags: ["Minimalist", "Warm tones"],
    items: [
      { id: 101, name: "Camel Coat",        brand: "& Other Stories", price: 165, sale: false,              img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=200&h=260&fit=crop&auto=format", rating: 4.8, outfitId: 1 },
      { id: 102, name: "Ivory Knit",         brand: "Arket",           price: 69,  sale: true, salePrice: 49, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&h=260&fit=crop&auto=format", rating: 4.6, outfitId: 1 },
      { id: 103, name: "Straight Trousers",  brand: "COS",             price: 89,  sale: false,              img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&h=260&fit=crop&auto=format", rating: 4.7, outfitId: 1 },
    ] as ShopItem[],
  },
  {
    id: 2,
    name: "Soft Feminine Flow",
    reason: "Tailored to your Soft Feminine preference",
    img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=500&h=640&fit=crop&auto=format",
    tags: ["Soft Feminine", "Spring"],
    items: [
      { id: 201, name: "Linen Midi Dress", brand: "Reformation", price: 198, sale: true, salePrice: 139, img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=200&h=260&fit=crop&auto=format", rating: 4.9, outfitId: 2 },
      { id: 202, name: "Strappy Mules",    brand: "Mango",       price: 59,  sale: false,                img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=200&h=260&fit=crop&auto=format", rating: 4.4, outfitId: 2 },
    ] as ShopItem[],
  },
  {
    id: 3,
    name: "Business Elevated",
    reason: "For your calendar events this week",
    img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=500&h=640&fit=crop&auto=format",
    tags: ["Business Casual", "Smart"],
    items: [
      { id: 301, name: "Tailored Blazer", brand: "Totême",  price: 349, sale: false,              img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=200&h=260&fit=crop&auto=format", rating: 4.9, outfitId: 3 },
      { id: 302, name: "Silk Blouse",     brand: "Arket",   price: 89,  sale: true, salePrice: 59, img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=200&h=260&fit=crop&auto=format", rating: 4.7, outfitId: 3 },
      { id: 303, name: "Wide-Leg Pants",  brand: "COS",     price: 95,  sale: false,              img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=200&h=260&fit=crop&auto=format", rating: 4.5, outfitId: 3 },
    ] as ShopItem[],
  },
];

const AI_FILTER_SUGGESTIONS = [
  "Show me sale items under £100",
  "Warm tones only",
  "Smart casual for the office",
  "Soft feminine summer pieces",
  "Complete my minimalist look",
];

const AI_RESPONSES: Record<string, string> = {
  default:    "Based on your warm undertone and minimalist style, I've filtered for earth tones and clean silhouettes that'll complement your existing wardrobe.",
  sale:       "Found 4 sale items under £100 that match your warm palette — the Ivory Knit and Linen Midi Dress are the strongest picks.",
  warm:       "Filtering for warm tones: camel, terracotta, sage, and ivory are your strongest colours.",
  casual:     "For smart casual office looks, the Tailored Blazer + Wide-Leg Pants combo is your best bet.",
  summer:     "Your warm undertone suits earthy pinks and sage greens. The Linen Midi Dress scores highest for your skin tone.",
  minimalist: "Pulling minimalist pieces that fill real gaps in your wardrobe — prioritising neutral basics you don't yet own.",
};

function getAIResponse(input: string): string {
  const l = input.toLowerCase();
  if (l.includes("sale") || l.includes("100")) return AI_RESPONSES.sale;
  if (l.includes("warm"))                       return AI_RESPONSES.warm;
  if (l.includes("casual") || l.includes("office")) return AI_RESPONSES.casual;
  if (l.includes("summer") || l.includes("feminine")) return AI_RESPONSES.summer;
  if (l.includes("minimalist") || l.includes("complete")) return AI_RESPONSES.minimalist;
  return AI_RESPONSES.default;
}

interface CartItem extends ShopItem { qty: number; }
type Message = { role: "user" | "ai"; text: string };

export function ShopScreen() {
  const [messages, setMessages]         = useState<Message[]>([{ role: "ai", text: `Hi Sophie! I've curated these picks based on your warm undertone and ${USER_PROFILE.topStyles[0]} style. Ask me to filter by anything.` }]);
  const [input, setInput]               = useState("");
  const [thinking, setThinking]         = useState(false);
  const [budget, setBudget]             = useState(200);
  const [cart, setCart]                 = useState<CartItem[]>([]);
  const [showCart, setShowCart]         = useState(false);
  const [addedId, setAddedId]           = useState<number | null>(null);
  const [checkedOut, setCheckedOut]     = useState(false);
  const [detailItem, setDetailItem]     = useState<ShopItem | null>(null);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + (i.sale && i.salePrice ? i.salePrice : i.price) * i.qty, 0);

  const addToCart = (item: ShopItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.flatMap((c) => {
        if (c.id !== id) return [c];
        const next = c.qty + delta;
        return next <= 0 ? [] : [{ ...c, qty: next }];
      })
    );
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      setCart([]);
      setCheckedOut(false);
      setShowCart(false);
    }, 2200);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((p) => [...p, { role: "ai", text: getAIResponse(text) }]);
      setThinking(false);
    }, 1200);
  };

  if (detailItem) {
    return (
      <AnimatePresence mode="wait">
        <ProductDetailScreen
          key={detailItem.id}
          item={detailItem}
          recommendedSize={USER_PROFILE.sizes.top}
          onBack={() => setDetailItem(null)}
          onAddToCart={(item) => { addToCart(item); }}
          inCart={cart.some((c) => c.id === detailItem.id)}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)" }}>Discover</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Curated for your colour & style</p>
        </div>
        {/* Cart button */}
        <button
          onClick={() => setShowCart(true)}
          className="relative w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 2px 8px rgba(169,139,227,0.15)" }}
        >
          <ShoppingCart size={20} style={{ color: "var(--foreground)" }} />
          {cartCount > 0 && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "white", fontFamily: "var(--font-body)" }}>{cartCount}</span>
            </motion.div>
          )}
        </button>
      </div>

      {/* Profile tone strip */}
      <div className="px-5 mb-4">
        <div className="p-3.5 rounded-2xl flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid var(--accent)" }}>
            <img src="https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=80&h=80&fit=crop&auto=format" alt="Sophie" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>
              {USER_PROFILE.undertone} undertone · {USER_PROFILE.season}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
              {USER_PROFILE.topStyles.join(" · ")}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {USER_PROFILE.palette.slice(0, 5).map((c) => (
              <div key={c} className="w-4 h-4 rounded-full" style={{ background: c, border: "1.5px solid rgba(75,59,97,0.12)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Filter Chat */}
      <div className="px-5 mb-4">
        <div className="rounded-3xl overflow-hidden" style={{ background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 4px 20px rgba(169,139,227,0.12)" }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)", background: "linear-gradient(90deg,rgba(169,139,227,0.1),transparent)" }}>
            <Sparkles size={14} style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.07em" }}>AI Style Filter</span>
          </div>
          <div className="px-4 pt-3 pb-2 flex flex-col gap-2.5" style={{ maxHeight: 160, overflowY: "auto", scrollbarWidth: "none" }}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5" style={{ background: "var(--accent)" }}>
                    <Wand2 size={11} color="white" />
                  </div>
                )}
                <div className="px-3 py-2 rounded-2xl text-xs max-w-[80%]" style={{ background: msg.role === "user" ? "var(--primary)" : "var(--background)", color: msg.role === "user" ? "var(--primary-foreground)" : "var(--foreground)", fontFamily: "var(--font-body)", lineHeight: 1.5, borderBottomRightRadius: msg.role === "user" ? 4 : undefined, borderBottomLeftRadius: msg.role === "ai" ? 4 : undefined }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}><Wand2 size={11} color="white" /></div>
                <div className="px-3 py-2 rounded-2xl flex gap-1" style={{ background: "var(--background)" }}>
                  {[0,1,2].map((d) => <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", animation: `bounce 0.8s ${d*0.15}s infinite` }} />)}
                </div>
              </motion.div>
            )}
          </div>
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {AI_FILTER_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "var(--background)", border: "1.5px solid var(--border)" }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="e.g. warm tones under £150…" className="flex-1 bg-transparent outline-none text-xs"
                style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }} />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: input.trim() ? "var(--accent)" : "var(--muted)" }}>
                <Send size={12} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}>Max budget</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)" }}>£{budget}</p>
        </div>
        <input type="range" min={20} max={500} step={10} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--accent)" }} />
      </div>

      {/* Outfit sections */}
      <div className="px-5 flex flex-col gap-5">
        {DISCOVER_OUTFITS.map((outfit, oi) => (
          <motion.div key={outfit.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.1 }}
            className="rounded-3xl overflow-hidden" style={{ background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 4px 16px rgba(169,139,227,0.1)" }}>
            {/* Hero */}
            <div className="relative" style={{ height: 150 }}>
              <img src={outfit.img} alt={outfit.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(75,59,97,0.75) 0%,transparent 55%)" }} />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex gap-1.5 mb-1.5">
                  {outfit.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(246,242,255,0.85)", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <p className="text-white" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700 }}>{outfit.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles size={11} color="rgba(255,255,255,0.8)" />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>{outfit.reason}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-3 flex flex-col gap-2">
              {outfit.items.map((item) => {
                const displayPrice = item.sale && item.salePrice ? item.salePrice : item.price;
                const overBudget   = displayPrice > budget;
                const inCart       = cart.some((c) => c.id === item.id);
                const justAdded    = addedId === item.id;

                return (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl"
                    style={{ background: "var(--background)", border: "1px solid var(--border)", opacity: overBudget ? 0.5 : 1 }}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" style={{ background: "var(--muted)" }} onClick={() => setDetailItem(item)}>
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailItem(item)}>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm truncate" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                        {item.sale && <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "#fce4ec", color: "#e85d87", fontFamily: "var(--font-body)", fontWeight: 700 }}>Sale</span>}
                      </div>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.brand}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} fill="#f4b942" style={{ color: "#f4b942" }} />
                        <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: item.sale ? "#e85d87" : "var(--foreground)" }}>£{displayPrice}</span>
                        {item.sale && <span className="text-xs line-through" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>£{item.price}</span>}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => !overBudget && addToCart(item)}
                        disabled={overBudget}
                        className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition-all"
                        style={{
                          background: justAdded ? "#dcfce7" : inCart ? "var(--secondary)" : overBudget ? "var(--muted)" : "var(--primary)",
                          color: justAdded ? "#16a34a" : inCart ? "var(--foreground)" : overBudget ? "var(--muted-foreground)" : "var(--primary-foreground)",
                          fontFamily: "var(--font-body)", fontWeight: 600,
                        }}
                      >
                        {justAdded ? <><Check size={10} /> Added!</> : inCart ? <><ShoppingCart size={10} /> In cart</> : <><Plus size={10} /> Add</>}
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating cart bar */}
      <AnimatePresence>
        {cartCount > 0 && !showCart && (
          <motion.button
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-28 left-5 right-5 z-20 flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: "var(--primary)", boxShadow: "0 8px 32px rgba(75,59,97,0.4)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                <ShoppingCart size={16} color="white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white" style={{ fontFamily: "var(--font-body)", opacity: 0.8 }}>{cartCount} item{cartCount > 1 ? "s" : ""}</p>
                <p className="text-sm text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>View Cart</p>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "white" }}>£{cartTotal}</p>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart sheet */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30" style={{ background: "rgba(75,59,97,0.45)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowCart(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl flex flex-col"
              style={{ background: "var(--card)", maxHeight: "82vh" }}
            >
              {/* Cart header */}
              <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--border)" }} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)" }}>Your Cart</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)", fontWeight: 700 }}>{cartCount}</span>
                  </div>
                  <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--background)" }}>
                    <X size={16} style={{ color: "var(--foreground)" }} />
                  </button>
                </div>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto px-5 py-3" style={{ scrollbarWidth: "none" }}>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <ShoppingBag size={36} style={{ color: "var(--muted-foreground)" }} />
                    <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {cart.map((item) => {
                      const displayPrice = item.sale && item.salePrice ? item.salePrice : item.price;
                      return (
                        <motion.div key={item.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                          className="flex items-center gap-3 p-3 rounded-2xl"
                          style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "var(--muted)" }}>
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.brand}</p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: item.sale ? "#e85d87" : "var(--foreground)", marginTop: 2 }}>
                              £{displayPrice}
                              {item.sale && <span className="text-xs line-through ml-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 400 }}>£{item.price}</span>}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <button onClick={() => removeFromCart(item.id)}>
                              <Trash2 size={14} style={{ color: "var(--muted-foreground)" }} />
                            </button>
                            <div className="flex items-center gap-2 px-2 py-1 rounded-full" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                              <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--muted)" }}>
                                <Minus size={10} style={{ color: "var(--foreground)" }} />
                              </button>
                              <span className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--foreground)", minWidth: 12, textAlign: "center" }}>{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}>
                                <Plus size={10} color="white" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {cart.length > 0 && (
                <div className="px-5 pb-7 pt-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
                  {/* Order summary */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Subtotal ({cartCount} items)</p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>£{cartTotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Delivery</p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "#16a34a" }}>Free</p>
                    </div>
                    <div className="h-px my-1" style={{ background: "var(--border)" }} />
                    <div className="flex justify-between">
                      <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--foreground)" }}>Total</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>£{cartTotal}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {checkedOut ? (
                      <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-full py-4 rounded-full flex items-center justify-center gap-2"
                        style={{ background: "#dcfce7" }}
                      >
                        <Check size={18} style={{ color: "#16a34a" }} />
                        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "#16a34a" }}>Order placed!</span>
                      </motion.div>
                    ) : (
                      <motion.button key="checkout" whileTap={{ scale: 0.97 }} onClick={handleCheckout}
                        className="w-full py-4 rounded-full flex items-center justify-center gap-2 text-sm"
                        style={{ background: "linear-gradient(135deg, var(--accent), #7e5fbf)", color: "white", fontFamily: "var(--font-body)", fontWeight: 700, boxShadow: "0 6px 20px rgba(169,139,227,0.4)" }}
                      >
                        <ShoppingBag size={17} /> Checkout · £{cartTotal}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>


      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

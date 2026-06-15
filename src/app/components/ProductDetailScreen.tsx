import { useState } from "react";
import { ArrowLeft, Star, Sparkles, Plus, Minus, ShoppingCart, Heart, Share2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShopItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  sale: boolean;
  salePrice?: number;
  img: string;
  rating: number;
}

interface ProductDetailScreenProps {
  item: ShopItem;
  recommendedSize: string;
  onBack: () => void;
  onAddToCart: (item: ShopItem) => void;
  inCart: boolean;
}

const PRODUCT_EXTRA: Record<number, {
  images: string[];
  description: string;
  sizes: string[];
  material: { label: string; value: string }[];
  care: string[];
  reviews: { name: string; rating: number; text: string; avatar: string }[];
  completesWith: string[];
}> = {
  101: {
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=600&h=780&fit=crop&auto=format",
    ],
    description: "An elevated camel coat cut in a relaxed, long silhouette. Crafted from a premium wool blend with a clean notch lapel and simple button placket. The perfect investment layer for a warm neutral wardrobe.",
    sizes: ["XS", "S", "M", "L", "XL"],
    material: [
      { label: "Outer",   value: "80% Wool, 20% Polyamide" },
      { label: "Lining",  value: "100% Viscose" },
      { label: "Origin",  value: "Made in Portugal" },
    ],
    care: ["Dry clean only", "Do not tumble dry", "Iron on low heat", "Store on a padded hanger"],
    reviews: [
      { name: "Emma T.",  rating: 5, text: "Gorgeous coat, true to size and the camel colour is so rich in person.", avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=60&h=60&fit=crop&auto=format" },
      { name: "Lucia M.", rating: 5, text: "Bought in S and it's perfect. Very structured but comfortable.", avatar: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Wide-Leg Trousers", "Ivory Knit", "White Sneakers"],
  },
  102: {
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=780&fit=crop&auto=format",
    ],
    description: "A cosy, chunky knit in a warm ivory tone. Relaxed boxy fit with dropped shoulders and ribbed cuffs. The kind of piece you'll reach for every weekend.",
    sizes: ["XS/S", "S/M", "M/L", "L/XL"],
    material: [
      { label: "Composition", value: "60% Merino Wool, 40% Nylon" },
      { label: "Origin",      value: "Made in Italy" },
    ],
    care: ["Hand wash cold", "Lay flat to dry", "Do not bleach", "Steam to refresh"],
    reviews: [
      { name: "Sophie L.", rating: 5, text: "So soft! The merino is incredibly warm without being itchy.", avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Mom Jeans", "Straight Trousers", "Leather Boots"],
  },
  103: {
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=600&h=780&fit=crop&auto=format",
    ],
    description: "Straight-leg trousers in a mid-weight ponte fabric with a high waist and clean front seam. Minimal and versatile — works equally well dressed up or down.",
    sizes: ["34", "36", "38", "40", "42"],
    material: [
      { label: "Composition", value: "72% Viscose, 24% Nylon, 4% Elastane" },
      { label: "Origin",      value: "Made in Lithuania" },
    ],
    care: ["Machine wash 30°C", "Do not tumble dry", "Iron inside out", "Dry in shade"],
    reviews: [
      { name: "Priya K.", rating: 4, text: "Great fit, very sleek. Runs slightly long if you're petite.", avatar: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Cream Blazer", "Silk Blouse", "Leather Boots"],
  },
  201: {
    images: [
      "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=600&h=780&fit=crop&auto=format",
    ],
    description: "A romantic midi dress in breathable European linen. Adjustable wrap front with a flowy A-line skirt. Designed with sustainability in mind — made from certified organic linen.",
    sizes: ["XS", "S", "M", "L", "XL"],
    material: [
      { label: "Composition", value: "100% Organic Linen" },
      { label: "Certification", value: "GOTS Certified" },
      { label: "Origin",      value: "Made in Spain" },
    ],
    care: ["Machine wash cold", "Tumble dry low", "Iron on medium", "Gets softer with every wash"],
    reviews: [
      { name: "Mia C.",   rating: 5, text: "Absolutely stunning. The linen feels luxurious and it photographs beautifully.", avatar: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=60&h=60&fit=crop&auto=format" },
      { name: "Emma T.",  rating: 5, text: "Perfect for summer weddings. The wrap front is flattering on all shapes.", avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Strappy Mules", "Gold Hoop Earrings", "Structured Tote"],
  },
  202: {
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&h=780&fit=crop&auto=format",
    ],
    description: "Minimalist strappy mules with a square toe and low block heel. The simple silhouette pairs with everything from dresses to wide-leg trousers.",
    sizes: ["36", "37", "38", "39", "40", "41"],
    material: [
      { label: "Upper",   value: "100% Leather" },
      { label: "Sole",    value: "Rubber" },
      { label: "Origin",  value: "Made in Spain" },
    ],
    care: ["Clean with a soft dry cloth", "Condition leather seasonally", "Store in dust bag", "Avoid prolonged water exposure"],
    reviews: [
      { name: "Lucia M.", rating: 4, text: "Very chic and comfortable for a heel. True to size.", avatar: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Silk Slip Dress", "Linen Midi Dress", "Wide-Leg Trousers"],
  },
  301: {
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=600&h=780&fit=crop&auto=format",
    ],
    description: "A sharply tailored single-breasted blazer in a fluid, structured fabric. Slightly oversized silhouette with welt pockets and a half-canvas construction for shape retention.",
    sizes: ["34", "36", "38", "40", "42"],
    material: [
      { label: "Outer",   value: "55% Wool, 45% Silk" },
      { label: "Lining",  value: "100% Silk" },
      { label: "Construction", value: "Half-canvas" },
      { label: "Origin",  value: "Made in France" },
    ],
    care: ["Dry clean only", "Steam to freshen", "Store on a wide hanger", "Brush with a clothes brush"],
    reviews: [
      { name: "Sophie L.", rating: 5, text: "Worth every penny. The silk-wool blend drapes beautifully.", avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=60&h=60&fit=crop&auto=format" },
      { name: "Priya K.",  rating: 5, text: "The most elegant blazer I've ever owned. I wear it constantly.", avatar: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Wide-Leg Pants", "Silk Blouse", "Leather Boots"],
  },
  302: {
    images: [
      "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=600&h=780&fit=crop&auto=format",
    ],
    description: "A fluid silk blouse with a relaxed draped collar and subtle sheen. Tucks beautifully into high-waisted bottoms and works alone as a going-out top.",
    sizes: ["XS", "S", "M", "L"],
    material: [
      { label: "Composition", value: "100% Mulberry Silk" },
      { label: "Weight",      value: "16 momme" },
      { label: "Origin",      value: "Made in China" },
    ],
    care: ["Hand wash cold in silk detergent", "Roll in a towel, do not wring", "Iron on silk setting", "Store folded or lightly rolled"],
    reviews: [
      { name: "Emma T.", rating: 5, text: "So luxurious. The silk weight is heavy and drapes perfectly.", avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Tailored Blazer", "Wide-Leg Pants", "Structured Tote"],
  },
  303: {
    images: [
      "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=600&h=780&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=780&fit=crop&auto=format",
    ],
    description: "Wide-leg trousers in a substantial crepe fabric with a high rise and pressed front crease. One of those pieces that instantly elevates any outfit.",
    sizes: ["34", "36", "38", "40", "42"],
    material: [
      { label: "Composition", value: "65% Polyester, 35% Viscose" },
      { label: "Finish",      value: "Matte crepe" },
      { label: "Origin",      value: "Made in Lithuania" },
    ],
    care: ["Machine wash 30°C gentle", "Hang to dry", "Steam or iron on low", "Dry clean for best results"],
    reviews: [
      { name: "Mia C.", rating: 4, text: "Love the silhouette. The crepe holds its shape well all day.", avatar: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=60&h=60&fit=crop&auto=format" },
    ],
    completesWith: ["Tailored Blazer", "Silk Blouse", "Leather Boots"],
  },
};

const FALLBACK_EXTRA = {
  images: ["https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=780&fit=crop&auto=format"],
  description: "A beautifully crafted wardrobe essential, designed to complement your existing pieces.",
  sizes: ["XS", "S", "M", "L", "XL"],
  material: [{ label: "Composition", value: "Natural fibres" }],
  care: ["Follow garment label"],
  reviews: [],
  completesWith: [],
};

export function ProductDetailScreen({ item, recommendedSize, onBack, onAddToCart, inCart }: ProductDetailScreenProps) {
  const extra        = PRODUCT_EXTRA[item.id] ?? FALLBACK_EXTRA;
  const displayPrice = item.sale && item.salePrice ? item.salePrice : item.price;
  const savings      = item.sale && item.salePrice ? item.price - item.salePrice : 0;

  const [activeImg,     setActiveImg]     = useState(0);
  const [selectedSize,  setSelectedSize]  = useState(recommendedSize);
  const [qty,           setQty]           = useState(1);
  const [liked,         setLiked]         = useState(false);
  const [showCare,      setShowCare]      = useState(false);
  const [addedFlash,    setAddedFlash]    = useState(false);

  const handleAdd = () => {
    onAddToCart(item);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="flex flex-col pb-8"
      style={{ background: "var(--background)" }}
    >
      {/* Image carousel */}
      <div className="relative" style={{ height: 400, background: "var(--muted)" }}>
        <img
          src={extra.images[activeImg]}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(246,242,255,0.9)", backdropFilter: "blur(8px)" }}
          >
            <ArrowLeft size={17} style={{ color: "var(--foreground)" }} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked((l) => !l)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(246,242,255,0.9)", backdropFilter: "blur(8px)" }}
            >
              <Heart size={16} style={{ color: liked ? "#e85d87" : "var(--foreground)" }} fill={liked ? "#e85d87" : "none"} />
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(246,242,255,0.9)", backdropFilter: "blur(8px)" }}
            >
              <Share2 size={16} style={{ color: "var(--foreground)" }} />
            </button>
          </div>
        </div>

        {/* Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />

        {/* Dot indicators */}
        {extra.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {extra.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeImg ? 18 : 6,
                  height: 6,
                  background: i === activeImg ? "var(--accent)" : "rgba(169,139,227,0.4)",
                }}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {extra.images.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {extra.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="rounded-xl overflow-hidden"
                style={{
                  width: 44, height: 52,
                  border: "2px solid",
                  borderColor: i === activeImg ? "var(--accent)" : "rgba(255,255,255,0.5)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Sale badge */}
        {item.sale && (
          <div
            className="absolute top-14 left-4 px-3 py-1 rounded-full text-xs"
            style={{ background: "#e85d87", color: "white", fontFamily: "var(--font-body)", fontWeight: 700 }}
          >
            Sale — save £{savings}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col gap-5 mt-1">

        {/* Title + price */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{item.brand}</p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.2, marginTop: 2 }}>
                {item.name}
              </h1>
            </div>
            <div className="text-right flex-shrink-0 mt-1">
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: item.sale ? "#e85d87" : "var(--foreground)" }}>
                £{displayPrice}
              </p>
              {item.sale && (
                <p className="text-xs line-through" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>£{item.price}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={13} fill={s <= Math.round(item.rating) ? "#f4b942" : "none"} style={{ color: "#f4b942" }} />
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{item.rating} · {extra.reviews.length} reviews</span>
          </div>
        </div>

        {/* AI recommendation banner */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(169,139,227,0.12), rgba(205,183,246,0.12))", border: "1px solid var(--border)" }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <Sparkles size={14} color="white" />
          </div>
          <div>
            <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--accent)" }}>AI Recommendation</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
              This piece matches your <strong>warm undertone</strong> and <strong>minimalist style</strong>. Your recommended size is <strong>{recommendedSize}</strong> based on your measurements.
            </p>
          </div>
        </div>

        {/* Size selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Select Size</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
              <p className="text-xs" style={{ color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                {recommendedSize} recommended for you
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {extra.sizes.map((size) => {
              const isSelected    = selectedSize === size;
              const isRecommended = size === recommendedSize;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="relative px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    background: isSelected ? "var(--primary)" : "var(--card)",
                    color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                    fontFamily: "var(--font-body)", fontWeight: isSelected ? 700 : 500,
                    border: "1.5px solid",
                    borderColor: isSelected ? "var(--primary)" : isRecommended ? "var(--accent)" : "var(--border)",
                    boxShadow: isSelected ? "0 4px 12px rgba(75,59,97,0.25)" : "none",
                  }}
                >
                  {size}
                  {isRecommended && !isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>About</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", lineHeight: 1.7 }}>{extra.description}</p>
        </div>

        {/* Material */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Material & Composition</p>
          </div>
          {extra.material.map((m, i) => (
            <div
              key={m.label}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: i < extra.material.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{m.label}</p>
              <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)", textAlign: "right", maxWidth: "55%" }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Care instructions — collapsible */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <button
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setShowCare((c) => !c)}
          >
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Care Instructions</p>
            {showCare ? <ChevronUp size={16} style={{ color: "var(--muted-foreground)" }} /> : <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />}
          </button>
          <AnimatePresence initial={false}>
            {showCare && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}
              >
                <div className="px-4 pb-3 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  {extra.care.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{c}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Completes with */}
        {extra.completesWith.length > 0 && (
          <div>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>
              <Sparkles size={13} className="inline mr-1.5" style={{ color: "var(--accent)" }} />
              Completes with
            </p>
            <div className="flex flex-wrap gap-2">
              {extra.completesWith.map((piece) => (
                <span
                  key={piece}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                >
                  {piece}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {extra.reviews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Reviews</p>
              <div className="flex items-center gap-1.5">
                <Star size={13} fill="#f4b942" style={{ color: "#f4b942" }} />
                <span className="text-sm" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--foreground)" }}>{item.rating}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {extra.reviews.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{r.name}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={10} fill={s <= r.rating ? "#f4b942" : "none"} style={{ color: "#f4b942" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add-to-cart bar */}
      <div
        className="sticky bottom-0 left-0 right-0 px-5 pt-3 pb-6 mt-6"
        style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          {/* Qty selector */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--muted)" }}>
              <Minus size={11} style={{ color: "var(--foreground)" }} />
            </button>
            <span className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--foreground)", minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <Plus size={11} color="white" />
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
            style={{
              background: addedFlash ? "#dcfce7" : "linear-gradient(135deg, var(--accent), #7e5fbf)",
              color: addedFlash ? "#16a34a" : "white",
              fontFamily: "var(--font-body)", fontWeight: 700,
              boxShadow: addedFlash ? "none" : "0 6px 20px rgba(169,139,227,0.4)",
            }}
          >
            <AnimatePresence mode="wait">
              {addedFlash ? (
                <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                  <Check size={16} /> Added to Cart!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <ShoppingCart size={16} /> Add to Cart · £{displayPrice * qty}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

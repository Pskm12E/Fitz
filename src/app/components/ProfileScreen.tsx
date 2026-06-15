import { useState } from "react";
import { Ruler, Palette, BookOpen, ChevronRight, Camera, Bell, Shield, LogOut } from "lucide-react";
import { motion } from "motion/react";

const BODY_MEASUREMENTS = [
  { label: "Height", value: "167 cm" },
  { label: "Bust", value: "86 cm" },
  { label: "Waist", value: "68 cm" },
  { label: "Hips", value: "94 cm" },
];

const SIZE_CHART = [
  { brand: "Zara", top: "S", bottom: "36", shoes: "38" },
  { brand: "COS", top: "XS/S", bottom: "34", shoes: "38" },
  { brand: "Arket", top: "S", bottom: "34", shoes: "38" },
  { brand: "Uniqlo", top: "S", bottom: "M", shoes: "24" },
];

const EDUCATION_TIPS = [
  { title: "Dressing for your silhouette", tag: "Body Shape", read: true },
  { title: "Warm vs cool skin tones", tag: "Color Theory", read: false },
  { title: "Building a capsule wardrobe", tag: "Minimalism", read: false },
  { title: "The 5-piece French wardrobe", tag: "Style Edit", read: true },
];

const COLOR_PALETTE = [
  "#E9D9FF", "#CDB7F6", "#A98BE3", "#7E5FBF",
  "#F4C2A1", "#E8A87C", "#C8956C", "#F9E4C8",
  "#B5D8B8", "#8EC89A", "#6BAF7A",
];

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<"sizing" | "color" | "education">("sizing");

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-18 h-18 rounded-full overflow-hidden" style={{ width: 72, height: 72, border: "3px solid var(--accent)" }}>
              <img
                src="https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=144&h=144&fit=crop&auto=format"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <Camera size={11} color="white" />
            </button>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)" }}>
              Sophie Laurent
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>@sophielooks · London</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Items", value: 42 },
            { label: "Outfits", value: 17 },
            { label: "Cost/wear", value: "£4.20" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 p-3 rounded-2xl text-center"
              style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(169,139,227,0.1)" }}
            >
              <p className="text-base" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div
          className="flex rounded-2xl p-1"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          {(["sizing", "color", "education"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-xs capitalize transition-all"
              style={{
                background: activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "var(--font-body)",
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab === "sizing" ? "Smart Sizing" : tab === "color" ? "Color Tone" : "Style Hub"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5">
        {activeTab === "sizing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            {/* Measurements */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <Ruler size={15} style={{ color: "var(--accent)" }} />
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Body Measurements</p>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)" }}>
                {BODY_MEASUREMENTS.map((m) => (
                  <div key={m.label} className="p-3" style={{ background: "var(--card)" }}>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{m.label}</p>
                    <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--foreground)" }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Size Chart */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Your Sizes by Brand</p>
              </div>
              {SIZE_CHART.map((row, i) => (
                <div
                  key={row.brand}
                  className="flex items-center px-4 py-3"
                  style={{ borderBottom: i < SIZE_CHART.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <p className="flex-1 text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{row.brand}</p>
                  <div className="flex gap-3">
                    {[{ label: "Top", val: row.top }, { label: "Bottom", val: row.bottom }, { label: "Shoes", val: row.shoes }].map(({ label, val }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "color" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Palette size={15} style={{ color: "var(--accent)" }} />
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Skin Tone Analysis</p>
              </div>
              <div
                className="p-3 rounded-xl mb-3"
                style={{ background: "var(--secondary)" }}
              >
                <p className="text-xs" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}>Warm Undertone · Spring / Autumn</p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                  Earth tones, warm neutrals, terracotta, and olive greens will complement your complexion most.
                </p>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Your optimised palette</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTE.map((c) => (
                  <div
                    key={c}
                    className="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110"
                    style={{ background: c, border: "2px solid var(--border)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "education" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={15} style={{ color: "var(--accent)" }} />
              <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>Fashion Advice Hub</p>
            </div>
            {EDUCATION_TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all"
                style={{ background: "var(--card)", border: "1px solid var(--border)", opacity: tip.read ? 0.65 : 1 }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--secondary)" }}>
                  <BookOpen size={15} style={{ color: "var(--foreground)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{tip.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>{tip.tag}</p>
                </div>
                <div className="flex items-center gap-2">
                  {tip.read && <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Read</span>}
                  <ChevronRight size={14} style={{ color: "var(--muted-foreground)" }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Settings */}
      <div className="px-5 mt-6">
        <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Settings</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {[
            { icon: Bell, label: "Notifications" },
            { icon: Shield, label: "Privacy & Data" },
            { icon: LogOut, label: "Sign Out" },
          ].map(({ icon: Icon, label }, i, arr) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-opacity-50 transition-all"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                color: label === "Sign Out" ? "#e85d87" : "var(--foreground)",
              }}
            >
              <Icon size={16} style={{ color: label === "Sign Out" ? "#e85d87" : "var(--muted-foreground)" }} />
              <span className="flex-1 text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{label}</span>
              <ChevronRight size={14} style={{ color: "var(--muted-foreground)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

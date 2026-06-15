import { useState } from "react";
import { Plus, Search, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AddItemScreen } from "./AddItemScreen";

const WARDROBE_ITEMS = [
  { id: 1,  name: "Cream Blazer",       brand: "Arket",           category: "tops",         season: "All", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300&h=380&fit=crop&auto=format", worn: 4,  price: 189 },
  { id: 4,  name: "Linen Shirt",         brand: "Uniqlo",          category: "tops",         season: "SS",  img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=300&h=380&fit=crop&auto=format", worn: 9,  price: 45  },
  { id: 7,  name: "Chunky Knit",         brand: "Zara",            category: "tops",         season: "AW",  img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=380&fit=crop&auto=format", worn: 5,  price: 59  },
  { id: 2,  name: "Wide-Leg Trousers",   brand: "COS",             category: "bottoms",      season: "AW",  img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&h=380&fit=crop&auto=format", worn: 7,  price: 125 },
  { id: 8,  name: "Mom Jeans",           brand: "Agolde",          category: "bottoms",      season: "All", img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=300&h=380&fit=crop&auto=format", worn: 15, price: 208 },
  { id: 6,  name: "Silk Slip Dress",     brand: "Reformation",     category: "dresses",      season: "SS",  img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=300&h=380&fit=crop&auto=format", worn: 3,  price: 248 },
  { id: 3,  name: "White Sneakers",      brand: "Common Projects", category: "shoes",        season: "All", img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=380&fit=crop&auto=format", worn: 12, price: 420 },
  { id: 5,  name: "Leather Boots",       brand: "Totême",          category: "shoes",        season: "AW",  img: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=300&h=380&fit=crop&auto=format", worn: 6,  price: 590 },
  { id: 9,  name: "Structured Tote",     brand: "Polène",          category: "accessories",  season: "All", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=380&fit=crop&auto=format", worn: 8,  price: 195 },
  { id: 10, name: "Gold Hoop Earrings",  brand: "Mango",           category: "accessories",  season: "All", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300&h=380&fit=crop&auto=format", worn: 20, price: 29  },
];

const CATEGORY_META: { id: string; label: string; emoji: string }[] = [
  { id: "tops",        label: "Tops",        emoji: "👚" },
  { id: "bottoms",     label: "Bottoms",     emoji: "👖" },
  { id: "dresses",     label: "Dresses",     emoji: "👗" },
  { id: "shoes",       label: "Shoes",       emoji: "👟" },
  { id: "accessories", label: "Accessories", emoji: "👜" },
];

export function WardrobeScreen() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const toggleSelect = (id: number) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleCollapse = (cat: string) =>
    setCollapsedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const totalValue = WARDROBE_ITEMS.reduce((a, i) => a + i.price, 0);
  const totalWorn  = WARDROBE_ITEMS.reduce((a, i) => a + i.worn,  0);

  const filteredItems = WARDROBE_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByCategory = CATEGORY_META.map((cat) => ({
    ...cat,
    items: filteredItems.filter((item) => item.category === cat.id),
  })).filter((cat) => cat.items.length > 0);

  if (showAddScreen) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="add-screen"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
        >
          <AddItemScreen onBack={() => setShowAddScreen(false)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)" }}>
          My Wardrobe
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
          {WARDROBE_ITEMS.length} items · £{totalValue.toLocaleString()} value
        </p>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Items",      value: WARDROBE_ITEMS.length },
            { label: "Times worn", value: totalWorn },
            { label: "Cost/wear",  value: `£${(totalValue / totalWorn).toFixed(0)}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 p-3 rounded-2xl text-center"
              style={{ background: "var(--card)", boxShadow: "0 2px 8px rgba(169,139,227,0.1)" }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)", fontSize: "1.1rem" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <Search size={15} style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search your wardrobe…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* Categorised sections */}
      <div className="flex flex-col gap-2 px-5">
        {groupedByCategory.map((cat) => {
          const isCollapsed = collapsedCategories.includes(cat.id);
          return (
            <div
              key={cat.id}
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 2px 12px rgba(169,139,227,0.08)" }}
            >
              {/* Section header — tap to collapse */}
              <button
                className="w-full flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: isCollapsed ? "none" : "1px solid var(--border)" }}
                onClick={() => toggleCollapse(cat.id)}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: "1.1rem" }}>{cat.emoji}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--foreground)" }}>
                    {cat.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                  >
                    {cat.items.length}
                  </span>
                </div>
                {isCollapsed
                  ? <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />
                  : <ChevronUp   size={16} style={{ color: "var(--muted-foreground)" }} />}
              </button>

              {/* Items grid */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="grid grid-cols-3 gap-2.5 p-3">
                      {cat.items.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            className="rounded-2xl overflow-hidden cursor-pointer relative"
                            style={{
                              background: "var(--background)",
                              border: "1.5px solid",
                              borderColor: isSelected ? "var(--accent)" : "var(--border)",
                              boxShadow: isSelected ? "0 4px 12px rgba(169,139,227,0.3)" : "none",
                            }}
                            onClick={() => toggleSelect(item.id)}
                          >
                            {isSelected && (
                              <div
                                className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: "var(--accent)" }}
                              >
                                <Check size={10} color="white" />
                              </div>
                            )}
                            <div style={{ height: 100, background: "var(--muted)" }}>
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="px-2 py-2">
                              <p className="text-xs truncate" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>
                                {item.name}
                              </p>
                              <p className="text-xs truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                                {item.brand}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded-full"
                                  style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)", fontSize: "0.6rem" }}
                                >
                                  {item.season}
                                </span>
                                <span className="text-xs" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                                  ×{item.worn}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Add Item FAB — absolute so it stays inside the mobile frame */}
      <div className="sticky bottom-6 flex justify-end px-5 mt-4 pointer-events-none">
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center pointer-events-auto transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--accent)", boxShadow: "0 8px 24px rgba(169,139,227,0.5)" }}
          onClick={() => setShowAddScreen(true)}
        >
          <Plus size={24} color="white" />
        </button>
      </div>
    </div>
  );
}

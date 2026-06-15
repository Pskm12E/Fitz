import { useState } from "react";
import { Home, Shirt, Users, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { WardrobeScreen } from "./components/WardrobeScreen";
import { OutfitGeneratorScreen } from "./components/OutfitGeneratorScreen";
import { StyleJamsScreen } from "./components/StyleJamsScreen";
import { ShopScreen } from "./components/ShopScreen";
import { ProfileScreen } from "./components/ProfileScreen";

type Screen = "home" | "wardrobe" | "outfits" | "jams" | "shop" | "profile";

const LEFT_NAV:  { id: Screen; icon: typeof Home; label: string }[] = [
  { id: "home",    icon: Home,        label: "Home"    },
  { id: "wardrobe",icon: Shirt,       label: "Wardrobe"},
];
const RIGHT_NAV: { id: Screen; icon: typeof Home; label: string }[] = [
  { id: "jams",   icon: Users,       label: "Jams" },
  { id: "shop",   icon: ShoppingBag, label: "Shop" },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const navigate = (screen: string) => setActiveScreen(screen as Screen);

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":     return <HomeScreen onNavigate={navigate} />;
      case "wardrobe": return <WardrobeScreen />;
      case "outfits":  return <OutfitGeneratorScreen />;
      case "jams":     return <StyleJamsScreen />;
      case "shop":     return <ShopScreen />;
      case "profile":  return <ProfileScreen />;
      default:         return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "var(--background)" }}>
      <div className="relative flex flex-col flex-1 overflow-hidden" style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative" style={{ overscrollBehavior: "contain", scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              style={{ minHeight: "100%" }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex-shrink-0 pb-5 pt-2 px-4" style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}>
          <div
            className="flex items-center rounded-full px-2"
            style={{
              background: "var(--primary)",
              boxShadow: "0 8px 24px rgba(75,59,97,0.3)",
              height: 60,
            }}
          >
            {LEFT_NAV.map(({ id, icon: Icon, label }) => {
              const isActive = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveScreen(id)}
                  className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-full transition-all"
                  style={{ background: isActive ? "rgba(255,255,255,0.13)" : "transparent" }}
                >
                  <Icon size={isActive ? 19 : 17} style={{ color: isActive ? "white" : "rgba(255,255,255,0.45)", transition: "all 0.18s" }} strokeWidth={isActive ? 2.2 : 1.6} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: isActive ? 700 : 400, color: isActive ? "white" : "rgba(255,255,255,0.45)" }}>
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Centre Generate FAB */}
            <div className="relative flex items-center justify-center" style={{ width: 72, flexShrink: 0 }}>
              <motion.button
                onClick={() => setActiveScreen("home")}
                whileTap={{ scale: 0.93 }}
                className="flex flex-col items-center justify-center rounded-full"
                style={{
                  width: 58, height: 58,
                  background: activeScreen === "home"
                    ? "linear-gradient(135deg, #CDB7F6 0%, #A98BE3 100%)"
                    : "linear-gradient(135deg, #A98BE3 0%, #7e5fbf 100%)",
                  boxShadow: "0 4px 18px rgba(169,139,227,0.6), 0 0 0 3px rgba(255,255,255,0.12)",
                  marginTop: -18,
                  border: "2.5px solid rgba(255,255,255,0.25)",
                }}
              >
                <Sparkles size={22} color="white" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.55rem", fontWeight: 700, color: "white", marginTop: 1 }}>Generate</span>
              </motion.button>
            </div>

            {RIGHT_NAV.map(({ id, icon: Icon, label }) => {
              const isActive = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveScreen(id)}
                  className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-full transition-all"
                  style={{ background: isActive ? "rgba(255,255,255,0.13)" : "transparent" }}
                >
                  <Icon size={isActive ? 19 : 17} style={{ color: isActive ? "white" : "rgba(255,255,255,0.45)", transition: "all 0.18s" }} strokeWidth={isActive ? 2.2 : 1.6} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: isActive ? 700 : 400, color: isActive ? "white" : "rgba(255,255,255,0.45)" }}>
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Profile */}
            <button
              onClick={() => setActiveScreen("profile")}
              className="flex flex-col items-center gap-0.5 flex-1 py-2 rounded-full transition-all"
              style={{ background: activeScreen === "profile" ? "rgba(255,255,255,0.13)" : "transparent" }}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden" style={{ border: activeScreen === "profile" ? "1.5px solid white" : "1.5px solid rgba(255,255,255,0.4)" }}>
                <img src="https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=40&h=40&fit=crop&auto=format" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", fontWeight: activeScreen === "profile" ? 700 : 400, color: activeScreen === "profile" ? "white" : "rgba(255,255,255,0.45)" }}>
                Me
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

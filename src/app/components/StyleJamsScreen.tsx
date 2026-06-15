import { useState } from "react";
import { Users, Plus, Link, Sparkles, Copy, Check, Edit3, Calendar, MapPin, Palette, ChevronRight, X, ArrowLeft, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ACTIVE_JAM = {
  code: "STYLE-4821",
  event: "Keiko's Wedding",
  date: "June 28, 2026",
  location: "Bali, Indonesia",
  prompt: "Bohemian beach wedding in Bali",
  members: [
    { name: "You",   avatar: "https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=80&h=80&fit=crop&auto=format", items: 42, status: "host" },
    { name: "Mia",   avatar: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=80&h=80&fit=crop&auto=format", items: 31, status: "ready" },
    { name: "Priya", avatar: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=80&h=80&fit=crop&auto=format", items: 27, status: "pending" },
  ],
  outfits: [
    { id: 1, name: "Golden Hour Boho", img: "https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400&h=520&fit=crop&auto=format", members: ["You", "Mia"],  score: 96 },
    { id: 2, name: "Tropical Flow",    img: "https://images.unsplash.com/photo-1616639943825-e0fbad20a3d3?w=400&h=520&fit=crop&auto=format", members: ["Priya", "You"], score: 92 },
    { id: 3, name: "Sunset Linen",     img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=400&h=520&fit=crop&auto=format", members: ["Mia", "Priya"],  score: 89 },
  ],
};

const STYLE_VIBES = [
  { id: "boho",    label: "Bohemian",   emoji: "🌿" },
  { id: "formal",  label: "Formal",     emoji: "🥂" },
  { id: "casual",  label: "Casual",     emoji: "☀️" },
  { id: "beach",   label: "Beach",      emoji: "🌊" },
  { id: "y2k",     label: "Y2K",        emoji: "✨" },
  { id: "minimal", label: "Minimalist", emoji: "🤍" },
  { id: "dark",    label: "Dark Glam",  emoji: "🖤" },
  { id: "garden",  label: "Garden",     emoji: "🌸" },
];

type CreateStep = "details" | "vibe" | "invite" | "done";

interface NewJam {
  eventName: string;
  date: string;
  location: string;
  prompt: string;
  vibe: string;
  code: string;
}

export function StyleJamsScreen() {
  const [tab, setTab] = useState<"active" | "create" | "join">("active");
  const [createStep, setCreateStep] = useState<CreateStep>("details");
  const [copied, setCopied] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState(ACTIVE_JAM.prompt);
  const [joinCode, setJoinCode] = useState("");

  const [newJam, setNewJam] = useState<NewJam>({
    eventName: "",
    date: "",
    location: "",
    prompt: "",
    vibe: "",
    code: "",
  });

  const copyCode = (code: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCode = () =>
    "STYLE-" + Math.floor(1000 + Math.random() * 9000);

  const advanceStep = () => {
    if (createStep === "details") setCreateStep("vibe");
    else if (createStep === "vibe") setCreateStep("invite");
    else if (createStep === "invite") {
      setNewJam((j) => ({ ...j, code: generateCode() }));
      setCreateStep("done");
    }
  };

  const resetCreate = () => {
    setCreateStep("details");
    setNewJam({ eventName: "", date: "", location: "", prompt: "", vibe: "", code: "" });
    setTab("active");
  };

  const canAdvance =
    createStep === "details" ? newJam.eventName.trim().length > 0 :
    createStep === "vibe"    ? newJam.vibe.length > 0 :
    true;

  const STEP_LABELS: CreateStep[] = ["details", "vibe", "invite", "done"];
  const stepIndex = STEP_LABELS.indexOf(createStep);

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)" }}>
          Style Jams
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
          Coordinate looks with your crew
        </p>
      </div>

      {/* Top tabs */}
      <div className="px-5 mb-5">
        <div className="flex rounded-2xl p-1" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {(["active", "create", "join"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); if (t === "create") setCreateStep("details"); }}
              className="flex-1 py-2 rounded-xl text-xs capitalize transition-all"
              style={{
                background: tab === t ? "var(--primary)" : "transparent",
                color: tab === t ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "var(--font-body)",
                fontWeight: tab === t ? 600 : 400,
              }}
            >
              {t === "active" ? "My Jams" : t === "create" ? "Create" : "Join"}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACTIVE TAB ── */}
      <AnimatePresence mode="wait">
        {tab === "active" && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Active jam card */}
            <div className="px-5 mb-5">
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "var(--card)", boxShadow: "0 4px 24px rgba(169,139,227,0.2)", border: "1.5px solid var(--border)" }}
              >
                <div className="p-4" style={{ background: "linear-gradient(135deg, var(--accent), var(--secondary))" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white", fontFamily: "var(--font-body)" }}>
                        Active · Host
                      </span>
                      <h2 className="mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "white", fontWeight: 700 }}>
                        {ACTIVE_JAM.event}
                      </h2>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} color="rgba(255,255,255,0.8)" />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>{ACTIVE_JAM.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} color="rgba(255,255,255,0.8)" />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>{ACTIVE_JAM.location}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                      style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "var(--font-body)", backdropFilter: "blur(8px)" }}
                      onClick={() => copyCode(ACTIVE_JAM.code)}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {ACTIVE_JAM.code}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-2">
                      {ACTIVE_JAM.members.map((m) => (
                        <div key={m.name} className="w-8 h-8 rounded-full overflow-hidden" style={{ border: "2px solid white" }}>
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>
                      {ACTIVE_JAM.members.length} members · {ACTIVE_JAM.members.reduce((a, m) => a + m.items, 0)} items pooled
                    </span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Event Prompt</p>
                      {editingPrompt ? (
                        <input autoFocus value={promptText} onChange={(e) => setPromptText(e.target.value)} onBlur={() => setEditingPrompt(false)}
                          className="w-full text-sm bg-transparent outline-none border-b"
                          style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", fontStyle: "italic", borderColor: "var(--accent)", paddingBottom: 2 }}
                        />
                      ) : (
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--foreground)", fontStyle: "italic" }}>"{promptText}"</p>
                      )}
                    </div>
                    <button onClick={() => setEditingPrompt(true)}><Edit3 size={14} style={{ color: "var(--muted-foreground)" }} /></button>
                  </div>
                </div>

                {/* Members status */}
                <div className="p-4">
                  <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Member status</p>
                  <div className="flex flex-col gap-2">
                    {ACTIVE_JAM.members.map((m) => (
                      <div key={m.name} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid var(--accent)" }}>
                          <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{m.name}</p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{m.items} items</p>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: m.status === "host" ? "var(--accent)" : m.status === "ready" ? "#dcfce7" : "var(--muted)",
                            color: m.status === "host" ? "white" : m.status === "ready" ? "#16a34a" : "var(--muted-foreground)",
                            fontFamily: "var(--font-body)", fontWeight: 600,
                          }}
                        >
                          {m.status === "host" ? "Host" : m.status === "ready" ? "Ready" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── CREATE TAB ── */}
        {tab === "create" && (
          <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5">

            {/* Step progress bar */}
            <div className="flex items-center gap-2 mb-6">
              {["Details", "Vibe", "Invite", "Done"].map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all"
                      style={{
                        background: i <= stepIndex ? "var(--accent)" : "var(--muted)",
                        color: i <= stepIndex ? "white" : "var(--muted-foreground)",
                        fontFamily: "var(--font-body)", fontWeight: 700,
                      }}
                    >
                      {i < stepIndex ? <Check size={13} /> : i + 1}
                    </div>
                    <span className="text-xs" style={{ color: i <= stepIndex ? "var(--accent)" : "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: i === stepIndex ? 600 : 400 }}>
                      {label}
                    </span>
                  </div>
                  {i < 3 && <div className="h-0.5 flex-1 rounded-full mb-4" style={{ background: i < stepIndex ? "var(--accent)" : "var(--muted)" }} />}
                </div>
              ))}
            </div>

            {/* ── STEP 1: Details ── */}
            <AnimatePresence mode="wait">
              {createStep === "details" && (
                <motion.div key="step-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-3"
                >
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)", marginBottom: 4 }}>
                    Event Details
                  </h2>

                  {/* Event name */}
                  <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                    <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Event Name *
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Keiko's Wedding"
                      value={newJam.eventName}
                      onChange={(e) => setNewJam((j) => ({ ...j, eventName: e.target.value }))}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  {/* Date */}
                  <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={13} style={{ color: "var(--accent)" }} />
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Date
                      </p>
                    </div>
                    <input
                      type="date"
                      value={newJam.date}
                      onChange={(e) => setNewJam((j) => ({ ...j, date: e.target.value }))}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: newJam.date ? "var(--foreground)" : "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={13} style={{ color: "var(--accent)" }} />
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Location
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Bali, Indonesia"
                      value={newJam.location}
                      onChange={(e) => setNewJam((j) => ({ ...j, location: e.target.value }))}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  {/* Style prompt */}
                  <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Palette size={13} style={{ color: "var(--accent)" }} />
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Style Prompt
                      </p>
                    </div>
                    <textarea
                      rows={2}
                      placeholder='e.g. "Bohemian beach wedding in Bali"'
                      value={newJam.prompt}
                      onChange={(e) => setNewJam((j) => ({ ...j, prompt: e.target.value }))}
                      className="w-full bg-transparent outline-none text-sm resize-none"
                      style={{ color: "var(--foreground)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Vibe ── */}
              {createStep === "vibe" && (
                <motion.div key="step-vibe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)" }}>Choose a Vibe</h2>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                      This guides the AI when matching outfits across wardrobes
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {STYLE_VIBES.map((vibe) => {
                      const isSelected = newJam.vibe === vibe.id;
                      return (
                        <button
                          key={vibe.id}
                          onClick={() => setNewJam((j) => ({ ...j, vibe: vibe.id }))}
                          className="p-4 rounded-2xl text-left transition-all"
                          style={{
                            background: isSelected ? "var(--primary)" : "var(--card)",
                            border: "1.5px solid",
                            borderColor: isSelected ? "var(--primary)" : "var(--border)",
                            boxShadow: isSelected ? "0 4px 16px rgba(75,59,97,0.25)" : "none",
                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                          }}
                        >
                          <span style={{ fontSize: "1.4rem" }}>{vibe.emoji}</span>
                          <p className="mt-1.5 text-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: isSelected ? "var(--primary-foreground)" : "var(--foreground)" }}>
                            {vibe.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Invite ── */}
              {createStep === "invite" && (
                <motion.div key="step-invite" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)" }}>Invite Your Crew</h2>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                      Your jam code will be generated on the next step — share it with friends to sync wardrobes
                    </p>
                  </div>

                  {/* Preview card */}
                  <div
                    className="p-4 rounded-2xl"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--secondary))", boxShadow: "0 6px 20px rgba(169,139,227,0.3)" }}
                  >
                    <p className="text-xs text-white mb-2" style={{ fontFamily: "var(--font-body)", opacity: 0.8 }}>Your Jam</p>
                    <p className="text-white" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
                      {newJam.eventName || "Untitled Event"}
                    </p>
                    {newJam.date && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar size={11} color="rgba(255,255,255,0.8)" />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>{newJam.date}</span>
                      </div>
                    )}
                    {newJam.location && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={11} color="rgba(255,255,255,0.8)" />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}>{newJam.location}</span>
                      </div>
                    )}
                    {newJam.vibe && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white", fontFamily: "var(--font-body)" }}>
                          {STYLE_VIBES.find((v) => v.id === newJam.vibe)?.emoji} {STYLE_VIBES.find((v) => v.id === newJam.vibe)?.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                      Anyone with the code can join. You'll be able to share it after creation.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid var(--accent)" }}>
                        <img src="https://images.unsplash.com/photo-1581841064838-a470c740e8ee?w=40&h=40&fit=crop&auto=format" alt="You" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>You (Host)</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>42 wardrobe items ready</p>
                      </div>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white", fontFamily: "var(--font-body)" }}>Host</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Done ── */}
              {createStep === "done" && (
                <motion.div key="step-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-5 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--secondary))", boxShadow: "0 8px 32px rgba(169,139,227,0.4)" }}
                  >
                    <Check size={36} color="white" strokeWidth={2.5} />
                  </motion.div>

                  <div className="text-center">
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--foreground)", fontWeight: 700 }}>Jam Created!</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                      Share your code with friends to start coordinating
                    </p>
                  </div>

                  {/* Code box */}
                  <div
                    className="w-full p-4 rounded-2xl flex items-center justify-between"
                    style={{ background: "var(--card)", border: "2px dashed var(--accent)" }}
                  >
                    <div>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Your Jam Code</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>
                        {newJam.code}
                      </p>
                    </div>
                    <button
                      onClick={() => copyCode(newJam.code)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Share buttons */}
                  <div className="w-full flex gap-2">
                    <button
                      className="flex-1 py-3 rounded-full text-sm flex items-center justify-center gap-2"
                      style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                    >
                      <Share2 size={15} /> Share Link
                    </button>
                    <button
                      className="flex-1 py-3 rounded-full text-sm flex items-center justify-center gap-2"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
                      onClick={resetCreate}
                    >
                      <Users size={15} /> View Jam
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    {[
                      { icon: Calendar, label: "Event",    value: newJam.eventName },
                      { icon: MapPin,   label: "Location", value: newJam.location || "Not set" },
                      { icon: Palette,  label: "Vibe",     value: STYLE_VIBES.find((v) => v.id === newJam.vibe)?.label || "—" },
                    ].map(({ icon: Icon, label, value }, i, arr) => (
                      <div key={label} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", background: "var(--card)" }}>
                        <Icon size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                        <p className="text-xs flex-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{label}</p>
                        <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--foreground)" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA buttons */}
            {createStep !== "done" && (
              <div className="flex gap-3 mt-6">
                {createStep !== "details" && (
                  <button
                    onClick={() => setCreateStep(STEP_LABELS[stepIndex - 1])}
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
                  >
                    <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
                  </button>
                )}
                <button
                  onClick={advanceStep}
                  disabled={!canAdvance}
                  className="flex-1 py-3.5 rounded-full text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: canAdvance ? "var(--primary)" : "var(--muted)",
                    color: canAdvance ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    boxShadow: canAdvance ? "0 4px 16px rgba(75,59,97,0.25)" : "none",
                  }}
                >
                  {createStep === "invite" ? (
                    <><Sparkles size={15} /> Create Jam</>
                  ) : (
                    <>Continue <ChevronRight size={15} /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── JOIN TAB ── */}
        {tab === "join" && (
          <motion.div key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5">
            <div className="flex flex-col gap-4">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--foreground)" }}>Join a Jam</h2>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                  Enter the code your host shared with you
                </p>
              </div>

              <div
                className="p-4 rounded-2xl"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
              >
                <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Jam Code
                </p>
                <input
                  type="text"
                  placeholder="e.g. STYLE-4821"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-transparent outline-none"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.05em" }}
                />
              </div>

              <button
                disabled={joinCode.length < 6}
                className="w-full py-4 rounded-full text-sm flex items-center justify-center gap-2"
                style={{
                  background: joinCode.length >= 6 ? "var(--primary)" : "var(--muted)",
                  color: joinCode.length >= 6 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  fontFamily: "var(--font-body)", fontWeight: 600,
                }}
              >
                <Link size={15} /> Join Jam
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              <button
                className="w-full py-4 rounded-2xl text-sm flex items-center justify-center gap-2"
                style={{ background: "var(--card)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "var(--font-body)", fontWeight: 600 }}
              >
                <Share2 size={15} style={{ color: "var(--accent)" }} /> Scan QR Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

type WeatherData = {
  location: string;
  description: string;
  temperature: string;
  humidity: string;
  rainChance: string;
  outfitAdvice?: string;
  sourceNote?: string;
  checkedAt?: string;
  error?: string;
  details?: string;
};

type AppearanceAnalysis = {
  visiblePalette?: string[];
  dominantColour?: string;
  visibleSkinTone?: string;
  likelyUndertone?: string;
  contrastLevel?: string;
  recommendedColours?: string[];
  stylingDirection?: string;
  reasoning?: string;
  lightingCaveat?: string;
};

type OutfitItem = {
  id: string;
  name: string;
  image_url: string;
  category?: string;
  color?: string;
  style?: string[];
  storage_path?: string;
  price?: number | string;
  buy_url?: string;
};

type Outfit = {
  name?: string;
  reason?: string;
  occasionFit?: string;
  weatherFit?: string;
  styleNotes?: string;
  ownedItems?: OutfitItem[];
  shopItems?: OutfitItem[];
};

type OutfitResult = {
  outfits?: Outfit[];
  shoppingSkippedReason?: string | null;
  error?: string;
  details?: unknown;
};

type ApiError = {
  error?: string;
  details?: unknown;
};

type WardrobeResult = {
  items?: OutfitItem[];
  sourceNote?: string;
  error?: string;
  details?: unknown;
};

type WardrobeGroup = {
  key: string;
  label: string;
  icon: string;
  items: OutfitItem[];
};

type ShopResult = {
  items?: OutfitItem[];
  sourceNote?: string;
  error?: string;
  details?: unknown;
};

type ShopCollection = {
  key: string;
  label: string;
  description: string;
  items: OutfitItem[];
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PROMPT_SUGGESTIONS = [
  "Smart casual presentation",
  "Clean Korean-inspired outfit",
  "Relaxed earth-tone look",
  "Minimal outfit for humid weather",
];

function errorMessage(value: unknown, fallback: string) {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ApiError).error === "string"
  ) {
    const error = (value as ApiError).error as string;
    const details = (value as ApiError).details;
    return typeof details === "string" && details.trim()
      ? `${error}: ${details}`
      : error;
  }
  return fallback;
}

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Could not read the image"));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });
}

async function requestWeather() {
  const response = await fetch("/api/weather", { cache: "no-store" });
  const data = (await response.json()) as WeatherData;

  if (!response.ok) {
    throw new Error(errorMessage(data, "Could not load weather"));
  }

  return data;
}

function Icon({
  children,
  size = 18,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(
    null,
  );
  const [analysis, setAnalysis] = useState<AppearanceAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [occasion, setOccasion] = useState("School presentation");
  const [stylePrompt, setStylePrompt] = useState("clean casual");
  const [mustWearItem, setMustWearItem] = useState("Blue Straight Jeans");
  const [shopTheLook, setShopTheLook] = useState(false);
  const [budget, setBudget] = useState("15");
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [outfitLoading, setOutfitLoading] = useState(false);
  const [tryOnLoading, setTryOnLoading] = useState<number | null>(null);
  const [tryOnImages, setTryOnImages] = useState<Record<number, string>>({});
  const [tryOnNotes, setTryOnNotes] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<
    "home" | "wardrobe" | "shop"
  >("home");
  const [wardrobeItems, setWardrobeItems] = useState<OutfitItem[]>([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(false);
  const [wardrobeSearch, setWardrobeSearch] = useState("");
  const [wardrobeSourceNote, setWardrobeSourceNote] = useState("");
  const [shopItems, setShopItems] = useState<OutfitItem[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState("");
  const [shopBudget, setShopBudget] = useState(200);
  const [shopSourceNote, setShopSourceNote] = useState("");

  async function loadWeather() {
    setWeatherLoading(true);
    setMessage(null);
    try {
      setWeather(await requestWeather());
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not load weather",
      );
    } finally {
      setWeatherLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    requestWeather()
      .then((data) => {
        if (active) setWeather(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Could not load weather",
          );
        }
      })
      .finally(() => {
        if (active) setWeatherLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function selectImage(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    setAnalysis(null);
    setResult(null);
    setTryOnImages({});
    setTryOnNotes({});

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPhoto(null);
      setMessage("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setPhoto(null);
      setMessage("Please choose an image that is 5 MB or smaller.");
      return;
    }

    try {
      setPhoto({ name: file.name, dataUrl: await readImage(file) });
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not read the image",
      );
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    void selectImage(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void selectImage(event.dataTransfer.files[0]);
  }

  async function analyzePhoto() {
    if (!photo) return;
    setAnalysisLoading(true);
    setMessage(null);
    setResult(null);
    setTryOnImages({});
    setTryOnNotes({});

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: photo.dataUrl }),
      });
      const data = (await response.json()) as {
        analysis?: AppearanceAnalysis;
        error?: string;
        details?: unknown;
      };
      if (!response.ok || !data.analysis) {
        throw new Error(errorMessage(data, "Could not analyze the photo"));
      }
      setAnalysis(data.analysis);
      if (data.analysis.stylingDirection) {
        setStylePrompt(data.analysis.stylingDirection);
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not analyze the photo",
      );
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function generateOutfit() {
    setActiveView("home");

    if (!weather || !analysis) {
      setMessage("Check the weather and analyze your photo first.");
      document
        .querySelector(".generator-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setOutfitLoading(true);
    setMessage(null);
    setResult(null);
    setTryOnImages({});
    setTryOnNotes({});

    const weatherContext = [
      weather.description,
      `Temperature: ${weather.temperature}`,
      `Humidity: ${weather.humidity}`,
      `Rain: ${weather.rainChance}`,
      weather.outfitAdvice
        ? `Weather clothing advice: ${weather.outfitAdvice}`
        : null,
    ]
      .filter(Boolean)
      .join(". ");

    try {
      const response = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo_user",
          occasion,
          weather: weatherContext,
          stylePreference: stylePrompt,
          mustWearItem: mustWearItem || undefined,
          appearanceAnalysis: analysis,
          shopTheLook,
          budget: Number(budget) || 0,
        }),
      });
      const data = (await response.json()) as OutfitResult;
      if (!response.ok) {
        throw new Error(errorMessage(data, "Could not generate an outfit"));
      }
      setResult(data);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not generate an outfit",
      );
    } finally {
      setOutfitLoading(false);
    }
  }

  async function generateTryOn(outfit: Outfit, index: number) {
    if (!photo) {
      setMessage("Upload a person photo before creating a visualization.");
      return;
    }
    const garments = [
      ...(outfit.ownedItems ?? []),
      ...(outfit.shopItems ?? []),
    ].map((item) => ({ name: item.name, imageUrl: item.image_url }));
    if (!garments.length) return;

    setTryOnLoading(index);
    setMessage(null);
    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImage: photo.dataUrl,
          garments,
          outfitName: outfit.name,
        }),
      });
      const data = (await response.json()) as {
        imageUrl?: string;
        note?: string;
        error?: string;
        details?: unknown;
      };
      if (!response.ok || !data.imageUrl) {
        throw new Error(
          errorMessage(data, "Could not generate the visualization"),
        );
      }
      setTryOnImages((current) => ({
        ...current,
        [index]: data.imageUrl as string,
      }));
      if (data.note) {
        setTryOnNotes((current) => ({
          ...current,
          [index]: data.note as string,
        }));
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not generate the visualization",
      );
    } finally {
      setTryOnLoading(null);
    }
  }

  async function openWardrobe() {
    setActiveView("wardrobe");
    setMessage(null);

    if (wardrobeItems.length || wardrobeLoading) {
      return;
    }

    setWardrobeLoading(true);
    try {
      const response = await fetch("/api/wardrobe", { cache: "no-store" });
      const data = (await response.json()) as WardrobeResult;

      if (!response.ok) {
        throw new Error(errorMessage(data, "Could not load your wardrobe"));
      }

      setWardrobeItems(data.items ?? []);
      setWardrobeSourceNote(data.sourceNote ?? "");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not load your wardrobe",
      );
    } finally {
      setWardrobeLoading(false);
    }
  }

  async function openShop() {
    setActiveView("shop");
    setMessage(null);

    if (shopItems.length || shopLoading) {
      return;
    }

    setShopLoading(true);
    try {
      const response = await fetch("/api/shop", { cache: "no-store" });
      const data = (await response.json()) as ShopResult;

      if (!response.ok) {
        throw new Error(errorMessage(data, "Could not load the shop"));
      }

      setShopItems(data.items ?? []);
      setShopSourceNote(data.sourceNote ?? "");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Could not load the shop",
      );
    } finally {
      setShopLoading(false);
    }
  }

  const today = new Intl.DateTimeFormat("en-SG", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const wardrobeQuery = wardrobeSearch.trim().toLowerCase();
  const filteredWardrobeItems = wardrobeItems.filter((item) => {
    if (!wardrobeQuery) {
      return true;
    }

    return [
      item.name,
      item.category,
      item.storage_path,
      ...(item.style ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(wardrobeQuery);
  });
  const wardrobeGroups: WardrobeGroup[] = [
    {
      key: "tops",
      label: "Tops",
      icon: "T",
      items: filteredWardrobeItems.filter(
        (item) =>
          item.category?.toLowerCase() === "top" ||
          item.storage_path?.toLowerCase().includes("/top/"),
      ),
    },
    {
      key: "bottoms",
      label: "Bottoms",
      icon: "B",
      items: filteredWardrobeItems.filter(
        (item) =>
          item.category?.toLowerCase() === "bottom" ||
          item.storage_path?.toLowerCase().includes("/bottom/"),
      ),
    },
    {
      key: "other",
      label: "Other pieces",
      icon: "+",
      items: filteredWardrobeItems.filter((item) => {
        const category = item.category?.toLowerCase();
        const path = item.storage_path?.toLowerCase() ?? "";
        return (
          category !== "top" &&
          category !== "bottom" &&
          !path.includes("/top/") &&
          !path.includes("/bottom/")
        );
      }),
    },
  ].filter((group) => group.items.length > 0);
  const shopQuery = shopSearch.trim().toLowerCase();
  const filteredShopItems = shopItems.filter((item) => {
    const matchesBudget = Number(item.price) <= shopBudget;
    const matchesQuery =
      !shopQuery ||
      [item.name, item.category, item.color, ...(item.style ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(shopQuery);
    return matchesBudget && matchesQuery;
  });
  const shopCategories = Array.from(
    new Set(
      filteredShopItems.map((item) => item.category || "Curated pieces"),
    ),
  );
  const shopCollections: ShopCollection[] = shopCategories.map(
    (category, index) => ({
      key: category,
      label:
        index === 0
          ? `${category} Edit`
          : `${category} Collection`,
      description:
        analysis?.stylingDirection ||
        "Selected from the FitFitz Supabase marketplace",
      items: filteredShopItems.filter(
        (item) => (item.category || "Curated pieces") === category,
      ),
    }),
  );

  return (
    <main className="fitfitz-shell">
      <div className="fitfitz-phone">
        <div className="fitfitz-scroll">
          <header
            className={`app-header ${
              activeView !== "home" ? "view-hidden" : ""
            }`}
          >
            <div>
              <p className="eyebrow">{today}</p>
              <h1>
                What are you
                <br />
                <span>wearing today?</span>
              </h1>
            </div>
            <div className="avatar">
              {photo ? (
                <Image
                  src={photo.dataUrl}
                  alt="Your profile"
                  fill
                  unoptimized
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <Icon size={20}>
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
                </Icon>
              )}
            </div>
          </header>

          {message && (
            <div className="error-banner" role="alert">
              {message}
            </div>
          )}

          <div className={activeView === "home" ? "" : "view-hidden"}>
          <section className="weather-card">
            <div className="weather-main">
              <div className="weather-icon">
                <Icon size={22}>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </Icon>
              </div>
              <div className="weather-copy">
                <strong>
                  {weatherLoading
                    ? "Checking..."
                    : weather?.temperature || "Weather"}
                </strong>
                <span>
                  {weather?.description || "Agnes is checking Singapore"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void loadWeather()}
                className="icon-button light"
                aria-label="Refresh weather"
              >
                <Icon size={16}>
                  <path d="M20 7h-5V2" />
                  <path d="M20 2a9 9 0 1 0 2 10" />
                </Icon>
              </button>
            </div>
            <div className="weather-stats">
              <span>{weather?.humidity || "Humidity pending"}</span>
              <span>{weather?.rainChance || "Rain pending"}</span>
            </div>
            {weather?.outfitAdvice && (
              <div className="weather-advice">
                <Icon size={14}>
                  <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
                  <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
                </Icon>
                <p>{weather.outfitAdvice}</p>
              </div>
            )}
          </section>

          <section className="generator-card">
            <div className="section-label">
              <Icon size={15}>
                <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
              </Icon>
              AI outfit generator
            </div>

            <div className="generator-body">
              <div className="photo-row">
                <label
                  className="photo-drop"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="sr-only"
                  />
                  {photo ? (
                    <Image
                      src={photo.dataUrl}
                      alt={`Preview of ${photo.name}`}
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <Icon size={24}>
                        <path d="M4 17.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z" />
                        <circle cx="9" cy="9" r="1.5" />
                        <path d="m5 17 4-4 3 3 2-2 5 5" />
                      </Icon>
                      <span>Add your photo</span>
                    </>
                  )}
                </label>
                <div className="photo-copy">
                  <strong>Personal colour check</strong>
                  <p>
                    Agnes reads your visible tone and colour harmony before
                    styling.
                  </p>
                  <button
                    type="button"
                    onClick={analyzePhoto}
                    disabled={!photo || analysisLoading}
                    className="secondary-button"
                  >
                    {analysisLoading ? "Analyzing..." : "Analyze photo"}
                  </button>
                </div>
              </div>

              {analysis && (
                <div className="analysis-panel">
                  <div>
                    <span>Visible tone</span>
                    <strong>{analysis.visibleSkinTone || "Unclear"}</strong>
                  </div>
                  <div>
                    <span>Undertone</span>
                    <strong>{analysis.likelyUndertone || "Unclear"}</strong>
                  </div>
                  <div>
                    <span>Direction</span>
                    <strong>
                      {analysis.stylingDirection || "Personal styling"}
                    </strong>
                  </div>
                  {analysis.recommendedColours?.length ? (
                    <div className="colour-chips">
                      {analysis.recommendedColours.map((colour) => (
                        <span key={colour}>{colour}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              <label className="field-label" htmlFor="occasion">
                Occasion
              </label>
              <input
                id="occasion"
                className="soft-input"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                placeholder="Where are you going?"
              />

              <label className="field-label" htmlFor="vibe">
                Describe your vibe
              </label>
              <div className="prompt-box">
                <Icon size={18}>
                  <path d="m14.5 4.5 5 5L8 21H3v-5L14.5 4.5Z" />
                  <path d="m12 7 5 5" />
                </Icon>
                <textarea
                  id="vibe"
                  rows={3}
                  value={stylePrompt}
                  onChange={(event) => setStylePrompt(event.target.value)}
                  placeholder="Describe the outfit style you want..."
                />
              </div>

              <div className="suggestion-row">
                {PROMPT_SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => setStylePrompt(suggestion)}
                    className={stylePrompt === suggestion ? "active" : ""}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <label className="field-label" htmlFor="must-wear">
                Must-wear piece
              </label>
              <div className="wardrobe-field">
                <div className="wardrobe-icon">
                  <Icon size={18}>
                    <path d="m9 4-5 3 2 4 2-1v10h8V10l2 1 2-4-5-3c-.5 1.2-1.5 2-3 2s-2.5-.8-3-2Z" />
                  </Icon>
                </div>
                <input
                  id="must-wear"
                  value={mustWearItem}
                  onChange={(event) => setMustWearItem(event.target.value)}
                  placeholder="Optional, e.g. blue jeans"
                />
              </div>

              <div className="shop-row">
                <div>
                  <strong>Shop the look</strong>
                  <p>Allow marketplace suggestions within your budget</p>
                </div>
                <button
                  type="button"
                  className={`switch ${shopTheLook ? "on" : ""}`}
                  onClick={() => setShopTheLook((current) => !current)}
                  aria-pressed={shopTheLook}
                >
                  <span />
                </button>
              </div>

              {shopTheLook && (
                <div className="budget-field">
                  <span>Maximum budget S$</span>
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={generateOutfit}
                disabled={!weather || !analysis || outfitLoading}
                className="generate-button"
              >
                <Icon size={19}>
                  <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
                  <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
                </Icon>
                {outfitLoading ? "Styling your outfits..." : "Generate outfits"}
              </button>
            </div>
          </section>

          {(outfitLoading || result?.outfits?.length) && (
            <section className="results-section">
              <div className="results-heading">
                <div>
                  <span>Your outfits</span>
                  <h2>Styled for you</h2>
                </div>
                {!outfitLoading && (
                  <button type="button" onClick={generateOutfit}>
                    More
                  </button>
                )}
              </div>

              {outfitLoading ? (
                <div className="loading-stack">
                  <div />
                  <div />
                </div>
              ) : (
                <div className="outfit-stack">
                  {result?.outfits?.map((outfit, index) => {
                    const allItems = [
                      ...(outfit.ownedItems ?? []),
                      ...(outfit.shopItems ?? []),
                    ];
                    const heroImage =
                      tryOnImages[index] || allItems[0]?.image_url;
                    return (
                      <div
                        className={`outfit-card-shell ${
                          tryOnLoading === index ? "is-visualizing" : ""
                        }`}
                        key={`${outfit.name ?? "outfit"}-${index}`}
                      >
                        <article className="outfit-card">
                          {heroImage && (
                            <div className="outfit-hero">
                              <Image
                                src={heroImage}
                                alt={outfit.name || "Generated outfit"}
                                fill
                                unoptimized
                                sizes="150px"
                                className="object-cover"
                              />
                              {tryOnLoading === index && (
                                <div
                                  className="visualizing-overlay"
                                  role="status"
                                  aria-live="polite"
                                >
                                  <span className="visualizing-spark">
                                    <Icon size={18}>
                                      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
                                    </Icon>
                                  </span>
                                  <strong>Creating your look</strong>
                                  <small>Matching your photo and clothes</small>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="outfit-content">
                            <div className="fit-row">
                              <span>{outfit.occasionFit || "Styled"}</span>
                              <span>{outfit.weatherFit || "Weather ready"}</span>
                            </div>
                            <h3>{outfit.name || `Outfit ${index + 1}`}</h3>
                            <p>{outfit.reason}</p>
                            <div className="piece-row">
                              {allItems.map((item) => (
                                <div className="piece-thumb" key={item.id}>
                                  <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    unoptimized
                                    sizes="46px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <p className="style-note">{outfit.styleNotes}</p>
                            <button
                              type="button"
                              onClick={() => generateTryOn(outfit, index)}
                              disabled={!photo || tryOnLoading !== null}
                              className="try-on-button"
                            >
                              <Icon size={15}>
                                <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
                              </Icon>
                              {tryOnLoading === index ? (
                                <>
                                  Creating visualization
                                  <span
                                    className="loading-dots"
                                    aria-hidden="true"
                                  >
                                    <i />
                                    <i />
                                    <i />
                                  </span>
                                </>
                              ) : tryOnImages[index] ? (
                                "Regenerate visualization"
                              ) : (
                                "Visualize this outfit"
                              )}
                            </button>
                            {tryOnNotes[index] && (
                              <p className="try-on-note">
                                {tryOnNotes[index]}
                              </p>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              )}

              {result?.shoppingSkippedReason && (
                <p className="skip-note">{result.shoppingSkippedReason}</p>
              )}
            </section>
          )}
          </div>

          {activeView === "wardrobe" && (
            <section className="wardrobe-view">
              <div className="wardrobe-heading">
                <div>
                  <h2>My Wardrobe</h2>
                  <p>
                    {wardrobeLoading
                      ? "Reading your Supabase collection..."
                      : `${wardrobeItems.length} items in your collection`}
                  </p>
                </div>
              </div>

              <div className="wardrobe-stats">
                <div>
                  <strong>{wardrobeItems.length}</strong>
                  <span>Items</span>
                </div>
                <div>
                  <strong>
                    {
                      new Set(
                        wardrobeItems.map(
                          (item) => item.category || "clothing",
                        ),
                      ).size
                    }
                  </strong>
                  <span>Categories</span>
                </div>
                <div>
                  <strong>Supabase</strong>
                  <span>Connected</span>
                </div>
              </div>

              <label className="wardrobe-search">
                <Icon size={20}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 5 5" />
                </Icon>
                <input
                  type="search"
                  value={wardrobeSearch}
                  onChange={(event) => setWardrobeSearch(event.target.value)}
                  placeholder="Search your wardrobe..."
                />
              </label>

              {wardrobeLoading ? (
                <div
                  className="wardrobe-sections wardrobe-loading"
                  aria-label="Loading wardrobe"
                >
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} />
                  ))}
                </div>
              ) : wardrobeGroups.length ? (
                <>
                  <div className="wardrobe-sections">
                    {wardrobeGroups.map((group) => (
                      <section className="wardrobe-group" key={group.key}>
                        <header>
                          <span className="wardrobe-group-icon">
                            {group.icon}
                          </span>
                          <h3>{group.label}</h3>
                          <strong>{group.items.length}</strong>
                          <Icon size={18} className="wardrobe-chevron">
                            <path d="m6 14 6-6 6 6" />
                          </Icon>
                        </header>
                        <div className="wardrobe-rail">
                          {group.items.map((item) => (
                            <article className="wardrobe-item" key={item.id}>
                              <div className="wardrobe-image">
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  fill
                                  unoptimized
                                  sizes="145px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="wardrobe-item-copy">
                                <h4>{item.name}</h4>
                                <p>
                                  {item.style?.at(-1) ||
                                    item.category ||
                                    "Clothing"}
                                </p>
                                <span>
                                  {item.storage_path
                                    ? item.storage_path
                                        .split("/")
                                        .slice(-2, -1)
                                        .join("")
                                    : "Owned"}
                                </span>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <div className="wardrobe-grid legacy-wardrobe-grid">
                  {false && wardrobeItems.map((item) => (
                    <article className="wardrobe-item" key={item.id}>
                      <div className="wardrobe-image">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="(max-width: 500px) 42vw, 190px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span>{item.category || "Clothing"}</span>
                        <h3>{item.name}</h3>
                        {item.style?.length ? (
                          <p>{item.style.join(" · ")}</p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                  </div>
                </>
              ) : (
                <div className="empty-wardrobe">
                  {wardrobeSearch
                    ? "No clothes match your search."
                    : "No readable clothes were found in your Supabase Clothes bucket."}
                </div>
              )}
              {wardrobeSourceNote && (
                <p className="wardrobe-source">{wardrobeSourceNote}</p>
              )}
            </section>
          )}

          {activeView === "shop" && (
            <section className="shop-view">
              <div className="shop-heading">
                <div>
                  <h2>Discover</h2>
                  <p>Curated for your colour and style</p>
                </div>
                <span className="shop-cart">
                  <Icon size={25}>
                    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H6" />
                    <circle cx="10" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </Icon>
                </span>
              </div>

              <div className="shop-profile">
                <div className="shop-avatar">
                  {photo ? (
                    <Image
                      src={photo.dataUrl}
                      alt="Your profile"
                      fill
                      unoptimized
                      sizes="46px"
                      className="object-cover"
                    />
                  ) : (
                    <Icon size={20}>
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
                    </Icon>
                  )}
                </div>
                <div>
                  <strong>
                    {analysis?.likelyUndertone
                      ? `${analysis.likelyUndertone} undertone`
                      : "Personal style edit"}
                  </strong>
                  <p>
                    {analysis?.stylingDirection ||
                      "Add a photo analysis for personalised picks"}
                  </p>
                </div>
                <div className="shop-palette" aria-hidden="true">
                  {(analysis?.recommendedColours ?? [
                    "Lavender",
                    "Plum",
                    "Sand",
                  ])
                    .slice(0, 3)
                    .map((colour, index) => (
                      <i
                        key={`${colour}-${index}`}
                        style={{
                          background:
                            index === 0
                              ? "#d9c3fb"
                              : index === 1
                                ? "#a98be3"
                                : "#d8aa7c",
                        }}
                      />
                    ))}
                </div>
              </div>

              <div className="shop-filter-card">
                <div className="shop-filter-label">
                  <Icon size={16}>
                    <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
                  </Icon>
                  AI style filter
                </div>
                <div className="shop-filter-body">
                  <p>
                    I&apos;ve curated the Supabase shop for your preferences.
                    Search by colour, category, or style.
                  </p>
                  <div className="shop-suggestions">
                    {["Warm tones", "Smart casual", "Sale pieces"].map(
                      (suggestion) => (
                        <button
                          type="button"
                          key={suggestion}
                          onClick={() => setShopSearch(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ),
                    )}
                  </div>
                  <label className="shop-search">
                    <input
                      value={shopSearch}
                      onChange={(event) => setShopSearch(event.target.value)}
                      placeholder="e.g. green shirts under S$100..."
                    />
                    <Icon size={18}>
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </Icon>
                  </label>
                </div>
              </div>

              <div className="shop-budget">
                <div>
                  <span>Max budget</span>
                  <strong>S${shopBudget}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={shopBudget}
                  onChange={(event) => setShopBudget(Number(event.target.value))}
                />
              </div>

              {shopLoading ? (
                <div className="shop-loading">
                  <div />
                  <div />
                </div>
              ) : shopCollections.length ? (
                <div className="shop-collections">
                  {shopCollections.map((collection) => (
                    <section className="shop-collection" key={collection.key}>
                      <div className="shop-collection-hero">
                        <Image
                          src={collection.items[0].image_url}
                          alt=""
                          fill
                          unoptimized
                          sizes="430px"
                          className="object-cover"
                        />
                        <div>
                          <span>
                            {collection.items[0].color ||
                              collection.items[0].category}
                          </span>
                          <h3>{collection.label}</h3>
                          <p>{collection.description}</p>
                        </div>
                      </div>
                      <div className="shop-product-list">
                        {collection.items.map((item) => (
                          <article className="shop-product" key={item.id}>
                            <div className="shop-product-image">
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                unoptimized
                                sizes="54px"
                                className="object-cover"
                              />
                            </div>
                            <div className="shop-product-copy">
                              <h4>{item.name}</h4>
                              <p>
                                {item.style?.join(" / ") ||
                                  item.category ||
                                  "Marketplace"}
                              </p>
                            </div>
                            <div className="shop-product-action">
                              <strong>S${Number(item.price).toFixed(2)}</strong>
                              {item.buy_url ? (
                                <a
                                  href={item.buy_url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Buy
                                </a>
                              ) : (
                                <span>Unavailable</span>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="empty-shop">
                  <strong>No shop products found</strong>
                  <p>
                    Add rows to the Supabase <code>marketplace_items</code>{" "}
                    table with a name, category, price, image URL, and buy URL.
                  </p>
                </div>
              )}

              {shopSourceNote && (
                <p className="shop-source">{shopSourceNote}</p>
              )}
            </section>
          )}
        </div>

        <nav className="bottom-nav" aria-label="Main navigation">
          <button
            type="button"
            className={activeView === "home" ? "active" : ""}
            onClick={() => setActiveView("home")}
          >
            <Icon size={18}>
              <path d="m3 11 9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </Icon>
            <span>Home</span>
          </button>
          <button
            type="button"
            className={activeView === "wardrobe" ? "active" : ""}
            onClick={() => void openWardrobe()}
          >
            <Icon size={18}>
              <path d="m9 4-5 3 2 4 2-1v10h8V10l2 1 2-4-5-3c-.5 1.2-1.5 2-3 2s-2.5-.8-3-2Z" />
            </Icon>
            <span>Wardrobe</span>
          </button>
          <button
            type="button"
            className={`nav-generate ${outfitLoading ? "is-loading" : ""}`}
            onClick={() => void generateOutfit()}
            disabled={outfitLoading}
          >
            <span className="nav-orb">
              <Icon size={21}>
                <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
              </Icon>
            </span>
            <span>{outfitLoading ? "Styling" : "Generate"}</span>
          </button>
          <button
            type="button"
            className={activeView === "shop" ? "active" : ""}
            onClick={() => void openShop()}
          >
            <Icon size={18}>
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </Icon>
            <span>Shop</span>
          </button>
          <button type="button">
            <Icon size={18}>
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
            </Icon>
            <span>Me</span>
          </button>
        </nav>
      </div>
    </main>
  );
}

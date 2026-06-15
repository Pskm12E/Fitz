import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  getStorageWardrobeItems,
  resolveItemImage,
} from "@/lib/storage";

const AGNES_API_KEY = process.env.AGNES_API_KEY;
const AGNES_ENDPOINT =
  process.env.AGNES_ENDPOINT ||
  "https://apihub.agnes-ai.com/v1/chat/completions";
const HAS_AGNES_API_KEY =
  Boolean(AGNES_API_KEY?.trim()) &&
  AGNES_API_KEY !== "your_new_agnes_api_key_here";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getItemCategory(item: JsonRecord) {
  const category =
    typeof item.category === "string" ? item.category.toLowerCase() : "";
  const style = Array.isArray(item.style)
    ? item.style
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLowerCase()
    : "";
  const description = `${category} ${style} ${
    typeof item.name === "string" ? item.name.toLowerCase() : ""
  }`;

  if (/(jacket|coat|blazer|cardigan|overshirt|outerwear)/.test(description)) {
    return "outerwear";
  }

  if (/(top|shirt|t-shirt|tee|polo|henley|sweater)/.test(description)) {
    return "top";
  }

  if (/(bottom|jean|trouser|pant|short|chino)/.test(description)) {
    return "bottom";
  }

  if (/(shoe|sneaker|loafer|boot|sandal)/.test(description)) {
    return "shoes";
  }

  return "other";
}

function removeDuplicateCoreItems(
  itemIds: string[],
  items: JsonRecord[],
) {
  const itemById = new Map(
    items
      .filter((item) => typeof item.id === "string")
      .map((item) => [item.id as string, item]),
  );
  const usedCategories = new Set<string>();

  return itemIds.filter((id) => {
    const item = itemById.get(id);

    if (!item) {
      return false;
    }

    const category = getItemCategory(item);

    if (!["top", "bottom", "shoes"].includes(category)) {
      return true;
    }

    if (usedCategories.has(category)) {
      return false;
    }

    usedCategories.add(category);
    return true;
  });
}

export async function POST(req: Request) {
  try {
    if (!HAS_AGNES_API_KEY) {
      return NextResponse.json(
        {
          error: "Agnes API key is not configured",
          details:
            "Replace your_new_agnes_api_key_here in .env.local with your real Agnes API key, then restart the development server.",
        },
        { status: 500 },
      );
    }

    const body: unknown = await req.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object" },
        { status: 400 },
      );
    }

    const userId =
      typeof body.userId === "string" ? body.userId : "demo_user";
    const occasion =
      typeof body.occasion === "string" ? body.occasion : undefined;
    const weather =
      typeof body.weather === "string" ? body.weather : undefined;
    const stylePreference =
      typeof body.stylePreference === "string"
        ? body.stylePreference
        : undefined;
    const mustWearItem =
      typeof body.mustWearItem === "string" ? body.mustWearItem : undefined;
    const appearanceAnalysis = isRecord(body.appearanceAnalysis)
      ? body.appearanceAnalysis
      : null;
    const shopTheLook =
      typeof body.shopTheLook === "boolean" ? body.shopTheLook : false;
    const budget =
      typeof body.budget === "number" || typeof body.budget === "string"
        ? Number(body.budget)
        : 0;

    if (!occasion || !weather || !stylePreference) {
      return NextResponse.json(
        {
          error: "Missing required fields: occasion, weather, stylePreference",
        },
        { status: 400 },
      );
    }

    if (!Number.isFinite(budget) || budget < 0) {
      return NextResponse.json(
        { error: "Budget must be a non-negative number" },
        { status: 400 },
      );
    }

    const { data: wardrobeItems, error: wardrobeError } = await supabase
      .from("wardrobe_items")
      .select("*")
      .eq("user_id", userId);

    if (wardrobeError || !wardrobeItems) {
      return NextResponse.json(
        { error: "Failed to fetch wardrobe items", details: wardrobeError },
        { status: 500 },
      );
    }

    const { data: marketplaceItems, error: marketplaceError } = await supabase
      .from("marketplace_items")
      .select("*");

    if (marketplaceError || !marketplaceItems) {
      return NextResponse.json(
        {
          error: "Failed to fetch marketplace items",
          details: marketplaceError,
        },
        { status: 500 },
      );
    }

    const wardrobeItemsWithImages =
      wardrobeItems.length > 0
        ? wardrobeItems.map(resolveItemImage)
        : await getStorageWardrobeItems("Clothes", userId);
    const marketplaceItemsWithImages = marketplaceItems.map(resolveItemImage);

    if (wardrobeItemsWithImages.length === 0) {
      return NextResponse.json(
        {
          error: "No wardrobe items are available",
          details:
            "The wardrobe_items table is empty and no readable images were found in the Clothes storage bucket.",
        },
        { status: 422 },
      );
    }

    const allowedWardrobeIds = wardrobeItemsWithImages.map((item) => item.id);
    const allowedShopIds = marketplaceItemsWithImages.map((item) => item.id);

    const prompt = `
You are an AI fashion stylist for a wardrobe planning app.

Create 2 to 3 outfit suggestions.

Rules:
1. Use mostly the user's existing wardrobe items.
2. Only use wardrobe item IDs from the provided wardrobe list.
3. Only use marketplace item IDs from the provided marketplace list.
4. Every outfit should include exactly one primary top, exactly one bottom, and one pair of shoes if available.
5. Never select two shirts, polos, T-shirts, or other primary tops for the same outfit.
6. An extra upper-body garment is allowed only when it is clearly outerwear such as a jacket, coat, blazer, cardigan, or overshirt.
7. If mustWearItem is provided, include the closest matching wardrobe item.
8. If shopTheLook is false, do not suggest marketplace items.
9. If shopTheLook is true, marketplace items are optional.
10. If suggesting marketplace items, total shop price for each outfit must be less than or equal to the budget.
11. If the budget is too low, set shopItemIds to [] and use only wardrobe items.
12. Do not invent item IDs.
13. Use the weather assessment to choose practical fabrics, layers, and footwear.
14. Use the photo's visible skin-tone, undertone, contrast, and recommended colours when choosing colour combinations.
15. In each reason, explain both the weather suitability and why the colours complement the photo analysis.
16. Return valid JSON only. No markdown.

User request:
Occasion: ${occasion}
Weather: ${weather}
Style preference: ${stylePreference}
Must-wear item: ${mustWearItem || "None"}
Shop the Look: ${shopTheLook}
Budget: ${budget}

Photo skin-tone and styling analysis:
${appearanceAnalysis ? JSON.stringify(appearanceAnalysis, null, 2) : "No photo analysis provided"}

User wardrobe items:
${JSON.stringify(wardrobeItemsWithImages, null, 2)}

Marketplace items:
${marketplaceItemsWithImages.length > 0 ? JSON.stringify(marketplaceItemsWithImages, null, 2) : "No marketplace items are available. Use wardrobe items only."}

Return this exact JSON structure:
{
  "outfits": [
    {
      "name": "string",
      "ownedItemIds": ["string"],
      "shopItemIds": ["string"],
      "totalShopPrice": 0,
      "reason": "string",
      "occasionFit": "Low | Medium | High",
      "weatherFit": "Low | Medium | High",
      "styleNotes": "string"
    }
  ],
  "shoppingSkippedReason": "string or null"
}
`;

    const aiResponse = await fetch(AGNES_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AGNES_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "agnes-2.0-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a fashion stylist API. Always return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return NextResponse.json(
        {
          error: "AI API request failed",
          details: errorText,
        },
        { status: aiResponse.status },
      );
    }

    const aiData: unknown = await aiResponse.json();
    const rawText =
      isRecord(aiData) &&
      Array.isArray(aiData.choices) &&
      isRecord(aiData.choices[0]) &&
      isRecord(aiData.choices[0].message) &&
      typeof aiData.choices[0].message.content === "string"
        ? aiData.choices[0].message.content
        : undefined;

    if (!rawText) {
      return NextResponse.json(
        {
          error: "No response from AI",
          raw: aiData,
        },
        { status: 500 },
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "AI did not return valid JSON",
          rawText,
        },
        { status: 500 },
      );
    }

    if (!isRecord(parsed) || !Array.isArray(parsed.outfits)) {
      return NextResponse.json(
        {
          error: "AI response did not include an outfits array",
          rawText,
        },
        { status: 500 },
      );
    }

    const cleanedOutfits = parsed.outfits.filter(isRecord).map((outfit) => {
      const ownedItemIds = removeDuplicateCoreItems(
        getStringArray(outfit.ownedItemIds).filter((id) =>
          allowedWardrobeIds.includes(id),
        ),
        wardrobeItemsWithImages,
      );

      const shopItemIds = getStringArray(outfit.shopItemIds).filter((id) =>
        allowedShopIds.includes(id),
      );

      const shopItems = marketplaceItemsWithImages.filter((item) =>
        shopItemIds.includes(item.id),
      );

      const totalShopPrice = shopItems.reduce(
        (sum, item) => sum + Number(item.price),
        0,
      );

      const finalShopItemIds =
        shopTheLook && totalShopPrice <= budget ? shopItemIds : [];

      const finalShopItems = marketplaceItemsWithImages.filter((item) =>
        finalShopItemIds.includes(item.id),
      );

      const finalTotalShopPrice = finalShopItems.reduce(
        (sum, item) => sum + Number(item.price),
        0,
      );

      return {
        ...outfit,
        ownedItemIds,
        shopItemIds: finalShopItemIds,
        totalShopPrice: finalTotalShopPrice,
        ownedItems: wardrobeItemsWithImages.filter((item) =>
          ownedItemIds.includes(item.id),
        ),
        shopItems: finalShopItems,
      };
    });

    const providedSkippedReason =
      typeof parsed.shoppingSkippedReason === "string"
        ? parsed.shoppingSkippedReason
        : null;

    return NextResponse.json({
      outfits: cleanedOutfits,
      shoppingSkippedReason:
        providedSkippedReason ||
        (!shopTheLook
          ? "Shop the Look is turned off."
          : cleanedOutfits.every((outfit) => outfit.shopItemIds.length === 0)
            ? "No suitable marketplace items were found within the budget."
            : null),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

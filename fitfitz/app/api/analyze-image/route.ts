import { NextResponse } from "next/server";

const AGNES_API_KEY = process.env.AGNES_API_KEY;
const AGNES_ENDPOINT =
  process.env.AGNES_ENDPOINT ||
  "https://apihub.agnes-ai.com/v1/chat/completions";
const HAS_AGNES_API_KEY =
  Boolean(AGNES_API_KEY?.trim()) &&
  AGNES_API_KEY !== "your_new_agnes_api_key_here";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getAssistantText(value: unknown) {
  if (
    !isRecord(value) ||
    !Array.isArray(value.choices) ||
    !isRecord(value.choices[0]) ||
    !isRecord(value.choices[0].message)
  ) {
    return null;
  }

  return typeof value.choices[0].message.content === "string"
    ? value.choices[0].message.content
    : null;
}

function estimateDataUrlBytes(dataUrl: string) {
  const encoded = dataUrl.split(",", 2)[1] ?? "";
  return Math.ceil((encoded.length * 3) / 4);
}

function parseJsonResponse(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned) as unknown;
}

export async function POST(request: Request) {
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

    const body: unknown = await request.json();
    const imageDataUrl =
      isRecord(body) && typeof body.imageDataUrl === "string"
        ? body.imageDataUrl
        : null;

    if (
      !imageDataUrl ||
      !/^data:image\/(jpeg|png|webp);base64,/i.test(imageDataUrl)
    ) {
      return NextResponse.json(
        { error: "Please upload a JPEG, PNG, or WebP image" },
        { status: 400 },
      );
    }

    if (estimateDataUrlBytes(imageDataUrl) > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller" },
        { status: 413 },
      );
    }

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
              "You are a careful personal stylist. You may describe visible skin tone and undertone for clothing colour matching. Do not identify the person or infer ethnicity, health, age, gender identity, or other sensitive traits. Treat all colour readings as approximate and affected by lighting. Return valid JSON only.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this photo before outfit generation.

Return exactly:
{
  "visiblePalette": ["3 to 5 visible colour names"],
  "dominantColour": "string",
  "visibleSkinTone": "brief neutral description of the visible skin-tone depth and surface colour, or unclear",
  "likelyUndertone": "warm | cool | neutral | unclear",
  "contrastLevel": "low | medium | high",
  "recommendedColours": ["4 to 6 clothing colour names"],
  "coloursToUseCarefully": ["0 to 4 colour names"],
  "stylingDirection": "short styling direction",
  "reasoning": "2 to 4 sentences explaining the visible colour observations and why the direction may work",
  "lightingCaveat": "short caveat about lighting and camera colour"
}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!aiResponse.ok) {
      const details = await aiResponse.text();
      return NextResponse.json(
        {
          error: "Image analysis request failed",
          details,
        },
        { status: aiResponse.status },
      );
    }

    const aiData: unknown = await aiResponse.json();
    const rawText = getAssistantText(aiData);

    if (!rawText) {
      return NextResponse.json(
        { error: "The AI returned no image analysis" },
        { status: 502 },
      );
    }

    let analysis: unknown;

    try {
      analysis = parseJsonResponse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "The AI image analysis was not valid JSON",
          details: rawText,
        },
        { status: 502 },
      );
    }

    if (!isRecord(analysis)) {
      return NextResponse.json(
        { error: "The AI returned an invalid image analysis" },
        { status: 502 },
      );
    }

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Could not analyze the image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

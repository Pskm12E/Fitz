import { NextResponse } from "next/server";

import { resolveItemImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("marketplace_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to load marketplace items", details: error },
        { status: 500 },
      );
    }

    const items = (data ?? [])
      .filter(
        (item) =>
          typeof item.image_url === "string" &&
          item.image_url.trim() &&
          Number.isFinite(Number(item.price)),
      )
      .map(resolveItemImage);

    return NextResponse.json({
      items,
      sourceNote: "Products loaded from the Supabase marketplace_items table.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Could not load the shop",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import {
  getStorageWardrobeItems,
  resolveItemImage,
} from "@/lib/storage";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const userId = "demo_user";
    const { data: tableItems, error } = await supabase
      .from("wardrobe_items")
      .select("*")
      .eq("user_id", userId);

    const storageItems = await getStorageWardrobeItems("Clothes", userId, {
      maxItemsPerFolder: null,
    });
    const allItems = [
      ...(error ? [] : (tableItems ?? []).map(resolveItemImage)),
      ...storageItems,
    ];
    const seenImages = new Set<string>();
    const items = allItems.filter((item) => {
      if (seenImages.has(item.image_url)) {
        return false;
      }

      seenImages.add(item.image_url);
      return true;
    });

    return NextResponse.json({
      items,
      sourceNote: error
        ? "Loaded from the public Clothes storage bucket; the wardrobe_items table was unavailable."
        : "Loaded from Supabase wardrobe_items and the public Clothes storage bucket.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Could not load the wardrobe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

import { supabase } from "@/lib/supabase";

const STORAGE_PREFIX = "storage://";
const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|webp)$/i;
const MAX_ITEMS_PER_FOLDER = 12;

export type StorageWardrobeItem = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color: null;
  style: string[];
  weather: string[];
  formality: null;
  image_url: string;
  created_at: string | null;
  storage_path: string;
};

export function resolveStorageUrl(imageUrl: string) {
  if (!imageUrl.startsWith(STORAGE_PREFIX)) {
    return imageUrl;
  }

  const storagePath = imageUrl.slice(STORAGE_PREFIX.length);
  const separatorIndex = storagePath.indexOf("/");

  if (separatorIndex <= 0 || separatorIndex === storagePath.length - 1) {
    return imageUrl;
  }

  const bucket = storagePath.slice(0, separatorIndex);
  const path = storagePath.slice(separatorIndex + 1);

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function resolveItemImage<T extends { image_url: string }>(item: T) {
  return {
    ...item,
    image_url: resolveStorageUrl(item.image_url),
  };
}

function humanizeFileName(fileName: string) {
  return fileName
    .replace(IMAGE_EXTENSION, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categoryFromPath(path: string) {
  const segments = path.split("/");

  if (segments.includes("Top")) {
    return "top";
  }

  if (segments.includes("Bottom")) {
    return "bottom";
  }

  return "clothing";
}

function styleFromPath(path: string) {
  const segments = path.split("/");
  return segments.slice(1, -1).map((segment) => segment.replace(/-/g, " "));
}

async function listFilesRecursively(bucket: string, prefix = "") {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw error;
  }

  const files: { name: string; path: string; createdAt: string | null }[] = [];

  for (const entry of data) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.id === null) {
      files.push(...(await listFilesRecursively(bucket, path)));
      continue;
    }

    if (IMAGE_EXTENSION.test(entry.name)) {
      files.push({
        name: entry.name,
        path,
        createdAt: entry.created_at ?? null,
      });
    }
  }

  return files;
}

export async function getStorageWardrobeItems(
  bucket = "Clothes",
  userId = "demo_user",
  options: { maxItemsPerFolder?: number | null } = {},
) {
  const files = await listFilesRecursively(bucket);
  const folderCounts = new Map<string, number>();
  const maxItemsPerFolder =
    options.maxItemsPerFolder === undefined
      ? MAX_ITEMS_PER_FOLDER
      : options.maxItemsPerFolder;

  return files.flatMap<StorageWardrobeItem>((file) => {
    const folder = file.path.slice(0, file.path.lastIndexOf("/"));
    const count = folderCounts.get(folder) ?? 0;

    if (maxItemsPerFolder !== null && count >= maxItemsPerFolder) {
      return [];
    }

    folderCounts.set(folder, count + 1);

    return [
      {
        id: `storage:${bucket}:${file.path}`,
        user_id: userId,
        name: humanizeFileName(file.name),
        category: categoryFromPath(file.path),
        color: null,
        style: styleFromPath(file.path),
        weather: [],
        formality: null,
        image_url: resolveStorageUrl(
          `${STORAGE_PREFIX}${bucket}/${file.path}`,
        ),
        created_at: file.createdAt,
        storage_path: file.path,
      },
    ];
  });
}

"use server";

import AnimeCard from "@/components/AnimeCard";
import type { AnimeFilters, AnimeProp } from "@/types/anime";
import { ANIMES_API, MAX_ANIME_LIMIT, SHIKIMORI_BASE } from "@/lib/api";

function img(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${SHIKIMORI_BASE}${url}`;
}

export async function fetchAnime(
  page: number,
  filters?: AnimeFilters | null
): Promise<React.ReactNode[]> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(MAX_ANIME_LIMIT));
  params.set("order", filters?.order || "popularity");

  if (filters?.search) params.set("search", filters.search);
  if (filters?.kind) params.set("kind", filters.kind);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.score) params.set("score", filters.score);

  const res = await fetch(`${ANIMES_API}?${params.toString()}`, {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "AnimeVault/1.0",
    },
  });

  if (!res.ok) {
    console.error("REST API error:", res.status);
    return [];
  }

  const data = await res.json();

  const list: AnimeProp[] = data.map((a: any) => ({
    id: String(a.id),
    name: a.name,
    image: {
      original: img(a.image?.original),
    },
    kind: a.kind ?? "",
    episodes: a.episodes ?? 0,
    episodes_aired: a.episodes_aired ?? a.episodes ?? 0,
    score: a.score ?? "",
    genres: a.genres,
    status: a.status,
    rating: a.rating,
  }));

  return list.map((anime, index) => (
    <AnimeCard key={anime.id} anime={anime} index={index} />
  ));
}

"use server";

import AnimeCard from "@/components/AnimeCard";
import { ANIMES_API, MAX_ANIME_LIMIT, SHIKIMORI_BASE } from "@/lib/api";

function img(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${SHIKIMORI_BASE}${url}`;
}

export async function fetchAnime(page: number) {
  const res = await fetch(
    `${ANIMES_API}?page=${page}&limit=${MAX_ANIME_LIMIT}&order=popularity`,
    {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "AnimeVault/1.0",
      },
    }
  );

  if (!res.ok) {
    console.log("API failed:", res.status);
    return [];
  }

  const data = await res.json();

  return data.map((anime: any, index: number) => (
    <AnimeCard
      key={anime.id}
      anime={{
        id: anime.id,
        name: anime.name,
        image: {
          original: img(anime.image?.original),
        },
      }}
      index={index}
    />
  ));
}

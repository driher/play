const BASE_URL = "https://cms.pentas.tv/api";

async function fetcher(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} - ${url}`);
  }

  return res.json();
}

// ======================
// BERITA
// ======================
export const getBerita = () =>
  fetcher(`${BASE_URL}/berita.php`);

// detail berita by slug
export const getBeritaBySlug = (slug: string) =>
  fetcher(`${BASE_URL}/berita.php?slug=${slug}`);

// ======================
// KATEGORI
// ======================
export const getKategori = () =>
  fetcher(`${BASE_URL}/kategori_menu.php`);
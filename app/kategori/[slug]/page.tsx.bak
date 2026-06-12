import Link from "next/link";
import NewsImage from "@/components/NewsImage";

export const revalidate = 60;

// =========================
// SIMPLE SAFE IMAGE
// =========================
function getImage(item: any) {
  const base = "https://cms.pentas.tv";

  let img =
    item?.thumbnail ||
    item?.file_path ||
    item?.gambar ||
    "";

  if (!img) return "https://via.placeholder.com/600x400";

  // fix escaped url dari API (\ /)
  img = img.replace(/\\/g, "");

  // kalau sudah full URL
  if (img.startsWith("http")) return img;

  // pastikan ada slash
  if (!img.startsWith("/")) img = "/" + img;

  return base + img;
}

export default async function Page({ params, searchParams }: any) {
  // =========================
  // FIX NEXT.JS 15 (IMPORTANT)
  // =========================
  const { slug } = await params;
  const sp = await searchParams;

  const page = Number(sp?.page || 1);
  const limit = Number(sp?.limit || 20);

  // =========================
  // FETCH DATA
  // =========================
  const res = await fetch(
    `https://cms.pentas.tv/api/kategori.php?slug=${slug}&page=${page}&limit=${limit}`,
    {
      next: { revalidate: 60 },
    }
  );

  const json = await res.json();

  const posts = json?.data || [];
  const total = json?.total || 0;
  const totalPages = json?.total_pages || 1;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white p-6">
        <h1 className="text-2xl font-bold">
          Kategori: {json?.nama_kategori || slug}
        </h1>

        <div className="text-sm opacity-90 mt-2">
          Total: {total} berita
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">

        {posts.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            Tidak ada berita di kategori <b>{slug}</b>
          </div>
        ) : (
          posts.map((item: any) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition"
            >

              {/* IMAGE */}
              <NewsImage
                src={getImage(item)}
                alt={item.judul}
              />

              {/* CONTENT */}
              <div className="p-3">
                <h2 className="font-semibold line-clamp-2">
                  {item.judul}
                </h2>

                {item.publish_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.publish_date).toLocaleDateString("id-ID")}
                  </p>
                )}
              </div>

            </Link>
          ))
        )}

      </div>

      {/* PAGINATION */}
      <div className="max-w-6xl mx-auto p-6 flex flex-wrap gap-2">

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/kategori/${slug}?page=${p}&limit=${limit}`}
            className={`px-3 py-1 rounded border ${
              p === page
                ? "bg-blue-700 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        ))}

      </div>

    </main>
  );
}
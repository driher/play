import Link from "next/link";
import NewsImage from "@/components/NewsImage";

export const revalidate = 60;

/* =========================
   FORMAT TANGGAL WIB
========================= */
function formatTanggalIndonesia(dateString?: string) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================
   SAFE IMAGE
========================= */
function getImage(item: any) {
  const base = "https://cms.pentas.tv";

  let img =
    item?.thumbnail ||
    item?.file_path ||
    item?.gambar ||
    "";

  if (!img) {
    return "https://via.placeholder.com/600x400?text=Pentas+TV";
  }

  img = img.replace(/\\/g, "");

  if (img.startsWith("http")) {
    return img;
  }

  if (!img.startsWith("/")) {
    img = "/" + img;
  }

  return base + img;
}

export default async function Page({
  params,
  searchParams,
}: any) {

  const { slug } = await params;
  const sp = await searchParams;

  const page = Number(sp?.page || 1);
  const limit = Number(sp?.limit || 20);

  const res = await fetch(
    `https://cms.pentas.tv/api/kategori.php?slug=${slug}&page=${page}&limit=${limit}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data kategori");
  }

  const json = await res.json();

  const posts = json?.data || [];
  const total = json?.total || 0;
  const totalPages = json?.total_pages || 1;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-red-600 text-white">

        <div className="max-w-6xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            {json?.nama_kategori || slug}
          </h1>

          <p className="mt-2 text-sm opacity-90">
            Total {total} berita
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-4">

        {posts.length === 0 ? (

          <div className="bg-white rounded-xl p-10 text-center shadow">

            <h2 className="font-semibold text-lg mb-2">
              Belum ada berita
            </h2>

            <p className="text-gray-500">
              Tidak ada berita pada kategori ini.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {posts.map((item: any) => (

              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >

                <NewsImage
                  src={getImage(item)}
                  alt={item.judul}
                />

                <div className="p-4">

                  <h2 className="font-semibold line-clamp-2 mb-2">
                    {item.judul}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {formatTanggalIndonesia(item.display_date)}
                  </p>

                  {item.deskripsi && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {item.deskripsi}
                    </p>
                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="max-w-6xl mx-auto px-4 pb-10">

          <div className="flex flex-wrap gap-2 justify-center">

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((p) => (

              <Link
                key={p}
                href={`/kategori/${slug}?page=${p}&limit=${limit}`}
                className={
                  p === page
                    ? "px-4 py-2 rounded bg-red-600 text-white"
                    : "px-4 py-2 rounded bg-white border hover:bg-gray-50"
                }
              >
                {p}
              </Link>

            ))}

          </div>

        </div>

      )}

    </main>
  );
}
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 300;

/* =========================
   FORMAT TANGGAL
========================= */
function formatTanggalIndonesia(dateString?: string) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================
   FETCH DETAIL BERITA
========================= */
async function getBerita(slug: string) {
  try {
    const res = await fetch(
      `https://cms.pentas.tv/api/detail.php?slug=${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) return null;

    const json = await res.json();

    return json?.data || null;
  } catch {
    return null;
  }
}

/* =========================
   FETCH TRENDING
========================= */
async function getTrending() {
  try {
    const res = await fetch(
      "https://cms.pentas.tv/api/berita.php",
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();

    return json?.data || [];
  } catch {
    return [];
  }
}

/* =========================
   SEO / OG / WHATSAPP
========================= */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const berita = await getBerita(slug);

  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan | Pentas TV",
    };
  }

  const image =
    berita.thumbnail ||
    "https://web.pentas.tv/og-image.jpg";

  const description =
    berita.ringkasan ||
    berita.excerpt ||
    berita.judul;

  return {
    title: berita.judul,
    description,

    alternates: {
      canonical: `https://web.pentas.tv/berita/${slug}`,
    },

    openGraph: {
      title: berita.judul,
      description,
      url: `https://web.pentas.tv/berita/${slug}`,
      siteName: "Pentas TV",
      locale: "id_ID",
      type: "article",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: berita.judul,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: berita.judul,
      description,
      images: [image],
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const berita = await getBerita(slug);

  if (!berita) {
    notFound();
  }

  const trending = await getTrending();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ARTIKEL */}
        <article className="md:col-span-2">

          <div className="text-xs text-red-600 font-bold uppercase mb-2">
            {berita.nama_kategori}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {berita.judul}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-5">
            <span>✍ {berita.author || "Pentas TV"}</span>
            <span>👁 {berita.views || 0}</span>
            <span>
              🕒{" "}
              {formatTanggalIndonesia(
                berita.publish_date ||
                  berita.created_at ||
                  berita.tanggal
              )}
            </span>
          </div>

          <ShareButtons title={berita.judul} />

          {berita.thumbnail && (
            <div className="mb-8 mt-5">

              <Image
                src={berita.thumbnail}
                alt={berita.judul}
                width={1200}
                height={630}
                className="w-full rounded-xl"
                priority
              />

              {(berita.media?.caption ||
                berita.media?.credit ||
                berita.media?.source) && (
                <p className="text-xs text-gray-500 italic mt-2">
                  {berita.media?.caption}

                  {berita.media?.credit &&
                    ` | Credit: ${berita.media.credit}`}

                  {berita.media?.source &&
                    ` | Source: ${berita.media.source}`}
                </p>
              )}
            </div>
          )}

          <div
            className="
              prose
              prose-lg
              max-w-none
              prose-headings:font-bold
              prose-headings:text-gray-900
              prose-p:text-gray-700
              prose-p:leading-8
              prose-a:text-red-600
              prose-img:rounded-xl
              prose-img:shadow-md
              prose-blockquote:border-red-600
              prose-blockquote:text-gray-700
              prose-li:marker:text-red-600
            "
            dangerouslySetInnerHTML={{
              __html: berita.isi || "",
            }}
          />
        </article>

        {/* SIDEBAR */}
        <aside className="bg-gray-50 border rounded-xl p-5 h-fit sticky top-20">

          <h2 className="font-bold text-red-600 text-lg mb-4">
            Berita Lainnya
          </h2>

          <div className="space-y-3">

            {trending
              ?.filter((item: any) => item.slug !== slug)
              .slice(0, 10)
              .map((item: any) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="block text-sm hover:text-red-600 transition border-b pb-3"
                >
                  {item.judul}
                </Link>
              ))}

          </div>

        </aside>

      </div>

    </main>
  );
}
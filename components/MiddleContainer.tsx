"use client";

import Link from "next/link";

type Props = {
  berita: any[];
};

export default function MiddleContainer({ berita }: Props) {
  const left = berita.slice(0, 12);
  const right = berita.slice(6, 10);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* =========================
          LEFT CONTENT
      ========================= */}

      <div className="lg:col-span-3 space-y-4">

        {left.map((item) => (

          <div
            key={item.id}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-lg transition-all duration-300"
          >

            <img
              src={item.thumbnail}
              alt={item.title || item.judul}
              className="w-32 h-24 rounded-xl object-cover flex-shrink-0"
            />

            <div className="flex flex-col justify-between">

              <Link href={`/berita/${item.slug}`}>

                <h3 className="font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-300">

                  {item.title || item.judul}

                </h3>

              </Link>

              <p className="text-xs text-muted mt-3">

                {formatTanggalIndonesia(
                  item.publish_date || item.created_at
                )}

              </p>

            </div>

          </div>

        ))}

      </div>

      {/* =========================
          RIGHT SIDEBAR
      ========================= */}

      <aside className="space-y-4">

        <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2">
          Berita Lainnya
        </h2>

        {right.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm hover:shadow-lg transition-all duration-300"
          >

            <Link href={`/berita/${item.slug}`}>

              <h3 className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-300">

                {item.title || item.judul}

              </h3>

            </Link>

            <p className="text-xs text-muted mt-3">

              {formatTanggalIndonesia(
                item.publish_date || item.created_at
              )}

            </p>

          </div>

        ))}

      </aside>

    </div>
  );
}
"use client";

import { formatDateTV } from "@/lib/formatDate";
import Link from "next/link";

type Props = { berita: any[] };

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

      {/* LEFT */}
      <div className="lg:col-span-3 space-y-4">

        {left.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-3 shadow rounded">

            <img src={item.thumbnail} className="w-28 h-20 object-cover rounded" />

            <div>
              <Link href={`/berita/${item.slug}`}>
                <div className="font-semibold hover:text-red-600">
                  {item.title || item.judul}
                </div>
              </Link>

              <div className="text-xs text-gray-500">
                                  <p className="text-xs text-gray-500">
                     {formatTanggalIndonesia(
    item.publish_date || item.created_at
  )}
                  </p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="space-y-3">

        <h2 className="font-bold border-b-2 border-red-600 pb-2">
          Berita Lainnya
        </h2>

        {right.map((item) => (
          <div key={item.id} className="bg-white p-3 shadow rounded">

            <Link href={`/berita/${item.slug}`}>
              <div className="text-sm font-semibold hover:text-red-600">
                {item.title || item.judul}
              </div>
            </Link>

            <div className="text-xs text-gray-500">
                                <p className="text-xs text-gray-500">
                    {formatTanggalIndonesia(item.publish_date)}
                  </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
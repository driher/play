"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MiddleContainer from "@/components/MiddleContainer";
import { formatDateTV } from "@/lib/formatDate";
import FeaturedCards from "@/components/FeaturedCards";

export default function Home() {
  const [berita, setBerita] = useState<any[]>([]);

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
  useEffect(() => {
    fetch("https://cms.pentas.tv/api/berita.php?page=1&limit=12")
      .then((res) => res.json())
      .then((data) => setBerita(data.data || []))
      .catch(console.error);
  }, []);

  const headline = berita[0];
  const list = berita.slice(1, 7);
  const sidebar = berita.slice(7, 12);
  const featuredItems = berita.slice(0, 4); // ✅ TAMBAHAN INI

  return (
    <main className="bg-gray-100 min-h-screen">

      <div className="w-full flex justify-center">
        <div className="w-[90%] max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-5 py-3">

          <section className="lg:col-span-8 bg-white rounded-xl overflow-hidden shadow">
            {headline && (
              <>
                <img
                  src={headline.thumbnail}
                  className="w-full h-[420px] object-cover"
                />


                <div className="p-5">
		<p className="text-gray-500 text-sm mt-2">
  {formatTanggalIndonesia(
    headline.publish_date || headline.created_at
  )}
</p>
                  <Link href={`/berita/${headline.slug}`}>
                    <h2 className="text-2xl font-bold hover:text-red-600">
                      {headline.judul}
                    </h2>
                  </Link>


                </div>
              </>
            )}

	    <FeaturedCards items={featuredItems} />
          </section>

          <aside className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-lg">Berita Terbaru</h3>

            {sidebar.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-white p-3 rounded-lg shadow"
              >
                <img
                  src={item.thumbnail}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <Link href={`/berita/${item.slug}`}>
                    <p className="text-sm font-semibold hover:text-red-600">
                      {item.judul}
                    </p>
                  </Link>

<p className="text-gray-500 text-sm mt-2">
  {formatTanggalIndonesia(
    headline.publish_date || headline.created_at
  )}
</p>
                </div>
              </div>
            ))}
          </aside>

          <section className="lg:col-span-12">
            <MiddleContainer berita={berita} />
          </section>

        </div>
      </div>

    </main>
  );
}
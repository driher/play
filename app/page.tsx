"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MiddleContainer from "@/components/MiddleContainer";
import FeaturedCards from "@/components/FeaturedCards";

export default function Home() {
  const [berita, setBerita] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

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

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    // BERITA
    fetch("https://cms.pentas.tv/api/berita.php?page=1&limit=12")
      .then((res) => res.json())
      .then((data) => setBerita(data.data || []))
      .catch(console.error);

    // VIDEO
    fetch("https://cms.pentas.tv/api/youtube.php")
      .then((res) => res.json())
      .then((data) => {
        const raw = data.data || data || [];

        // filter normal video (bukan shorts)
        const normalVideos = raw.filter((v: any) => {
          const url = (v.url || "").toLowerCase();
          const title = (v.title || "").toLowerCase();

          return (
            url.includes("watch?v=") &&
            !url.includes("/shorts/") &&
            !title.includes("shorts") &&
            !title.includes("#shorts")
          );
        });

        setVideos(normalVideos);

        if (normalVideos.length > 0) {
          setCurrentVideo(normalVideos[0]);
        }
      })
      .catch(console.error);
  }, []);

  const headline = berita[0];
  const sidebar = berita.slice(4, 15);
  const featuredItems = berita.slice(0, 4);

  return (
    <main className="bg-gray-100 min-h-screen">

      <div className="w-full flex justify-center">
        <div className="w-[90%] max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-5 py-3">

          {/* =========================
              HEADLINE
          ========================= */}
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

            {/* =========================
                SHORTS SECTION
            ========================= */}
            {videos.length > 0 && (
              <section className="mt-6 flex justify-center">

                <div className="w-[95%] max-w-[1000px]">

                  <h3 className="font-bold text-lg mb-3">
                    🎬 Video Terbaru
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {videos.slice(0, 3).map((v: any) => {
                      const isActive = currentVideo?.id === v.id;

                      return (
                        <div
                          key={v.id}
                          onClick={() => setCurrentVideo(v)}
                          className="cursor-pointer bg-black rounded-xl overflow-hidden shadow"
                        >

                          {isActive ? (
                            <div className="aspect-video md:aspect-[9/16]">
                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&playsinline=1`}
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <>
                              <div className="aspect-video md:aspect-[9/16] bg-black">
                                <img
                                  src={v.thumbnail}
                                  className="w-full h-full object-cover hover:opacity-80"
                                />
                              </div>

                              <div className="p-2 bg-white">
                                <p className="text-xs line-clamp-2">
                                  {v.title}
                                </p>
                              </div>
                            </>
                          )}

                        </div>
                      );
                    })}

                  </div>

                </div>

              </section>
            )}

          </section>

          {/* =========================
              SIDEBAR
          ========================= */}
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
                      item.publish_date || item.created_at
                    )}
                  </p>

                </div>

              </div>
            ))}

          </aside>

          {/* =========================
              MIDDLE CONTENT
          ========================= */}
          <section className="lg:col-span-12">
            <MiddleContainer berita={berita} />
          </section>

        </div>
      </div>

    </main>
  );
}
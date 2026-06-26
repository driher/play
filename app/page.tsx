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
    fetch("https://cms.pentas.tv/api/berita.php?page=1&limit=12")
      .then((res) => res.json())
      .then((data) => setBerita(data.data || []))
      .catch(console.error);

    fetch("https://cms.pentas.tv/api/youtube.php")
      .then((res) => res.json())
      .then((data) => {
        const raw = data.data || data || [];

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
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">

      <div className="flex justify-center w-full">

        <div className="w-[90%] max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-6 py-5">

          {/* =========================
              HEADLINE
          ========================= */}

          <section className="lg:col-span-8 bg-surface border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

            {headline && (
              <>
                <img
                  src={headline.thumbnail}
                  alt={headline.judul}
                  className="w-full h-[420px] object-cover"
                />

                <div className="p-6">

                  <p className="text-sm text-muted mb-2">
                    {formatTanggalIndonesia(
                      headline.publish_date || headline.created_at
                    )}
                  </p>

                  <Link href={`/berita/${headline.slug}`}>

                    <h2 className="text-3xl font-bold leading-tight text-foreground hover:text-primary transition-colors duration-300">
                      {headline.judul}
                    </h2>

                  </Link>

                </div>
              </>
            )}

            <FeaturedCards items={featuredItems} />

            {/* =========================
                VIDEO
            ========================= */}

            {videos.length > 0 && (

              <section className="mt-8 px-4 pb-6">

                <div className="max-w-[1000px] mx-auto">

                  <h3 className="text-xl font-bold text-foreground mb-4">
                    🎬 Video Terbaru
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {videos.slice(0, 3).map((v: any) => {

                      const isActive = currentVideo?.id === v.id;

                      return (

                        <div
                          key={v.id}
                          onClick={() => setCurrentVideo(v)}
                          className="cursor-pointer rounded-2xl overflow-hidden border border-border bg-surface shadow hover:shadow-xl transition-all duration-300"
                        >

                          {isActive ? (

                            <div className="aspect-video md:aspect-[9/16] bg-black">

                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&playsinline=1`}
                                allowFullScreen
                              />

                            </div>

                          ) : (

                            <>
                              <div className="aspect-video md:aspect-[9/16] overflow-hidden">

                                <img
                                  src={v.thumbnail}
                                  alt={v.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />

                              </div>

                              <div className="p-3 bg-surface border-t border-border">

                                <p className="text-sm text-foreground line-clamp-2">
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

            <h3 className="text-xl font-bold text-foreground">
              Berita Terbaru
            </h3>

            {sidebar.map((item) => (

              <div
                key={item.id}
                className="flex gap-3 bg-surface border border-border rounded-xl p-3 shadow hover:shadow-lg transition-all duration-300"
              >

                <img
                  src={item.thumbnail}
                  alt={item.judul}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex flex-col justify-between">

                  <Link href={`/berita/${item.slug}`}>

                    <p className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-300">
                      {item.judul}
                    </p>

                  </Link>

                  <p className="text-xs text-muted mt-2">

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
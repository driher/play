"use client";

import { useEffect, useState } from "react";

export default function VideoSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  useEffect(() => {
    fetch("https://cms.pentas.tv/api/youtube.php")
      .then((res) => res.json())
      .then((data) => {
        const raw = data.data || data || [];

        // 🔥 FILTER VIDEO NORMAL (BUKAN SHORTS)
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

  return (
    <section className="mt-6 bg-black rounded-xl overflow-hidden shadow col-span-12">

      {/* TITLE */}
      <div className="bg-black text-white px-4 py-2 text-sm">
        🎥 Video Terbaru (16:9)
      </div>

      {/* PLAYER */}
      {currentVideo && (
        <div className="w-full aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
            title={currentVideo.title}
            allowFullScreen
          />
        </div>
      )}

      {/* THUMBNAILS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-white">

        {videos.slice(0, 4).map((v: any) => (
          <div
            key={v.id}
            onClick={() => setCurrentVideo(v)}
            className="cursor-pointer group"
          >

            <img
              src={v.thumbnail}
              className="w-full h-20 object-cover rounded group-hover:opacity-80"
            />

            <p className="text-xs mt-1 line-clamp-2 text-gray-700">
              {v.title}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BreakingNewsBar() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://cms.pentas.tv/api/trending.php")
      .then((res) => res.json())
      .then((data) => setItems(data?.data || []))
      .catch(console.error);
  }, []);

  const textItems = items.slice(0, 10);

  return (
    <div className="bg-red-600 text-white overflow-hidden border-b border-red-800 flex items-center">

      {/* LABEL */}
      <div className="bg-red-800 px-4 py-2 font-bold text-sm whitespace-nowrap">
        🔴 BREAKING NEWS
      </div>

      {/* TICKER */}
      <div className="flex-1 overflow-hidden relative group">
        <div className="flex whitespace-nowrap animate-marquee px-4 text-sm font-medium">

          {[...textItems, ...textItems].map((item, index) => (
            <span
              key={index}
              className="flex items-center mr-10 whitespace-nowrap"
            >
              <Link
                href={`/berita/${item.slug}`}
                className="hover:underline hover:text-yellow-200 transition"
              >
                {item.title}
              </Link>

              <span className="ml-3">•</span>
            </span>
          ))}

        </div>
      </div>

      {/* ANIMASI + HOVER PAUSE */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          min-width: 200%;
          animation: marquee 22s linear infinite;
        }

        /* 🔥 PAUSE SAAT HOVER */
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

    </div>
  );
}
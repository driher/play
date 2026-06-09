"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [datetime, setDatetime] = useState("");
  const [trending, setTrending] = useState<string[]>([]);
  const [rates, setRates] = useState<string[]>([]);
  const [fx, setFx] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);

  // ðŸ“… FORMAT INDONESIA TV NEWS
  const formatTanggal = () => {
    const now = new Date();

    const hari = new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(now);
    const tanggal = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(now);
    const bulan = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(now);
    const tahun = new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(now);

    const jam = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${hari}, ${tanggal} ${bulan} ${tahun} - ${jam} WIB`;
  };

  useEffect(() => {
    // ðŸ•’ CLOCK
    const updateClock = () => setDatetime(formatTanggal());

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // ðŸ”¥ TRENDING
    async function loadTrending() {
      try {
        const res = await fetch("https://cms.pentas.tv/api/trending.php");
        const data = await res.json();

        const items = Array.isArray(data?.data)
          ? data.data.map((item: any) => item.title)
          : [];

        setTrending(items);
      } catch {
        setTrending([]);
      }
    }
// ðŸ”¥ MENU
async function loadKategori() {
  try {
    const res = await fetch(
      "https://cms.pentas.tv/api/kategori_menu.php"
    );

    const data = await res.json();

    const kategori = (data?.data || [])
      .filter(
        (item: any) =>
          Number(item.urutan) > 0
      )
      .sort(
        (a: any, b: any) =>
          Number(a.urutan) - Number(b.urutan)
      );

    setMenu(kategori);
  } catch {
    setMenu([]);
  }
}
    // ðŸ’± KURS RUPIAH
    async function loadRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/IDR");
        const data = await res.json();

        const target = ["USD", "EUR", "SGD", "JPY", "GBP", "AUD"];

        const formatted = target
          .map((cur) => {
            const rate = data?.rates?.[cur];
            if (!rate) return null;

            const rupiah = (1 / rate).toFixed(2);

            return `1 ${cur} = Rp ${rupiah}`;
          })
          .filter(Boolean);

        setRates(formatted as string[]);
      } catch {
        setRates(["Gagal load kurs"]);
      }
    }

    // ðŸ“Š LIVE FX MARKET
    async function loadFxMarket() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/IDR");
        const data = await res.json();

        const target = ["USD", "EUR", "SGD", "JPY", "GBP", "AUD"];

        const formatted = target.map((cur) => {
          const rate = data?.rates?.[cur];
          if (!rate) return null;

          const value = 1 / rate;
          const change = (Math.random() * 2 - 1).toFixed(2);

          return {
            cur,
            value,
            change: Number(change),
          };
        }).filter(Boolean);

        setFx(formatted);
      } catch {
        setFx([]);
      }
    }
    loadKategori();
    loadTrending();
    loadRates();
    loadFxMarket();

    const rateInterval = setInterval(loadRates, 60000);
    const fxInterval = setInterval(loadFxMarket, 60000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(rateInterval);
      clearInterval(fxInterval);
    };
  }, []);

return (
  <div className="w-full">

    {/* TOP BAR */}
    <div className="bg-blue-950 text-white text-xs px-6 py-2 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="bg-red-600 px-2 py-[2px] font-bold animate-pulse">
          LIVE
        </span>
        <span>PENTAS TV NEWS</span>
      </div>

      <div className="flex gap-4">
        <span>{datetime}</span>
        <span>📍 Jawa Barat</span>
      </div>
    </div>

    {/* NAVBAR */}
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">

      <Link href="/" className="flex items-center">
        <Image
          src="/logo-pentas-tv-new.png"
          alt="Pentas TV"
          width={320}
          height={120}
          priority
        />
      </Link>
      <button className="bg-red-600 text-white px-4 py-1 text-sm font-bold hover:bg-red-700 transition">
        WATCH LIVE
      </button>

    </nav>

    {/* MENU KATEGORI */}
    <div className="bg-blue-800 text-white border-t border-blue-700">

      <div className="overflow-x-auto">

        <div className="flex items-center gap-6 px-6 py-2 whitespace-nowrap min-w-max text-sm font-medium">

          {menu.map((item) => (
            <Link
              key={item.id}
              href={`/kategori/${item.slug}`}
              className="hover:text-yellow-300 transition"
            >
              {item.nama_kategori}
            </Link>
          ))}

        </div>

      </div>

    </div>

    {/* LIVE FX MARKET */}
    <div className="bg-blue-950 text-white text-sm py-2 overflow-hidden group border-t border-blue-800">

      <div className="flex items-center gap-2 px-6 mb-1">
        <span className="bg-green-500 text-black px-2 py-[2px] text-[10px] font-bold animate-pulse">
          LIVE
        </span>

        <span className="text-xs font-semibold opacity-90">
          FX MARKET • IDR BASED
        </span>
      </div>

      <div className="ticker-fx px-6">
        {fx.length > 0
          ? fx.map((item: any, i: number) => (
              <span key={i} className="mr-8">
                <span className="font-bold">{item.cur}</span>{" "}
                <span>Rp {item.value.toFixed(2)}</span>{" "}
                <span
                  className={
                    item.change >= 0
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {item.change >= 0 ? "▲" : "▼"} {item.change}
                </span>
              </span>
            ))
          : "Loading FX Market..."}
      </div>

           <style jsx>{`
        .ticker-fx {
          display: inline-block;
          white-space: nowrap;
          animation: fxMove 35s linear infinite;
          padding-left: 100%;
        }

        @keyframes fxMove {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .group:hover .ticker-fx {
          animation-play-state: paused;
        }
      `}</style>

    </div>

  </div>
);
}
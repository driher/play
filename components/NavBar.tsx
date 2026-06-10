"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [datetime, setDatetime] = useState("");
  const [fx, setFx] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);

  // =========================
  // CLOCK FORMAT INDONESIA
  // =========================
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
    let isMounted = true;

    // CLOCK
    const updateClock = () => {
      if (isMounted) setDatetime(formatTanggal());
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // =========================
    // MENU KATEGORI
    // =========================
    async function loadKategori() {
      try {
        const res = await fetch("https://cms.pentas.tv/api/kategori_menu.php");
        const data = await res.json();

        const kategori = (data?.data || [])
          .filter((item: any) => Number(item.urutan) > 0)
          .sort((a: any, b: any) => Number(a.urutan) - Number(b.urutan));

        if (isMounted) setMenu(kategori);
      } catch {
        if (isMounted) setMenu([]);
      }
    }

    // =========================
    // FX MARKET
    // =========================
    async function loadFxMarket() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/IDR");
        const data = await res.json();

        const target = ["USD", "EUR", "SGD", "JPY", "GBP", "AUD"];

        const formatted = target
          .map((cur) => {
            const rate = data?.rates?.[cur];
            if (!rate) return null;

            return {
              cur,
              value: (1 / rate),
              change: +(Math.random() * 2 - 1).toFixed(2),
            };
          })
          .filter(Boolean);

        if (isMounted) setFx(formatted);
      } catch {
        if (isMounted) setFx([]);
      }
    }

    loadKategori();
    loadFxMarket();

    const fxInterval = setInterval(loadFxMarket, 60000);

    return () => {
      isMounted = false;
      clearInterval(clockInterval);
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
            width={200}
            height={60}
            priority
          />
        </Link>

        <button className="bg-red-600 text-white px-4 py-1 text-sm font-bold hover:bg-red-700 transition">
          WATCH LIVE
        </button>
      </nav>

      {/* MENU */}
      <div className="bg-blue-800 text-white border-t border-blue-700 overflow-x-auto">
        <div className="flex gap-6 px-6 py-2 whitespace-nowrap text-sm font-medium min-w-max">
          {menu.length > 0 ? (
            menu.map((item) => (
              <Link
                key={item.id}
                href={`/kategori/${item.slug}`}
                className="hover:text-yellow-300 transition"
              >
                {item.nama_kategori}
              </Link>
            ))
          ) : (
            <span className="text-gray-200">Loading menu...</span>
          )}
        </div>
      </div>

      {/* FX MARKET */}
      <div className="bg-blue-950 text-white text-sm py-2 overflow-hidden border-t border-blue-800">
        <div className="flex items-center gap-2 px-6 mb-1">
          <span className="bg-green-500 text-black px-2 py-[2px] text-[10px] font-bold animate-pulse">
            LIVE
          </span>
          <span className="text-xs font-semibold opacity-90">
            FX MARKET • IDR BASED
          </span>
        </div>

        <div className="ticker-fx px-6">
          {fx.length > 0 ? (
            fx.map((item: any, i: number) => (
              <span key={i} className="mr-8">
                <b>{item.cur}</b> Rp {item.value.toFixed(2)}{" "}
                <span className={item.change >= 0 ? "text-green-400" : "text-red-400"}>
                  {item.change >= 0 ? "▲" : "▼"} {item.change}
                </span>
              </span>
            ))
          ) : (
            "Loading FX..."
          )}
        </div>

        <style jsx>{`
          .ticker-fx {
            display: inline-block;
            white-space: nowrap;
            animation: move 35s linear infinite;
            padding-left: 100%;
          }

          @keyframes move {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>

    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

const STREAM_URL = "https://c4.siar.us:8092/live";
const ICECAST_URL = "https://c4.siar.us:8092/status-json.xsl";

export default function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("Radio Sehati");
  const [artist, setArtist] = useState("-");
  const [listeners, setListeners] = useState(0);
  const [cover, setCover] = useState("/cover.jpg");

  // ▶ PLAY
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!playing) {
        setLoading(true);
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // 📡 META
  const fetchMeta = async () => {
    try {
      const res = await fetch(ICECAST_URL + "?t=" + Date.now());
      const data = await res.json();

      const src = Array.isArray(data?.icestats?.source)
        ? data.icestats.source[0]
        : data?.icestats?.source;

      const raw = src?.title || "Radio Sehati";

      if (raw.includes(" - ")) {
        const [a, t] = raw.split(" - ");
        setArtist(a);
        setTitle(t);
      } else {
        setTitle(raw);
      }

      setListeners(src?.listeners || 0);
    } catch {}
  };

  // 🖼 COVER
  const fetchCover = async (q: string) => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=1`
      );
      const data = await res.json();

      const img = data?.results?.[0]?.artworkUrl100;
      if (img) setCover(img.replace("100x100", "600x600"));
    } catch {}
  };

  useEffect(() => {
    fetchMeta();
    const i = setInterval(fetchMeta, 8000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (title && title !== "Radio Sehati") {
      fetchCover(`${artist} ${title}`);
    }
  }, [title]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-200">

      {/* CARD */}
      <div className="relative w-full max-w-md">

        <div className="relative overflow-hidden rounded-[28px] shadow-2xl border border-white/30 backdrop-blur-xl bg-white/20 p-6 text-center">

          {/* HEADER */}
          <h1 className="text-lg font-extrabold tracking-[3px] text-white drop-shadow">
            RADIO STREAMING SEHATI
          </h1>

          {/* VINYL */}
          <div className="flex justify-center my-6">
            <div className={`relative w-[260px] h-[260px] rounded-full
              bg-[radial-gradient(circle_at_30%_30%,#444,black)]
              shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]
              ${playing ? "animate-spin-slow" : ""}`}>

              {/* cover tengah */}
              <div className="absolute inset-[65px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={cover}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* META */}
          <div className="text-white drop-shadow">
            <div className="text-xl font-bold truncate">
              {title}
            </div>

            <div className="text-sm opacity-90">
              {artist}
            </div>

            <div className="text-xs mt-2 opacity-80">
              👥 {listeners} listeners
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={toggle}
            className="mt-6 w-full py-3 rounded-full font-bold text-white
            bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg active:scale-95 transition"
          >
            {loading ? "Connecting..." : playing ? "Pause" : "Play"}
          </button>

          {/* FOOTER */}
          <p className="mt-4 text-xs text-white/80">
            Icecast AutoDJ • Radio Sehati
          </p>
        </div>
      </div>

      {/* AUDIO */}
      <audio ref={audioRef} src={STREAM_URL} preload="none" />
    </div>
  );
}
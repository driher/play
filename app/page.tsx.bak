"use client";

import { useEffect, useRef, useState } from "react";

const STREAM_URL = "http://c4.siar.us:8092/live";
const ICECAST = "http://c4.siar.us:8092/status-json.xsl";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const [title, setTitle] = useState("Radio Sehati");
  const [artist, setArtist] = useState("-");
  const [listeners, setListeners] = useState(0);

  const [cover, setCover] = useState("/cover.jpg");

  // ▶️ PLAY / PAUSE
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!playing) {
        setBuffering(true);

        audio.load(); // penting untuk stabil di beberapa browser
        await audio.play();

        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch (err) {
      console.log("PLAY ERROR:", err);
      setPlaying(false);
    } finally {
      setBuffering(false);
    }
  };

  // 🖼️ COVER (safe version)
  const fetchCover = async (a: string, t: string) => {
    try {
      if (!a || a === "-") return;

      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          a + " " + t
        )}&entity=song&limit=1`
      );

      const data = await res.json();
      const img = data?.results?.[0]?.artworkUrl100;

      if (img) {
        const highRes = img.replace("100x100", "600x600");
        setCover(highRes);
      }
    } catch {
      // fallback diam, jangan spam state
    }
  };

  // 📡 ICECAST META (SAFE PARSER)
  const fetchMeta = async () => {
    try {
      const res = await fetch(ICECAST);
      const data = await res.json();

      const source = data?.icestats?.source;

      const live = Array.isArray(source)
        ? source.find((s: any) => s?.listenurl)
        : source;

      const raw =
        live?.title ||
        live?.yp_currently_playing ||
        "Radio Sehati";

      let art = "-";
      let song = raw;

      if (typeof raw === "string" && raw.includes(" - ")) {
        const parts = raw.split(" - ");
        art = parts[0]?.trim();
        song = parts.slice(1).join(" - ").trim();
      }

      setArtist(art);
      setTitle(song);
      setListeners(live?.listeners ?? 0);

      fetchCover(art, song);
    } catch (err) {
      console.log("ICECAST ERROR:", err);
    }
  };

  useEffect(() => {
    fetchMeta();
    const interval = setInterval(fetchMeta, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-100 text-neutral-900 px-4">

      {/* overlay */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative w-full max-w-md">

        <div className="bg-white/55 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl text-center">

          <h1 className="text-2xl font-semibold tracking-wide">
            Radio Streaming Sehati
          </h1>

          <p className="text-xs text-neutral-600 mt-1">
            Live Audio Broadcast
          </p>

          {/* COVER */}
          <div className="flex justify-center my-6">
            <img
              src={cover}
              alt="cover"
              className="w-56 h-56 rounded-2xl object-cover shadow-lg border border-white/40"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/cover.jpg";
              }}
            />
          </div>

          {/* STATUS */}
          <span
            className={`px-4 py-1 rounded-full text-xs font-medium ${
              playing
                ? "bg-amber-500 text-white"
                : "bg-white/70 text-neutral-600"
            }`}
          >
            {playing ? "LIVE ON AIR" : "OFF AIR"}
          </span>

          {/* NOW PLAYING */}
          <div className="mt-6 bg-white/50 rounded-2xl p-4 border border-white/40">
            <p className="text-lg font-semibold text-amber-700 truncate">
              {title}
            </p>

            <p className="text-sm text-neutral-700 mt-1">
              {artist}
            </p>

            <p className="text-xs text-neutral-500 mt-2">
              {listeners} listeners
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={toggle}
            className="mt-6 w-full py-3 rounded-xl font-semibold transition active:scale-95 shadow-lg bg-amber-500 text-white hover:bg-amber-600"
          >
            {playing ? "Pause Radio" : "Play Radio"}
          </button>

          {/* BUFFER */}
          {buffering && (
            <p className="text-xs mt-3 text-amber-700">
              Connecting stream...
            </p>
          )}

          <p className="mt-5 text-xs text-neutral-500">
            Icecast AutoDJ • Radio Sehati
          </p>

        </div>
      </div>

      {/* AUDIO */}
      <audio ref={audioRef} src={STREAM_URL} preload="none" />
    </div>
  );
}
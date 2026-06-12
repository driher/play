"use client";

import { useEffect, useState } from "react";

export default function VideoPlayer() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("https://cms.pentas.tv/api/youtube.php");
        const data = await res.json();

        const list = data.data || data;

        if (Array.isArray(list) && list.length > 0) {
          setVideos(list);
          setCurrent(list[0]);
        }
      } catch (err) {
        console.error("Gagal ambil video:", err);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Video Terbaru</h2>

      {/* PLAYER */}
      <div className="player">
        {current && (
          <iframe
            src={`https://www.youtube.com/embed/${current.videoId}`}
            allowFullScreen
          />
        )}
      </div>

      {/* THUMBNAILS */}
      <div className="thumbs">
        {videos.slice(0, 4).map((v, i) => (
          <div
            key={i}
            className="thumb"
            onClick={() => setCurrent(v)}
          >
            <img
              src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
              alt={v.title}
            />
            <p>{v.title}</p>
          </div>
        ))}
      </div>

      {/* STYLE */}
      <style jsx>{`
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          color: #fff;
        }

        .title {
          margin-bottom: 15px;
        }

        .player {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 15px;
        }

        .thumb {
          cursor: pointer;
          background: #1a1a1a;
          border-radius: 10px;
          overflow: hidden;
          transition: 0.2s;
        }

        .thumb:hover {
          transform: scale(1.03);
        }

        .thumb img {
          width: 100%;
          display: block;
        }

        .thumb p {
          font-size: 12px;
          padding: 6px;
          color: #ccc;
        }

        @media (max-width: 768px) {
          .thumbs {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

return (
  <div className="flex items-center gap-3 mt-4 mb-6 text-sm">
    
    <span className="font-semibold text-gray-600">
      Bagikan:
    </span>

      {/* FACEBOOK */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Facebook
      </a>

      {/* X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-black text-white rounded"
      >
        X
      </a>

      {/* WHATSAPP */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        WhatsApp
      </a>

    </div>
  );
}
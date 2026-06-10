"use client";

import { useState } from "react";

export default function NewsImage({ src, alt }: any) {
  const [img, setImg] = useState(src);

  return (
    <img
      src={img}
      alt={alt}
      className="w-full h-48 object-cover bg-gray-100"
      loading="lazy"
      onError={() =>
        setImg("https://via.placeholder.com/600x400")
      }
    />
  );
}
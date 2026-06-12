import { NextRequest, NextResponse } from "next/server";

const EXCLUDED_PREFIXES = [
  "/berita",
  "/kategori",
  "/agenda",
  "/video",
  "/radio",
  "/kontak",
  "/tentang",
  "/api",
  "/_next",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip route yang dikecualikan
  if (EXCLUDED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Skip file statis
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const parts = pathname.split("/").filter(Boolean);

  // Hanya URL format /kategori-lama/slug
  if (parts.length === 2) {
    const slug = parts[1];

    return NextResponse.redirect(
      new URL(`/berita/${slug}`, request.url),
      301
    );
  }

  return NextResponse.next();
}
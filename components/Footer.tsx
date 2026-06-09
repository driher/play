import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LOGO + DESC */}
        <div>
          <h2 className="text-xl font-bold text-white">
            PENTAS TV
          </h2>

          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Portal berita digital yang menyajikan informasi terkini, terpercaya,
            dan aktual dari berbagai kategori seperti politik, ekonomi, teknologi,
            dan hiburan.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="font-semibold mb-3">Navigasi</h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/" className="hover:text-red-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/berita" className="hover:text-red-400">
                Berita
              </Link>
            </li>
            <li>
              <Link href="/kategori" className="hover:text-red-400">
                Kategori
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-red-400">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Kontak</h3>

          <ul className="text-sm text-gray-300 space-y-2">
            <li>Email: redaksi@pentastv.com</li>
            <li>WhatsApp: +62 812-0000-0000</li>
            <li>Instagram: @pentastv</li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} PENTAS TV. All rights reserved.
      </div>

    </footer>
  );
}
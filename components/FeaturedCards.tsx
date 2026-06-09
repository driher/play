import Link from "next/link";

interface Item {
  id: number;
  judul: string;
  slug: string;
  thumbnail: string;
  created_at: string;
}

export default function FeaturedCards({
  items,
}: {
  items: Item[];
}) {
  if (!items || items.length === 0) return null;

  const limitedItems = items.slice(1, 4);

  return (
    <section className="w-full py-10">
      
      {/* CONTAINER UTAMA */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {limitedItems.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.judul}
                  className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-gray-900 group-hover:text-red-600 transition">
                  {item.judul}
                </h3>

                <p className="text-[11px] text-gray-500 mt-2">
                  {item.created_at}
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
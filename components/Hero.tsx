import { getBerita } from "@/lib/api";

export default async function Hero() {
  const data = await getBerita();
  const featured = data?.data?.[0];

  return (
    <section className="max-w-6xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* BIG NEWS */}
      <div className="md:col-span-2 bg-white shadow rounded overflow-hidden">
        <div className="h-[300px] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Featured Image</span>
        </div>

        <div className="p-4">
          <span className="text-[var(--accent)] text-sm font-semibold">
            HEADLINE
          </span>

          <h2 className="text-3xl font-bold mt-2">
            {featured?.judul}
          </h2>

          <p className="text-gray-600 mt-2 line-clamp-3">
            {featured?.isi}
          </p>
        </div>
      </div>

      {/* SIDE NEWS */}
      <div className="flex flex-col gap-3">
        {data?.data?.slice(1, 4).map((item: any, i: number) => (
          <div key={i} className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold text-sm">
              {item.judul}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {item.tanggal}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
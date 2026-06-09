import { getBerita } from "@/lib/api";

export default async function NewsGrid() {
  const data = await getBerita();

  return (
    <section className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="md:col-span-2 space-y-4">
        {data?.data?.map((item: any, i: number) => (
          <div key={i} className="bg-white p-4 rounded shadow flex gap-4">
            
            <div className="w-32 h-24 bg-gray-200"></div>

            <div>
              <h3 className="font-bold">{item.judul}</h3>
              <p className="text-xs text-gray-500">{item.tanggal}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.isi}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* SIDEBAR */}
      <aside className="space-y-4">
        <div className="bg-[var(--primary)] text-white p-3 font-bold">
          TERPOPULER
        </div>

        {data?.data?.slice(0, 5).map((item: any, i: number) => (
          <div key={i} className="bg-white p-3 shadow rounded text-sm">
            {item.judul}
          </div>
        ))}
      </aside>

    </section>
  );
}
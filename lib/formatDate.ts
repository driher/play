export function formatDateTV(dateString: string) {
  const now = new Date(dateString);

  const hari = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(now);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
  }).format(now);

  const bulan = new Intl.DateTimeFormat("id-ID", {
    month: "long",
  }).format(now);

  const tahun = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
  }).format(now);

  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `${hari}, ${tanggal} ${bulan} ${tahun} - ${jam} WIB`;
}
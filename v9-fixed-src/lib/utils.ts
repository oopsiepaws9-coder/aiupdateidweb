export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export function readingMinutes(content?: string | null) {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}


export function cleanArticleTitle(value?: string | null) {
  return (value || "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

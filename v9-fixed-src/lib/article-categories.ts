export type ArticleCategory = {
  name: string;
  slug: string;
  description: string;
  databaseValues: readonly string[];
};

export const articleCategories = [
  {
    name: "Berita AI",
    slug: "berita-ai",
    description: "Perkembangan terbaru dari industri kecerdasan buatan.",
    databaseValues: ["Berita AI"]
  },
  {
    name: "Belajar AI",
    slug: "belajar-ai",
    description: "Panduan dasar untuk memahami AI dengan lebih mudah.",
    databaseValues: ["Belajar AI"]
  },
  {
    name: "Tutorial",
    slug: "tutorial",
    description: "Panduan praktis menggunakan teknologi dan alat AI.",
    databaseValues: ["Tutorial"]
  },
  {
    name: "AI Tools",
    slug: "ai-tools",
    description: "Rekomendasi dan panduan alat AI untuk berbagai kebutuhan.",
    databaseValues: ["AI Tools", "Tools AI"]
  },
  {
    name: "AI Models",
    slug: "ai-models",
    description: "Informasi tentang model AI dan kemampuan terbarunya.",
    databaseValues: ["AI Models"]
  },
  {
    name: "Prompt AI",
    slug: "prompt",
    description: "Panduan dan inspirasi prompt AI yang efektif.",
    databaseValues: ["Prompt", "Prompt AI"]
  },
  {
    name: "Perbandingan AI",
    slug: "perbandingan-ai",
    description: "Perbandingan layanan dan alat AI untuk membantu memilih.",
    databaseValues: ["Perbandingan AI", "Review"]
  }
] satisfies readonly ArticleCategory[];

const normalize = (value: string) => value.trim().toLowerCase();

export function getArticleCategoryBySlug(slug: string) {
  const normalized = normalize(slug);
  return articleCategories.find(category => category.slug === normalized);
}

export function getArticleCategoryByValue(
  value: string | null | undefined
) {
  if (!value) return undefined;

  const normalized = normalize(value);

  return articleCategories.find(category =>
    category.databaseValues.some(item => normalize(item) === normalized)
  );
}

export function getArticleCategorySlug(
  value: string | null | undefined
) {
  return getArticleCategoryByValue(value)?.slug || "artikel";
}

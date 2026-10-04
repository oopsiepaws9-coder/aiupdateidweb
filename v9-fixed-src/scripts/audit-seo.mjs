import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = "https://aiupdateid.com";
const TITLE_LIMIT = 60;
const PIXEL_BUDGET = 580;
const BRAND = " | AIUpdateId";

if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY wajib tersedia. Audit ini hanya membaca data published."
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function clean(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function stripBrand(value = "") {
  return clean(value).replace(/(?:\s*[|—-]\s*AIUpdateId)+\s*$/i, "");
}

function trimAtWord(value, limit = TITLE_LIMIT) {
  const normalized = clean(value);
  if (normalized.length <= limit) return normalized;
  const slice = normalized.slice(0, limit + 1);
  const boundary = slice.lastIndexOf(" ");
  return (boundary >= Math.floor(limit * 0.65)
    ? slice.slice(0, boundary)
    : normalized.slice(0, limit)
  ).trim();
}

function renderedTitle(value) {
  const title = stripBrand(value);
  const branded = `${title}${BRAND}`;
  return branded.length <= TITLE_LIMIT ? branded : trimAtWord(title);
}

// Approximation only. Google truncates by rendered width and device, not a
// documented character limit.
function estimatedPixels(value) {
  return [...clean(value)].reduce((total, character) => {
    if (character === " ") return total + 4;
    if (/[ilI1.,:;'|!]/.test(character)) return total + 4;
    if (/[mwMW@%&#]/.test(character)) return total + 11;
    if (/[A-Z0-9]/.test(character)) return total + 8;
    return total + 7;
  }, 0);
}

function compactSuggestion(value) {
  const compact = stripBrand(value)
    .replace(/\b(Panduan|Tutorial) Lengkap\b/gi, "$1")
    .replace(/\bTerbaru\b/gi, "")
    .replace(/\s+([,:?!])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return renderedTitle(compact);
}

function slugify(value = "") {
  return clean(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleAudit(row, type) {
  const source = row.seo_title || row.title || row.name || "";
  const rendered = renderedTitle(source);
  const pixels = estimatedPixels(rendered);
  return {
    type,
    url: `${SITE_URL}/${type === "article" ? "artikel" : "tools"}/${row.slug}`,
    source_title: source,
    source_characters: clean(source).length,
    rendered_title: rendered,
    rendered_characters: rendered.length,
    estimated_pixels: pixels,
    flag:
      clean(source).length > TITLE_LIMIT || pixels > PIXEL_BUDGET
        ? "REVIEW"
        : "OK",
    compact_candidate: compactSuggestion(source)
  };
}

function intentOverlap(articles, tools) {
  const intentPattern =
    /\b(review|ulasan|harga|fitur|kelebihan|kekurangan|gratis|alternatif|cara menggunakan|apa itu|vs)\b/i;
  const overlaps = [];

  for (const tool of tools) {
    const productTokens = new Set([
      slugify(tool.slug),
      slugify(tool.name)
    ].filter(Boolean));

    for (const article of articles) {
      const haystack = slugify(
        `${article.slug} ${article.title || ""} ${article.seo_title || ""} ${article.focus_keyword || ""}`
      );
      const productMatch = [...productTokens].some(token =>
        token && haystack.includes(token)
      );

      if (!productMatch || !intentPattern.test(`${article.title} ${article.seo_title || ""}`)) {
        continue;
      }

      overlaps.push({
        tool_url: `${SITE_URL}/tools/${tool.slug}`,
        article_url: `${SITE_URL}/artikel/${article.slug}`,
        category_url: article.category
          ? `${SITE_URL}/kategori/${slugify(article.category)}`
          : null,
        article_title: article.seo_title || article.title,
        review: "Periksa query GSC. Pertahankan keduanya hanya jika intent direktori dan intent artikel benar-benar berbeda."
      });
    }
  }

  return overlaps;
}

async function getAllPublished(table, columns) {
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq("status", "published")
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

const [articles, tools] = await Promise.all([
  getAllPublished(
    "articles",
    "id,title,slug,seo_title,focus_keyword,category,canonical_url"
  ),
  getAllPublished("ai_tools", "id,name,slug,seo_title,category")
]);

const titles = [
  ...articles.map(row => titleAudit(row, "article")),
  ...tools.map(row => titleAudit(row, "tool"))
];
const flaggedTitles = titles.filter(row => row.flag === "REVIEW");
const overlaps = intentOverlap(articles, tools);
const report = {
  generated_at: new Date().toISOString(),
  note: "Tidak ada data yang diubah. Kandidat judul bersifat mekanis dan wajib ditinjau bersama query GSC sebelum digunakan.",
  totals: {
    published_articles: articles.length,
    published_tools: tools.length,
    titles_to_review: flaggedTitles.length,
    intent_overlaps_to_review: overlaps.length
  },
  titles_to_review: flaggedTitles,
  intent_overlaps_to_review: overlaps
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(report.note);
  console.log("\nRINGKASAN");
  console.table(report.totals);
  console.log("\nJUDUL YANG PERLU DITINJAU");
  console.table(flaggedTitles);
  console.log("\nPOTENSI TUMPANG TINDIH INTENT");
  console.table(overlaps);
}

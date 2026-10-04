type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type JsonLdProps = {
  data: JsonLdValue | null | undefined;
};

export type FaqItem = {
  question?: string | null;
  answer?: string | null;
};

type ArticleJsonLdProps = {
  title: string;
  description: string;
  url: string;
  author: string;
  authorUrl?: string;
  publisher?: string;
  publisherUrl?: string;
  publisherLogo?: string;
  image?: string | string[];
  datePublished?: string | null;
  dateModified?: string | null;
  section?: string | null;
  keywords?: string[] | null;
  wordCount?: number;
  faqArray?: FaqItem[] | null;
};

type SoftwareApplicationJsonLdProps = {
  name: string;
  description: string;
  url: string;
  category?: string | null;
  operatingSystems?: string[] | null;
  sameAs?: string;
  price?: number;
  priceCurrency?: string;
  pricingDescription?: string | null;
  rating?: number | null;
  reviewBody?: string | null;
  reviewer?: string;
  faqArray?: FaqItem[] | null;
};

export function serializeJsonLd(data: JsonLdValue) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

function faqSchema(items?: FaqItem[] | null) {
  const faq = (items || []).flatMap(item => {
    const question = item.question?.trim();
    const answer = item.answer?.trim();
    return question && answer ? [{ question, answer }] : [];
  });

  return faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(item => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    : null;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  author,
  authorUrl,
  publisher = "AIUpdateId",
  publisherUrl,
  publisherLogo,
  image,
  datePublished,
  dateModified,
  section,
  keywords,
  wordCount,
  faqArray
}: ArticleJsonLdProps) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: typeof image === "string" ? [image] : image,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    inLanguage: "id-ID",
    articleSection: section || undefined,
    keywords: keywords?.join(", ") || undefined,
    wordCount,
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: author, url: authorUrl },
    publisher: {
      "@type": "Organization",
      name: publisher,
      url: publisherUrl,
      logo: publisherLogo
        ? { "@type": "ImageObject", url: publisherLogo }
        : undefined
    }
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={faqSchema(faqArray)} />
    </>
  );
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
  category,
  operatingSystems,
  sameAs,
  price,
  priceCurrency = "USD",
  pricingDescription,
  rating,
  reviewBody,
  reviewer = "AIUpdateId",
  faqArray
}: SoftwareApplicationJsonLdProps) {
  const validRating = Number(rating || 0) > 0;
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: category || "Artificial Intelligence",
    operatingSystem: operatingSystems?.join(", ") || "Web",
    url,
    sameAs,
    offers:
      typeof price === "number"
        ? {
            "@type": "Offer",
            price,
            priceCurrency,
            description: pricingDescription || undefined
          }
        : undefined,
    review: validRating
      ? {
          "@type": "Review",
          author: { "@type": "Organization", name: reviewer },
          reviewBody:
            reviewBody || `Penilaian editorial ${reviewer} untuk ${name}.`,
          reviewRating: {
            "@type": "Rating",
            ratingValue: Number(rating),
            bestRating: 10,
            worstRating: 1
          }
        }
      : undefined
  };

  return (
    <>
      <JsonLd data={software} />
      <JsonLd data={faqSchema(faqArray)} />
    </>
  );
}

export const TAXONOMY_HUBS = [
  "chatgpt",
  "google-gemini",
  "gemini-spark",
  "ai-agent",
  "prompt-ai",
  "literasi-ai",
  "ai-untuk-kerja",
  "ai-untuk-belajar",
  "generative-ai",
] as const;

export function isTaxonomyHub(slug: string) {
  return (TAXONOMY_HUBS as readonly string[]).includes(slug);
}

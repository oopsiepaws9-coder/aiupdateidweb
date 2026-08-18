import SmartHome from "@/components/SmartHome";
import type {
  HomeArticle,
  HomeComparison,
  HomeModel,
  HomePrompt,
  HomeTool
} from "@/components/SmartHome";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata = { alternates: { canonical: "/" } };
export const revalidate = 300;

const ARTICLE_COLUMNS =
  "id,title,slug,excerpt,category,cover_image,alt_text";
const TOOL_COLUMNS =
  "id,name,slug,category,short_description,pricing,rating";
const MODEL_COLUMNS =
  "id,name,slug,provider,model_type,short_description";
const COMPARISON_COLUMNS =
  "id,title,slug,summary,item_a_name,item_b_name,verdict";
const PROMPT_COLUMNS =
  "id,title,slug,category,description,tool_name";

export default async function Page() {
  const supabase = createServerSupabase();
  let articles: HomeArticle[] = [];
  let tools: HomeTool[] = [];
  let models: HomeModel[] = [];
  let comparisons: HomeComparison[] = [];
  let prompts: HomePrompt[] = [];

  if (supabase) {
    const [
      articlesResult,
      toolsResult,
      modelsResult,
      comparisonsResult,
      promptsResult
    ] = await Promise.all([
      supabase
        .from("articles")
        .select(ARTICLE_COLUMNS)
        .eq("status", "published")
        .eq("featured", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(5),
      supabase
        .from("ai_tools")
        .select(TOOL_COLUMNS)
        .eq("status", "published")
        .eq("featured", true)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(5),
      supabase
        .from("ai_models")
        .select(MODEL_COLUMNS)
        .eq("status", "published")
        .eq("featured", true)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(5),
      supabase
        .from("comparisons")
        .select(COMPARISON_COLUMNS)
        .eq("status", "published")
        .eq("featured", true)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(5),
      supabase
        .from("ai_prompts")
        .select(PROMPT_COLUMNS)
        .eq("status", "published")
        .eq("featured", true)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .limit(5)
    ]);

    articles = (articlesResult.data || []) as HomeArticle[];
    tools = (toolsResult.data || []) as HomeTool[];
    models = (modelsResult.data || []) as HomeModel[];
    comparisons = (comparisonsResult.data || []) as HomeComparison[];
    prompts = (promptsResult.data || []) as HomePrompt[];

    const queryErrors = [
      ["articles", articlesResult.error],
      ["tools", toolsResult.error],
      ["models", modelsResult.error],
      ["comparisons", comparisonsResult.error],
      ["prompts", promptsResult.error]
    ] as const;

    for (const [label, error] of queryErrors) {
      if (error) console.error(`[homepage] ${label}: ${error.message}`);
    }
  }

  return (
    <SmartHome
      articles={articles}
      tools={tools}
      models={models}
      comparisons={comparisons}
      prompts={prompts}
    />
  );
}

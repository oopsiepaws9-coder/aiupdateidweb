import SmartHome from "@/components/SmartHome";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const metadata = { alternates: { canonical: "/" } };
export const revalidate = 300;

export default async function Page(){
  const supabase = createServerSupabase();
  let articles: Article[] = [];
  let toolCount = 0;
  let promptCount = 0;

  if (supabase) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (!error) articles = (data || []) as Article[];

    const [toolsResult, promptsResult] = await Promise.all([
      supabase
        .from("ai_tools")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("ai_prompts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    if (!toolsResult.error) toolCount = toolsResult.count ?? 0;
    if (!promptsResult.error) promptCount = promptsResult.count ?? 0;
  }

  return <SmartHome initialItems={articles} toolCount={toolCount} promptCount={promptCount}/>;
}

import SmartHome from "@/components/SmartHome";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Article } from "@/lib/types";

export const metadata = { alternates: { canonical: "/" } };
export const revalidate = 300;

export default async function Page(){
  const supabase = createServerSupabase();
  let articles: Article[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (!error) articles = (data || []) as Article[];
  }

  return <SmartHome initialItems={articles}/>;
}

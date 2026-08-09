import V9Detail from "@/components/V9Detail";
import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export const revalidate=300;

export default async function Page(props:{params: Promise<{slug:string}>}) {
  const params = await props.params;
  const supabase=createServerSupabase();
  if(!supabase) return notFound();
  const {data}=await supabase.from("ai_models").select("*").eq("slug",params.slug).eq("status","published").maybeSingle();
  if(!data) return notFound();
  return <V9Detail table="ai_models" slug={params.slug} initialItem={data} backHref="/models" backLabel="Kembali ke AI Models"/>;
}

import V9Detail from "@/components/V9Detail";
import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export const revalidate=300;

export default async function Page({params}:{params:{slug:string}}){
  const supabase=createServerSupabase();
  if(!supabase) return notFound();
  const {data}=await supabase.from("glossary_terms").select("*").eq("slug",params.slug).eq("status","published").maybeSingle();
  if(!data) return notFound();
  return <V9Detail table="glossary_terms" slug={params.slug} initialItem={data} backHref="/glossary" backLabel="Kembali ke Glossary"/>;
}

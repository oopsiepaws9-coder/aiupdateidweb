import V9Directory from "@/components/V9Directory";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosarium AI: Kamus Istilah Artificial Intelligence",
  description:
    "Pelajari istilah penting AI, machine learning, LLM, prompt, dan teknologi artificial intelligence melalui glosarium AIUpdateId yang mudah dipahami.",
  alternates: {
    canonical: "/glossary",
  },
};
export const revalidate=300;

export default async function Page(){
  const supabase=createServerSupabase();
  let items:any[]=[];
  if(supabase){
    const {data}=await supabase.from("glossary_terms").select("*").eq("status","published").order("created_at",{ascending:false});
    items=data||[];
  }
  return <V9Directory items={items} table="glossary_terms" title="Kamus Istilah AI" base="/glossary"/>;
}

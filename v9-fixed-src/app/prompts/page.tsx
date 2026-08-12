import type { Metadata } from "next";
import PromptLibraryClient from "@/components/PromptLibraryClient";
import { createServerSupabase } from "@/lib/supabase-server";
import { getSiteUrl } from "@/lib/site-url";
import type { PromptItem } from "@/lib/prompt-types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Prompt AI Siap Pakai untuk Belajar, Kerja & Bisnis",
  description: "Jelajahi Prompt Library AIUpdateId: prompt siap salin untuk belajar, menulis, mahasiswa, bisnis, marketing, coding, riset, dan produktivitas.",
  alternates:{ canonical:"/prompts" },
  openGraph:{ title:"Prompt Library AIUpdateId", description:"Prompt AI siap pakai dan mudah disesuaikan.", type:"website" }
};

export default async function PromptsPage(){
  const supabase=createServerSupabase();
  let prompts:PromptItem[]=[];
  if(supabase){
    const {data}=await supabase.from("ai_prompts").select("*").eq("status","published").order("featured",{ascending:false}).order("updated_at",{ascending:false});
    prompts=(data||[]) as PromptItem[];
  }
  const base=getSiteUrl();
  const schema={"@context":"https://schema.org","@type":"CollectionPage",name:"Prompt Library AIUpdateId",url:`${base}/prompts`,mainEntity:{"@type":"ItemList",itemListElement:prompts.slice(0,50).map((p,i)=>({"@type":"ListItem",position:i+1,url:`${base}/prompts/${p.slug}`,name:p.title}))}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><PromptLibraryClient prompts={prompts}/></>;
}

import V9Directory from "@/components/V9Directory";
import { createServerSupabase } from "@/lib/supabase-server";

export const revalidate=60;

export default async function Page(){
  const supabase=createServerSupabase();
  let items:any[]=[];
  if(supabase){
    const {data}=await supabase.from("comparisons").select("*").eq("status","published").order("created_at",{ascending:false});
    items=data||[];
  }
  return <V9Directory items={items} table="comparisons" title="Perbandingan AI" base="/compare"/>;
}

"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ArticleViewTracker({id,current}:{id:string;current:number}){
  useEffect(()=>{
    const key=`aiupdateid-view-${id}`;
    if(sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key,"1");
    supabase.from("articles").update({view_count:current+1}).eq("id",id).then(()=>{});
  },[id,current]);
  return null;
}

"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress(){
  const[value,setValue]=useState(0);
  useEffect(()=>{
    const update=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      setValue(max>0?Math.min(100,(window.scrollY/max)*100):0);
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
  },[]);
  return <div className="readingProgress"><span style={{width:`${value}%`}}/></div>
}

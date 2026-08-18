import { cleanArticleTitle } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";
export function makeSeoTitle(title:string, keyword:string){
  const clean=cleanArticleTitle(title);
  if(keyword && !clean.toLowerCase().includes(keyword.toLowerCase())){
    return `${clean} | ${keyword}`.slice(0,60);
  }
  return clean.slice(0,60);
}

export function makeMetaDescription(excerpt:string, content:string){
  const source=(excerpt||content||"").replace(/[#>*_`-]/g," ").replace(/\s+/g," ").trim();
  return source.length<=160?source:`${source.slice(0,157).trim()}...`;
}

export function makeOgDescription(meta:string, excerpt:string){
  return (meta||excerpt||"").slice(0,200);
}

export function makeCanonical(slug:string){
  return slug?`${getSiteUrl()}/artikel/${slug}` : "";
}

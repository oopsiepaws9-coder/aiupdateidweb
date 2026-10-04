import { cleanArticleTitle } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export const SEO_TITLE_CHARACTER_BUDGET = 60;
export const SEO_TITLE_PIXEL_BUDGET = 580;
const BRAND_SUFFIX = " | AIUpdateId";

function trimAtWordBoundary(value:string, maxLength:number){
  const clean=value.replace(/\s+/g," ").trim();
  if(clean.length<=maxLength) return clean;

  const candidate=clean.slice(0,maxLength+1);
  const lastSpace=candidate.lastIndexOf(" ");
  return (lastSpace>=Math.floor(maxLength*0.65)
    ? candidate.slice(0,lastSpace)
    : clean.slice(0,maxLength)).trim();
}

export function stripBrandSuffix(title:string){
  return cleanArticleTitle(title)
    .replace(/(?:\s*[|—-]\s*AIUpdateId)+\s*$/i,"")
    .replace(/\s+/g," ")
    .trim();
}

/**
 * Creates a deterministic title for the HTML <title> tag.
 * Google has no fixed character limit, so this is an editorial safety budget,
 * not a promise that Google will display the title verbatim.
 */
export function makeAbsoluteSeoTitle(title:string, maxLength=SEO_TITLE_CHARACTER_BUDGET){
  const clean=stripBrandSuffix(title);
  const branded=`${clean}${BRAND_SUFFIX}`;
  if(branded.length<=maxLength) return branded;
  return trimAtWordBoundary(clean,maxLength);
}
export function makeSeoTitle(title:string, keyword:string){
  const clean=cleanArticleTitle(title);
  if(keyword && !clean.toLowerCase().includes(keyword.toLowerCase())){
    return trimAtWordBoundary(`${clean} | ${keyword}`,SEO_TITLE_CHARACTER_BUDGET);
  }
  return trimAtWordBoundary(clean,SEO_TITLE_CHARACTER_BUDGET);
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

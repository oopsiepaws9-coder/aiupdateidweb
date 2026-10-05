import { cleanArticleTitle } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export const SEO_TITLE_CHARACTER_BUDGET = 60;
export const SEO_TITLE_PIXEL_BUDGET = 580;
const BRAND_SUFFIX = " | AIUpdateId";

export function stripBrandSuffix(title:string){
  return cleanArticleTitle(title)
    .replace(/(?:\s*[|—-]\s*AIUpdateId)+\s*$/i,"")
    .replace(/\s+/g," ")
    .trim();
}

/**
 * Creates a deterministic title for the HTML <title> tag without cutting an
 * editorial title mid-sentence. The character budget decides whether the brand
 * suffix fits; titles that exceed the budget stay intact and are handled by the
 * content audit for a human rewrite.
 *
 * Google has no fixed character limit, so the budget is an editorial warning,
 * not a safe place to truncate copy mechanically.
 */
export function makeAbsoluteSeoTitle(title:string, maxLength=SEO_TITLE_CHARACTER_BUDGET){
  const clean=stripBrandSuffix(title);
  if(!clean) return "AIUpdateId";
  const branded=`${clean}${BRAND_SUFFIX}`;
  if(branded.length<=maxLength) return branded;
  return clean;
}
export function makeSeoTitle(title:string, keyword:string){
  const clean=stripBrandSuffix(title);
  const normalizedKeyword=cleanArticleTitle(keyword).trim();
  if(normalizedKeyword && !clean.toLowerCase().includes(normalizedKeyword.toLowerCase())){
    const withKeyword=`${clean} | ${normalizedKeyword}`;
    return withKeyword.length<=SEO_TITLE_CHARACTER_BUDGET ? withKeyword : clean;
  }
  return clean;
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

import V9Detail from "@/components/V9Detail";
export default function Page({params}:{params:{slug:string}}){
  return <V9Detail table="ai_models" slug={params.slug} backHref="/models" backLabel="Kembali ke AI Models"/>;
}

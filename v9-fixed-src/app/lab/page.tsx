import type {Metadata} from "next";
import ResearchLabView from "@/components/lab/ResearchLabView";

export const metadata: Metadata = {
  title:"AIUpdateId Research & Verification Lab",
  description:"Prototype internal untuk menguji workflow verifikasi klaim, bukti, sumber, kontradiksi, freshness, dan human review.",
  robots:{index:false,follow:false,nocache:true},
};

export default function ResearchLabPage(){
  return <main><ResearchLabView/></main>;
}

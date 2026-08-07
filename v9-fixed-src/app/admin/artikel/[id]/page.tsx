import Editor from "@/components/Editor";
export default function Page({params}:{params:{id:string}}){return <main className="editorPage"><Editor id={params.id}/></main>}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page(){
  const router=useRouter();const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[error,setError]=useState("");const[busy,setBusy]=useState(false);
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session)router.replace("/admin/dashboard")})},[router]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError("");const{error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error)setError(error.message);else router.push("/admin/dashboard")};
  return <main className="page"><section className="login"><span className="logoMark">AI</span><h1>Admin AIUpdateId</h1><p>Masuk menggunakan akun Supabase.</p><form onSubmit={submit}><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<div className="errorBox">{error}</div>}<button className="primary" disabled={busy}>{busy?"Memproses...":"Masuk"}</button></form></section></main>
}

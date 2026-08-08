"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewsletterForm(){
  const[email,setEmail]=useState("");
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState("");
  const[ok,setOk]=useState(false);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!email.trim())return;
    setBusy(true);setMessage("");
    const{error}=await supabase.from("newsletter_subscribers").insert({email:email.trim().toLowerCase()});
    setBusy(false);
    if(error){
      if(error.code==="23505"){setOk(true);setMessage("Email ini sudah terdaftar.")}
      else {setOk(false);setMessage(error.message)}
    }else{
      setOk(true);setMessage("Berhasil terdaftar ke newsletter AIUpdateId.");setEmail("");
    }
  };

  return <form className="newsletterForm" onSubmit={submit}>
    <div><Mail size={18}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Alamat email"/></div>
    <button className="primary" disabled={busy}>{busy?"Memproses...":"Daftar"}</button>
    {message&&<p className={ok?"newsletterSuccess":"newsletterError"}>{ok&&<CheckCircle2 size={16}/>} {message}</p>}
  </form>
}

"use client";
import { useState } from "react";

export function EnquiryForm(){
  const [state,setState]=useState<"idle"|"sending"|"sent"|"error">("idle");
  async function submit(event:React.FormEvent<HTMLFormElement>){ event.preventDefault(); setState("sending"); const data=Object.fromEntries(new FormData(event.currentTarget)); const response=await fetch("/api/enquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)}); setState(response.ok?"sent":"error"); if(response.ok) event.currentTarget.reset(); }
  return <form className="form-panel" onSubmit={submit}><div className="form-grid"><label>Name<input name="name" required minLength={2}/></label><label>Phone<input name="phone" required inputMode="tel"/></label><label>Email<input name="email" type="email" required/></label><label>Service<select name="service"><option>Vastu consultation</option><option>Architecture & structural design</option><option>Interior design</option><option>2D / 3D modelling</option></select></label><label className="full">Tell us about your requirement<textarea name="message" required minLength={10}/></label><div className="full"><button className="btn gold" disabled={state==="sending"}>{state==="sending"?"Sending…":"Request a callback"}</button> {state==="sent"&&<span role="status">Thank you. Your enquiry has been received.</span>} {state==="error"&&<span role="alert">Please check the form and try again.</span>}</div></div></form>
}

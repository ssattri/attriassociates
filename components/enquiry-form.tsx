"use client";

import { useState } from "react";

export function EnquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/enquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setState(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <label>Name<input name="name" required minLength={2} /></label>
    <label>Email<input name="email" type="email" required /></label>
    <label>Phone<input name="phone" inputMode="tel" required minLength={7} /></label>
    <label>Service<select name="service"><option>Vastu consultation</option><option>Architecture & structural design</option><option>Interior design</option><option>2D / 3D modelling</option></select></label>
    <label className="wide">Your requirement<textarea name="message" required minLength={10} /></label>
    <div className="wide"><button className="button gold" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Request a callback"}</button>{state === "sent" && <p role="status">Thank you. Your enquiry has been received.</p>}{state === "error" && <p role="alert">Please email attriassociates99@gmail.com while our form is being activated.</p>}</div>
  </form>;
}

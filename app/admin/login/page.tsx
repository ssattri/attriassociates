"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Secure sign-in will be enabled after the Supabase role migration is applied.");
  }

  return <main className="admin-login"><section className="admin-identity"><a className="admin-wordmark" href="/"><span className="admin-mark"><span>↗</span></span><span>ATTRI<small>ASSOCIATES</small></span></a><div className="admin-intro"><div className="tag">Secure administration</div><h1>Control centre<br/><em>access.</em></h1><p>Administration is isolated from customer accounts and protected by role validation, lockout controls and short owner sessions.</p><div className="admin-badges"><span>Admin only</span><span>Attempt lockout</span><span>Audit ready</span></div></div></section><section className="admin-form-pane"><form className="admin-card" onSubmit={submit}><div className="tag">Admin login</div><h2>Authorised personnel<br/>only</h2><p>Enter your administrator credentials to continue.</p><label>Administrator email<input type="email" name="email" placeholder="admin@example.com" required /></label><label>Password<input type="password" name="password" placeholder="Your secure password" required minLength={8} /></label><button type="submit">Enter control centre <b>→</b></button>{message && <p className="admin-message" role="status">{message}</p>}<a className="return-link" href="/">← Return to website</a></form></section></main>;
}

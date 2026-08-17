"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    if (response.ok) window.location.assign("/admin");
    else { const body = await response.json().catch(() => ({})); setMessage(body.error ?? "Unable to sign in."); setLoading(false); }
  }

  return <main className="admin-login"><section className="admin-identity"><a className="admin-wordmark" href="/"><span className="admin-mark"><span>↗</span></span><span>ATTRI<small>ASSOCIATES</small></span></a><div className="admin-intro"><div className="tag">Secure administration</div><h1>Control centre<br/><em>access.</em></h1><p>Administration is isolated from customer accounts and protected by role validation, lockout controls and short owner sessions.</p><div className="admin-badges"><span>Admin only</span><span>Attempt lockout</span><span>Audit ready</span></div></div></section><section className="admin-form-pane"><form className="admin-card" onSubmit={submit}><div className="tag">Admin login</div><h2>Authorised personnel<br/>only</h2><p>Enter your administrator credentials to continue.</p><label>Administrator email<input type="email" name="email" placeholder="admin@example.com" required autoComplete="email" /></label><label>Password<input type="password" name="password" placeholder="Your secure password" required minLength={8} autoComplete="current-password" /></label><button type="submit" disabled={loading}>{loading ? "Verifying access…" : <>Enter control centre <b>→</b></>}</button>{message && <p className="admin-message" role="alert">{message}</p>}<a className="return-link" href="/">← Return to website</a></form></section></main>;
}

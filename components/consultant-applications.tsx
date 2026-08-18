"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Application = { id: string; full_name: string; phone: string | null; consultant_application_status: string; created_at: string };

export function ConsultantApplications({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [items, setItems] = useState(applications);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  async function decide(id: string, decision: "approved" | "rejected") {
    setBusy(id);
    const response = await fetch(`/api/admin/consultant-applications/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision }) });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      setItems((current) => current.map((item) => item.id === id ? { ...item, consultant_application_status: decision } : item));
      setMessage(`Application ${decision}.`);
      router.refresh();
    } else setMessage(body.error || "Could not update application.");
    setBusy("");
  }
  return <main className="crm-page"><header className="crm-top"><a className="crm-back" href="/admin">← Control centre</a><div><p>Security / consultant access</p><h1>Consultant applications</h1></div></header><section className="crm-table-card">{items.map((item) => <div className="crm-row consultant-row" key={item.id}><span><b>{item.full_name || "Unnamed applicant"}</b><small>{item.phone || "Phone pending"} · {new Date(item.created_at).toLocaleDateString("en-IN")}</small></span><span className={`crm-status ${item.consultant_application_status}`}>{item.consultant_application_status}</span>{item.consultant_application_status === "pending" ? <span className="consultant-actions"><button disabled={busy === item.id} onClick={() => decide(item.id, "approved")}>Approve</button><button disabled={busy === item.id} onClick={() => decide(item.id, "rejected")}>Reject</button></span> : <span />}</div>)}{!items.length && <div className="crm-empty">No consultant applications yet.</div>}</section>{message && <p className="master-message">{message}</p>}</main>;
}

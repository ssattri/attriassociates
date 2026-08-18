"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const groups = [
  ["Dashboard", [["▦", "Overview", "/admin"], ["◔", "Analytics", "/admin/analytics"], ["♟", "Notifications", "/admin/notifications"]]],
  ["Customers & delivery", [["♙", "Customer data", "/admin/customers"], ["▤", "Master data", "/admin/master-data"], ["♧", "Leads & CRM", "/admin/enquiries"], ["◫", "Consultations", "/admin/consultations"], ["◉", "Consultant access", "/admin/consultant-applications"]]],
  ["Content & commerce", [["▱", "Projects", "/admin/projects"], ["▤", "Articles", "/admin/articles"], ["◈", "Products", "/admin/products"], ["☆", "Reviews", "/admin/reviews"], ["▧", "Website content", "/admin/content"]]],
  ["System", [["⚙", "Settings", "/admin/settings"], ["⌘", "Integrations", "/admin/integrations"], ["♙", "Team access", "/admin/team"]]]
];

export function AdminWorkspaceFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [busy, setBusy] = useState(false);
  if (pathname === "/admin" || pathname === "/admin/login") return <>{children}</>;
  async function logout() { setBusy(true); await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); }
  return <div className="admin-frame"><aside><a className="admin-frame-brand" href="/admin"><span>A</span><b>ATTRI<small>CONTROL CENTRE</small></b></a><nav>{groups.map(([title, entries]: any) => <section key={title}><p>{title}</p>{entries.map(([icon, label, href]: string[]) => <a key={label} href={href} className={pathname === href ? "active" : ""}><i>{icon}</i>{label}</a>)}</section>)}</nav><footer><a href="/" target="_blank">↗ View website</a><button onClick={logout} disabled={busy}>↪ {busy ? "Signing out" : "Sign out"}</button></footer></aside><div className="admin-frame-content">{children}</div></div>;
}

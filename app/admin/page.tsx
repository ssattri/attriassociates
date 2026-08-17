import { AdminCommandCentre } from "../../components/admin-command-centre";
import { createAuthServerClient } from "../../lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [profileResult, modulesResult, enquiryResult, attentionResult, recentResult] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", user?.id ?? "").maybeSingle(),
    supabase.from("module_controls").select("key,label,active,sort_order").order("sort_order"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).in("priority", ["high", "urgent"]).in("status", ["new", "contacted", "qualified", "proposal_sent", "follow_up"]),
    supabase.from("enquiries").select("id,reference,name,service,status,priority,created_at").order("created_at", { ascending: false }).limit(4)
  ]);
  return <AdminCommandCentre adminName={profileResult.data?.full_name || user?.email?.split("@")[0] || "Administrator"} role={profileResult.data?.role || "staff"} modules={modulesResult.data || []} newLeads={enquiryResult.count || 0} needsAttention={attentionResult.count || 0} recentEnquiries={recentResult.data || []} />;
}

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "proposal_sent", "follow_up", "converted", "closed", "spam"]),
  priority: z.enum(["low", "normal", "high", "urgent"])
});
const staffRoles = ["super_admin", "admin", "manager", "staff"];

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const input = inputSchema.safeParse(await request.json().catch(() => null));
  const { id } = await context.params;
  if (!input.success || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid enquiry update." }, { status: 400 });
  let response = NextResponse.json({ ok: true });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll(values) { values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } }
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role,account_status").eq("id", user.id).maybeSingle();
  if (!profile || profile.account_status !== "active" || !staffRoles.includes(profile.role)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const { data: before, error: readError } = await supabase.from("enquiries").select("status,priority,reference").eq("id", id).maybeSingle();
  if (readError || !before) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  const { error: updateError } = await supabase.from("enquiries").update(input.data).eq("id", id);
  if (updateError) return NextResponse.json({ error: "Unable to update enquiry." }, { status: 500 });
  const { error: auditError } = await supabase.from("audit_logs").insert({ actor_id: user.id, action: "enquiry.workflow_updated", entity_type: "enquiry", entity_id: id, metadata: { reference: before.reference, from: { status: before.status, priority: before.priority }, to: input.data } });
  if (auditError) return NextResponse.json({ error: "Enquiry was updated, but the audit migration must be applied before further changes." }, { status: 409 });
  return response;
}

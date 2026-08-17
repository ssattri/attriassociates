import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const credentials = z.object({ email: z.string().email().max(180), password: z.string().min(8).max(128) });

export async function POST(request: NextRequest) {
  const input = credentials.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

  let response = NextResponse.json({ ok: true });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll(values) { values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } }
  );
  const { data, error } = await supabase.auth.signInWithPassword(input.data);
  if (error || !data.user) return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role,account_status").eq("id", data.user.id).maybeSingle();
  const staffRoles = ["super_admin", "admin", "manager", "staff"];
  if (!profile || profile.account_status !== "active" || !staffRoles.includes(profile.role)) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "This account does not have control-centre access." }, { status: 403 });
  }
  return response;
}

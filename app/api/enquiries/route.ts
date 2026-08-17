import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(7).max(24),
  service: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(3000)
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin;
  if (origin && origin !== siteUrl) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

  const input = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("enquiries").insert({ ...input.data, source_page: "contact" });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Enquiries are not available yet. Please email us directly." }, { status: 503 });
  }
}

import { EnquiryForm } from "@/components/enquiry-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function ContactPage() {
  const supabase = createServerSupabaseClient(); const { data } = await supabase.from("site_settings").select("value").eq("key", "identity_contact").maybeSingle(); const info = data?.value as { primary_phone?: string; primary_email?: string; address?: string } | undefined;
  return <main><section className="hero"><div className="container"><div className="eyebrow">Get in touch</div><h1>Start a conversation.</h1><p className="lead">Tell us about your project, site, property or requirement. We will guide you to the right service.</p></div></section><section className="section"><div className="container split"><div><h2>Let us help you plan with clarity.</h2><p className="muted">Based in India and serving worldwide. Contact us by phone at {info?.primary_phone || "+91 99907 77716"} or email {info?.primary_email || "attriassociates99@gmail.com"}.{info?.address ? ` ${info.address}` : ""}</p></div><EnquiryForm /></div></section></main>;
}

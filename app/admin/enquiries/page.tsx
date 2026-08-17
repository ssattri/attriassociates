import { EnquiriesWorkspace } from "../../../components/enquiries-workspace";
import { createAuthServerClient } from "../../../lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const supabase = await createAuthServerClient();
  const { data } = await supabase.from("enquiries").select("id,reference,name,email,phone,service,message,status,priority,created_at").order("created_at", { ascending: false }).limit(100);
  return <EnquiriesWorkspace enquiries={data || []} />;
}

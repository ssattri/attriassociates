import { createAuthServerClient } from "@/lib/supabase/auth";
import { ConsultationsQueue } from "@/components/consultations-queue";
export const dynamic="force-dynamic";
export default async function Consultations(){const supabase=await createAuthServerClient();const {data}=await supabase.from("consultation_bookings").select("id,reference,name,email,phone,consultation_type,preferred_date,preferred_time,notes,status,created_at").order("created_at",{ascending:false}).limit(100);return <ConsultationsQueue bookings={data||[]}/>;}

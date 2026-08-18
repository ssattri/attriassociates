import { createAuthServerClient } from "@/lib/supabase/auth";
import { ConsultationsQueue } from "@/components/consultations-queue";
export const dynamic="force-dynamic";
export default async function Consultations(){const supabase=await createAuthServerClient();const [{data:bookings},{data:consultants}]=await Promise.all([supabase.from("consultation_bookings").select("id,reference,name,email,phone,consultation_type,preferred_date,preferred_time,notes,status,assigned_to,created_at").order("created_at",{ascending:false}).limit(100),supabase.from("profiles").select("id,full_name").eq("role","consultant").eq("account_status","active").eq("consultant_application_status","approved").order("full_name")]);return <ConsultationsQueue bookings={bookings||[]} consultants={consultants||[]}/>;}

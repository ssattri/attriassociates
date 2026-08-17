import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().email().max(180),phone:z.string().trim().min(7).max(24),service:z.string().trim().max(100),message:z.string().trim().min(10).max(3000)});
export async function POST(request:NextRequest){
  const origin=request.headers.get("origin"); const site=new URL(process.env.NEXT_PUBLIC_SITE_URL??request.url).origin;
  if(origin&&origin!==site)return NextResponse.json({error:"Invalid origin"},{status:403});
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid enquiry",fields:parsed.error.flatten().fieldErrors},{status:400});
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return NextResponse.json({error:"Service is not configured"},{status:503});
  const supabase=await createServerSupabaseClient();
  const {error}=await supabase.from("enquiries").insert({...parsed.data,source_page:"website",status:"new"});
  if(error)return NextResponse.json({error:"Unable to save enquiry"},{status:500});
  return NextResponse.json({ok:true},{status:201});
}

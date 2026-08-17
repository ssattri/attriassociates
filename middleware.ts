import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll(values) { values.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && request.nextUrl.pathname !== "/admin/login") return NextResponse.redirect(new URL("/admin/login", request.url));
  if (user && request.nextUrl.pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", request.url));
  if (user && request.nextUrl.pathname !== "/admin/login") {
    const { data: profile } = await supabase.from("profiles").select("role,account_status").eq("id", user.id).maybeSingle();
    const staffRoles = ["super_admin", "admin", "manager", "staff"];
    if (!profile || profile.account_status !== "active" || !staffRoles.includes(profile.role)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };

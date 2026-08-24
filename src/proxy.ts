import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth check if Supabase isn't configured yet
  if (!supabaseUrl || !supabaseKey) {
    const isProtected =
      pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

/**
 * Only run on routes whose rendering actually depends on who is signed in.
 *
 * The previous matcher ran on every request that wasn't a static asset, and
 * this proxy calls `supabase.auth.getUser()` — which is a network round-trip to
 * Supabase's auth server, not a local token decode. That put a Supabase call in
 * front of every navigation on the site, including the fully static Impressum
 * and Datenschutzerklärung pages, which need no session at all.
 *
 * Next's own guidance is explicit that Proxy "is not intended for slow data
 * fetching" and should not be a full session-management solution.
 *
 * Trade-off worth knowing: Supabase refreshes the session as a side effect of
 * this call, so with a narrower matcher the refresh now happens only when a
 * visitor touches one of these routes. For a site that is mostly public pages
 * that is the right side of the trade — but it is a trade, not a free win.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};

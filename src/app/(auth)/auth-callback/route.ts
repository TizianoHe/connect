import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where a confirmation or recovery link lands.
 *
 * Supabase sends people here in one of two shapes and which one you get depends
 * on the project's flow and on the email template:
 *
 *   ?code=...                     PKCE, exchanged for a session
 *   ?token_hash=...&type=signup   the older verify link, redeemed with verifyOtp
 *
 * This route used to read `code` only. When a link arrived in the other shape
 * it fell straight through to the failure redirect, and the person ended up
 * back at the start being asked to sign in, with nothing explaining why.
 *
 * PKCE also fails legitimately when the link is opened in a different browser
 * than the one that signed up, because the verifier lives in that browser. The
 * token_hash branch has no such constraint, so trying both is what makes the
 * link work from a phone when the form was filled in on a laptop.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  /**
   * Where to go once the session exists. Only a same-origin path is accepted,
   * so a crafted link cannot turn this route into an open redirect.
   */
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : null;

  const supabase = await createClient();
  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  }

  if (!verified && tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: (type as "signup" | "email" | "recovery" | "invite") ?? "signup",
      token_hash: tokenHash,
    });
    verified = !error;
  }

  if (!verified) {
    // `link_invalid` is what the login page turns into a sentence someone can
    // act on. Landing there silently was the actual bug being fixed here.
    return NextResponse.redirect(`${origin}/login?error=link_invalid`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // A recovery link means the person is setting a new password, not onboarding.
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=link_invalid`);
  }

  const { data: profile } = await supabase
    .from("sme_profiles")
    .select("onboarding_step")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(`${origin}/onboarding/step-1`);
  }

  if (profile.onboarding_step < 5) {
    return NextResponse.redirect(
      `${origin}/onboarding/step-${profile.onboarding_step}`
    );
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}

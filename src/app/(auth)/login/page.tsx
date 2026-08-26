import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Anmelden" };

/**
 * Messages for the ?error= values /auth-callback can redirect with. Without
 * this the callback bounced people to a plain sign-in form and never said the
 * link had failed, so the only visible symptom was "it didn't work".
 */
const ERRORS: Record<string, string> = {
  link_invalid:
    "Dieser Link ist abgelaufen oder wurde bereits verwendet. Melden Sie sich an, oder fordern Sie über \u201ePasswort vergessen\u201c einen neuen an.",
  auth_callback_failed:
    "Die Bestätigung hat nicht geklappt. Bitte melden Sie sich an oder fordern Sie einen neuen Link an.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERRORS[error] ?? ERRORS.auth_callback_failed : null;

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-3xl text-neutral-900 mb-1">Willkommen zurück</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Melden Sie sich an, um Ihr Unternehmensprofil zu verwalten.
          </p>

          {message && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
              {message}
            </p>
          )}

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

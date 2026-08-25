import { Logo } from "@/components/shared/Logo";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// TODO: When spotted.ch domain is configured with custom email (Resend/SendGrid), update Supabase Auth settings to use custom SMTP and customize the reset password email template.

export const metadata = { title: "Passwort zurücksetzen" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-3xl text-neutral-900 mb-1">Passwort zurücksetzen</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

import { Logo } from "@/components/shared/Logo";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// TODO: When spotted.ch domain is configured with custom email (Resend/SendGrid), update Supabase Auth settings to use custom SMTP and customize the reset password email template.

export const metadata = { title: "Reset password — Spotted" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Reset your password</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

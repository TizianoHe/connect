import { Logo } from "@/components/shared/Logo";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Neues Passwort — Spotted" };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-3xl text-neutral-900 mb-1">Neues Passwort setzen</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Wählen Sie unten Ihr neues Passwort.
          </p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}

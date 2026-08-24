import { Logo } from "@/components/shared/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Anmelden — Spotted" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <h1 className="text-3xl text-neutral-900 mb-1">Willkommen zurück</h1>
          <p className="font-sans text-sm text-neutral-500 mb-8">
            Melden Sie sich an, um Ihr Unternehmensprofil zu verwalten.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

import { SignUpForm } from "@/modules/identity/presentation/sign-up-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Crie sua conta</h1>

          <p className="text-sm">Comece a organizar sua vida financeira com o YuFinance.</p>
        </header>

        <SignUpForm />
      </section>
    </main>
  );
}

import { LoginForm } from "@/modules/identity/presentation/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Entre na sua conta</h1>

          <p className="text-sm">Acesse seu espaço financeiro no YuFinance.</p>
        </header>

        <LoginForm />
      </section>
    </main>
  );
}

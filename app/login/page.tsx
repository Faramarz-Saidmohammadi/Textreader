import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Link className="brand" href="/"><span className="brand-mark">V</span><span>Voxora</span></Link>
        <div>
          <span className="pill">Secure workspace access</span>
          <h1>Accessibility operations for modern service teams.</h1>
          <p>Manage phrase libraries, team permissions, usage signals, and operational audit history from one workspace.</p>
        </div>
        <small>Demo account is created by the seed script. Credentials are documented in README.</small>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to Voxora</h2>
          <p>Use your workspace credentials to continue.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

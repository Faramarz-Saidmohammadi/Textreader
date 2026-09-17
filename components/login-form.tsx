"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Unable to sign in.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label><span>Email</span><input name="email" type="email" autoComplete="email" defaultValue="owner@voxora.dev" required /></label>
      <label><span>Password</span><input name="password" type="password" autoComplete="current-password" defaultValue="VoxoraDemo!2026" required /></label>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button className="button primary large" disabled={loading} type="submit">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

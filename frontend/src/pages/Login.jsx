import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field, Input, Button } from "../components/Field";
import ErrorBanner from "../components/ErrorBanner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      const redirectTo = location.state?.from?.pathname;
      navigate(redirectTo || (user.role === "admin" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <p className="text-xs uppercase tracking-wide2 text-terracotta">Studio access</p>
      <h1 className="mt-3 font-display text-4xl text-espresso">Welcome back</h1>
      <p className="mt-2 text-sm text-espresso/60">Sign in to manage bookings and galleries.</p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl bg-softwhite p-6 shadow-sm ring-1 ring-espresso/5">
        <ErrorBanner message={error} />
        <Field label="Email">
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@studio.com"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso/60">
        New to the studio team?{" "}
        <Link to="/register" className="text-terracotta hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

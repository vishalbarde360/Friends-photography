import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field, Input, Button } from "../components/Field";
import ErrorBanner from "../components/ErrorBanner";

export default function Register() {
  const { register, setupAdmin } = useAuth();
  const navigate = useNavigate();
  const [asAdmin, setAsAdmin] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", setupKey: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = asAdmin ? await setupAdmin(form) : await register(form);
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <p className="text-xs uppercase tracking-wide2 text-terracotta">Studio access</p>
      <h1 className="mt-3 font-display text-4xl text-espresso">Create an account</h1>
      <p className="mt-2 text-sm text-espresso/60">
        Set up a studio team account to manage clients, events and galleries.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl bg-softwhite p-6 shadow-sm ring-1 ring-espresso/5">
        <ErrorBanner message={error} />
        <Field label="Full name">
          <Input required value={form.name} onChange={update("name")} placeholder="Your name" />
        </Field>
        <Field label="Email">
          <Input type="email" required value={form.email} onChange={update("email")} placeholder="you@studio.com" />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
            placeholder="At least 6 characters"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-espresso/70">
          <input
            type="checkbox"
            checked={asAdmin}
            onChange={(e) => setAsAdmin(e.target.checked)}
            className="h-4 w-4 rounded border-espresso/30 accent-terracotta"
          />
          I have the studio admin setup key
        </label>

        {asAdmin && (
          <Field label="Admin setup key">
            <Input required value={form.setupKey} onChange={update("setupKey")} placeholder="Setup key" />
          </Field>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account…" : asAdmin ? "Create admin account" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso/60">
        Already have an account?{" "}
        <Link to="/login" className="text-terracotta hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

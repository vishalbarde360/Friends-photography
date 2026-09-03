import React, { useState } from "react";
import * as inquiryApi from "../api/inquiry";
import { Field, Input, Textarea, Select, Button } from "../components/Field";
import ErrorBanner from "../components/ErrorBanner";

const eventTypes = ["Wedding", "Pre-Wedding", "Birthday", "Corporate", "Events", "Other"];
const budgets = ["Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹2,50,000", "₹2,50,000+", "Not sure yet"];

const empty = {
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  budget: budgets[0],
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await inquiryApi.createInquiry(form);
      setDone(true);
      setForm(empty);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="text-xs uppercase tracking-wide2 text-terracotta">Enquire</p>
      <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
        Tell us about your day
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-espresso/65">
        Share a few details and we'll get back to you with availability and a
        package that fits.
      </p>

      {done ? (
        <div className="mt-10 rounded-2xl bg-beige/50 p-8 text-center">
          <p className="font-display text-2xl text-espresso">Thank you 🤍</p>
          <p className="mt-2 text-sm text-espresso/70">
            Your enquiry has been received. We'll reach out on the details you shared, usually within a day.
          </p>
          <Button className="mt-6" onClick={() => setDone(false)}>
            Send another enquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10 space-y-5 rounded-2xl bg-softwhite p-6 shadow-sm ring-1 ring-espresso/5 sm:p-8">
          <ErrorBanner message={error} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <Input required value={form.name} onChange={update("name")} placeholder="Your name" />
            </Field>
            <Field label="Phone">
              <Input required value={form.phone} onChange={update("phone")} placeholder="+91 90000 00000" />
            </Field>
          </div>

          <Field label="Email">
            <Input type="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Event type">
              <Select required value={form.eventType} onChange={update("eventType")}>
                {eventTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Event date">
              <Input type="date" required value={form.eventDate} onChange={update("eventDate")} />
            </Field>
          </div>

          <Field label="Location">
            <Input required value={form.location} onChange={update("location")} placeholder="Venue / city" />
          </Field>

          <Field label="Estimated budget">
            <Select value={form.budget} onChange={update("budget")}>
              {budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </Select>
          </Field>

          <Field label="Message">
            <Textarea
              required
              rows={4}
              value={form.message}
              onChange={update("message")}
              placeholder="Tell us a bit about the day you're planning…"
            />
          </Field>

          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Sending…" : "Send enquiry"}
          </Button>
        </form>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as reviewApi from "../api/review";

export default function Footer() {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    text: "",
  });

  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (rating) => {
    setForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.rating) {
      setError("Please select a rating.");
      return;
    }

    if (!form.text.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setLoading(true);

      const response = await reviewApi.createReview({
        name: form.name.trim(),
        rating: Number(form.rating),
        text: form.text.trim(),
      });

      const newReview = response?.data?.data;

      // Home marquee ला नवीन review पाठवण्यासाठी
      window.dispatchEvent(
        new CustomEvent("review-created", {
          detail: newReview,
        })
      );

      setForm({
        name: "",
        rating: 0,
        text: "",
      });

      setHover(0);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Review submit error:", err);

      setError(
        err?.response?.data?.message ||
        "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#eadbc5] text-charcoal">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">

        <div className="grid gap-10 lg:grid-cols-4">


          {/* ================= BRAND + MAP ================= */}
          <div className="lg:col-span-1">

            {/* Brand */}
            <Link
              to="/"
              className="font-serif text-2xl font-semibold"
            >
              Friends{" "}
              <span className="italic font-normal text-terracotta">
                Photography
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-charcoal/70">
              Wedding, pre-wedding, birthday and corporate photography —
              every frame kept, curated and delivered with care.
            </p>

            {/* Map + Connect */}
            <div className="mt-7 grid grid-cols-2 gap-4">

              {/* MAP CARD */}
              <div
                className="
        h-[210px]
        w-[230px]
        overflow-hidden
        rounded-2xl
        border
        border-black/10
        bg-white
        shadow-sm
      "
              >
                <iframe
                  title="Friends Photography Location"
                  src="https://www.google.com/maps?q=Pune,Maharashtra&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* CONNECT CARD */}

            </div>
          </div>

          {/* ================= EXPLORE ================= */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
              Explore
            </p>

            <div className="mt-5 flex flex-col gap-3 text-sm">

              <Link
                to="/portfolio"
                className="transition hover:text-terracotta"
              >
                Portfolio
              </Link>

              <Link
                to="/client-gallery"
                className="transition hover:text-terracotta"
              >
                Client gallery
              </Link>

              <Link
                to="/enquire"
                className="transition hover:text-terracotta"
              >
                Enquire
              </Link>

            </div>
          </div>

          {/* ================= STUDIO ================= */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
              Studio
            </p>

            <div className="mt-5 space-y-3 text-sm text-charcoal/80">

              <p>
                hello@friendsphotography.studio
              </p>

              <p>
                +91 90000 00000
              </p>

              <p>
                Pune, Maharashtra
              </p>

            </div>
          </div>

          {/* ================= REVIEW FORM ================= */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
              Share Your Experience
            </p>

            <h2 className="mt-3 font-serif text-2xl">
              Leave a review
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-4 rounded-2xl bg-[#f5ecdf] p-4 shadow-sm"
            >

              {/* Rating */}
              <div>

                <p className="text-[9px] uppercase tracking-[0.15em] text-charcoal/50">
                  Rating
                </p>

                <div className="mt-1 flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => handleRating(star)}
                      className="text-xl leading-none transition-transform hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      <span
                        className={
                          star <= (hover || form.rating)
                            ? "text-[#e0a400]"
                            : "text-charcoal/30"
                        }
                      >
                        ★
                      </span>
                    </button>

                  ))}

                </div>
              </div>

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                maxLength={50}
                className="
                  mt-3
                  w-full
                  rounded-xl
                  border
                  border-black/10
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-charcoal
                  placeholder:text-charcoal/40
                  outline-none
                  transition
                  focus:border-terracotta
                "
              />

              {/* Review */}
              <textarea
                name="text"
                placeholder="Your review..."
                value={form.text}
                onChange={handleChange}
                maxLength={300}
                rows={3}
                className="
                  mt-2
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-black/10
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-charcoal
                  placeholder:text-charcoal/40
                  outline-none
                  transition
                  focus:border-terracotta
                "
              />

              {/* Error */}
              {error && (
                <p className="mt-2 text-[11px] text-red-600">
                  {error}
                </p>
              )}

              {/* Success */}
              {success && (
                <p className="mt-2 text-[11px] text-green-700">
                  ✓ Thank you! Your review has been submitted.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-3
                  w-full
                  rounded-full
                  bg-charcoal
                  px-4
                  py-2.5
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:opacity-85
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Submitting..." : "Submit review"}
              </button>

            </form>
          </div>

        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-black/10">

        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-charcoal/50 lg:px-10">
          © {new Date().getFullYear()} Friends Photography. All rights reserved.
        </div>

      </div>

    </footer>
  );
}
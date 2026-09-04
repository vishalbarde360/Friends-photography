import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as reviewApi from "../api/review";

export default function Footer() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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

  // ================= SERVICES =================

  const services = [
    {
      name: "Wedding Photography",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M4 8.5a1.5 1.5 0 0 1 1.5-1.5h2l.9-1.5h7.2l.9 1.5h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="13"
            r="3.2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },

    {
      name: "Wedding Films",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect
            x="3.5"
            y="6.5"
            width="12"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M15.5 10.5 20 8v8l-4.5-2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      name: "Pre-Wedding Shoots",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect
            x="3.5"
            y="5"
            width="17"
            height="14"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="9"
            cy="10.5"
            r="1.6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4.5 16.5 9 12.5l3 2.5 3-3 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      name: "Engagements",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle
            cx="9"
            cy="14"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="15"
            cy="14"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },

    {
      name: "Albums",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M5 4.5h9l5 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 4.5v4.5a1 1 0 0 0 1 1h4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },


  ];

  // ================= INSTAGRAM SHOTS =================

  const instagramShots = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop&sat=-30",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop&sat=-30",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=300&auto=format&fit=crop&sat=-30",
  ];

  return (
    <footer className="bg-[#eadbc5] text-charcoal">

      {/* ================= MAIN FOOTER ================= */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        <div className={`flex flex-col gap-10 lg:flex-row lg:items-start transition-all duration-700 ease-out ${footerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>

          {/* ================= LEFT ================= */}

          <div className="flex-1">

            {/* Brand / Explore / Studio */}

            <div className={`grid gap-8 sm:grid-cols-3 transition-all duration-700 delay-100 ease-out ${footerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>

              {/* Brand */}

              <div>
                <Link
                  to="/"
                  className="font-serif text-2xl font-semibold transition-transform duration-300 hover:-translate-y-1 inline-block"
                >
                  Friends{" "}
                  <span className="italic font-normal text-terracotta">
                    Photography
                  </span>
                </Link>

                <p className="mt-3 max-w-sm text-sm leading-6 text-charcoal/70">
                  Wedding, pre-wedding, birthday and corporate photography —
                  every frame kept, curated and delivered with care.
                </p>
              </div>

              {/* Explore */}

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
                  Explore
                </p>

                <div className="mt-4 flex flex-col gap-3 text-sm">

                  <Link
                    to="/portfolio"
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-terracotta"
                  >
                    Portfolio
                  </Link>

                  <Link
                    to="/client-gallery"
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-terracotta"
                  >
                    Client gallery
                  </Link>

                  <Link
                    to="/enquire"
                    className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-terracotta"
                  >
                    Enquire
                  </Link>

                </div>
              </div>

              {/* Studio */}

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
                  Studio
                </p>

                <div className="mt-4 space-y-3 text-sm text-charcoal/80">

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

            </div>

            {/* ================= OUR SERVICES ================= */}

            <div className={`mt-10 transition-all duration-700 delay-200 ease-out ${footerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>

              <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
                Our Services
              </p>

              <div className="mt-5 flex flex-wrap gap-x-9 gap-y-7">

                {services.map((s) => (
                  <div
                    key={s.name}
                    className="flex w-[105px] flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 text-charcoal/70 transition-all duration-300 hover:-rotate-6 hover:scale-110 hover:bg-white/35 hover:text-terracotta">
                      {s.icon}
                    </span>

                    <span className="text-[11px] leading-4 text-charcoal/70">
                      {s.name}
                    </span>
                  </div>
                ))}

              </div>
            </div>

            {/* ================= FOLLOW OUR JOURNEY ================= */}


          </div>

          {/* ================= RIGHT: REVIEW FORM ================= */}

          <div className={`w-full lg:w-[360px] lg:shrink-0 transition-all duration-700 delay-150 ease-out ${footerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>

            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
              Share Your Experience
            </p>


            {/* FORM - HEIGHT SLIGHTLY INCREASED */}

            <form
              onSubmit={handleSubmit}
              className="mt-4 min-h-[120px] rounded-2xl bg-[#f5ecdf] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
    mt-4
    w-full
    rounded-full
    bg-[#2f2a26]
    px-4
    py-3
    text-sm
    font-medium
    text-white
    transition
    duration-300
    hover:bg-[#4a4039]
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

      <div className={`border-t border-black/10 transition-all duration-700 delay-300 ease-out ${footerVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>

        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-charcoal/50 lg:px-10">
          © {new Date().getFullYear()} Friends Photography. All rights reserved.
        </div>

      </div>

    </footer>
  );
}
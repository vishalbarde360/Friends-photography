// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as portfolioApi from "../api/portfolio";
import * as reviewApi from "../api/review";

import PortfolioCard from "../components/PortfolioCard";
import Loader from "../components/Loader";

const categories = [
  "Wedding",
  "Pre-Wedding",
  "Birthday",
  "Corporate",
  "Events",
];

const heroImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1800&auto=format&fit=crop",
];

/* ================================
   HERO SLIDESHOW
================================ */

function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"
            }`}
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-espresso/55" />

      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-espresso/40" />
    </div>
  );
}

/* ================================
   STAR INPUT
================================ */

function StarInput({ value, onChange, dark = true }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="text-xl leading-none transition-transform hover:scale-110"
        >
          <span
            style={{
              color:
                (hover || value) >= n
                  ? "#FFD700"
                  : dark
                    ? "#FFFFFF"
                    : "#5C5149",
            }}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

/* ================================
   STAR DISPLAY
================================ */

function StarDisplay({ rating }) {
  const numericRating = Number(rating) || 0;

  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= numericRating ? "#FFD700" : "#FFFFFF",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ================================
   REVIEW MARQUEE
================================ */

function ReviewMarquee({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-softwhite/50">
        No reviews yet. Be the first to leave a review!
      </p>
    );
  }

  /*
    Duplicate reviews for continuous animation.
  */
  const loop = [
    ...reviews,
    ...reviews,
    ...reviews,
    ...reviews,
  ];

  return (
    <div className="w-full overflow-hidden py-2">
      <div className="review-marquee flex w-max gap-5 hover:[animation-play-state:paused]">
        {loop.map((review, index) => (
          <div
            key={`${review._id || review.id || review.name}-${index}`}
            className="
              h-[165px]
              w-[340px]
              shrink-0
              rounded-2xl
              bg-softwhite/10
              px-6
              py-5
              ring-1
              ring-softwhite/15
            "
          >
            {/* Rating */}
            <StarDisplay rating={review.rating} />

            {/* Review */}
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-softwhite/85">
              "{review.text}"
            </p>

            {/* Name */}
            <p className="mt-3 text-xs uppercase tracking-wide2 text-softwhite/50">

              {review.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================
   HOME
================================ */

export default function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Reviews */
  const [reviews, setReviews] = useState([]);

  /* Review form */
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    text: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  /* ================================
     FETCH PORTFOLIO + REVIEWS
  ================================= */

  useEffect(() => {
    /* Portfolio */

    portfolioApi
      .getAllPortfolios()
      .then((res) => {
        setPortfolios(res.data.data || []);
      })
      .catch((error) => {
        console.error("Portfolio fetch error:", error);
        setPortfolios([]);
      })
      .finally(() => {
        setLoading(false);
      });

    /* Reviews */

    reviewApi
      .getReviews()
      .then((res) => {
        setReviews(res.data.data || []);
      })
      .catch((error) => {
        console.error("Review fetch error:", error);
        setReviews([]);
      });
  }, []);

  /* ================================
     REVIEW SUBMIT
  ================================= */

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    setReviewError("");
    setSubmitted(false);

    if (!form.name.trim()) {
      setReviewError("Please enter your name.");
      return;
    }

    if (!form.rating) {
      setReviewError("Please select a star rating.");
      return;
    }

    if (!form.text.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await reviewApi.createReview({
        name: form.name.trim(),
        rating: Number(form.rating),
        text: form.text.trim(),
      });

      const newReview = response.data.data;

      /* Immediately add review to marquee */

      setReviews((prev) => [newReview, ...prev]);

      /* Reset */

      setForm({
        name: "",
        rating: 0,
        text: "",
      });

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Review submit error:", error);

      setReviewError(
        error?.response?.data?.message ||
        "Failed to submit review. Please try again."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div>
      {/* ================================
          ANIMATIONS
      ================================= */}

      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-fade-up {
          opacity: 0;
          animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes reviewMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .review-marquee {
          animation: reviewMarquee 32s linear infinite;
        }
      `}</style>

      {/* ================================
          HERO
      ================================= */}

      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <HeroSlideshow />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-8">
          <p
            className="hero-fade-up text-xs uppercase tracking-wide2 text-softwhite/70"
            style={{
              animationDelay: "0.1s",
            }}
          >
            Photography studio · Since the everyday, made memorable
          </p>

          <h1
            className="hero-fade-up mx-auto mt-5 max-w-3xl font-display text-3xl leading-[1.1] text-softwhite sm:text-4xl md:text-5xl"
            style={{
              animationDelay: "0.35s",
            }}
          >
            We photograph the moments you'll{" "}
            <span className="italic text-terracotta">
              want back.
            </span>
          </h1>

          <p
            className="hero-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-softwhite/80"
            style={{
              animationDelay: "0.6s",
            }}
          >
            Weddings, pre-weddings, birthdays and corporate stories —
            shot candidly, delivered as private galleries your clients
            can open with a single link or QR code.
          </p>

          <div
            className="hero-fade-up mt-8 flex flex-wrap justify-center gap-3"
            style={{
              animationDelay: "0.85s",
            }}
          >
            <Link
              to="/portfolio"
              className="rounded-full bg-softwhite px-6 py-3 text-sm text-espresso transition hover:bg-terracotta hover:text-softwhite"
            >
              View portfolio
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-softwhite/50 px-6 py-3 text-sm text-softwhite transition hover:border-terracotta hover:text-terracotta"
            >
              Enquire about a date
            </Link>
          </div>
        </div>
      </section>

      {/* ================================
          CATEGORY STRIP
      ================================= */}

      <section className="border-y border-espresso/10 bg-beige/40">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 py-6 text-sm text-espresso/70 sm:px-8">
          {categories.map((category, index) => (
            <span
              key={category}
              className="flex items-center gap-8"
            >
              {category}

              {index < categories.length - 1 && (
                <span className="hidden text-terracotta sm:inline">
                  /
                </span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ================================
          ABOUT
      ================================= */}

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-wide2 text-terracotta">
              About the studio
            </p>

            <h2 className="mt-3 font-display text-3xl text-espresso sm:text-4xl">
              We're Friends Photography — a small team,
              telling honest stories.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-espresso/70">
              For over 7 years we've shot weddings, pre-wedding
              stories, birthdays and corporate events across
              Maharashtra — favoring candid, unposed moments over
              stiff formal portraits. Every shoot is edited by hand
              and delivered as a private gallery your clients can
              open with a single link or QR code, no app or login
              required.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-espresso/10 pt-6">
              <div>
                <p className="font-display text-3xl text-espresso">
                  7+
                </p>

                <p className="mt-1 text-xs text-espresso/60">
                  Years shooting
                </p>
              </div>

              <div>
                <p className="font-display text-3xl text-espresso">
                  300+
                </p>

                <p className="mt-1 text-xs text-espresso/60">
                  Events covered
                </p>
              </div>

              <div>
                <p className="font-display text-3xl text-espresso">
                  4.9★
                </p>

                <p className="mt-1 text-xs text-espresso/60">
                  Average rating
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-beige">
            <img
              src="https://i.pinimg.com/736x/7f/07/77/7f07770020ed44766d2981d45bd24f19.jpg"
              alt="Behind the scenes at a Friends Photography shoot"
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================================
          FEATURED WORK
      ================================= */}

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-espresso">
              Recent stories
            </h2>

            <p className="mt-1 text-sm text-espresso/60">
              A few frames from recent shoots.
            </p>
          </div>

          <Link
            to="/portfolio"
            className="text-sm text-terracotta hover:underline"
          >
            See full portfolio
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading portfolio" />
        ) : portfolios.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-espresso/15 py-16 text-center text-sm text-espresso/50">
            No portfolio pieces published yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {portfolios.slice(0, 8).map((portfolio) => (
              <PortfolioCard
                key={portfolio._id}
                item={portfolio}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================================
          GALLERY CTA
      ================================= */}

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 rounded-3xl bg-espresso px-6 py-12 text-softwhite sm:px-12 md:grid-cols-[1.2fr_auto] md:items-center">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl">
              Already shot with us? Your gallery is one link away.
            </h3>

            <p className="mt-2 max-w-lg text-sm text-softwhite/70">
              Enter the private link or QR code your photographer
              shared to browse and download your event photos.
            </p>
          </div>

          <Link
            to="/gallery"
            className="justify-self-start rounded-full bg-terracotta px-6 py-3 text-sm text-softwhite transition hover:bg-mocha md:justify-self-end"
          >
            Open my gallery
          </Link>
        </div>
      </section>

      {/* ================================
          CLIENT REVIEWS
          FORM IS NOW IN FOOTER
      ================================= */}

      <section className="bg-espresso py-14 text-softwhite">
        <div className="w-full">
          <div className="px-5 text-center sm:px-8">
            <p className="text-xs uppercase tracking-wide2 text-terracotta">
              Client reviews
            </p>

            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              What people say about us
            </h2>
          </div>

          <div className="mt-10 w-full">
            <ReviewMarquee reviews={reviews} />
          </div>
        </div>
      </section>
    </div>
  );
}
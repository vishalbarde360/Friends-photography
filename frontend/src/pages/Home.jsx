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
              transition duration-300 hover:-translate-y-2 hover:bg-softwhite/15 hover:shadow-xl
            "
          >
            <StarDisplay rating={review.rating} />

            <p className="mt-3 line-clamp-4 text-sm leading-6 text-softwhite/85">
              "{review.text}"
            </p>

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
   WHAT WE CAPTURE ICON
================================ */

function CaptureIcon({ type }) {
  if (type === "ready") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
        <rect
          x="5"
          y="7"
          width="14"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 7l1.2-2h3.6L15 7"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="13"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (type === "celebration") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
        <path
          d="M6 18c4-1 7-4 8-9l1-4-4 2c-5 1-8 5-9 9l4 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M15 5l3-2M18 9h3M16 2v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "vows") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
        <circle
          cx="9"
          cy="13"
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="15"
          cy="13"
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 5c1.5 2 3 3 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "candid") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
        <circle
          cx="9"
          cy="9"
          r="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="16"
          cy="10"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.5 19c.7-3.2 2.5-5 5.5-5s4.8 1.8 5.5 5M14 16c2.7-.8 5 .3 6 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
      <path
        d="M5 17c4-1 7-4 9-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 8l1-4 2 3 3-1-2 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ================================
   HOME
================================ */

export default function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);

  /* ================================
     FETCH DATA
  ================================= */

  useEffect(() => {
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
     SCROLL REVEAL ANIMATION
  ================================= */

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading, portfolios.length, reviews.length]);

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

        @keyframes scrollReveal {
          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(45px);
        }

        .scroll-reveal.is-visible {
          animation: scrollReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hover-lift {
          transition:
            transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 350ms ease,
            border-color 350ms ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(42, 31, 24, 0.14);
        }

        .capture-hover {
          transition:
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            color 300ms ease;
        }

        .capture-hover:hover {
          transform: translateY(-7px);
        }

        .capture-hover svg {
          transition: transform 300ms ease;
        }

        .capture-hover:hover svg {
          transform: scale(1.15) rotate(-4deg);
        }

        .image-hover {
          transition:
            transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 400ms ease;
        }

        .image-hover img {
          transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .image-hover:hover {
          box-shadow: 0 22px 50px rgba(42, 31, 24, 0.18);
        }

        .image-hover:hover img {
          transform: scale(1.06);
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

        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal,
          .scroll-reveal.is-visible {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .review-marquee {
            animation: none;
          }
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
            style={{ animationDelay: "0.1s" }}
          >
            Photography studio · Since the everyday, made memorable
          </p>

          <h1
            className="hero-fade-up mx-auto mt-5 max-w-3xl font-display text-3xl leading-[1.1] text-softwhite sm:text-4xl md:text-5xl"
            style={{ animationDelay: "0.35s" }}
          >
            We photograph the moments you'll{" "}
            <span className="italic text-terracotta">
              want back.
            </span>
          </h1>

          <p
            className="hero-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-softwhite/80"
            style={{ animationDelay: "0.6s" }}
          >
            Weddings, pre-weddings, birthdays and corporate stories —
            shot candidly, delivered as private galleries your clients
            can open with a single link or QR code.
          </p>

          <div
            className="hero-fade-up mt-8 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "0.85s" }}
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

      <section className="scroll-reveal border-y border-espresso/10 bg-beige/40">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 py-6 text-sm text-espresso/70 sm:px-8">
          {categories.map((category, index) => (
            <span
              key={category}
              className="flex items-center gap-8 transition duration-300 hover:-translate-y-0.5 hover:text-terracotta"
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

      {/* ==================================================
          NEW SECTION 1 — WEDDING FILMS
      ================================================== */}

      {/* ================================
    WEDDING FILM VIDEO BANNER
================================ */}

      <section className="scroll-reveal group relative h-[300px] w-full overflow-hidden rounded-xl sm:h-[380px] md:h-[300px]">

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        >
          <source
            src="/wedding.mp4"
            type="video/mp4"
          />

          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/20" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">

          <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16">

            {/* Small Heading */}
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/70 sm:text-[10px]">
              Wedding Films
            </p>

            {/* Main Heading */}
            <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
              Your Story, In Motion
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-xs leading-5 text-white/75 sm:text-sm">
              Experience the emotions, the joy and the little moments
              that make your wedding unforgettable.
            </p>

            {/* Button */}
            <Link
              to="https://cdn.pixabay.com/video/2024/05/20/212698_large.mp4"
              className="
          mt-5
          inline-flex
          items-center
          rounded-md
          border
          border-white/70
          px-4
          py-2
          text-[11px]
          text-white
          transition
          duration-300
          hover:bg-white
          hover:text-espresso
        "    target="_blank"
              rel="noopener noreferrer"
            >
              Watch Wedding Film
            </Link>

          </div>

          {/* Play Circle */}

        </div>

      </section>

      {/* ==================================================
          NEW SECTION 2 — WHAT WE CAPTURE
      ================================================== */}

      <section className="scroll-reveal border-y border-espresso/10 bg-[#f7f4ef]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

          <div className="mb-9">
            <p className="text-[10px] uppercase tracking-[0.25em] text-terracotta">
              What We Capture
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">

            {/* Getting Ready */}

            <div className="capture-hover text-center">
              <div className="flex justify-center text-espresso/80">
                <CaptureIcon type="ready" />
              </div>

              <h3 className="mt-4 font-display text-base text-espresso">
                Getting Ready
              </h3>

              <p className="mx-auto mt-2 max-w-[150px] text-[11px] leading-5 text-espresso/55">
                The quiet moments before forever.
              </p>
            </div>

            {/* Celebrations */}

            <div className="capture-hover text-center">
              <div className="flex justify-center text-espresso/80">
                <CaptureIcon type="celebration" />
              </div>

              <h3 className="mt-4 font-display text-base text-espresso">
                Celebrations
              </h3>

              <p className="mx-auto mt-2 max-w-[150px] text-[11px] leading-5 text-espresso/55">
                Haldi, Mehendi, Sangeet and more.
              </p>
            </div>

            {/* The Vows */}

            <div className="capture-hover text-center">
              <div className="flex justify-center text-espresso/80">
                <CaptureIcon type="vows" />
              </div>

              <h3 className="mt-4 font-display text-base text-espresso">
                The Vows
              </h3>

              <p className="mx-auto mt-2 max-w-[150px] text-[11px] leading-5 text-espresso/55">
                Sacred rituals and heartfelt emotions.
              </p>
            </div>

            {/* Candid Moments */}

            <div className="capture-hover text-center">
              <div className="flex justify-center text-espresso/80">
                <CaptureIcon type="candid" />
              </div>

              <h3 className="mt-4 font-display text-base text-espresso">
                Candid Moments
              </h3>

              <p className="mx-auto mt-2 max-w-[150px] text-[11px] leading-5 text-espresso/55">
                Real smiles, real stories.
              </p>
            </div>

            {/* Afterglow */}

            <div className="capture-hover text-center">
              <div className="flex justify-center text-espresso/80">
                <CaptureIcon type="afterglow" />
              </div>

              <h3 className="mt-4 font-display text-base text-espresso">
                The Afterglow
              </h3>

              <p className="mx-auto mt-2 max-w-[150px] text-[11px] leading-5 text-espresso/55">
                A celebration to remember.
              </p>
            </div>

          </div>
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

          <div className="image-hover mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-beige">
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

      <section className="scroll-reveal mx-auto max-w-6xl px-5 py-16 sm:px-8">

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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 [&>*]:transition [&>*]:duration-300 [&>*]:hover:-translate-y-2 [&>*]:hover:shadow-xl">
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

      <section className="scroll-reveal mx-auto max-w-6xl px-5 pb-20 sm:px-8">

        <div className="hover-lift grid gap-8 rounded-3xl bg-espresso px-6 py-12 text-softwhite sm:px-12 md:grid-cols-[1.2fr_auto] md:items-center">

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
      ================================= */}

      <section className="scroll-reveal bg-espresso py-14 text-softwhite">

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
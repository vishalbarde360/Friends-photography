import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as portfolioApi from "../api/portfolio";
import PortfolioCard from "../components/PortfolioCard";
import Loader from "../components/Loader";

const categories = ["Wedding", "Pre-Wedding", "Birthday", "Corporate", "Events"];

// Hero backdrop images — replace these with your own shoot photos
// (ideally 1800px+ wide, landscape, consistent tone/grade).
const heroImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1800&auto=format&fit=crop",
];

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
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      {/* Darken + warm the photo so white text stays readable */}
      <div className="absolute inset-0 bg-espresso/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-espresso/40" />
    </div>
  );
}

export default function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi
      .getAllPortfolios()
      .then((res) => setPortfolios(res.data.data || []))
      .catch(() => setPortfolios([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <HeroSlideshow />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-8">
          <p className="text-xs uppercase tracking-wide2 text-softwhite/70">
            Photography studio · Since the everyday, made memorable
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-3xl leading-[1.1] text-softwhite sm:text-4xl md:text-5xl">
            We photograph the moments you'll{" "}
            <span className="italic text-terracotta">want back.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-softwhite/80">
            Weddings, pre-weddings, birthdays and corporate stories — shot
            candidly, delivered as private galleries your clients can open
            with a single link or QR code.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      {/* Category strip */}
      <section className="border-y border-espresso/10 bg-beige/40">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 py-6 text-sm text-espresso/70 sm:px-8">
          {categories.map((c, i) => (
            <span key={c} className="flex items-center gap-8">
              {c}
              {i < categories.length - 1 && (
                <span className="hidden text-terracotta sm:inline">/</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-espresso">Recent stories</h2>
            <p className="mt-1 text-sm text-espresso/60">
              A few frames from recent shoots.
            </p>
          </div>
          <Link to="/portfolio" className="text-sm text-terracotta hover:underline">
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
            {portfolios.slice(0, 8).map((p) => (
              <PortfolioCard key={p._id} item={p} />
            ))}
          </div>
        )}
      </section>

      {/* Gallery CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 rounded-3xl bg-espresso px-6 py-12 text-softwhite sm:px-12 md:grid-cols-[1.2fr_auto] md:items-center">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl">
              Already shot with us? Your gallery is one link away.
            </h3>
            <p className="mt-2 max-w-lg text-sm text-softwhite/70">
              Enter the private link or QR code your photographer shared to
              browse and download your event photos.
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
    </div>
  );
}

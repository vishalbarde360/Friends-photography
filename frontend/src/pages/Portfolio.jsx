import React, { useEffect, useMemo, useState } from "react";
import * as portfolioApi from "../api/portfolio";
import PortfolioCard from "../components/PortfolioCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const categories = ["All", "Wedding", "Pre-Wedding", "Birthday", "Corporate", "Events", "Other"];

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    portfolioApi
      .getAllPortfolios()
      .then((res) => setPortfolios(res.data.data || []))
      .catch(() => setPortfolios([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? portfolios : portfolios.filter((p) => p.category === active)),
    [portfolios, active]
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-wide2 text-terracotta">Portfolio</p>
        <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
          Stories we've shot
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">
          Browse by category to see the kind of moments we're drawn to —
          then tell us about yours.
        </p>
      </div>

      {/* Category filter — horizontally scrollable on small screens */}
      <div className="mb-8 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
              active === c
                ? "border-espresso bg-espresso text-softwhite"
                : "border-espresso/15 text-espresso/70 hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading portfolio" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          subtitle="No portfolio pieces in this category yet — try another filter."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <PortfolioCard key={p._id} item={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as portfolioApi from "../api/portfolio";
import Loader from "../components/Loader";

export default function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    portfolioApi
      .getPortfolioById(id)
      .then((res) => setItem(res.data.data))
      .catch(() => setError("This portfolio piece couldn't be found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading" />;

  if (error || !item) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="font-display text-2xl text-espresso">{error}</p>
        <Link to="/portfolio" className="mt-4 inline-block text-sm text-terracotta hover:underline">
          Back to portfolio
        </Link>
      </div>
    );
  }

  const date = item.eventDate
    ? new Date(item.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <Link to="/portfolio" className="text-sm text-espresso/60 hover:text-terracotta">
          ← Back to portfolio
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide2 text-terracotta">{item.category}</p>
            <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl">{item.title}</h1>
            <p className="mt-2 text-sm text-espresso/60">
              {item.location}
              {date ? ` · ${date}` : ""}
            </p>
          </div>
        </div>

        {item.description && (
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-espresso/70">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-8 aspect-[16/9] w-full overflow-hidden bg-beige sm:mt-10">
        <img
          src={item.coverImage}
          alt={item.title}
          className="h-full w-full object-cover cursor-zoom-in"
          onClick={() => setLightbox(item.coverImage)}
        />
      </div>

      {item.images?.length > 0 && (
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {item.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className="aspect-square overflow-hidden rounded-xl bg-beige focus-ring"
              >
                <img
                  src={src}
                  alt={`${item.title} ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 text-2xl text-softwhite/80 hover:text-softwhite"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}

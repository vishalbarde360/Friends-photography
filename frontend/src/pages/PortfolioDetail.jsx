// src/pages/PortfolioDetail.jsx
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
      {/* Hero — blurred backdrop of the same photo, sharp copy on top uncropped */}
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-espresso">
        {/* Blurred backdrop fills the frame so no empty bars, regardless of source aspect ratio */}
        <img
          src={item.coverImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
        />
        <div className="absolute inset-0 bg-espresso/50" />

        {/* Sharp, uncropped photo centered on top */}
        <img
          src={item.coverImage}
          alt={item.title}
          onClick={() => setLightbox(item.coverImage)}
          className="absolute inset-0 m-auto h-full max-h-full w-auto max-w-full object-contain cursor-zoom-in drop-shadow-2xl"
        />

        {/* Bottom gradient so the title stays readable over any image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-espresso/90 to-transparent" />

        <Link
          to="/portfolio"
          className="absolute left-5 top-5 rounded-full bg-espresso/50 px-4 py-2 text-sm text-softwhite backdrop-blur transition hover:bg-espresso/70 sm:left-8 sm:top-8"
        >
          ← Back to portfolio
        </Link>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs uppercase tracking-wide2 text-terracotta">{item.category}</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-softwhite sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-2 text-sm text-softwhite/80">
              {item.location}
              {date ? ` · ${date}` : ""}
            </p>
          </div>
        </div>
      </div>

      {item.description && (
        <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-espresso/70">
            {item.description}
          </p>
        </div>
      )}

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
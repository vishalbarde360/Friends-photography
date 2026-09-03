import React from "react";
import { Link } from "react-router-dom";

export default function PortfolioCard({ item }) {
  const date = item.eventDate
    ? new Date(item.eventDate).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Link
      to={`/portfolio/${item._id}`}
      className="group block overflow-hidden rounded-2xl bg-softwhite shadow-sm ring-1 ring-espresso/5 transition hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden bg-beige">
        <img
          src={item.coverImage}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide2 text-terracotta">
          {item.category}
        </p>
        <h3 className="mt-1 font-display text-lg text-espresso">{item.title}</h3>
        <p className="mt-1 text-xs text-espresso/60">
          {item.location}
          {date ? ` · ${date}` : ""}
        </p>
      </div>
    </Link>
  );
}

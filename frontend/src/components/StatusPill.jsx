import React from "react";

const palettes = {
  New: "bg-terracotta/15 text-terracotta",
  Contacted: "bg-mocha/15 text-mocha",
  Discussion: "bg-mocha/15 text-mocha",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-600",
  Upcoming: "bg-terracotta/15 text-terracotta",
  Ongoing: "bg-mocha/15 text-mocha",
  Cancelled: "bg-red-100 text-red-600",
  Draft: "bg-espresso/10 text-espresso/70",
  Published: "bg-emerald-100 text-emerald-700",
  Archived: "bg-espresso/10 text-espresso/70",
};

export default function StatusPill({ status }) {
  const cls = palettes[status] || "bg-espresso/10 text-espresso/70";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

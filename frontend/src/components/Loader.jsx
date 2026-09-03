import React from "react";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-espresso/60">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-espresso/15 border-t-terracotta" />
      <p className="text-sm tracking-wide">{label}…</p>
    </div>
  );
}

import React from "react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-espresso">
      {message}
    </div>
  );
}

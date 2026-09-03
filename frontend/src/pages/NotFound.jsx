import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl text-terracotta">404</p>
      <h1 className="mt-3 font-display text-2xl text-espresso">Page not found</h1>
      <p className="mt-2 text-sm text-espresso/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6 rounded-full bg-espresso px-6 py-3 text-sm text-softwhite hover:bg-terracotta">
        Back home
      </Link>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-beige/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-espresso">
            Friends <span className="italic text-terracotta">Photography</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-espresso/70">
            Wedding, pre-wedding, birthday and corporate photography — every
            frame kept, curated and delivered with care.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide2 text-mocha">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-espresso/80">
            <li><Link to="/portfolio" className="hover:text-terracotta">Portfolio</Link></li>
            <li><Link to="/gallery" className="hover:text-terracotta">Client gallery</Link></li>
            <li><Link to="/contact" className="hover:text-terracotta">Enquire</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide2 text-mocha">
            Studio
          </p>
          <ul className="mt-4 space-y-2 text-sm text-espresso/80">
            <li>hello@friendsphotography.studio</li>
            <li>+91 90000 00000</li>
            <li>Pune, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso/10 px-5 py-5 text-center text-xs text-espresso/50 sm:px-8">
        © {new Date().getFullYear()} Friends Photography. All rights reserved.
      </div>
    </footer>
  );
}

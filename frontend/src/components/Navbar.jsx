import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/gallery", label: "Client Gallery" },
  { to: "/contact", label: "Enquire" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    `relative py-2 text-sm tracking-wide transition-colors ${isActive ? "text-terracotta" : "text-espresso/80 hover:text-terracotta"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-espresso/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-2xl font-medium text-espresso">
            Friends
          </span>
          <span className="font-display text-2xl italic text-terracotta">
            Photography
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="text-sm tracking-wide text-espresso/80 hover:text-terracotta"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="rounded-full border border-espresso/20 px-4 py-2 text-sm text-espresso transition hover:border-terracotta hover:text-terracotta focus-ring"
              >
                Log out
              </button>

            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-espresso px-5 py-2 text-sm text-softwhite transition hover:bg-terracotta focus-ring"
            >
              Studio Login
            </Link>
          )}
        </nav>

        {/* Hamburger button (mobile / tablet only) */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md md:hidden focus-ring"
        >
          <span
            className={`block h-0.5 w-6 bg-espresso transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-espresso transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-espresso transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""
              }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-0 top-[65px] z-40 bg-ivory transition-transform duration-300 ease-in-out md:hidden ${open ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
      >
        <nav className="flex h-full flex-col gap-1 px-6 py-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `border-b border-espresso/10 py-4 font-display text-2xl ${isActive ? "text-terracotta" : "text-espresso"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="border-b border-espresso/10 py-4 font-display text-2xl text-espresso"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="mt-6 rounded-full border border-espresso/20 px-5 py-3 text-center text-sm text-espresso"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mt-6 rounded-full bg-espresso px-5 py-3 text-center text-sm text-softwhite"
            >
              Studio Login
            </Link>
          )}

          {user && !isAdmin && (
            <p className="mt-4 text-xs text-espresso/50">
              Signed in as {user.name}
            </p>
          )}
        </nav>
      </div>
    </header>
  );
}

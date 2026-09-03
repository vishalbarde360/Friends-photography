import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const nav = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/albums", label: "Albums" },
  { to: "/admin/photos", label: "Photos" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/galleries", label: "Client galleries" },
];

export default function AdminLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2.5 text-sm transition ${isActive
      ? "bg-espresso text-softwhite"
      : "text-espresso/75 hover:bg-beige/60"
    }`;

  const SidebarContent = (
    <>
      <div className="mb-8 px-1">
        <p className="font-display text-xl text-espresso" onClick={() => window.location.href = "/"}>Studio Admin</p>
        <p className="mt-1 text-xs text-espresso/50">{user?.name}</p>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-8 w-full rounded-lg border border-espresso/15 px-4 py-2.5 text-left text-sm text-espresso/75 hover:border-terracotta hover:text-terracotta"
      >
        Log out
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-espresso/10 bg-ivory/95 px-5 py-4 backdrop-blur lg:hidden">
        <p className="font-display text-lg text-espresso">{title || "Studio Admin"}</p>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md focus-ring"
        >
          <span className={`block h-0.5 w-5 bg-espresso transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-espresso transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-espresso transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 bg-espresso/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`h-full w-72 max-w-[80%] bg-softwhite p-6 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {SidebarContent}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 sm:px-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-8 rounded-2xl bg-softwhite p-5 shadow-sm ring-1 ring-espresso/5">
            {SidebarContent}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {title && (
            <h1 className="mb-6 hidden font-display text-2xl text-espresso lg:block">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

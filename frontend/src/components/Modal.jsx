import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-espresso/40 px-4 py-8 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-2xl bg-softwhite p-6 shadow-xl`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-espresso">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-espresso/50 hover:bg-beige/60 hover:text-espresso focus-ring"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

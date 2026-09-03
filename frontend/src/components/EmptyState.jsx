import React from "react";

export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-espresso/15 py-20 text-center">
      <p className="font-display text-xl text-espresso">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-espresso/60">{subtitle}</p>}
      {action}
    </div>
  );
}

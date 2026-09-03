import React from "react";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide2 text-espresso/60">
        {label}
      </span>
      {children}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg border border-espresso/15 bg-ivory px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/35 focus-ring focus:border-terracotta";

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${baseInput} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-espresso text-softwhite hover:bg-terracotta disabled:opacity-50",
    outline:
      "border border-espresso/20 text-espresso hover:border-terracotta hover:text-terracotta disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
    ghost: "text-espresso/70 hover:text-terracotta",
  };
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition focus-ring ${variants[variant]} ${className}`}
    />
  );
}

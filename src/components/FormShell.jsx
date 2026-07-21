import React from "react";

export function FormShell({ title, subtitle, children }) {
  return (
    <section className="fade-up mx-auto w-full max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-gradient text-4xl font-extrabold">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

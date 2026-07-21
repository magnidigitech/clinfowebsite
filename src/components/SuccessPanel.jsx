import React from "react";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";

export function SuccessPanel({ title, text }) {
  return (
    <section className="fade-up panel mx-auto max-w-xl p-8 text-center">
      <CircleCheck className="mx-auto mb-4 size-14 text-clin-green" />
      <h1 className="text-3xl font-extrabold text-clin-green">{title}</h1>
      <p className="mt-3 text-slate-600">{text}</p>
      <Link to="/login" className="btn-primary mt-6">Go to LMS Login</Link>
    </section>
  );
}

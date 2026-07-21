import React from "react";
import { Navigate } from "react-router-dom";

export function Dashboard({ studentUser }) {
  if (!studentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="fade-up panel mx-auto w-full max-w-3xl p-10 text-center">
      <h1 className="text-gradient text-4xl font-extrabold">Student Portal</h1>
      <p className="mt-2 text-slate-500">Active Path: Clinical SAS Programming & Analytics</p>
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 font-semibold">
        🚧 Under Active Development - LMS Sandbox Integration Pending
      </div>
    </section>
  );
}

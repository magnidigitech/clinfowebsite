import React, { useState } from "react";
import { BadgeCheck, ShieldCheck, X } from "lucide-react";
import { SEO } from "../components/SEO";

export function VerifyCertificatePage({ certificates }) {
  const [certNumber, setCertNumber] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  function handleVerify(e) {
    e.preventDefault();
    if (!certNumber.trim()) return;

    const found = (certificates || []).find(
      (c) => String(c["Certificate Number"] || "").trim().toLowerCase() === certNumber.trim().toLowerCase()
    );
    setResult(found || null);
    setSearched(true);
  }

  return (
    <div className="fade-up mx-auto w-full max-w-3xl py-2">
      <SEO
        title="Verify Certificate Authenticity | Clinformatiq"
        description="Verify the official authenticity and GxP training records of a Clinformatiq clinical program certificate holder."
        canonicalUrl="https://www.clinformatiq.com/certificate"
      />
      <div className="text-center mb-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Certificate Verification</h1>
        <p className="mt-1 text-xs md:text-sm text-slate-500">Verify the authenticity of a Clinformatiq certificate.</p>
      </div>

      <div className="panel p-4 sm:p-6">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            className="flex-1 input-field py-2 text-sm"
            placeholder="Enter Certificate Number (e.g., CFT2507A011)"
            value={certNumber}
            onChange={(e) => {
              setCertNumber(e.target.value);
              setSearched(false);
              setResult(null);
            }}
            required
          />
          <button type="submit" className="btn-primary py-2 px-5 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
            <ShieldCheck size={18} /> Verify Certificate
          </button>
        </form>

        {searched && (
          <div className={`p-4 sm:p-5 rounded-xl border transition-all ${result ? "bg-emerald-50/90 border-emerald-300 shadow-sm" : "bg-red-50 border-red-200"}`}>
            {result ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1 border border-emerald-200 shadow-inner">
                  <BadgeCheck size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-emerald-950">Certificate Found & Certified</h3>
                <p className="text-xs font-medium text-emerald-700 mb-3">Officially verified in Clinformatiq records.</p>

                <div className="grid gap-2.5 sm:grid-cols-2 text-left bg-white p-3.5 sm:p-4 rounded-lg border border-emerald-200 shadow-sm text-sm">
                  <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-3">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Candidate Name</label>
                    <div className="text-base font-extrabold text-slate-900">{result["Name"] || "N/A"}</div>
                  </div>
                  <div className="border-b sm:border-b-0 border-slate-100 pb-2 sm:pb-0">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Certificate Number</label>
                    <div className="text-base font-extrabold text-clin-blue">{result["Certificate Number"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Course / Track</label>
                    <div className="text-sm font-bold text-slate-800">{result["Course"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Date of Issue</label>
                    <div className="text-sm font-bold text-emerald-800">{result["Date of Issue"] || result["Date of issue"] || result["Details"] || "N/A"}</div>
                  </div>
                  {Object.entries(result).map(([key, val]) => {
                    if (["Certificate Number", "Name", "Course", "Date of Issue", "Date of issue", "Details"].includes(key) || !val) return null;
                    return (
                      <div key={key} className="sm:col-span-2 pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">{key}</label>
                        <div className="text-xs font-semibold text-slate-700">{String(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2 shadow-inner">
                  <X size={20} />
                </div>
                <h3 className="text-base font-extrabold text-red-800 mb-1">Not Found in Records</h3>
                <p className="text-xs text-red-600">The certificate number entered could not be found. Please check the number and try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

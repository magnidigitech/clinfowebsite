import React, { useState } from "react";
import { BadgeCheck, ShieldCheck, X } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";

export function VerifyCertificatePage({ certificates, content }) {
  const [certNumber, setCertNumber] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  function handleVerify(e) {
    e.preventDefault();
    if (!certNumber.trim()) return;

    const found = (certificates || []).find(c => String(c["Certificate Number"]).trim().toLowerCase() === certNumber.trim().toLowerCase());
    setResult(found || null);
    setSearched(true);
  }

  return (
    <div className="fade-up max-w-4xl mx-auto w-full">
      <SectionHeader title="Certificate Verification" subtitle="Verify the authenticity of a Clinformatiq certificate." />

      <div className="panel p-8 md:p-12 mt-10">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-1 input-field"
            placeholder="Enter Certificate Number (e.g., CFTXXXXA0XX)"
            value={certNumber}
            onChange={(e) => {
              setCertNumber(e.target.value);
              setSearched(false);
              setResult(null);
            }}
            required
          />
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <ShieldCheck size={20} /> Verify Certificate
          </button>
        </form>

        {searched && (
          <div className={`p-6 md:p-10 rounded-2xl border transition-all ${result ? "bg-emerald-50/80 border-emerald-300 shadow-lg" : "bg-red-50 border-red-200"}`}>
            {result ? (
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner border border-emerald-200">
                  <BadgeCheck size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900 mb-1">Certificate Found & Certified</h3>
                <p className="text-sm font-semibold text-emerald-700 mb-6">This certificate is officially verified in Clinformatiq records.</p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 text-left bg-white p-6 md:p-8 rounded-xl border border-emerald-200 shadow-md">
                  <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-4">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Candidate Name</label>
                    <div className="text-xl font-extrabold text-slate-900">{result["Name"] || "N/A"}</div>
                  </div>
                  <div className="border-b sm:border-b-0 border-slate-100 pb-4 sm:pb-0">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Certificate Number</label>
                    <div className="text-xl font-extrabold text-clin-blue">{result["Certificate Number"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Course / Track</label>
                    <div className="text-lg font-bold text-slate-800">{result["Course"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Date of Issue</label>
                    <div className="text-lg font-bold text-emerald-800">{result["Date of Issue"] || result["Date of issue"] || result["Details"] || "N/A"}</div>
                  </div>
                  {Object.entries(result).map(([key, val]) => {
                    if (["Certificate Number", "Name", "Course", "Date of Issue", "Date of issue", "Details"].includes(key) || !val) return null;
                    return (
                      <div key={key} className="sm:col-span-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">{key}</label>
                        <div className="text-base font-semibold text-slate-700">{String(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-inner">
                  <X size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-red-800 mb-2">Not found in Records</h3>
                <p className="text-red-600/80">The certificate number you entered could not be found in our database. Please check the number and try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

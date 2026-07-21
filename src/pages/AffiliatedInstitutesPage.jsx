import React, { useState } from "react";
import { FileUp, X } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { RichTextDisplay } from "../components/RichTextDisplay";

export function AffiliatedInstitutesPage({ affiliatedInstitutes, content }) {
  const [activeInstitute, setActiveInstitute] = useState(null);
  const institutes = Array.isArray(affiliatedInstitutes) ? affiliatedInstitutes : [];

  return (
    <section className="fade-up">
      <SectionHeader title={content?.affiliatedTitle || "Our Affiliated Institutes"} subtitle={content?.affiliatedSubtitle || "Partners committed to advancing clinical education and training through Memorandum of Understanding (MOU) agreements."} />
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        <p>🤝 <RichTextDisplay html={content?.affiliatedText || "All institutes listed below have formal MOU agreements with Clinformatiq for collaborative clinical training and professional development."} className="inline" /></p>
      </div>

      {institutes.length === 0 ? (
        <div className="panel p-10 text-center text-slate-500">The affiliated institutes list is currently being updated.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {institutes.map((institute) => (
            <article key={institute.id} className="panel cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition group" onClick={() => setActiveInstitute(institute)}>
              <div className="aspect-[3/2] w-full overflow-hidden bg-white p-4">
                <img src={institute.photo || institute.image} alt={institute.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  ✓ MOU CERTIFIED
                </div>
                <h3 className="text-lg font-bold text-clin-blue">{institute.name}</h3>
                {institute.city && <p className="mt-2 text-sm text-slate-600">{institute.city}</p>}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-clin-green"></span>
                  Active Partnership
                </div>
                {institute.mouPdfUrl && (
                  <a
                    href={institute.mouPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="btn-secondary btn-small mt-4 inline-flex items-center gap-2"
                  >
                    <FileUp size={14} /> View MOU
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {activeInstitute && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-5 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setActiveInstitute(null)}>
          <div className="panel w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
            <button className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 shadow-sm backdrop-blur" onClick={() => setActiveInstitute(null)}><X size={20} /></button>
            <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto bg-white p-5">
              <img src={activeInstitute.photo || activeInstitute.image} alt={activeInstitute.name} className="h-full w-full object-contain" />
            </div>
            <div className="p-8 w-full md:w-3/5 flex flex-col">
              <h2 className="text-3xl font-extrabold text-slate-900">{activeInstitute.name}</h2>
              {activeInstitute.city && <p className="mt-1 text-lg font-bold text-slate-500">{activeInstitute.city}</p>}
              <div className="mt-4 mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold w-fit text-green-700">
                ✓ MOU CERTIFIED
              </div>
              {activeInstitute.mouPdfUrl && (
                <a href={activeInstitute.mouPdfUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-small mt-3 inline-flex w-fit items-center gap-2">
                  <FileUp size={14} /> View MOU PDF
                </a>
              )}
              <h3 className="mt-4 font-bold text-clin-blue border-b border-slate-100 pb-2">Collaboration Details</h3>
              <div className="mt-4 text-slate-600 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[40vh] md:max-h-[60vh] pr-4 custom-scrollbar">
                <RichTextDisplay html={activeInstitute.description || "No collaboration description provided."} className="" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-900">Partnership Benefits</h3>
        <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Mutual curriculum development and alignment</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Joint student internship programs</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Faculty exchange and training initiatives</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Research collaboration opportunities</span></li>
        </ul>
      </div>
    </section>
  );
}

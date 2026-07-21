import React, { useState } from "react";
import { BriefcaseBusiness, Globe2, MapPin, Play, X } from "lucide-react";
import { defaultCareers } from "../data/defaultData";
import { SectionHeader } from "../components/SectionHeader";
import { RichTextDisplay } from "../components/RichTextDisplay";
import { TextField } from "../components/TextField";
import { SEO } from "../components/SEO";

function ApplyModal({ role, onClose, setJobApplications }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover: "" });

  function submit(event) {
    event.preventDefault();
    setJobApplications((items) => [...items, { id: `job_${Date.now()}`, role, ...form, timestamp: new Date().toLocaleString() }]);
    setSent(true);
    window.setTimeout(onClose, 1400);
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-5 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="panel w-full max-w-lg p-6">
        <button className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close modal"><X /></button>
        <h2 className="text-2xl font-extrabold text-slate-900">Apply for: {role}</h2>
        <p className="mt-1 text-sm text-slate-500">Fill out the application details to schedule interviews.</p>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          {sent && <div className="alert-success">Application submitted. Close this window.</div>}
          <TextField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
          <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
          <label><span className="form-label">Experience Summary</span><textarea required className="input min-h-24" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} /></label>
          <button className="btn-primary bg-clin-blue hover:bg-clin-blue-dark" type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export function CareersPage({ setJobApplications, careerListings, siteContent }) {
  const [filter, setFilter] = useState("all");
  const [activeJob, setActiveJob] = useState(null);
  const listings = Array.isArray(careerListings) ? careerListings : defaultCareers;
  const categories = Array.from(new Set(listings.map((job) => job.category || "clinical")));
  const filteredJobs = listings.filter((job) => filter === "all" || job.category === filter);
  const defaultMsg = "No content available. Please contact admin.";

  return (
    <section className="fade-up">
      <SEO
        title="Careers & Placement Opportunities | Clinformatiq"
        description="Join the Clinformatiq team or explore job placement openings in Clinical Research, SAS programming, and Data Management."
        canonicalUrl="https://www.clinformatiq.com/careers"
      />
      <SectionHeader title="Join the Clinformatiq Team" subtitle="Grow your skills alongside leading global clinical software specialists and cohort trainers." />
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {[["all", "All Roles"], ...categories.map((category) => [category, category])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${filter === key ? "bg-clin-green text-white" : "bg-white text-slate-500 shadow-sm hover:text-clin-green"}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-5">
        {filteredJobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-500">No career openings are listed right now.</div>
        ) : filteredJobs.map((job) => (
          <article key={job.id || job.role} className="panel flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-extrabold text-clin-blue">{job.role}</h3>
              {job.description && <RichTextDisplay html={job.description} className="mt-2 max-w-3xl text-sm leading-6 text-slate-600" />}
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin size={16} />{job.location}</span>
                <span className="inline-flex items-center gap-1"><BriefcaseBusiness size={16} />{job.type}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => setActiveJob(job.role)}>Apply Now</button>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-900">Connect With Us</h3>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          {siteContent?.footerYoutube && <a href={siteContent.footerYoutube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Play size={16} /> YouTube</a>}
          {siteContent?.footerInstagram && <a href={siteContent.footerInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Instagram</a>}
          {siteContent?.footerFacebook && <a href={siteContent.footerFacebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Facebook</a>}
        </div>
        {!siteContent?.footerYoutube && !siteContent?.footerInstagram && !siteContent?.footerFacebook && <p className="text-xs text-slate-400">{defaultMsg}</p>}
      </div>
      {activeJob && <ApplyModal role={activeJob} onClose={() => setActiveJob(null)} setJobApplications={setJobApplications} />}
    </section>
  );
}

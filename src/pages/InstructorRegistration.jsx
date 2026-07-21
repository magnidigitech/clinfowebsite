import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { FormShell } from "../components/FormShell";
import { TextField } from "../components/TextField";
import { SuccessPanel } from "../components/SuccessPanel";
import { SEO } from "../components/SEO";

export function InstructorRegistration({ setTrainers }) {
  const [fileName, setFileName] = useState("");
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", experience: "", specialty: "" });

  function submit(event) {
    event.preventDefault();
    setTrainers((items) => [...items, { id: `ins_${Date.now()}`, ...form, timestamp: new Date().toLocaleString() }]);
    setComplete(true);
  }

  if (complete) return <SuccessPanel title="Trainer Application Received!" text="Our academic coordinator team will review your resume dossier and specialties and schedule interviews." />;

  return (
    <FormShell title="Become an Instructor" subtitle="Join Clinformatiq as a clinical cohort trainer or software mentor.">
      <SEO
        title="Instructor & Faculty Registration | Clinformatiq"
        description="Join Clinformatiq as a clinical cohort trainer, SAS mentor, or pharmaceutical software instructor."
        canonicalUrl="https://www.clinformatiq.com/instructor-reg"
      />
      <form onSubmit={submit} className="panel grid gap-4 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
        </div>
        <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Years of Clinical Experience" type="number" value={form.experience} onChange={(experience) => setForm({ ...form, experience })} required />
          <TextField label="Core Clinical Specialty" value={form.specialty} onChange={(specialty) => setForm({ ...form, specialty })} required />
        </div>
        <label>
          <span className="form-label">Upload Professional Resume (PDF / DOC)</span>
          <span className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-clin-green/30 bg-clin-green/5 p-7 text-center text-sm font-semibold text-slate-500">
            <FileUp className="mb-2 text-clin-green" />
            {fileName || "Choose a file or drag it here"}
            <input className="sr-only" type="file" accept=".pdf,.doc,.docx" required onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </span>
        </label>
        <button className="btn-primary mt-2 bg-clin-blue hover:bg-clin-blue-dark" type="submit">Submit Trainer Request</button>
      </form>
    </FormShell>
  );
}

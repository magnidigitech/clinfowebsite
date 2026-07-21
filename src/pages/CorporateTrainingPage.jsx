import React, { useState } from "react";
import { BarChart3, Building2, Check, GraduationCap, ShieldCheck } from "lucide-react";
import { FormShell } from "../components/FormShell";
import { TextField } from "../components/TextField";
import { SuccessPanel } from "../components/SuccessPanel";

export function CorporateTrainingPage({ content }) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    cohortSize: "10-25",
    areas: [],
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);

  const trainingAreas = [
    "Clinical Research",
    "Clinical Data Management (CDM)",
    "Pharmacovigilance",
    "Regulatory Affairs",
    "Medical Coding",
    "Clinical SAS Programming",
    "R Programming",
    "Power BI for Healthcare Analytics",
    "Quality Assurance (QA) & Quality Control (QC)",
    "Good Clinical Practice (GCP) and Regulatory Compliance",
    "Pharmacy benefit management"
  ];

  const benefits = [
    {
      title: "Tailor-Made Solutions",
      desc: "Customized learning pathways fully aligned with your organizational goals and business objectives."
    },
    {
      title: "Expert Instructors",
      desc: "Delivered by seasoned industry experts and active professionals bringing real-world wisdom."
    },
    {
      title: "Practical Learning",
      desc: "Immersive learning experiences built around actual clinical trial datasets and case scenarios."
    },
    {
      title: "Flexible Delivery",
      desc: "Accommodating schedule formats including interactive online, on-premise onsite, or hybrid cohorts."
    },
    {
      title: "Audited Assessments",
      desc: "Milestone quizzes and evaluation frameworks to ensure transparent learning metrics and KPI tracking."
    },
    {
      title: "Post-Training Support",
      desc: "Ongoing mentor guidance, refresher check-ins, and accredited certification upon cohort completion."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Collaborate & Analyze",
      desc: "We align with your operational leaders to pinpoint critical skill gaps, domain competencies, and software focus areas."
    },
    {
      num: "02",
      title: "Design & Customize",
      desc: "Our academic experts draft custom curriculum plans, selecting modules and datasets that mimic your actual workflows."
    },
    {
      num: "03",
      title: "Deliver & Practice",
      desc: "Active training combines high-fidelity virtual instruction with sandbox exercises, ensuring daily active application."
    },
    {
      num: "04",
      title: "Evaluate & Retain",
      desc: "Through final capstones, rigorous assessments, and post-cohort documentation, we guarantee maximum retention."
    }
  ];

  const targetSectors = [
    "Pharmaceutical Companies",
    "Biotechnology Organizations",
    "Contract Research Organizations (CROs)",
    "Healthcare Institutions",
    "Medical Device Companies",
    "Life Sciences Enterprises"
  ];

  function toggleArea(area) {
    setForm(prev => {
      const areas = prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.areas.length === 0) {
      setStatus({ type: "error", text: "Please select at least one training area of interest." });
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("clinformatiq_corporate_inquiries") || "[]");
      const newInquiry = {
        id: `corp_${Date.now()}`,
        ...form,
        timestamp: new Date().toLocaleString()
      };
      localStorage.setItem("clinformatiq_corporate_inquiries", JSON.stringify([...existing, newInquiry]));
      setSubmitted(true);
    } catch (err) {
      setStatus({ type: "error", text: "Failed to submit inquiry. Please try again." });
    }
  }

  if (submitted) {
    return (
      <SuccessPanel
        title="Corporate Inquiry Received!"
        text="Thank you for choosing Clinformatiq. Our academic training consultant will contact your organization representative within 24 hours to map out your custom sandbox training curriculum."
      />
    );
  }

  return (
    <div className="fade-up flex flex-col gap-16 md:gap-24">
      {/* Why Choose Us */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Why Choose Our Corporate Training?</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            We bridge the gap between academic theory and clinical workplace reality with professional programs tailored to your organizational KPIs.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="panel p-6 flex flex-col gap-3 hover:-translate-y-1 transition duration-300 group">
              <div className="size-10 rounded-lg bg-clin-green/10 text-clin-green flex items-center justify-center font-bold">
                <Check size={20} className="transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-clin-blue transition">{benefit.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Areas */}
      <section id="training-areas" className="flex flex-col gap-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Specialized Training Domains</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Our expert trainers deliver customized programs across key life sciences, analytics, and compliance sectors.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {trainingAreas.map((area, idx) => (
            <div key={idx} className="panel p-5 flex items-center gap-4 bg-white/70 hover:bg-white hover:shadow-lg transition">
              <div className="size-10 rounded-full bg-clin-blue/10 text-clin-blue flex items-center justify-center flex-shrink-0">
                {area.includes("SAS") || area.includes("R ") || area.includes("BI") ? (
                  <BarChart3 size={18} />
                ) : area.includes("Compliance") || area.includes("Practice") || area.includes("Quality") ? (
                  <ShieldCheck size={18} />
                ) : (
                  <GraduationCap size={18} />
                )}
              </div>
              <span className="text-sm font-bold text-slate-800 leading-tight">{area}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Approach */}
      <section className="flex flex-col gap-12 bg-gradient-to-b from-cyan-50/50 to-emerald-50/50 rounded-3xl p-8 md:p-12 border border-cyan-100">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Structured Approach</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Every organization has unique needs. We design cohorts that guarantee employee readiness from day one.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-4 relative z-10">
              <div className="text-4xl md:text-5xl font-black text-clin-green/20 leading-none">{step.num}</div>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Benefit */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Who Can Benefit?</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Providing workforce development for key industries seeking to upskill talent and meet regulatory demands.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {targetSectors.map((sector, idx) => (
            <div key={idx} className="panel p-6 flex items-start gap-4 hover:shadow-md transition">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-800 leading-tight">{sector}</h3>
                <span className="text-xs text-slate-400 font-semibold">Authorized Upskilling Target</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Inquiry Form */}
      <section id="partner-form" className="scroll-mt-24">
        <FormShell title="Partner with Us" subtitle="Invest in your team's professional growth with customized, practical training programs.">
          <form onSubmit={handleSubmit} className="panel grid gap-5 p-6 sm:p-8">
            {status?.type === "error" && <div className="alert-error">{status.text}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Company Name" value={form.companyName} onChange={companyName => setForm({ ...form, companyName })} required />
              <TextField label="Contact Person Name" value={form.contactName} onChange={contactName => setForm({ ...form, contactName })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Work Email Address" type="email" value={form.email} onChange={email => setForm({ ...form, email })} required />
              <TextField label="Phone Number" type="tel" value={form.phone} onChange={phone => setForm({ ...form, phone })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="form-label">Estimated Cohort Size</span>
                <select
                  className="input cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:0.75rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
                  value={form.cohortSize}
                  onChange={e => setForm({ ...form, cohortSize: e.target.value })}
                  required
                >
                  <option value="Less than 10">Less than 10 employees</option>
                  <option value="10-25">10 to 25 employees</option>
                  <option value="25-50">25 to 50 employees</option>
                  <option value="50+">More than 50 employees</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="form-label">Training Areas of Interest</legend>
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
                {trainingAreas.map((area, idx) => (
                  <label key={idx} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-clin-green/30 hover:bg-clin-green/5">
                    <input
                      type="checkbox"
                      className="size-4 accent-clin-green"
                      checked={form.areas.includes(area)}
                      onChange={() => toggleArea(area)}
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              <span className="form-label">Custom Requirements / Additional Message</span>
              <textarea
                className="input min-h-28 resize-y py-3.5 font-sans"
                value={form.message}
                placeholder="Please outline any specific objectives, timing constraints, or tools access requirements..."
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </label>

            <button className="btn-primary mt-2 cursor-pointer text-white" type="submit">Submit Partnership Inquiry</button>
          </form>
        </FormShell>
      </section>
    </div>
  );
}

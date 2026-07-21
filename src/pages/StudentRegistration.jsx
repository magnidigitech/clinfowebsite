import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormShell } from "../components/FormShell";
import { TextField } from "../components/TextField";
import { SuccessPanel } from "../components/SuccessPanel";

export function StudentRegistration({ siteContent, setStudents }) {
  const [searchParams] = useSearchParams();
  const selectedCourse = searchParams.get("course") || "";
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    first: "",
    last: "",
    username: "",
    phone: "",
    email: "",
    courses: selectedCourse ? [selectedCourse] : [],
    pass: "",
    confirm: ""
  });

  function toggleCourse(courseName) {
    setForm((current) => {
      const courses = current.courses.includes(courseName)
        ? current.courses.filter((name) => name !== courseName)
        : [...current.courses, courseName];
      return { ...current, courses };
    });
  }

  function submit(event) {
    event.preventDefault();
    if (form.courses.length === 0) {
      setStatus({ type: "error", text: "Please select at least one specialized path before completing registration." });
      return;
    }
    if (form.pass !== form.confirm) {
      setStatus({ type: "error", text: "Registration passwords do not match. Please verify your entry." });
      return;
    }
    setStudents((items) => [
      ...items,
      {
        id: `st_${Date.now()}`,
        name: `${form.first} ${form.last}`,
        username: form.username,
        phone: form.phone,
        email: form.email,
        course: form.courses.join(", "),
        courses: form.courses,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setStatus({ type: "success", text: "Enrollment complete. Use student / student to log into the LMS panel simulator." });
  }

  if (status?.type === "success") return <SuccessPanel title="Enrollment Complete!" text={status.text} />;

  return (
    <FormShell title="Student Enrollment Form" subtitle="Replicating Tutor LMS student registration layout credentials">
      <form onSubmit={submit} className="panel grid gap-4 p-6 sm:p-8">
        {status?.type === "error" && <div className="alert-error">{status.text}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First Name" value={form.first} onChange={(first) => setForm({ ...form, first })} required />
          <TextField label="Last Name" value={form.last} onChange={(last) => setForm({ ...form, last })} required />
          <TextField label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
        </div>
        <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <fieldset>
          <legend className="form-label">Specialized Path Choice</legend>
          <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
            {siteContent.courses.map((course) => (
              <label key={course.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-clin-green/30 hover:bg-clin-green/5">
                <input
                  type="checkbox"
                  className="size-4 accent-clin-green"
                  checked={form.courses.includes(course.name)}
                  onChange={() => toggleCourse(course.name)}
                />
                <span>{course.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Password" type="password" value={form.pass} onChange={(pass) => setForm({ ...form, pass })} required />
          <TextField label="Confirm Password" type="password" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} required />
        </div>
        <button className="btn-primary mt-2" type="submit">Complete Registration</button>
      </form>
    </FormShell>
  );
}

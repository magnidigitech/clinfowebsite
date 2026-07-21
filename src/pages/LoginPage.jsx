import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { storageKeys } from "../data/defaultData";
import { TextField } from "../components/TextField";
import { SEO } from "../components/SEO";

export function LoginPage({ setStudentUser, setAdminUser }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const username = form.username.trim().toLowerCase();
    if (username === "student" && form.password === "student") {
      setStudentUser({ username: "student", role: "student" });
      navigate("/dashboard");
      return;
    }
    if (username === "admin@clinformatiq.com" && form.password === "clinformatiq123") {
      sessionStorage.setItem(storageKeys.admin, "true");
      setAdminUser(true);
      navigate("/admin");
      return;
    }
    setError("Invalid LMS username or password credentials.");
  }

  return (
    <section className="fade-up mx-auto w-full max-w-md">
      <SEO
        title="LMS Portal Access & Login | Clinformatiq"
        description="Sign in to access the Clinformatiq Student Dashboard or Admin Console."
        canonicalUrl="https://www.clinformatiq.com/login"
      />
      <form onSubmit={submit} className="panel grid gap-5 p-7">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-clin-blue/10 text-clin-blue"><Lock /></div>
        <div className="text-center">
          <h1 className="text-gradient text-3xl font-extrabold">LMS Portal Access</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to access Student Dashboard or Admin Console</p>
        </div>
        {error && <div className="alert-error">{error}</div>}
        <TextField label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} required />
        <label>
          <span className="form-label">Password</span>
          <span className="relative block">
            <input required className="input pr-12" type={visible ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setVisible(!visible)} aria-label="Toggle password visibility">
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="btn-primary w-full" type="submit">Sign In</button>
      </form>
    </section>
  );
}

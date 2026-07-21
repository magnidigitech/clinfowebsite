import React from "react";

export function TextField({ label, value, onChange, type = "text", required = false }) {
  return (
    <label>
      <span className="form-label">{label}</span>
      <input className="input" type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

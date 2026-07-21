import React from "react";
import { Link } from "react-router-dom";
import { Globe2, Play } from "lucide-react";
import { Logo } from "./Logo";

function stripAddressLabel(value) {
  return String(value || "").replace(/^Address:\s*/i, "");
}

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-slate-900">{title}</h3>
      <ul className="grid gap-2 text-sm text-slate-500">
        {items.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("/") ? (
              <Link to={href} className="hover:text-clin-green">{label}</Link>
            ) : (
              <a href={href} className="hover:text-clin-green">{label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ content }) {
  const defaultMsg = "No content available. Please contact admin.";
  const footerAddress = stripAddressLabel(content?.footerAddress || defaultMsg);
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white px-5 py-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="mb-4 inline-flex"><Logo compact /></Link>
          <p className="max-w-sm text-sm text-slate-500">
            Providing industry-leading, expert-designed clinical research and technical computing curriculum cohorts.
          </p>
        </div>
        <FooterList title="Menu Links" items={[["Home", "/"], ["Our Courses", "/courses"], ["Corporate Training", "/corporate-training"], ["Careers", "/careers"], ["Register", "/student-reg"]]} />
        <FooterList title="Contact Info" items={[["Call: +91 90108 55577", "tel:+919010855577"], ["info@clinformatiq.com", "mailto:info@clinformatiq.com"]]} />
        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900">Address</h3>
          <p className="max-w-sm text-sm text-slate-500">{footerAddress}</p>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-[1400px] border-t border-slate-200 pt-6">
        <h3 className="mb-3 text-sm font-bold text-slate-900">Social Media</h3>
        <div className="flex gap-4 text-sm text-slate-500">
          {content?.footerYoutube && <a href={content.footerYoutube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Play size={16} /> YouTube</a>}
          {content?.footerInstagram && <a href={content.footerInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Instagram</a>}
          {content?.footerFacebook && <a href={content.footerFacebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Facebook</a>}
        </div>
        {!content?.footerYoutube && !content?.footerInstagram && !content?.footerFacebook && <p className="text-xs text-slate-400">{defaultMsg}</p>}
      </div>
      <div className="mx-auto mt-8 flex max-w-[1400px] flex-wrap justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400">
        <p>Copyright 2026 Clinformatiq. All rights reserved.</p>
        <p>Authorized Hostinger Deployment</p>
      </div>
    </footer>
  );
}

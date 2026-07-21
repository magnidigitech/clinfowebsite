import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    ["/", "Home"],
    ["/courses", "Our Courses"],
    ["/corporate-training", "Corporate Training"],
    ["/team", "Our Team"],
    ["/careers", "Careers"],
    ["/student-reg", "Student Registration"],
    ["/affiliated-institutes", "Our Affiliated Institutes"],
    ["/certificate", "Verify Certificate"],
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex h-auto min-h-[80px] lg:h-[110px] max-w-[1750px] w-full flex-col lg:flex-row lg:items-center lg:justify-between px-4 py-4 sm:px-6 lg:px-11 lg:py-0">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <Link to="/" aria-label="Clinformatiq home" className="flex shrink-0 items-center overflow-hidden rounded">
            <Logo />
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/login" className="btn-primary btn-small rounded-lg px-4 py-2 text-sm font-semibold">
              Login
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600" aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <nav className={`${mobileMenuOpen ? "flex" : "hidden"} mt-4 flex-col gap-4 pb-4 lg:pb-0 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-x-3 xl:gap-x-5 text-sm font-semibold text-slate-600`}>
          {links.map(([path, label]) => {
            let displayLabel = label;
            if (label === "Our Courses") displayLabel = "Courses";
            if (label === "Our Affiliated Institutes") displayLabel = "Affiliated Institutes";

            const isActive = currentPath === path || (path !== "/" && currentPath.startsWith(path));

            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`whitespace-nowrap border-b-2 py-2 lg:py-1 transition ${isActive ? "border-clin-green text-clin-green" : "border-transparent hover:border-clin-green/40 hover:text-clin-green"}`}
              >
                {displayLabel}
              </Link>
            );
          })}
          <Link to="/login" className="hidden lg:inline-flex btn-primary btn-small rounded-lg px-5 py-2.5 text-sm font-semibold lg:px-6">
            LMS Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

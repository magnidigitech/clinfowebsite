import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export function NotFoundPage() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="fade-up flex min-h-[65vh] flex-col items-center justify-center text-center px-4 py-12">
      <div className="relative mb-6 grid h-28 w-28 place-items-center rounded-full bg-red-50 text-red-500 border border-red-100 shadow-inner">
        <span className="text-4xl font-black tracking-tighter">404</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Page Not Found</h1>
      <p className="max-w-md text-slate-600 mb-8 text-base font-medium">
        The address you entered (<code className="bg-slate-100 px-2.5 py-1 rounded-md text-clin-blue font-bold text-sm border border-slate-200">{location.pathname}</code>) does not exist on Clinformatiq.
      </p>

      <div className="mb-8 flex flex-col items-center gap-1.5 bg-gradient-to-br from-cyan-50/80 to-emerald-50/80 p-6 rounded-2xl border border-cyan-100 shadow-md max-w-xs w-full">
        <div className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Redirecting to Main Page in</div>
        <div className="text-4xl font-black text-clin-blue animate-pulse">{countdown}s</div>
      </div>

      <Link
        to="/"
        className="btn-primary bg-clin-blue hover:bg-clin-blue-dark flex items-center gap-2 shadow-xl shadow-clin-blue/25 px-8 py-4 text-base font-bold transition-all hover:scale-105 cursor-pointer"
      >
        <Home size={20} /> Go to Main Page Now
      </Link>
    </div>
  );
}

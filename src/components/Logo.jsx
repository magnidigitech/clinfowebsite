import React from "react";

export function Logo({ compact = false }) {
  return (
    <img
      src="/clinformatiq-logo.png"
      alt="Clinformatiq - Uniting Science with Clinical Tech"
      className={`block object-cover object-center ${compact ? "h-[50px] w-[160px]" : "h-[60px] sm:h-[70px] lg:h-[80px] w-[200px] sm:w-[240px] lg:w-[280px]"}`}
    />
  );
}

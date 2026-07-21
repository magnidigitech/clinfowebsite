import React from "react";
import { RichTextDisplay } from "./RichTextDisplay";

export function SectionHeader({ title, subtitle }) {
  return (
    <div className="mx-auto mb-10 mt-16 max-w-2xl text-center">
      <h1 className="text-gradient text-4xl font-extrabold">{title}</h1>
      <RichTextDisplay html={subtitle} className="mt-3 text-slate-600" />
    </div>
  );
}

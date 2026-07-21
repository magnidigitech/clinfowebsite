import React from "react";

export function RichTextDisplay({ html, className = "" }) {
  if (!html) return null;
  return <div className={`rich-text-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

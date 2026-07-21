import React, { useEffect } from "react";

export function SEO({
  title = "Clinformatiq | Premium Clinical Analytics, SAS & Life Sciences Training",
  description = "Prepare for clinical research, SAS programming, CDM, pharmacovigilance, medical coding, and regulatory affairs careers with Clinformatiq's expert-led industry training.",
  keywords = "Clinical Research, Clinical Data Management, Pharmacovigilance, Clinical SAS, Medical Coding, Regulatory Affairs, PBM, Clinformatiq",
  canonicalUrl = "https://www.clinformatiq.com",
  ogImage = "https://www.clinformatiq.com/clinformatiq-logo.png"
}) {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (selector, attr, attrValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update canonical link
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Standard Meta Tags
    setMetaTag("meta[name='description']", "name", "description", description);
    setMetaTag("meta[name='keywords']", "name", "keywords", keywords);
    setMetaTag("meta[name='robots']", "name", "robots", "index, follow");

    // OpenGraph Meta Tags
    setMetaTag("meta[property='og:title']", "property", "og:title", title);
    setMetaTag("meta[property='og:description']", "property", "og:description", description);
    setMetaTag("meta[property='og:type']", "property", "og:type", "website");
    setMetaTag("meta[property='og:url']", "property", "og:url", canonicalUrl);
    setMetaTag("meta[property='og:image']", "property", "og:image", ogImage);
    setMetaTag("meta[property='og:site_name']", "property", "og:site_name", "Clinformatiq");

    // Twitter Card Meta Tags
    setMetaTag("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    setMetaTag("meta[name='twitter:title']", "name", "twitter:title", title);
    setMetaTag("meta[name='twitter:description']", "name", "twitter:description", description);
    setMetaTag("meta[name='twitter:image']", "name", "twitter:image", ogImage);

  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null;
}

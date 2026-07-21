import React, { useState } from "react";
import { Linkedin, X } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { RichTextDisplay } from "../components/RichTextDisplay";
import { formatExternalUrl } from "../components/RichTextEditor";
import { SEO } from "../components/SEO";

export function OurTeam({ teamMembers = [], directors = [], siteContent = {} }) {
  const [activeMember, setActiveMember] = useState(null);

  const sortedDirectors = [...directors].sort((a, b) => (parseInt(a.position) || 0) - (parseInt(b.position) || 0));
  const sortedTeam = [...teamMembers].sort((a, b) => (parseInt(a.position) || 0) - (parseInt(b.position) || 0));

  const marqueeSpeed = siteContent.teamMarqueeSpeed || 40;

  return (
    <section className="fade-up">
      <SEO
        title="Our Leadership & Industry Mentors | Clinformatiq"
        description="Meet the clinical experts, regulatory affairs specialists, and data management visionaries behind Clinformatiq Institute."
        canonicalUrl="https://www.clinformatiq.com/team"
      />
      <SectionHeader title="Our Team" subtitle="Meet the clinical experts and visionaries behind Clinformatiq." />

      {directors.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900 text-center">Board of Directors</h2>
          <div className="relative flex overflow-hidden mask-fade py-4">
            <div className="animate-marquee flex gap-6 whitespace-nowrap px-6" style={{ animationDuration: `${marqueeSpeed}s` }}>
              {[...sortedDirectors, ...sortedDirectors].map((member, i) => (
                <article key={i} className="panel shrink-0 w-[300px] cursor-pointer overflow-hidden transition hover:-translate-y-2 hover:shadow-xl group" onClick={() => setActiveMember(member)}>
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100">
                    <img src={member.photo} alt={member.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 text-center whitespace-normal">
                    <h3 className="text-lg font-extrabold text-clin-blue">{member.name}</h3>
                    <p className="mt-1 text-sm font-bold text-clin-green">({member.designation})</p>
                    {member.linkedin && (
                      <a
                        href={formatExternalUrl(member.linkedin)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mx-auto mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-clin-blue/20 px-3 py-2 text-xs font-bold text-clin-blue transition hover:bg-clin-blue/10"
                      >
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {teamMembers.length > 0 && (
        <div>
          {directors.length > 0 && <h2 className="mb-6 text-2xl font-extrabold text-slate-900 text-center">Our Experts</h2>}
          <div className="relative flex overflow-hidden mask-fade py-4">
            <div className="animate-marquee flex gap-6 whitespace-nowrap px-6" style={{ animationDuration: `${marqueeSpeed}s` }}>
              {[...sortedTeam, ...sortedTeam].map((member, i) => (
                <article key={i} className="panel shrink-0 w-[300px] cursor-pointer overflow-hidden transition hover:-translate-y-2 hover:shadow-xl group" onClick={() => setActiveMember(member)}>
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100">
                    <img src={member.photo} alt={member.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 text-center whitespace-normal">
                    <h3 className="text-lg font-extrabold text-clin-blue">{member.name}</h3>
                    <p className="mt-1 text-sm font-bold text-clin-green">({member.designation})</p>
                    {member.linkedin && (
                      <a
                        href={formatExternalUrl(member.linkedin)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mx-auto mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-clin-blue/20 px-3 py-2 text-xs font-bold text-clin-blue transition hover:bg-clin-blue/10"
                      >
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {teamMembers.length === 0 && directors.length === 0 && (
        <div className="panel p-10 text-center text-slate-500">The team directory is currently being updated.</div>
      )}

      {activeMember && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-5 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setActiveMember(null)}>
          <div className="panel w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
            <button className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 shadow-sm backdrop-blur" onClick={() => setActiveMember(null)}><X size={20} /></button>
            <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto bg-slate-100">
              <img src={activeMember.photo} alt={activeMember.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-8 w-full md:w-3/5 flex flex-col">
              <h2 className="text-3xl font-extrabold text-slate-900">{activeMember.name}</h2>
              <p className="mt-1 text-lg font-bold text-clin-green">({activeMember.designation})</p>
              {activeMember.linkedin && (
                <a
                  href={formatExternalUrl(activeMember.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-clin-blue/25 px-4 py-2 text-sm font-bold text-clin-blue transition hover:bg-clin-blue/10"
                >
                  <Linkedin size={16} /> LinkedIn Profile
                </a>
              )}
              <div className="mt-6 text-slate-600 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[40vh] md:max-h-[60vh] pr-4 custom-scrollbar">
                <RichTextDisplay html={activeMember.description} className="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Globe2,
  GraduationCap,
  MonitorCheck,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";
import { defaultSiteContent, userReviews, getYoutubeId } from "../data/defaultData";
import { SectionHeader } from "../components/SectionHeader";
import { RichTextDisplay } from "../components/RichTextDisplay";
import { SEO } from "../components/SEO";

export function HomePage({ content }) {
  const videos = content.videos?.length ? content.videos : defaultSiteContent.videos;
  const [chapter, setChapter] = useState(videos[0]?.id || "video_1");
  const [openFaq, setOpenFaq] = useState(0);
  const video = videos.find((item) => item.id === chapter) || videos[0];
  const activeVideoId = getYoutubeId(video?.videoId, defaultSiteContent.videos[0].videoId);
  const heroVideoId = getYoutubeId(content.heroVideoId);
  const icons = [Globe2, MonitorCheck, Users, ShieldCheck, GraduationCap];

  return (
    <div className="space-y-16">
      <SEO
        title="Clinformatiq | Premium Clinical Analytics, SAS & Life Sciences Training"
        description="Accelerate your clinical learning path. Learn directly from field practitioners using curriculum models backed by global compliance mandates and clinical software workflows."
        canonicalUrl="https://www.clinformatiq.com"
      />
      <section className="relative grid items-center gap-10 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/55 p-8 shadow-2xl shadow-teal-900/10 backdrop-blur md:p-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative">
          <h1 className="text-gradient text-5xl font-extrabold leading-tight drop-shadow-sm sm:text-7xl">{content.hero.title}</h1>
          <RichTextDisplay html={content.hero.subtitle} className="mt-6 max-w-2xl text-xl leading-9 text-slate-700" />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/courses" className="btn-primary">{content.hero.cta1Text}<ArrowRight size={18} /></Link>
            <a href="https://wa.me/+919010855577" target="_blank" rel="noreferrer" className="btn-secondary">{content.hero.cta2Text}</a>
          </div>
        </div>

        <div className="panel relative overflow-hidden ring-1 ring-clin-green/10">
          <a href={`https://www.youtube.com/watch?v=${activeVideoId}`} target="_blank" rel="noreferrer" className="group relative block aspect-video overflow-hidden bg-slate-900">
            <img src={`https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg`} alt={`${video.title} reference video thumbnail`} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-clin-blue shadow-2xl">
              <Play fill="currentColor" />
            </span>
            <span className="absolute bottom-5 left-5 right-5 text-white">
              <strong className="block text-xl">{video.title}</strong>
              <small className="text-sm text-white/75">{video.meta}</small>
            </span>
          </a>
          <div className="grid border-t border-cyan-100 bg-cyan-50/80" style={{ gridTemplateColumns: `repeat(${Math.min(videos.length, 4)}, minmax(0, 1fr))` }}>
            {videos.map((item) => (
              <button key={item.id} onClick={() => setChapter(item.id)} className={`px-3 py-4 text-xs font-extrabold transition sm:text-sm ${chapter === item.id ? "bg-gradient-to-r from-clin-green to-clin-blue text-white" : "text-slate-600 hover:bg-white"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 w-full overflow-hidden rounded-[2rem] border border-white/50 bg-slate-900 shadow-2xl shadow-teal-900/20">
        <div className="group relative aspect-video w-full overflow-hidden bg-slate-900 md:aspect-[2.5/1]">
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[250%] max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[120%]"
            src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&modestbranding=1&rel=0&showinfo=0`}
            title="Clinformatiq Overview Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <SectionHeader title={content.academicFocusTitle || "Academic Focus & Clinical Sandbox"} subtitle={content.academicFocusSubtitle || "Professional training standards optimized for biotechnology, pharmaceuticals, and software validation pipelines."} />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {content.features.map((feature, index) => {
          const Icon = icons[index] || ShieldCheck;
          return (
            <article key={feature.title} className="panel p-8 transition hover:-translate-y-1 hover:border-clin-green/25">
              <div className="mb-5 grid size-12 place-items-center rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100 text-clin-blue shadow-inner"><Icon /></div>
              <h3 className="text-lg font-extrabold text-clin-blue">{feature.title}</h3>
              <RichTextDisplay html={feature.description} className="mt-3 text-sm leading-6 text-slate-600" />
            </article>
          );
        })}
      </div>

      <section className="mt-16 grid gap-5 md:grid-cols-4">
        {content.metrics.map((metric) => (
          <div key={metric.label} className="panel bg-gradient-to-br from-white to-cyan-50 p-7 text-center">
            <div className="text-gradient text-4xl font-extrabold">{metric.value}</div>
            <div className="mt-2 text-sm font-bold text-slate-500">{metric.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-16 overflow-hidden rounded-xl border border-white/80 bg-white/90 shadow-2xl shadow-teal-900/10">
        <div className="px-5 py-7 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Dynamic Course Index</h2>
          <p className="text-slate-500">Choose the perfect course for your career goals</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gradient-to-r from-cyan-50 to-emerald-50 text-xs uppercase tracking-wide text-slate-600">
              <tr><th className="px-5 py-4">Course</th><th className="px-5 py-4">Duration</th><th className="px-5 py-4">Key Skills</th><th className="px-5 py-4">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {content.courses.map((course) => (
                <tr key={course.id} className="hover:bg-clin-green/5">
                  <td className="px-5 py-4 font-extrabold text-clin-blue">{course.name}</td>
                  <td className="px-5 py-4 text-slate-600"><RichTextDisplay html={course.duration} className="course-rich-cell" /></td>
                  <td className="px-5 py-4 text-slate-600"><RichTextDisplay html={course.skills} className="course-rich-cell" /></td>
                  <td className="px-5 py-4"><Link className="btn-primary btn-small" to={`/student-reg?course=${encodeURIComponent(course.name)}`}>Enroll</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 overflow-hidden py-10">
        <div className="mx-auto mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Real Experiences.</h2>
          <p className="mt-2 text-slate-500">See what our students are saying about us</p>
        </div>
        <div className="relative flex overflow-hidden mask-fade">
          <div className="animate-marquee flex gap-5 whitespace-nowrap px-5">
            {[...userReviews, ...userReviews].map((item, i) => (
              <blockquote key={i} className="panel flex w-[350px] shrink-0 flex-col justify-between whitespace-normal rounded-3xl border border-cyan-100 bg-white p-6 shadow-[0_4px_30px_rgba(15,118,110,0.06)] md:w-[400px]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-clin-green to-clin-blue text-lg font-bold text-white shadow-inner">
                        {item.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-800">{item.author}</div>
                        <div className="text-xs font-medium text-slate-400">{item.date}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic leading-relaxed text-slate-600">"{item.text}"</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-bold text-slate-300">
                  <div className="flex text-amber-400">
                    {"★".repeat(item.rating)}
                  </div>
                  <span className="flex items-center gap-1"><CircleCheck size={14} className="text-emerald-400" /> VERIFIED</span>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <SectionHeader title="Frequently Answered Queries" subtitle="Everything you need to know about Clinformatiq cohorts, tools access, and clinical career placement." />
      <div className="mx-auto grid max-w-3xl gap-3">
        {content.faqs.map((faq, index) => (
          <div key={faq.question} className="panel overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between px-5 py-4 text-left font-extrabold text-slate-800">
              {faq.question}<ChevronDown className={`transition ${openFaq === index ? "rotate-180" : ""}`} />
            </button>
            {openFaq === index && <p className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-600">{faq.answer}</p>}
          </div>
        ))}
      </div>

      <section className="panel mt-16 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-8 text-center sm:p-12">
        <h2 className="text-gradient text-4xl font-extrabold">{content.cta.title}</h2>
        <RichTextDisplay html={content.cta.description} className="mx-auto mt-4 max-w-2xl text-slate-600" />
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Link to="/courses" className="btn-primary bg-clin-blue hover:bg-clin-blue-dark">Start Your Journey</Link>
          <a href="https://wa.me/+919010855577" target="_blank" rel="noreferrer" className="btn-secondary">Schedule Consultation</a>
        </div>
      </section>
    </div>
  );
}

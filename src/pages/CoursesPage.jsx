import React from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/SectionHeader";
import { RichTextDisplay } from "../components/RichTextDisplay";

export function CoursesPage({ content }) {
  return (
    <section className="fade-up">
      <SectionHeader title="Our Curriculum Courses" subtitle="Study our specialized pathways prepared by clinical trials and bioinformatics leaders." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content.courses.map((course) => (
          <article key={course.id} className="panel flex flex-col p-6 transition hover:-translate-y-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-xl font-extrabold text-clin-blue">{course.name}</h2>
              <span className="badge border-clin-green/20 bg-clin-green/10 text-clin-green">Duration: <RichTextDisplay html={course.duration} className="course-rich-inline" /></span>
            </div>
            <RichTextDisplay html={course.body} className="mt-4 flex-1 text-sm leading-6 text-slate-600" />
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <strong className="text-slate-800">Key Skills:</strong> <RichTextDisplay html={course.skills} className="inline" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/student-reg?course=${encodeURIComponent(course.name)}`} className="btn-primary btn-small">Enroll Cohort</Link>
              {course.pdfUrl && (
                <a href={course.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-small">View Curriculum</a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

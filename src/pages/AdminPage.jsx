import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleCheck,
  ExternalLink,
  FileUp,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Pencil,
  Play,
  Plus,
  Save,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { storageKeys, defaultSiteContent } from "../data/defaultData";
import { storageEnabled, uploadFileToStorage, uploadCoursePDF, deleteCoursePDF } from "../postgresStore";
import { Logo } from "../components/Logo";
import { TextField } from "../components/TextField";
import { RichTextDisplay } from "../components/RichTextDisplay";
import { RichTextEditor } from "../components/RichTextEditor";
import { SEO } from "../components/SEO";

function AdminFeaturesTab({ content, setContent, showToast }) {
  const features = content.features || [];
  const blankFeature = { title: "", description: "" };
  const [form, setForm] = useState(blankFeature);
  const [editIndex, setEditIndex] = useState(null);

  function save(e) {
    e.preventDefault();
    const updated = [...features];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    setContent({ ...content, features: updated });
    setForm(blankFeature);
    setEditIndex(null);
    showToast("Feature saved!");
  }

  function editItem(i) {
    setForm(features[i]);
    setEditIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteItem(i) {
    if (!window.confirm("Delete this feature?")) return;
    const updated = features.filter((_, idx) => idx !== i);
    setContent({ ...content, features: updated });
    if (editIndex === i) {
      setForm(blankFeature);
      setEditIndex(null);
    }
    showToast("Feature deleted!");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Manage Features</h2>
        <p className="text-sm text-slate-500">Add or edit the feature cards shown on the home page.</p>
      </div>

      <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">{editIndex !== null ? "Edit Feature" : "Add New Feature"}</h3>
        <div className="space-y-4">
          <TextField label="Title" value={form.title} onChange={(val) => setForm({ ...form, title: val })} required />
          <RichTextEditor label="Description" value={form.description} onChange={(val) => setForm({ ...form, description: val })} />
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Feature</button>
          {editIndex !== null && (
            <button type="button" onClick={() => { setEditIndex(null); setForm(blankFeature); }} className="rounded-lg bg-slate-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-200">Cancel</button>
          )}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((item, i) => (
          <div key={i} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-2 font-bold text-slate-900">{item.title}</h4>
            <p className="mt-2 text-sm text-slate-600 line-clamp-3"><RichTextDisplay html={item.description} /></p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => editItem(i)} className="flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100"><Pencil size={12} /> Edit</button>
              <button onClick={() => deleteItem(i)} className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100"><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHeroTab({ content, setContent, showToast }) {
  const hero = content.hero || {};
  function update(key, val) {
    setContent({ ...content, hero: { ...hero, [key]: val } });
  }
  function updateContent(key, val) {
    setContent({ ...content, [key]: val });
  }
  function save(e) {
    e.preventDefault();
    showToast("Homepage content saved!");
  }
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Manage Hero Content</h2>
        <p className="text-sm text-slate-500">Control the first impression of your website.</p>
      </div>
      <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <TextField label="Main Heading (XL)" value={hero.title || ""} onChange={v => update("title", v)} required />
        <RichTextEditor label="Hero Subtitle (Lead Paragraph)" value={hero.subtitle || ""} onChange={v => update("subtitle", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Primary CTA Button Text" value={hero.cta1Text || ""} onChange={v => update("cta1Text", v)} />
          <TextField label="Secondary CTA Button Text" value={hero.cta2Text || ""} onChange={v => update("cta2Text", v)} />
        </div>
        <div className="border-t border-slate-200 pt-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Academic Focus Section</h3>
          <div className="space-y-4">
            <TextField label="Section Heading" value={content.academicFocusTitle || ""} onChange={v => updateContent("academicFocusTitle", v)} required />
            <RichTextEditor label="Section Paragraph" value={content.academicFocusSubtitle || ""} onChange={v => updateContent("academicFocusSubtitle", v)} />
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Homepage Changes</button>
        </div>
      </form>
    </div>
  );
}

function AdminMetricsTab({ content, setContent, showToast }) {
  const metrics = content.metrics || [];
  function updateMetric(index, key, val) {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [key]: val };
    setContent({ ...content, metrics: updated });
  }
  function save(e) {
    e.preventDefault();
    showToast("Metrics saved!");
  }
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Manage Metrics</h2>
        <p className="text-sm text-slate-500">Update the statistics displayed on the homepage.</p>
      </div>
      <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        {metrics.map((m, i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-2 border-b border-slate-100 pb-4 last:border-0">
            <TextField label={`Metric ${i + 1} Value`} value={m.value} onChange={v => updateMetric(i, "value", v)} />
            <TextField label={`Metric ${i + 1} Label`} value={m.label} onChange={v => updateMetric(i, "label", v)} />
          </div>
        ))}
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Metrics</button>
        </div>
      </form>
    </div>
  );
}

function AdminVideosTab({ content, setContent, showToast }) {
  const videos = content.videos?.length ? content.videos : defaultSiteContent.videos;

  function updateVideo(index, key, val) {
    const updated = [...videos];
    updated[index] = { ...updated[index], [key]: val };
    setContent({ ...content, videos: updated });
  }

  function addVideo() {
    if (videos.length >= 4) {
      showToast("Maximum 4 videos allowed.");
      return;
    }
    setContent({
      ...content,
      videos: [
        ...videos,
        {
          id: `video_${Date.now()}`,
          label: `${String(videos.length + 1).padStart(2, "0")}. New Video`,
          title: "New Training Video",
          meta: "Watch this reference on YouTube",
          videoId: "",
        },
      ],
    });
    showToast("Video slot added.");
  }

  function removeVideo(id) {
    if (videos.length <= 1) {
      showToast("Keep at least one video on the homepage.");
      return;
    }
    setContent({ ...content, videos: videos.filter((video) => video.id !== id) });
    showToast("Video removed.");
  }

  function save(e) {
    e.preventDefault();
    showToast("Videos saved!");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Homepage Videos</h2>
          <p className="text-sm text-slate-500">Add, remove, and edit 1 to 4 YouTube videos shown in the hero panel.</p>
        </div>
        <button type="button" onClick={addVideo} className="btn-secondary btn-small inline-flex items-center gap-2 self-start sm:self-auto"><Plus size={15} /> Add Video</button>
      </div>
      <form onSubmit={save} className="space-y-4">
        {videos.map((video, i) => (
          <div key={video.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-extrabold text-clin-blue">Video {i + 1}</h3>
              <button type="button" onClick={() => removeVideo(video.id)} className="rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600" title="Remove video">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Tab Label" value={video.label || ""} onChange={v => updateVideo(i, "label", v)} required />
              <TextField label="YouTube Video ID" value={video.videoId || ""} onChange={v => updateVideo(i, "videoId", v)} required />
              <TextField label="Video Title" value={video.title || ""} onChange={v => updateVideo(i, "title", v)} required />
              <TextField label="Small Description" value={video.meta || ""} onChange={v => updateVideo(i, "meta", v)} />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Videos</button>
        </div>
      </form>
    </div>
  );
}

function AdminCareersTab({ careers, setCareers, showToast }) {
  const blankCareer = { role: "", location: "", type: "", category: "clinical", description: "" };
  const [form, setForm] = useState(blankCareer);
  const [editId, setEditId] = useState(null);
  const listings = careers?.length ? careers : [];

  function submit(e) {
    e.preventDefault();
    if (editId) {
      setCareers((items) => items.map((item) => item.id === editId ? { ...item, ...form } : item));
      setEditId(null);
      showToast("Career updated!");
    } else {
      setCareers((items) => [...items, { id: `career_${Date.now()}`, ...form }]);
      showToast("Career added!");
    }
    setForm(blankCareer);
  }

  function editCareer(career) {
    setEditId(career.id);
    setForm({
      role: career.role || "",
      location: career.location || "",
      type: career.type || "",
      category: career.category || "clinical",
      description: career.description || "",
    });
  }

  function deleteCareer(id) {
    if (window.confirm("Delete this career listing?")) {
      setCareers((items) => items.filter((item) => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm(blankCareer);
      }
      showToast("Career removed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">{editId ? "Edit Career" : "Add Career"}</h2>
          <p className="text-sm text-slate-500">Admin can create any role, keep default text, edit details, or remove listings.</p>
        </div>
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Role Title" value={form.role} onChange={role => setForm({ ...form, role })} required />
            <TextField label="Location" value={form.location} onChange={location => setForm({ ...form, location })} required />
            <TextField label="Job Type" value={form.type} onChange={type => setForm({ ...form, type })} required />
            <TextField label="Category" value={form.category} onChange={category => setForm({ ...form, category })} required />
          </div>
          <RichTextEditor label="Default / Custom Text" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(blankCareer); }} className="btn-secondary">Cancel Edit</button>}
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> {editId ? "Save Career" : "Add Career"}</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-900">Current Careers ({listings.length})</h2>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No career listings are live. Add one above whenever you are ready.</div>
        ) : (
          <div className="space-y-3">
            {listings.map((career) => (
              <div key={career.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-clin-blue">{career.role}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                      <span>{career.location}</span>
                      <span>{career.type}</span>
                      <span>{career.category}</span>
                    </div>
                    {career.description && <RichTextDisplay html={career.description} className="mt-3 text-sm leading-6 text-slate-600" />}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => editCareer(career)} className="rounded-lg p-2.5 text-clin-blue transition hover:bg-clin-blue/10" title="Edit career">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => deleteCareer(career.id)} className="rounded-lg p-2.5 text-red-400 transition hover:bg-red-50 hover:text-red-600" title="Delete career">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCoursesTab({ content, setContent, showToast }) {
  const courses = content.courses || [];
  const blankCourse = { id: "", name: "", duration: "", skills: "", body: "", pdfUrl: "", pdfFileName: "" };
  const [form, setForm] = useState(blankCourse);
  const [editIndex, setEditIndex] = useState(null);
  const [uploadingPdfIndex, setUploadingPdfIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  function saveCourse(e) {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...courses];
      updated[editIndex] = { ...updated[editIndex], ...form };
      setContent({ ...content, courses: updated });
      showToast("Course updated!");
      setEditIndex(null);
    } else {
      const newCourse = { ...form, id: form.id || Date.now().toString() };
      setContent({ ...content, courses: [...courses, newCourse] });
      showToast("Course added!");
      setIsAdding(false);
    }
    setForm(blankCourse);
  }

  function startEdit(index) {
    setEditIndex(index);
    setIsAdding(false);
    setForm({ ...courses[index] });
  }

  function cancelEdit() {
    setEditIndex(null);
    setIsAdding(false);
    setForm(blankCourse);
  }

  function deleteCourse(index) {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const updated = courses.filter((_, i) => i !== index);
      setContent({ ...content, courses: updated });
      showToast("Course deleted!");
      if (editIndex === index) {
        setEditIndex(null);
        setForm(blankCourse);
      }
    }
  }

  async function handlePdfUpload(index, file) {
    if (!file) return;
    try {
      setUploadingPdfIndex(index);
      const { publicUrl, fileName } = await uploadCoursePDF(file, courses[index].name);
      const updated = [...courses];
      updated[index] = { ...updated[index], pdfUrl: publicUrl, pdfFileName: fileName };
      setContent({ ...content, courses: updated });
      showToast("Curriculum PDF uploaded successfully!");
    } catch (err) {
      showToast("Failed to upload PDF: " + err.message);
    } finally {
      setUploadingPdfIndex(null);
    }
  }

  async function handlePdfRemove(index) {
    try {
      const fileName = courses[index].pdfFileName;
      if (fileName) {
        try { await deleteCoursePDF(fileName); } catch (e) { console.warn("Failed to delete from storage:", e); }
      }
      const updated = [...courses];
      updated[index] = { ...updated[index], pdfUrl: "", pdfFileName: "" };
      setContent({ ...content, courses: updated });
      showToast("Curriculum PDF removed!");
    } catch (err) {
      showToast("Failed to remove PDF: " + err.message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Courses</h2>
          <p className="text-sm text-slate-500">Add, edit, or remove courses displayed on your website.</p>
        </div>
        {!isAdding && editIndex === null && (
          <button onClick={() => { setIsAdding(true); setForm(blankCourse); }} className="btn-primary inline-flex items-center gap-2">
            <GraduationCap size={16} /> Add New Course
          </button>
        )}
      </div>

      {(isAdding || editIndex !== null) && (
        <form onSubmit={saveCourse} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
            {isAdding ? "Add New Course" : "Edit Course"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Course Name" value={form.name} onChange={name => setForm({ ...form, name })} required />
            <TextField label="Course ID (optional slug)" value={form.id} onChange={id => setForm({ ...form, id })} />
          </div>
          <RichTextEditor label="Duration / Month Text" value={form.duration} onChange={v => setForm({ ...form, duration: v })} />
          <RichTextEditor label="Key Skills" value={form.skills} onChange={v => setForm({ ...form, skills: v })} />
          <RichTextEditor label="Description" value={form.body} onChange={v => setForm({ ...form, body: v })} />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
            <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> {isAdding ? "Add Course" : "Save Course"}</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {courses.map((course, i) => (
          <div key={course.id || i} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <div className="font-bold text-slate-800">{course.name}</div>
                <div className="text-xs text-slate-500">Duration: {course.duration?.replace(/<[^>]*>?/gm, '') || "N/A"}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(i)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-clin-blue hover:bg-clin-blue/10 transition">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => deleteCourse(i)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

            {!isAdding && editIndex !== i && (
              <div className="border-t border-slate-50 px-5 py-3 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm font-semibold text-slate-700">Curriculum PDF</div>
                {course.pdfUrl ? (
                  <div className="flex items-center gap-3">
                    <a href={course.pdfUrl} target="_blank" rel="noreferrer" className="text-clin-blue hover:underline text-sm flex items-center gap-1 font-bold">
                      <FileUp size={16} /> View PDF
                    </a>
                    <button onClick={() => handlePdfRemove(i)} className="text-red-500 hover:text-red-700 text-sm ml-2 font-bold">Remove</button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="btn-secondary btn-small inline-flex items-center gap-1">
                      <FileUp size={14} /> {uploadingPdfIndex === i ? "Uploading..." : "Upload PDF"}
                    </span>
                    <input type="file" accept=".pdf" className="sr-only" disabled={uploadingPdfIndex === i} onChange={(e) => handlePdfUpload(i, e.target.files?.[0])} />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDirectorsTab({ directors, setDirectors, showToast }) {
  const [form, setForm] = useState({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  const [uploading, setUploading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  function saveDirector(e) {
    e.preventDefault();
    if (!form.photo) return showToast('Photo is required!');
    const pos = parseInt(form.position) || 0;

    if (editIndex !== null) {
      const updated = [...directors];
      updated[editIndex] = { ...updated[editIndex], ...form, position: pos };
      setDirectors(updated);
      showToast('Director updated!');
      setEditIndex(null);
    } else {
      setDirectors(prev => [...prev, { id: Date.now().toString(), ...form, position: pos }]);
      showToast('Director added!');
    }
    setForm({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  }

  function startEdit(index) {
    setEditIndex(index);
    setForm({ ...directors[index] });
  }

  function cancelEdit() {
    setEditIndex(null);
    setForm({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, 'directors_photos');
      setForm({ ...form, photo: url });
      showToast('Photo uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploading(false);
    }
  }

  function deleteDirector(id) {
    if (window.confirm('Delete this director?')) {
      setDirectors(prev => prev.filter(m => m.id !== id));
      showToast('Director removed.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">{editIndex !== null ? 'Edit Director' : 'Add Director'}</h2>
          <p className="text-sm text-slate-500">Manage the directors displayed on your website.</p>
        </div>
        <form onSubmit={saveDirector} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full Name" value={form.name} onChange={name => setForm({ ...form, name })} required />
            <TextField label="Designation" value={form.designation} onChange={designation => setForm({ ...form, designation })} required />
            <TextField label="LinkedIn Profile URL" value={form.linkedin} onChange={linkedin => setForm({ ...form, linkedin })} />
            <TextField label="Position Number" value={form.position} onChange={position => setForm({ ...form, position })} type="number" />
          </div>
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <span className="form-label block mb-2">Profile Photo</span>
            {storageEnabled ? (
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FileUp size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </label>
                {form.photo && <img src={form.photo} alt="Preview" className="size-12 rounded-full object-cover border-2 border-white shadow-sm" />}
              </div>
            ) : (
              <TextField label="Photo URL (Image link)" value={form.photo} onChange={photo => setForm({ ...form, photo })} />
            )}
          </div>
          <RichTextEditor label="Description / Bio" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            {editIndex !== null && <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>}
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Users size={16} /> {editIndex !== null ? 'Save Director' : 'Add Director'}</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Current Directors ({directors.length})</h2>
        {directors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No directors added yet.</div>
        ) : (
          <div className="space-y-3">
            {directors.sort((a, b) => (parseInt(a.position) || 0) - (parseInt(b.position) || 0)).map((member, idx) => (
              <div key={member.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <img src={member.photo} alt={member.name} className="size-14 rounded-full object-cover bg-slate-200 border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{member.name} <span className="text-xs text-slate-500 font-normal">[Pos: {member.position}]</span></div>
                  <div className="text-xs font-semibold text-clin-green truncate">{member.designation}</div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{member.description.replace(/<[^>]*>?/gm, '').slice(0, 80)}...</div>
                </div>
                <button onClick={() => startEdit(idx)} className="rounded-lg p-2.5 text-clin-blue hover:bg-clin-blue/10 transition" title="Edit">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteDirector(member.id)} className="rounded-lg p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminTeamTab({ teamMembers, setTeamMembers, showToast }) {
  const [form, setForm] = useState({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  const [uploading, setUploading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  function saveMember(e) {
    e.preventDefault();
    if (!form.photo) return showToast('Photo is required!');
    const pos = parseInt(form.position) || 0;

    if (editIndex !== null) {
      const updated = [...teamMembers];
      updated[editIndex] = { ...updated[editIndex], ...form, position: pos };
      setTeamMembers(updated);
      showToast('Team member updated!');
      setEditIndex(null);
    } else {
      setTeamMembers(prev => [...prev, { id: Date.now().toString(), ...form, position: pos }]);
      showToast('Team member added!');
    }
    setForm({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  }

  function startEdit(index) {
    setEditIndex(index);
    setForm({ ...teamMembers[index] });
  }

  function cancelEdit() {
    setEditIndex(null);
    setForm({ name: '', designation: '', description: '', photo: '', linkedin: '', position: '' });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, 'team_photos');
      setForm({ ...form, photo: url });
      showToast('Photo uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploading(false);
    }
  }

  function deleteMember(id) {
    if (window.confirm('Delete this team member?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      showToast('Team member removed.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">{editIndex !== null ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <p className="text-sm text-slate-500">Create a new profile for the Our Team page.</p>
        </div>
        <form onSubmit={saveMember} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full Name" value={form.name} onChange={name => setForm({ ...form, name })} required />
            <TextField label="Designation" value={form.designation} onChange={designation => setForm({ ...form, designation })} required />
            <TextField label="LinkedIn Profile URL" value={form.linkedin} onChange={linkedin => setForm({ ...form, linkedin })} />
            <TextField label="Position Number" value={form.position} onChange={position => setForm({ ...form, position })} type="number" />
          </div>
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <span className="form-label block mb-2">Profile Photo</span>
            {storageEnabled ? (
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FileUp size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </label>
                {form.photo && <img src={form.photo} alt="Preview" className="size-12 rounded-full object-cover border-2 border-white shadow-sm" />}
              </div>
            ) : (
              <TextField label="Photo URL (Image link)" value={form.photo} onChange={photo => setForm({ ...form, photo })} />
            )}
            {!storageEnabled && <p className="text-xs text-slate-500 mt-2">Storage not configured. You must use a direct image URL.</p>}
          </div>
          <RichTextEditor label="Description / Bio" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            {editIndex !== null && <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>}
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Users size={16} /> {editIndex !== null ? 'Save Member' : 'Add Member'}</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Current Team ({teamMembers.length})</h2>
        {teamMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No team members added yet. Use the form above to add your first member.</div>
        ) : (
          <div className="space-y-3">
            {teamMembers.sort((a, b) => (parseInt(a.position) || 0) - (parseInt(b.position) || 0)).map((member, idx) => (
              <div key={member.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <img src={member.photo} alt={member.name} className="size-14 rounded-full object-cover bg-slate-200 border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{member.name} <span className="text-xs text-slate-500 font-normal">[Pos: {member.position}]</span></div>
                  <div className="text-xs font-semibold text-clin-green truncate">{member.designation}</div>
                  {member.linkedin && <div className="mt-0.5 text-xs text-slate-400 truncate">LinkedIn added</div>}
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{member.description.replace(/<[^>]*>?/gm, '').slice(0, 80)}...</div>
                </div>
                <button onClick={() => startEdit(idx)} className="rounded-lg p-2.5 text-clin-blue hover:bg-clin-blue/10 transition" title="Edit">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteMember(member.id)} className="rounded-lg p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDocumentsTab({ documents, setDocuments, showToast }) {
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) {
      alert("Please enter a Document Title before selecting a file to upload.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, "documents");
      setDocuments(prev => [...prev, { id: Date.now().toString(), title, url, filename: file.name, timestamp: new Date().toLocaleString() }]);
      setTitle("");
      showToast("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploading(false);
    }
  }

  function deleteDoc(id) {
    if (window.confirm("Delete this document? Note: This only removes the link from the UI, not the actual file in storage.")) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      showToast("Document removed.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Documents & PDFs</h2>
          <p className="text-sm text-slate-500">Upload PDF resources, brochures, and important files.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          {!storageEnabled && (
            <div className="alert-error mb-4">Storage is not configured. File uploads are disabled.</div>
          )}
          <TextField label="Document Title" value={title} onChange={setTitle} disabled={!storageEnabled || uploading} />

          <label className={`btn-primary cursor-pointer inline-flex items-center gap-2 w-fit ${(!storageEnabled || uploading || !title.trim()) && "opacity-50 pointer-events-none"}`}>
            <FileUp size={16} /> {uploading ? "Uploading PDF..." : "Select & Upload PDF"}
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} disabled={!storageEnabled || uploading || !title.trim()} />
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Uploaded Documents ({documents?.length || 0})</h2>
        {!documents?.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No documents uploaded yet.</div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800">{doc.title}</div>
                  <div className="text-xs text-slate-500">{doc.filename} • Uploaded: {doc.timestamp}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary btn-small inline-flex items-center gap-2">
                    <ExternalLink size={14} /> View
                  </a>
                  <button onClick={() => deleteDoc(doc.id)} className="rounded-lg p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAffiliatedTab({ affiliatedInstitutes, setAffiliatedInstitutes, content, setContent, showToast }) {
  const blankInstituteForm = { name: "", city: "", description: "", photo: "", mouPdfUrl: "", mouPdfName: "" };
  const [form, setForm] = useState(blankInstituteForm);
  const [uploading, setUploading] = useState(false);
  const [uploadingMou, setUploadingMou] = useState(false);
  const [uploadingMouId, setUploadingMouId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  function saveInstitute(e) {
    e.preventDefault();
    if (!form.photo) return showToast("Photo is required!");

    if (editIndex !== null) {
      const updated = [...affiliatedInstitutes];
      updated[editIndex] = { ...updated[editIndex], ...form };
      setAffiliatedInstitutes(updated);
      showToast("Affiliated institute updated!");
      setEditIndex(null);
    } else {
      setAffiliatedInstitutes(prev => [...prev, { id: Date.now().toString(), ...form }]);
      showToast("Affiliated institute added!");
    }
    setForm(blankInstituteForm);
  }

  function startEdit(index) {
    setEditIndex(index);
    setForm({ ...affiliatedInstitutes[index] });
  }

  function cancelEdit() {
    setEditIndex(null);
    setForm(blankInstituteForm);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, "affiliated_photos");
      setForm({ ...form, photo: url });
      showToast("Photo uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploading(false);
    }
  }

  async function handleMouFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file.");
      return;
    }
    setUploadingMou(true);
    try {
      const url = await uploadFileToStorage(file, "affiliated_mous");
      setForm({ ...form, mouPdfUrl: url, mouPdfName: file.name });
      showToast("MOU PDF uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || 'MOU upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploadingMou(false);
      e.target.value = "";
    }
  }

  async function handleExistingMouChange(id, file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file.");
      return;
    }
    setUploadingMouId(id);
    try {
      const url = await uploadFileToStorage(file, "affiliated_mous");
      setAffiliatedInstitutes(prev => prev.map(inst => (
        inst.id === id ? { ...inst, mouPdfUrl: url, mouPdfName: file.name } : inst
      )));
      showToast("MOU PDF attached!");
    } catch (err) {
      console.error(err);
      alert(err.message || 'MOU upload failed. Make sure PostgreSQL database and server connection are working.');
    } finally {
      setUploadingMouId(null);
    }
  }

  function removeExistingMou(id) {
    setAffiliatedInstitutes(prev => prev.map(inst => (
      inst.id === id ? { ...inst, mouPdfUrl: "", mouPdfName: "" } : inst
    )));
    showToast("MOU PDF removed.");
  }

  function deleteInstitute(id) {
    if (window.confirm("Delete this affiliated institute?")) {
      setAffiliatedInstitutes(prev => prev.filter(m => m.id !== id));
      showToast("Affiliated institute removed.");
    }
  }

  function saveContent(e) {
    e.preventDefault();
    showToast("Page text saved!");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Page Content</h2>
          <p className="text-sm text-slate-500">Edit the text that appears at the top of the Affiliated Institutes page.</p>
        </div>
        <form onSubmit={saveContent} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <TextField label="Main Title" value={content.affiliatedTitle || "Our Affiliated Institutes"} onChange={v => setContent({ ...content, affiliatedTitle: v })} required />
          <TextField label="Subtitle" value={content.affiliatedSubtitle || "Partners committed to advancing clinical education and training through Memorandum of Understanding (MOU) agreements."} onChange={v => setContent({ ...content, affiliatedSubtitle: v })} required />
          <RichTextEditor label="Highlighted Text Banner" value={content.affiliatedText || "All institutes listed below have formal MOU agreements with Clinformatiq for collaborative clinical training and professional development."} onChange={v => setContent({ ...content, affiliatedText: v })} />
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Text</button>
          </div>
        </form>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">{editIndex !== null ? "Edit Affiliated Institute" : "Add Affiliated Institute"}</h2>
          <p className="text-sm text-slate-500">Manage entries for the Affiliated Institutes page.</p>
        </div>
        <form onSubmit={saveInstitute} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Institute / College Name" value={form.name} onChange={name => setForm({ ...form, name })} required />
            <TextField label="Location (e.g. Hyderabad, India)" value={form.city} onChange={city => setForm({ ...form, city })} required />
          </div>
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <span className="form-label block mb-2">Institute Photo</span>
            {storageEnabled ? (
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FileUp size={16} /> {uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </label>
                {form.photo && <img src={form.photo} alt="Preview" className="h-12 w-20 rounded object-cover border-2 border-white shadow-sm" />}
              </div>
            ) : (
              <TextField label="Photo URL (Image link)" value={form.photo} onChange={photo => setForm({ ...form, photo })} />
            )}
            {!storageEnabled && <p className="text-xs text-slate-500 mt-2">Storage not configured. You must use a direct image URL.</p>}
          </div>
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <span className="form-label block mb-2">MOU PDF</span>
            {storageEnabled ? (
              <div className="flex flex-wrap items-center gap-3">
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FileUp size={16} /> {uploadingMou ? "Uploading..." : "Upload MOU PDF"}
                  <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleMouFileChange} disabled={uploadingMou} />
                </label>
                {form.mouPdfUrl && (
                  <a href={form.mouPdfUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-clin-blue hover:underline">
                    {form.mouPdfName || "View uploaded MOU"}
                  </a>
                )}
              </div>
            ) : (
              <TextField label="MOU PDF URL" value={form.mouPdfUrl} onChange={mouPdfUrl => setForm({ ...form, mouPdfUrl, mouPdfName: mouPdfUrl ? "MOU PDF" : "" })} />
            )}
            <p className="mt-2 text-xs text-slate-500">Attach the Memorandum of Understanding PDF for this college.</p>
          </div>
          <RichTextEditor label="Collaboration Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            {editIndex !== null && <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>}
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Building2 size={16} /> {editIndex !== null ? "Save Institute" : "Add Institute"}</button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Current Institutes ({affiliatedInstitutes?.length || 0})</h2>
        {!affiliatedInstitutes?.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No institutes added yet. Use the form above to add your first one.</div>
        ) : (
          <div className="space-y-3">
            {affiliatedInstitutes.map((inst, idx) => (
              <div key={inst.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <img src={inst.photo || inst.image} alt={inst.name} className="h-14 w-20 rounded object-contain bg-white border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{inst.name}</div>
                  <div className="text-xs font-semibold text-clin-green truncate">{inst.city}</div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{inst.description?.slice(0, 80)}...</div>
                  {inst.mouPdfUrl && (
                    <a href={inst.mouPdfUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-clin-blue hover:underline">
                      <FileUp size={12} /> {inst.mouPdfName || "View MOU PDF"}
                    </a>
                  )}
                </div>
                {storageEnabled ? (
                  <label className="btn-secondary btn-small cursor-pointer inline-flex items-center gap-2">
                    <FileUp size={14} /> {uploadingMouId === inst.id ? "Uploading..." : inst.mouPdfUrl ? "Replace MOU" : "Add MOU"}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      disabled={uploadingMouId === inst.id}
                      onChange={(e) => handleExistingMouChange(inst.id, e.target.files?.[0])}
                    />
                  </label>
                ) : (
                  <TextField label="MOU PDF URL" value={inst.mouPdfUrl || ""} onChange={mouPdfUrl => setAffiliatedInstitutes(prev => prev.map(item => item.id === inst.id ? { ...item, mouPdfUrl, mouPdfName: mouPdfUrl ? "MOU PDF" : "" } : item))} />
                )}
                {inst.mouPdfUrl && (
                  <button onClick={() => removeExistingMou(inst.id)} className="rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition">
                    Remove MOU
                  </button>
                )}
                <button onClick={() => startEdit(idx)} className="rounded-lg p-2.5 text-clin-blue hover:bg-clin-blue/10 transition" title="Edit">
                  <Pencil size={18} />
                </button>
                <button onClick={() => deleteInstitute(inst.id)} className="rounded-lg p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCertificatesTab({ certificates, setCertificates, showToast }) {
  const [searchTerm, setSearchTerm] = useState("");

  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  const filteredCerts = safeCertificates.filter(c =>
    String(c["Name"] || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c["Certificate Number"] || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c["Course"] || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c["Date of Issue"] || c["Date of issue"] || c["Details"] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });

        if (!rows || rows.length === 0) {
          showToast("File is empty.");
          return;
        }

        let headerRowIdx = -1;
        let colMap = { certNo: -1, name: -1, course: -1, dateOfIssue: -1 };

        for (let r = 0; r < Math.min(rows.length, 15); r++) {
          const rowStr = rows[r].map(cell => String(cell || "").trim().toLowerCase());
          let tempCert = -1, tempName = -1, tempCourse = -1, tempDate = -1;

          rowStr.forEach((s, idx) => {
            if (tempCert === -1 && (s.includes("cert") || s === "id" || s.includes("roll") || s.includes("reg") || s === "no." || s === "sl.no" || s === "s.no")) {
              tempCert = idx;
            } else if (tempName === -1 && (s.includes("name") || s.includes("candidate") || s.includes("student") || s.includes("participant"))) {
              tempName = idx;
            } else if (tempCourse === -1 && (s.includes("course") || s.includes("track") || s.includes("program") || s.includes("subject") || s.includes("training"))) {
              tempCourse = idx;
            } else if (tempDate === -1 && (s.includes("date") || s.includes("issue") || s.includes("detail") || s.includes("award") || s.includes("completion") || s.includes("valid"))) {
              tempDate = idx;
            }
          });

          if (tempCert !== -1 || tempName !== -1 || tempCourse !== -1 || tempDate !== -1) {
            headerRowIdx = r;
            colMap = { certNo: tempCert, name: tempName, course: tempCourse, dateOfIssue: tempDate };
            if ([tempCert, tempName, tempCourse, tempDate].filter(i => i !== -1).length >= 2) {
              break;
            }
          }
        }

        if (colMap.certNo === -1) colMap.certNo = 0;
        if (colMap.name === -1) colMap.name = [1, 0, 2, 3].find(idx => idx !== colMap.certNo) ?? 1;
        if (colMap.course === -1) colMap.course = [2, 1, 3, 0].find(idx => idx !== colMap.certNo && idx !== colMap.name) ?? 2;
        if (colMap.dateOfIssue === -1) colMap.dateOfIssue = [3, 2, 1, 4].find(idx => idx !== colMap.certNo && idx !== colMap.name && idx !== colMap.course) ?? 3;

        const startIdx = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
        const newCerts = [];

        for (let r = startIdx; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;

          const certNo = String(row[colMap.certNo] || "").trim();
          const name = String(row[colMap.name] || "").trim();
          const course = String(row[colMap.course] || "").trim();
          const dateOfIssue = String(row[colMap.dateOfIssue] || "").trim();

          if (!certNo && !name && !course && !dateOfIssue) continue;
          if (certNo.toLowerCase().includes("cert") && name.toLowerCase().includes("name")) continue;

          if (certNo) {
            const normalized = {
              "Certificate Number": certNo,
              "Name": name || "N/A",
              "Course": course || "N/A",
              "Date of Issue": dateOfIssue || "N/A",
              "Date of issue": dateOfIssue || "N/A",
              "Details": dateOfIssue || "N/A"
            };

            if (headerRowIdx !== -1 && rows[headerRowIdx]) {
              const headers = rows[headerRowIdx];
              headers.forEach((h, idx) => {
                const headerName = String(h || "").trim();
                if (headerName && idx !== colMap.certNo && idx !== colMap.name && idx !== colMap.course && idx !== colMap.dateOfIssue) {
                  normalized[headerName] = String(row[idx] || "").trim();
                }
              });
            }

            newCerts.push(normalized);
          }
        }

        if (newCerts.length === 0) {
          showToast("Could not find any certificate entries in the file.");
          return;
        }

        const existingMap = new Map();
        safeCertificates.forEach(c => existingMap.set(String(c["Certificate Number"]).trim().toLowerCase(), c));

        let added = 0;
        let updated = 0;

        newCerts.forEach(nc => {
          const key = String(nc["Certificate Number"]).trim().toLowerCase();
          if (existingMap.has(key)) {
            updated++;
          } else {
            added++;
          }
          existingMap.set(key, nc);
        });

        const mergedList = Array.from(existingMap.values());
        setCertificates(mergedList);

        showToast(`Successfully imported ${added} new and updated ${updated} certificates.`);
        e.target.value = "";
      } catch (err) {
        showToast("Error parsing file: " + err.message);
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function deleteCert(certNumber) {
    if (window.confirm(`Are you sure you want to delete certificate ${certNumber}?`)) {
      setCertificates(safeCertificates.filter(c => c["Certificate Number"] !== certNumber));
      showToast("Certificate deleted.");
    }
  }

  function clearAll() {
    if (window.confirm("Are you sure you want to delete ALL certificates? This cannot be undone until you re-upload.")) {
      setCertificates([]);
      showToast("All certificates cleared.");
    }
  }

  return (
    <div className="fade-up">
      <div className="mb-8 p-6 panel bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 shadow-sm">
        <h3 className="text-xl font-extrabold text-slate-800 mb-2 flex items-center gap-2">
          <FileUp className="text-clin-blue" size={24} /> Upload Certificates (Excel / CSV)
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Upload an Excel (<code className="font-semibold text-slate-800">.xlsx, .xls</code>) or CSV file containing certificate records. Ensure your file columns include:
          <br />
          <code className="inline-block mt-2 text-xs bg-white border border-cyan-200 px-3 py-1.5 rounded text-clin-blue font-bold shadow-2xs">
            Certificate Number | Name | Course | Date of Issue
          </code>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="btn-primary cursor-pointer flex items-center gap-2 bg-clin-blue hover:bg-clin-blue-dark shadow-md shadow-clin-blue/20">
            <FileUp size={18} /> Select Excel / CSV File
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onClick={(e) => { e.target.value = null; }} onChange={handleExcelUpload} />
          </label>
          <span className="text-xs font-medium text-slate-500">Existing records with matching Certificate Numbers will be automatically updated.</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Current Records ({safeCertificates.length})</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search certificates..."
            className="input-field flex-1 sm:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {safeCertificates.length > 0 && (
            <button onClick={clearAll} className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200">
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Cert Number</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Date of Issue</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-500 italic">
                    {safeCertificates.length === 0 ? "No certificates found. Upload an Excel/CSV file to get started." : "No records match your search."}
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-bold text-clin-blue">{cert["Certificate Number"] || "N/A"}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{cert["Name"] || "N/A"}</td>
                    <td className="px-5 py-3 text-slate-600">{cert["Course"] || "N/A"}</td>
                    <td className="px-5 py-3 text-slate-600">{cert["Date of Issue"] || cert["Date of issue"] || cert["Details"] || "N/A"}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => deleteCert(cert["Certificate Number"])} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminSettingsTab({ content, setContent, showToast }) {
  function save(e) {
    e.preventDefault();
    showToast("Settings saved!");
  }
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Global Settings</h2>
        <p className="text-sm text-slate-500">Manage video links and other site-wide settings.</p>
      </div>
      <form onSubmit={save} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${storageEnabled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
          PostgreSQL database: {storageEnabled ? "Connected via Express API backend" : "Not configured yet. Using browser storage until DATABASE_URL is added."}
        </div>
        <TextField label="Background Hero Video YouTube ID or URL" value={content.heroVideoId || ""} onChange={heroVideoId => setContent({ ...content, heroVideoId })} required />
        <TextField label="Footer YouTube Channel URL" value={content.footerYoutube || ""} onChange={footerYoutube => setContent({ ...content, footerYoutube })} />
        <TextField label="Footer Instagram URL" value={content.footerInstagram || ""} onChange={footerInstagram => setContent({ ...content, footerInstagram })} />
        <TextField label="Footer Facebook URL" value={content.footerFacebook || ""} onChange={footerFacebook => setContent({ ...content, footerFacebook })} />
        <TextField label="WhatsApp Number" value={content.whatsappNumber || ""} onChange={whatsappNumber => setContent({ ...content, whatsappNumber })} />
        <TextField label="Footer Address" value={content.footerAddress || ""} onChange={footerAddress => setContent({ ...content, footerAddress })} required />
        <TextField label="Team Marquee Speed (seconds)" value={content.teamMarqueeSpeed || ""} onChange={teamMarqueeSpeed => setContent({ ...content, teamMarqueeSpeed })} />
        <div className="border-t border-slate-200 pt-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Academic Focus Section</h3>
          <div className="space-y-4">
            <TextField label="Academic Focus & Sandbox Title" value={content.academicFocusTitle || ""} onChange={academicFocusTitle => setContent({ ...content, academicFocusTitle })} required />
            <RichTextEditor label="Academic Focus & Sandbox Subtitle" value={content.academicFocusSubtitle || ""} onChange={v => setContent({ ...content, academicFocusSubtitle: v })} />
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={16} /> Save Settings</button>
        </div>
      </form>
    </div>
  );
}

export function AdminPage({ adminUser, setAdminUser, teamMembers, setTeamMembers, siteContent, setSiteContent, careerListings, setCareerListings, documents, setDocuments, affiliatedInstitutes, setAffiliatedInstitutes, directors, setDirectors, certificates, setCertificates }) {
  const navigate = useNavigate();

  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  const [activeTab, setActiveTab] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleLogout() {
    sessionStorage.removeItem(storageKeys.admin);
    setAdminUser(false);
    navigate("/");
  }

  const sidebarLinks = [
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "features", label: "Features", icon: CircleCheck },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "videos", label: "Videos", icon: Play },
    { id: "careers", label: "Careers", icon: BriefcaseBusiness },
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "directors", label: "Directors", icon: Users },
    { id: "team", label: "Our Team", icon: Users },
    { id: "documents", label: "Documents & PDFs", icon: FileUp },
    { id: "affiliated", label: "Affiliated Institutes", icon: Building2 },
    { id: "certificates", label: "Certificates", icon: BadgeCheck },
    { id: "settings", label: "Global Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <SEO title="Admin Console | Clinformatiq" description="Clinformatiq Management Dashboard" canonicalUrl="https://www.clinformatiq.com/admin" />
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <Logo compact />
          <span className="text-sm font-extrabold text-clin-blue">Admin Portal</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setSidebarOpen(false); }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${activeTab === link.id
                  ? "bg-clin-blue text-white shadow-md shadow-clin-blue/25"
                  : "text-slate-600 hover:bg-slate-50 hover:text-clin-blue"
                  }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-3 py-4">
          <Link to="/" className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-clin-green transition">
            <ExternalLink size={18} /> View Site
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-extrabold text-slate-800">
            {sidebarLinks.find(l => l.id === activeTab)?.label || "Dashboard"}
          </h1>
        </header>

        {toast && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-sm">
            <CircleCheck size={18} /> {toast}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "hero" && <AdminHeroTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "features" && <AdminFeaturesTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "metrics" && <AdminMetricsTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "videos" && <AdminVideosTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "careers" && <AdminCareersTab careers={careerListings} setCareers={setCareerListings} showToast={showToast} />}
          {activeTab === "courses" && <AdminCoursesTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "directors" && <AdminDirectorsTab directors={directors} setDirectors={setDirectors} showToast={showToast} />}
          {activeTab === "team" && <AdminTeamTab teamMembers={teamMembers} setTeamMembers={setTeamMembers} showToast={showToast} />}
          {activeTab === "documents" && <AdminDocumentsTab documents={documents} setDocuments={setDocuments} showToast={showToast} />}
          {activeTab === "affiliated" && <AdminAffiliatedTab affiliatedInstitutes={affiliatedInstitutes} setAffiliatedInstitutes={setAffiliatedInstitutes} content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "certificates" && <AdminCertificatesTab certificates={certificates} setCertificates={setCertificates} showToast={showToast} />}
          {activeTab === "settings" && <AdminSettingsTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

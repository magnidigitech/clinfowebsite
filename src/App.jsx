import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  Eye,
  EyeOff,
  ExternalLink,
  FileUp,
  Globe2,
  GraduationCap,
  Home,
  LayoutDashboard,
  Linkedin,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MonitorCheck,
  Pencil,
  Play,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { storageEnabled, loadSiteState, saveSiteState, uploadFileToStorage, uploadCoursePDF, deleteCoursePDF } from "./supabaseStore";
import * as XLSX from "xlsx";

const storageKeys = {
  students: "clinformatiq_web_students",
  trainers: "clinformatiq_web_trainers",
  jobs: "clinformatiq_web_jobs",
  content: "clinformatiq_site_content",
  admin: "clinformatiq_admin_session",
  team: "clinformatiq_web_team",
  careers: "clinformatiq_web_careers",
  documents: "clinformatiq_web_documents",
  affiliated: "clinformatiq_web_affiliated",
};

const userReviews = [
  { author: "Sivaram Veedulana", rating: 5, date: "4 months ago", text: "I joined the CDM course at Clinformatiq and overall it was a good experience. The training was easy to follow and included both theory and practical sessions, which helped in understanding the basics clearly. The trainers explained concepts patiently and gave hands-on practice, which was useful. Support and guidance were provided throughout the course, especially for understanding the CDM process and career path. Overall, it’s a good option for anyone who wants to start a career in Clinical Data Management. Thanks to the Clinformatiq team for the support." },
  { author: "madhuri", rating: 5, date: "5 months ago", text: "I completed the Clinical Data Management course at Clinformatiq, and it was an excellent learning experience. The trainers explained CDM concepts, CRF design, SDTM basics, and real-time clinical trial workflows very clearly. The sessions were practical and industry-oriented, which helped me understand how clinical data is handled in real projects. Clinformatiq is a great institute for anyone looking to start a career in Clinical Data Management." },
  { author: "Bhushan Nedunuri", rating: 5, date: "4 months ago", text: "Clinformatiq is one of the best institutes for Pharmacovigilance (PV) training. I enrolled in the PV course at Clinformatiq, where the professional training team provided structured theory and practical training with real-time examples, which was very helpful. Abhishikth Sir guided me throughout the course, clarified doubts, and supported me with proper career guidance, which made a big difference in understanding the PV domain and planning my career path. This course is very useful for anyone looking to build a career in Pharmacovigilance. I strongly recommend Clinformatiq for PV course and Pharmacovigilance training. Thank you Abhishikth Sir and the Clinformatiq team for the valuable guidance and support." },
  { author: "uday raj", rating: 5, date: "5 months ago", text: "The Clinical SAS training at Clinformatiq is very practical and job-oriented. The trainer covered Base SAS, Clinical SAS concepts, CDISC standards (SDTM & ADaM), TFLs, and real clinical datasets. The teaching style is beginner-friendly and interview-focused. I strongly recommend Clinformatiq for students aiming for a career in Clinical SAS programming." },
  { author: "praneeth rick", rating: 5, date: "5 months ago", text: "I completed my Clinical Data Management (CDM) course with Clinformatiq and it was a very good experience. The trainers explained each topic clearly and helped with doubts. They also guide students with career support and job leads. One of the best clinical research institutes." },
  { author: "Navyanelluri4@gmail.com Nelluri", rating: 5, date: "5 months ago", text: "Clinformatiq Institute provides in-depth SAS Clinical training with a strong focus on real-world clinical data and practical learning. The trainers explain every concept clearly and patiently, making even complex topics easy to understand. It is the best coaching institute for building confidence and skills needed for a successful clinical SAS career." },
  { author: "Sainath Rathod", rating: 5, date: "8 months ago", text: "I had a wonderful experience with Clinformatiq. The training in Clinical Data Management was highly informative, well-structured, and practical. I gained valuable knowledge and hands-on experience that boosted my confidence in the field. I had clear concepts and I'm truly happy that I joined Clinformatiq, and I would recommend it to anyone looking to build a strong foundation in Clinical Data Management." },
  { author: "Rajesh Buddha", rating: 5, date: "4 months ago", text: "Great Clinical SAS course, The Clinical SAS course at Clinformatiq was really helpful. The trainers explained concepts clearly and the hands-on practice made it easy to understand. Good for anyone starting a career in Clinical SAS." },
  { author: "KURIMILLA VINODKUMAR", rating: 5, date: "8 months ago", text: "The training session on Clinical Research and Clinical Data Management was thorough and well-structured, covering foundational concepts as well as advanced industry standards and best practices. Each module blended theoretical knowledge with practical insights, helping participants develop essential skills in using Electronic Data Capture (EDC) systems, data integrity, quality control, and regulatory compliance. The hands-on approach, including live project allocations and mock interviews, greatly enhanced real-world readiness for a career in this field. Sessions on diverse topics like regulatory frameworks, Castor EDC programming for clinical data, and roles within clinical research offered valuable breadth and depth. The faculty demonstrated deep expertise and provided clear guidance on data management processes from initial setup to project closeout. Overall, this course delivered a comprehensive, engaging, and practical learning experience highly recommended for aspiring professionals in clinical research and data management." },
  { author: "Saranya K", rating: 5, date: "5 months ago", text: "I have completed my CDM course in Clinformatiq. i have learned theory as well practicals during the session. trainers was very humble and clearly explained my doubts. i would recommend clinformatiq institute for CDM Course." },
  { author: "D Janvitha Reddy", rating: 5, date: "9 months ago", text: "I have completed CDM training from Clinformatiq. The sessions were clear, well-structured, and very helpful for understanding the concepts. Overall, it was a good learning experience and I would recommend it." },
  { author: "Sanika Sarpotdar", rating: 5, date: "9 months ago", text: "I had a great CDM class experience at clinformatiq, I had completed my cdm training from this institute. They offer detailed and practical training, recommended for freshers." },
  { author: "Morla Padma sai sree", rating: 5, date: "5 months ago", text: "I had a very positive learning experience with clinformatiq.the training classes for clinical data management and pharmacaovigilence were well organized, informative,and industry -oriented.the trainers explained concepts very clearly with practical examples,which helped me understand real-world structured course content significantly improved my knowledge and confidence in both domains.overall, Clinformatq provides excellent training for anyone looking to build a strong foundation and pursue a career in clinical data management and pharmacaovigilence" },
  { author: "Garima Yadav", rating: 5, date: "8 months ago", text: "It has been a great experience with Clinformatiq and their faculty. The CDM training was well-structured and informative. Thank you very much." },
  { author: "Bharath Srinivas", rating: 5, date: "9 months ago", text: "Clinformatiq offer real-time tool coaching to Pharma students. They give importance to practical approach so that students can gain indepth knowledge." },
  { author: "Abhilash Rathore", rating: 5, date: "9 months ago", text: "Enrolling in the CDM course at Clinformatiq was a great choice. It helped me understand the end to end process of CDM. It helped me gain clarity of the CDM pipeline. Many thanks!!" },
  { author: "trupti londhe", rating: 5, date: "9 months ago", text: "I had completed CDM course from Clinformatiq and It's very informative ." },
  { author: "Ruchitha KB", rating: 5, date: "a month ago", text: "I recently completed the Clinical Data Management course, and it was a great learning experience. The concepts were explained with excellent clarity, making it very easy for freshers to understand. Any queries were addressed promptly and clearly. A special thanks to Jamuna ma’am for her guidance and support throughout the course. Overall, it’s a highly useful course for anyone looking to start a career in clinical data management." }
];

const defaultSiteContent = {
  heroVideoId: "Q4I043_ZtRA",
  footerYoutube: "https://www.youtube.com/@clinformatiq",
  footerInstagram: "https://www.instagram.com/clinformatiq",
  footerFacebook: "https://www.facebook.com/clinformatiq",
  whatsappNumber: "+919010855577",
  footerAddress: "Address: 5th Floor D, No.1-6-2, Maruthi Nagar, Guntur, Andhra Pradesh 522006",
  academicFocusTitle: "Academic Focus & Clinical Sandbox",
  academicFocusSubtitle: "Professional training standards optimized for biotechnology, pharmaceuticals, and software validation pipelines.",
  hero: {
    tag: "Clinical Analytics Curriculum",
    title: "Launch Your Clinical Career",
    subtitle:
      "Accelerate your clinical learning path. Learn directly from field practitioners using curriculum models backed by global compliance mandates and clinical software workflows.",
    cta1Text: "Start Your Journey",
    cta2Text: "Schedule Consultation",
  },
  videos: [
    {
      id: "sas",
      label: "01. SAS Intro",
      title: "Clinical SAS Programming",
      meta: "Watch clinical SAS reference on YouTube",
      videoId: "5Un72EhNUa0",
    },
    {
      id: "sdtm",
      label: "02. SDTM Standards",
      title: "CDISC SDTM Standards",
      meta: "Watch SDTM fundamentals on YouTube",
      videoId: "iDJ1OYSSrD8",
    },
    {
      id: "gcp",
      label: "03. GCP Audits",
      title: "GCP Audit Readiness",
      meta: "Watch clinical research GCP reference on YouTube",
      videoId: "kkElB0iDbZU",
    },
  ],
  metrics: [
    { value: "5,000+", label: "Trained Professionals" },
    { value: "98%", label: "Career Transition Rate" },
    { value: "150+", label: "Active Global Hiring Partners" },
    { value: "12+", label: "Specialized Learning Modules" },
  ],
  features: [
    {
      title: "Unsure about your career? I found Clinformatiq",
      description:
        "Based on current market trends and individual career aspirations, Clinformatiq's expert counsellors collaborate with students to identify and select the most suitable courses within the healthcare and clinical research domain.",
    },
    {
      title: "Hey, I am Industry-Ready",
      description:
        "Students will receive comprehensive, hands-on practical training specifically designed to equip them with real-world skills. This training uses actual testcase scenarios and workflows, enabling students to gain direct exposure to healthcare tools.",
    },
    {
      title: "Polishing My Resume",
      description:
        "Clinformatiq's expert counsellors are helping me build a strong, industry-focused resume that showcases my training in clinical and healthcare domains.",
    },
    {
      title: "Mock Today, Rock Tomorrow",
      description:
        "Clinformatiq prepares students for real-world job interviews through structured mock interview sessions and focused communication skill development, using curated question banks tailored to the healthcare and clinical research industry.",
    },
    {
      title: "Trained, Tested, Hired!",
      description:
        "With the right guidance and skill development, I successfully secured a role aligned with my career goals in the healthcare industry.",
    },
  ],
  courses: [
    {
      id: "cr",
      name: "Clinical Research",
      duration: "1 month",
      skills: "Clinical Trials, Protocol Design, GCP, ICH Guidelines",
      body: "A detailed introduction covering clinical trials planning, protocol design, ethics committee approvals, and international GCP and ICH regulations.",
    },
    {
      id: "cdm",
      name: "Clinical Data Management",
      duration: "1 month",
      skills: "CRF Design, EDC Systems, Query Management, CDISC Standards",
      body: "Focuses on verifying clinical database design, EDC setups, edit check scripts, CRF formatting, database locks, and audit-ready filing.",
    },
    {
      id: "pv",
      name: "Pharmacovigilance",
      duration: "1 month",
      skills: "Drug Safety Monitoring, MedDRA Coding, Case Processing, Signal Detection",
      body: "Covers post-marketing safety checks, adverse event reporting, MedDRA dictionary encoding, case narratives, and clinical signal detection.",
    },
    {
      id: "mc",
      name: "Medical Coding",
      duration: "1 month",
      skills: "ICD-10, CPT, HCPCS Coding, Claims Review",
      body: "Learn healthcare terminology codes to classify diagnoses, physician procedures, medical treatments, and clinical bills.",
    },
    {
      id: "ra",
      name: "Regulatory Affairs",
      duration: "1 month",
      skills: "Regulatory Submissions, IND/NDA, Compliance, FDA/EMA Guidelines",
      body: "Covers global dossier submissions for marketing approvals, FDA/EMA guidelines, eCTD setups, and medical labels.",
    },
    {
      id: "cs",
      name: "Clinical SAS",
      duration: "3 months",
      skills: "SAS Programming, Data Cleaning, TFLs, CDISC (SDTM/ADaM)",
      body: "Professional analytics using SAS programming tools, dataset modifications, TFL generation, and CDISC standards.",
    },
    {
      id: "rp",
      name: "R Programming",
      duration: "3 months",
      skills: "Data Visualization, Statistical Modeling & Computing",
      body: "Modern biostatistical computing, graph formatting, ggplot2 packages, and statistical model assessments for clinical researchers.",
    },
    {
      id: "pb",
      name: "Power BI",
      duration: "2 months",
      skills: "DAX Formulas, Interactive Dashboards, Data Modeling, Report Automation",
      body: "A hands-on pathway teaching interactive reports, clinical dashboards, safety metrics automation, and DAX data modeling.",
    },
    {
      id: "qa",
      name: "Data Validation / QC / QA",
      duration: "1 month",
      skills: "Source Verification, Quality Audits, SOP Compliance, GxP Data Integrity",
      body: "Focuses on verifying clinical data quality, regulatory compliance, and process consistency through audits and SOP compliance checks.",
    },
  ],
  testimonials: [
    {
      quote:
        "The R and SAS cohorts gave me the exact data cleaning and SDTM mapping skills CROs require.",
      author: "Priya Sharma",
      role: "Clinical Data Analyst, IQVIA",
    },
    {
      quote:
        "The hands-on sandbox labs made all the difference. I processed real safety cases under global audit workflows.",
      author: "Rajesh Varma",
      role: "Safety Specialist, Cognizant",
    },
    {
      quote:
        "Learning EDC setup and query workflow directly from an active trial lead helped me through technical interviews.",
      author: "Dr. Anjali Mehta",
      role: "Associate CDM Lead, Novartis",
    },
  ],
  faqs: [
    {
      question: "What background is required for Clinical SAS?",
      answer:
        "Life Sciences, Biotechnology, Pharmacy, Medicine, or Statistics backgrounds are ideal. The curriculum starts from foundations and scales to SDTM/ADaM workflows.",
    },
    {
      question: "Are your cohorts live or self-paced?",
      answer:
        "Cohorts are led live by active industry practitioners with interactive lectures, sandbox labs, and portfolio support.",
    },
    {
      question: "How does placement referral work?",
      answer:
        "Graduates who pass GxP competency evaluations are referred to hiring partners with portfolio evaluations.",
    },
  ],
  cta: {
    title: "Ready to Launch Your Career?",
    description:
      "Be among the first to join our innovative clinical training programs and shape the future of healthcare technology.",
  },
};

const defaultCareers = [
  {
    id: "career_sas_lead",
    role: "Clinical SAS Analytics Lead",
    location: "Hyderabad, India",
    type: "Full-Time Role",
    category: "programming",
  },
  {
    id: "career_cdm_manager",
    role: "Senior Clinical Data Manager",
    location: "Remote (India)",
    type: "Contract / Flexible",
    category: "clinical",
  },
  {
    id: "career_pv_auditor",
    role: "Pharmacovigilance Quality Auditor",
    location: "Bangalore, India",
    type: "Full-Time Role",
    category: "clinical",
  },
];

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function mergeSiteContent(saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaultSiteContent;
  return {
    ...defaultSiteContent,
    ...saved,
    hero: { ...defaultSiteContent.hero, ...(saved.hero || {}) },
    cta: { ...defaultSiteContent.cta, ...(saved.cta || {}) },
    metrics: Array.isArray(saved.metrics) ? saved.metrics : defaultSiteContent.metrics,
    features: Array.isArray(saved.features) ? saved.features : defaultSiteContent.features,
    courses: Array.isArray(saved.courses) ? saved.courses : defaultSiteContent.courses,
    testimonials: Array.isArray(saved.testimonials) ? saved.testimonials : defaultSiteContent.testimonials,
    faqs: Array.isArray(saved.faqs) ? saved.faqs : defaultSiteContent.faqs,
    videos: Array.isArray(saved.videos) && saved.videos.length ? saved.videos : defaultSiteContent.videos,
  };
}

function getYoutubeId(value, fallback = "Q4I043_ZtRA") {
  const text = String(value || "").trim();
  if (!text) return fallback;
  const match = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match?.[1] || text;
}

function Logo({ compact = false }) {
  return (
    <img
      src="/clinformatiq-logo.png"
      alt="Clinformatiq - Uniting Science with Clinical Tech"
      className={`block object-cover object-center ${compact ? "h-[50px] w-[160px]" : "h-[60px] sm:h-[70px] lg:h-[80px] w-[200px] sm:w-[240px] lg:w-[280px]"}`}
    />
  );
}

function App() {
  const [route, setRoute] = useState(() => parseRoute());
  // Site content fields: Supabase is the ONLY source of truth. Defaults are just placeholders while loading.
  const [siteContent, setSiteContent] = useState(() => defaultSiteContent);
  const [students, setStudents] = useState(() => readJson(storageKeys.students, []));
  const [trainers, setTrainers] = useState(() => readJson(storageKeys.trainers, []));
  const [jobApplications, setJobApplications] = useState(() => []);
  const [studentUser, setStudentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(() => sessionStorage.getItem(storageKeys.admin) === "true");
  const [teamMembers, setTeamMembers] = useState(() => []);
  const [careerListings, setCareerListings] = useState(() => defaultCareers);
  const [documents, setDocuments] = useState(() => []);
  const [affiliatedInstitutes, setAffiliatedInstitutes] = useState(() => []);
  const [certificates, setCertificates] = useState(() => []);
  const [directors, setDirectors] = useState(() => []);
  const [remoteReady, setRemoteReady] = useState(!storageEnabled);
  const hasMountedSupabase = useRef(false);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Load site state from Supabase on mount — this is the ONLY place data comes from
  useEffect(() => {
    if (!storageEnabled) return;
    loadSiteState()
      .then((state) => {
        if (!state) return;
        if (state.siteContent) setSiteContent(mergeSiteContent(state.siteContent));
        if (Array.isArray(state.careerListings)) setCareerListings(state.careerListings);
        if (Array.isArray(state.teamMembers)) setTeamMembers(state.teamMembers);
        if (Array.isArray(state.jobApplications)) setJobApplications(state.jobApplications);
        if (Array.isArray(state.documents)) setDocuments(state.documents);
        if (Array.isArray(state.affiliatedInstitutes)) setAffiliatedInstitutes(state.affiliatedInstitutes);
        if (Array.isArray(state.certificates)) setCertificates(state.certificates);
        if (Array.isArray(state.directors)) setDirectors(state.directors);
      })
      .catch((error) => console.warn(error.message))
      .finally(() => {
        hasMountedSupabase.current = true;
        setRemoteReady(true);
      });
  }, []);

  // Only keep localStorage for student/trainer form submissions (not site content)
  useEffect(() => localStorage.setItem(storageKeys.students, JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem(storageKeys.trainers, JSON.stringify(trainers)), [trainers]);

  // Auto-save to Supabase ONLY when admin is logged in AND data has loaded from Supabase first
  useEffect(() => {
    if (!storageEnabled || !adminUser || !hasMountedSupabase.current) return;
    saveSiteState({ siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors, certificates })
      .catch((error) => console.warn(error.message));
  }, [adminUser, siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors, certificates]);

  const page = useMemo(() => {
    const props = {
      siteContent,
      setSiteContent,
      students,
      setStudents,
      trainers,
      setTrainers,
      jobApplications,
      setJobApplications,
      studentUser,
      setStudentUser,
      adminUser,
      setAdminUser,
      teamMembers,
      setTeamMembers,
      careerListings,
      setCareerListings,
      documents,
      setDocuments,
      affiliatedInstitutes,
      setAffiliatedInstitutes,
      directors,
      setDirectors,
      certificates,
      setCertificates,
    };

    if (route.name === "not-found") return <NotFoundPage />;
    if (route.name === "courses") return <CoursesPage content={siteContent} />;
    if (route.name === "team") return <OurTeam teamMembers={teamMembers} directors={directors} siteContent={siteContent} />;
    if (route.name === "careers") return <CareersPage {...props} />;
    if (route.name === "student-reg") return <StudentRegistration {...props} selectedCourse={route.params.get("course") || ""} />;
    if (route.name === "verify-certificate") return <VerifyCertificatePage certificates={certificates} content={siteContent} />;
    if (route.name === "affiliated-institutes") return <AffiliatedInstitutesPage affiliatedInstitutes={affiliatedInstitutes} content={siteContent} />;
    if (route.name === "login") return <LoginPage {...props} />;
    if (route.name === "corporate-training") return <CorporateTrainingPage content={siteContent} />;
    if (route.name === "dashboard") return <Dashboard studentUser={studentUser} />;
    if (route.name === "admin") return <AdminPage {...props} />;
    return <HomePage content={siteContent} />;
  }, [route, siteContent, students, trainers, jobApplications, studentUser, adminUser, teamMembers, careerListings, documents, affiliatedInstitutes, directors, certificates]);

  const isAdmin = route.name === "admin";

  if (isAdmin) {
    return page;
  }

  // Show loading screen while Supabase data is being fetched
  if (!remoteReady && storageEnabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <img src="/clinformatiq-logo.png" alt="Clinformatiq" className="h-16 mb-6 animate-pulse" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeRoute={route.name} />
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 py-10 sm:px-6">{page}</main>
      <Footer content={siteContent} />
      {siteContent.whatsappNumber && (
        <a
          href={`https://wa.me/${siteContent.whatsappNumber.replace(/[^0-9+]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.002 0C7.172 0 0 7.172 0 16.002c0 2.802.735 5.518 2.133 7.93l-2.074 7.575 7.747-2.031c2.316 1.258 4.887 1.921 7.536 1.922h.005c8.828 0 16.002-7.174 16.002-16.004S24.832 0 16.002 0zm0 28.718h-.003c-2.368-.002-4.697-.638-6.73-1.845l-.482-.286-5.006 1.312 1.334-4.88-.314-.498A13.267 13.267 0 012.72 16.002C2.72 8.675 8.68 2.718 16.004 2.718c3.553 0 6.892 1.385 9.404 3.899 2.51 2.513 3.893 5.852 3.893 9.404-.002 7.329-5.96 13.287-13.298 13.297zm7.291-9.972c-.398-.2-2.368-1.168-2.735-1.302-.365-.133-.632-.2-.899.2s-1.033 1.302-1.266 1.568c-.233.268-.466.302-.866.1-.398-.2-1.688-.622-3.218-1.986-1.192-1.062-1.996-2.374-2.23-2.774-.234-.4-.026-.618.174-.816.18-.18.398-.466.598-.7.2-.234.266-.398.398-.666.134-.268.066-.5-.034-.7s-.899-2.168-1.233-2.968c-.324-.778-.654-.672-.899-.684-.233-.01-.5-.01-.766-.01s-.699.1-1.066.5c-.366.4-1.398 1.368-1.398 3.338s1.432 3.87 1.632 4.138c.2.268 2.82 4.306 6.832 6.038 3.308 1.43 4.01.8 4.676.732.666-.068 2.133-.87 2.433-1.704.3-.834.3-1.55.2-1.702-.1-.15-.366-.25-.766-.45z" />
          </svg>
        </a>
      )}
    </div>
  );
}

function NotFoundPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.replace("/#/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fade-up flex min-h-[65vh] flex-col items-center justify-center text-center px-4 py-12">
      <div className="relative mb-6 grid h-28 w-28 place-items-center rounded-full bg-red-50 text-red-500 border border-red-100 shadow-inner">
        <span className="text-4xl font-black tracking-tighter">404</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Page Not Found</h1>
      <p className="max-w-md text-slate-600 mb-8 text-base font-medium">
        The address you entered (<code className="bg-slate-100 px-2.5 py-1 rounded-md text-clin-blue font-bold text-sm border border-slate-200">{window.location.pathname !== "/" && window.location.pathname !== "/index.html" ? window.location.pathname : window.location.hash}</code>) does not exist on Clinformatiq.
      </p>
      
      <div className="mb-8 flex flex-col items-center gap-1.5 bg-gradient-to-br from-cyan-50/80 to-emerald-50/80 p-6 rounded-2xl border border-cyan-100 shadow-md max-w-xs w-full">
        <div className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Redirecting to Main Page in</div>
        <div className="text-4xl font-black text-clin-blue animate-pulse">{countdown}s</div>
      </div>

      <button
        onClick={() => window.location.replace("/#/")}
        className="btn-primary bg-clin-blue hover:bg-clin-blue-dark flex items-center gap-2 shadow-xl shadow-clin-blue/25 px-8 py-4 text-base font-bold transition-all hover:scale-105 cursor-pointer"
      >
        <Home size={20} /> Go to Main Page Now
      </button>
    </div>
  );
}

function parseRoute() {
  const pathname = window.location.pathname;
  if (pathname !== "/" && pathname !== "/index.html") {
    return { name: "not-found", params: new URLSearchParams() };
  }

  const hash = window.location.hash || "#/";
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  
  const validPrefixes = [
    "courses", "team", "careers", "student-reg", 
    "verify-certificate", "affiliated-institutes", 
    "login", "dashboard", "admin", "corporate-training"
  ];

  if (path !== "" && !validPrefixes.some(prefix => path.startsWith(prefix))) {
    return { name: "not-found", params: new URLSearchParams(query) };
  }

  const name =
    path.startsWith("courses") ? "courses" :
    path.startsWith("team") ? "team" :
    path.startsWith("careers") ? "careers" :
    path.startsWith("student-reg") ? "student-reg" :
    path.startsWith("verify-certificate") ? "verify-certificate" :
    path.startsWith("affiliated-institutes") ? "affiliated-institutes" :
    path.startsWith("login") ? "login" :
    path.startsWith("dashboard") ? "dashboard" :
    path.startsWith("admin") ? "admin" :
    path.startsWith("corporate-training") ? "corporate-training" :
    "home";
  return { name, params: new URLSearchParams(query) };
}

function Header({ activeRoute }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = [
    ["home", "#/", "Home"],
    ["courses", "#/courses", "Our Courses"],
    ["corporate-training", "#/corporate-training", "Corporate Training"],
    ["team", "#/team", "Our Team"],
    ["careers", "#/careers", "Careers"],
    ["student-reg", "#/student-reg", "Student Registration"],
    ["affiliated-institutes", "#/affiliated-institutes", "Our Affiliated Institutes"],
    ["verify-certificate", "#/verify-certificate", "Verify Certificate"],
  ];

  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 h-auto min-h-[80px] lg:h-[110px] w-[calc(100%-1rem)] sm:w-[calc(100%-5rem)] xl:w-[calc(100%-9.5rem)] max-w-[1750px] overflow-visible rounded-[10px] border border-white bg-white/95 shadow-md shadow-teal-900/10 transition-all">
      <div className="flex h-full flex-col lg:flex-row lg:items-center lg:justify-between px-4 py-4 sm:px-6 lg:px-11 lg:py-0">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <a href="#/" aria-label="Clinformatiq home" className="flex shrink-0 items-center overflow-hidden rounded">
            <Logo />
          </a>
          <div className="flex items-center gap-3 lg:hidden">
            <a href="#/login" className="btn-primary btn-small rounded-lg px-4 py-2 text-sm font-semibold">
              Login
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600" aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        <nav className={`${mobileMenuOpen ? "flex" : "hidden"} mt-4 flex-col gap-4 pb-4 lg:pb-0 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-x-3 xl:gap-x-5 text-sm font-semibold text-slate-600`}>
          {links.map(([key, href, label]) => {
            // Shorten some labels to fit the header
            let displayLabel = label;
            if (label === "Our Courses") displayLabel = "Courses";
            if (label === "Our Affiliated Institutes") displayLabel = "Affiliated Institutes";
            
            return (
              <a key={key} href={href} onClick={() => setMobileMenuOpen(false)} className={`whitespace-nowrap border-b-2 py-2 lg:py-1 transition ${activeRoute === key ? "border-clin-green text-clin-green" : "border-transparent hover:border-clin-green/40 hover:text-clin-green"}`}>
                {displayLabel}
              </a>
            );
          })}
          <a href="#/login" className="hidden lg:inline-flex btn-primary btn-small rounded-lg px-5 py-2.5 text-sm font-semibold lg:px-6">
            LMS Login
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer({ content }) {
  const defaultMsg = "No content available. Please contact admin.";
  const footerAddress = stripAddressLabel(content?.footerAddress || defaultMsg);
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white px-5 py-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <a href="#/" className="mb-4 inline-flex"><Logo compact /></a>
          <p className="max-w-sm text-sm text-slate-500">
            Providing industry-leading, expert-designed clinical research and technical computing curriculum cohorts.
          </p>
        </div>
        <FooterList title="Menu Links" items={[["Home", "#/"], ["Our Courses", "#/courses"], ["Corporate Training", "#/corporate-training"], ["Careers", "#/careers"], ["Register", "#/student-reg"]]} />
        <FooterList title="Contact Info" items={[["Call: +91 90108 55577", "tel:+919010855577"], ["info@clinformatiq.com", "mailto:info@clinformatiq.com"]]} />
        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-900">Address</h3>
          <p className="max-w-sm text-sm text-slate-500">{footerAddress}</p>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-[1400px] border-t border-slate-200 pt-6">
        <h3 className="mb-3 text-sm font-bold text-slate-900">Social Media</h3>
        <div className="flex gap-4 text-sm text-slate-500">
          {content?.footerYoutube && <a href={content.footerYoutube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Play size={16} /> YouTube</a>}
          {content?.footerInstagram && <a href={content.footerInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Instagram</a>}
          {content?.footerFacebook && <a href={content.footerFacebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Facebook</a>}
        </div>
        {!content?.footerYoutube && !content?.footerInstagram && !content?.footerFacebook && <p className="text-xs text-slate-400">{defaultMsg}</p>}
      </div>
      <div className="mx-auto mt-8 flex max-w-[1400px] flex-wrap justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400">
        <p>Copyright 2026 Clinformatiq. All rights reserved.</p>
        <p>Authorized Hostinger Deployment</p>
      </div>
    </footer>
  );
}

function stripAddressLabel(value) {
  return String(value || "").replace(/^Address:\s*/i, "");
}

function FooterList({ title, items }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-slate-900">{title}</h3>
      <ul className="grid gap-2 text-sm text-slate-500">
        {items.map(([label, href]) => <li key={label}><a href={href} className="hover:text-clin-green">{label}</a></li>)}
      </ul>
    </div>
  );
}

function HomePage({ content }) {
  const videos = content.videos?.length ? content.videos : defaultSiteContent.videos;
  const [chapter, setChapter] = useState(videos[0]?.id || "video_1");
  const [openFaq, setOpenFaq] = useState(0);
  const video = videos.find((item) => item.id === chapter) || videos[0];
  const activeVideoId = getYoutubeId(video?.videoId, defaultSiteContent.videos[0].videoId);
  const heroVideoId = getYoutubeId(content.heroVideoId);
  const icons = [Globe2, MonitorCheck, Users, ShieldCheck, GraduationCap];

  return (
    <div className="fade-up">
      <section className="relative grid items-center gap-10 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/55 p-8 shadow-2xl shadow-teal-900/10 backdrop-blur md:p-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative">
          <h1 className="text-gradient text-5xl font-extrabold leading-tight drop-shadow-sm sm:text-7xl">{content.hero.title}</h1>
          <RichTextDisplay html={content.hero.subtitle} className="mt-6 max-w-2xl text-xl leading-9 text-slate-700" />
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#/courses" className="btn-primary">{content.hero.cta1Text}<ArrowRight size={18} /></a>
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
                  <td className="px-5 py-4"><a className="btn-primary btn-small" href={`#/student-reg?course=${encodeURIComponent(course.name)}`}>Enroll</a></td>
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
          <a href="#/courses" className="btn-primary bg-clin-blue hover:bg-clin-blue-dark">Start Your Journey</a>
          <a href="https://wa.me/+919010855577" target="_blank" rel="noreferrer" className="btn-secondary">Schedule Consultation</a>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mx-auto mb-10 mt-16 max-w-2xl text-center">
      <h2 className="text-gradient text-4xl font-extrabold">{title}</h2>
      <RichTextDisplay html={subtitle} className="mt-3 text-slate-600" />
    </div>
  );
}

function CoursesPage({ content }) {
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
              <a href={`#/student-reg?course=${encodeURIComponent(course.name)}`} className="btn-primary btn-small">Enroll Cohort</a>
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

function StudentRegistration({ siteContent, selectedCourse, setStudents }) {
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", username: "", phone: "", email: "", courses: selectedCourse ? [selectedCourse] : [], pass: "", confirm: "" });

  function toggleCourse(courseName) {
    setForm((current) => {
      const courses = current.courses.includes(courseName)
        ? current.courses.filter((name) => name !== courseName)
        : [...current.courses, courseName];
      return { ...current, courses };
    });
  }

  function submit(event) {
    event.preventDefault();
    if (form.courses.length === 0) {
      setStatus({ type: "error", text: "Please select at least one specialized path before completing registration." });
      return;
    }
    if (form.pass !== form.confirm) {
      setStatus({ type: "error", text: "Registration passwords do not match. Please verify your entry." });
      return;
    }
    setStudents((items) => [
      ...items,
      {
        id: `st_${Date.now()}`,
        name: `${form.first} ${form.last}`,
        username: form.username,
        phone: form.phone,
        email: form.email,
        course: form.courses.join(", "),
        courses: form.courses,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setStatus({ type: "success", text: "Enrollment complete. Use student / student to log into the LMS panel simulator." });
  }

  if (status?.type === "success") return <SuccessPanel title="Enrollment Complete!" text={status.text} />;

  return (
    <FormShell title="Student Enrollment Form" subtitle="Replicating Tutor LMS student registration layout credentials">
      <form onSubmit={submit} className="panel grid gap-4 p-6 sm:p-8">
        {status?.type === "error" && <div className="alert-error">{status.text}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="First Name" value={form.first} onChange={(first) => setForm({ ...form, first })} required />
          <TextField label="Last Name" value={form.last} onChange={(last) => setForm({ ...form, last })} required />
          <TextField label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
        </div>
        <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <fieldset>
          <legend className="form-label">Specialized Path Choice</legend>
          <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
            {siteContent.courses.map((course) => (
              <label key={course.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-clin-green/30 hover:bg-clin-green/5">
                <input
                  type="checkbox"
                  className="size-4 accent-clin-green"
                  checked={form.courses.includes(course.name)}
                  onChange={() => toggleCourse(course.name)}
                />
                <span>{course.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Password" type="password" value={form.pass} onChange={(pass) => setForm({ ...form, pass })} required />
          <TextField label="Confirm Password" type="password" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} required />
        </div>
        <button className="btn-primary mt-2" type="submit">Complete Registration</button>
      </form>
    </FormShell>
  );
}

function InstructorRegistration({ setTrainers }) {
  const [fileName, setFileName] = useState("");
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", experience: "", specialty: "" });

  function submit(event) {
    event.preventDefault();
    setTrainers((items) => [...items, { id: `ins_${Date.now()}`, ...form, timestamp: new Date().toLocaleString() }]);
    setComplete(true);
  }

  if (complete) return <SuccessPanel title="Trainer Application Received!" text="Our academic coordinator team will review your resume dossier and specialties and schedule interviews." />;

  return (
    <FormShell title="Become an Instructor" subtitle="Join Clinformatiq as a clinical cohort trainer or software mentor.">
      <form onSubmit={submit} className="panel grid gap-4 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
        </div>
        <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Years of Clinical Experience" type="number" value={form.experience} onChange={(experience) => setForm({ ...form, experience })} required />
          <TextField label="Core Clinical Specialty" value={form.specialty} onChange={(specialty) => setForm({ ...form, specialty })} required />
        </div>
        <label>
          <span className="form-label">Upload Professional Resume (PDF / DOC)</span>
          <span className="grid cursor-pointer place-items-center rounded-lg border border-dashed border-clin-green/30 bg-clin-green/5 p-7 text-center text-sm font-semibold text-slate-500">
            <FileUp className="mb-2 text-clin-green" />
            {fileName || "Choose a file or drag it here"}
            <input className="sr-only" type="file" accept=".pdf,.doc,.docx" required onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </span>
        </label>
        <button className="btn-primary mt-2 bg-clin-blue hover:bg-clin-blue-dark" type="submit">Submit Trainer Request</button>
      </form>
    </FormShell>
  );
}

function AffiliatedInstitutesPage({ affiliatedInstitutes, content }) {
  const [activeInstitute, setActiveInstitute] = useState(null);
  const institutes = Array.isArray(affiliatedInstitutes) ? affiliatedInstitutes : [];

  return (
    <section className="fade-up">
      <SectionHeader title={content?.affiliatedTitle || "Our Affiliated Institutes"} subtitle={content?.affiliatedSubtitle || "Partners committed to advancing clinical education and training through Memorandum of Understanding (MOU) agreements."} />
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        <p>🤝 <RichTextDisplay html={content?.affiliatedText || "All institutes listed below have formal MOU agreements with Clinformatiq for collaborative clinical training and professional development."} className="inline" /></p>
      </div>
      
      {institutes.length === 0 ? (
        <div className="panel p-10 text-center text-slate-500">The affiliated institutes list is currently being updated.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {institutes.map((institute) => (
            <article key={institute.id} className="panel cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition group" onClick={() => setActiveInstitute(institute)}>
              <div className="aspect-[3/2] w-full overflow-hidden bg-white p-4">
                <img src={institute.photo || institute.image} alt={institute.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  ✓ MOU CERTIFIED
                </div>
                <h3 className="text-lg font-bold text-clin-blue">{institute.name}</h3>
                {institute.city && <p className="mt-2 text-sm text-slate-600">{institute.city}</p>}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-clin-green"></span>
                  Active Partnership
                </div>
                {institute.mouPdfUrl && (
                  <a
                    href={institute.mouPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="btn-secondary btn-small mt-4 inline-flex items-center gap-2"
                  >
                    <FileUp size={14} /> View MOU
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {activeInstitute && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-5 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setActiveInstitute(null)}>
          <div className="panel w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
            <button className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 shadow-sm backdrop-blur" onClick={() => setActiveInstitute(null)}><X size={20} /></button>
            <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto bg-white p-5">
               <img src={activeInstitute.photo || activeInstitute.image} alt={activeInstitute.name} className="h-full w-full object-contain" />
            </div>
            <div className="p-8 w-full md:w-3/5 flex flex-col">
              <h2 className="text-3xl font-extrabold text-slate-900">{activeInstitute.name}</h2>
              {activeInstitute.city && <p className="mt-1 text-lg font-bold text-slate-500">{activeInstitute.city}</p>}
              <div className="mt-4 mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold w-fit text-green-700">
                ✓ MOU CERTIFIED
              </div>
              {activeInstitute.mouPdfUrl && (
                <a href={activeInstitute.mouPdfUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-small mt-3 inline-flex w-fit items-center gap-2">
                  <FileUp size={14} /> View MOU PDF
                </a>
              )}
              <h3 className="mt-4 font-bold text-clin-blue border-b border-slate-100 pb-2">Collaboration Details</h3>
              <div className="mt-4 text-slate-600 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[40vh] md:max-h-[60vh] pr-4 custom-scrollbar">
                <RichTextDisplay html={activeInstitute.description || "No collaboration description provided."} className="" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-900">Partnership Benefits</h3>
        <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Mutual curriculum development and alignment</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Joint student internship programs</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Faculty exchange and training initiatives</span></li>
          <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-clin-green flex-shrink-0"></span><span>Research collaboration opportunities</span></li>
        </ul>
      </div>
    </section>
  );
}

function CorporateTrainingPage({ content }) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    cohortSize: "10-25",
    areas: [],
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);

  const trainingAreas = [
    "Clinical Research",
    "Clinical Data Management (CDM)",
    "Pharmacovigilance",
    "Regulatory Affairs",
    "Medical Coding",
    "Clinical SAS Programming",
    "R Programming",
    "Power BI for Healthcare Analytics",
    "Quality Assurance (QA) & Quality Control (QC)",
    "Good Clinical Practice (GCP) and Regulatory Compliance",
    "Pharmacy benefit management"
  ];

  const benefits = [
    {
      title: "Tailor-Made Solutions",
      desc: "Customized learning pathways fully aligned with your organizational goals and business objectives."
    },
    {
      title: "Expert Instructors",
      desc: "Delivered by seasoned industry experts and active professionals bringing real-world wisdom."
    },
    {
      title: "Practical Learning",
      desc: "Immersive learning experiences built around actual clinical trial datasets and case scenarios."
    },
    {
      title: "Flexible Delivery",
      desc: "Accommodating schedule formats including interactive online, on-premise onsite, or hybrid cohorts."
    },
    {
      title: "Audited Assessments",
      desc: "Milestone quizzes and evaluation frameworks to ensure transparent learning metrics and KPI tracking."
    },
    {
      title: "Post-Training Support",
      desc: "Ongoing mentor guidance, refresher check-ins, and accredited certification upon cohort completion."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Collaborate & Analyze",
      desc: "We align with your operational leaders to pinpoint critical skill gaps, domain competencies, and software focus areas."
    },
    {
      num: "02",
      title: "Design & Customize",
      desc: "Our academic experts draft custom curriculum plans, selecting modules and datasets that mimic your actual workflows."
    },
    {
      num: "03",
      title: "Deliver & Practice",
      desc: "Active training combines high-fidelity virtual instruction with sandbox exercises, ensuring daily active application."
    },
    {
      num: "04",
      title: "Evaluate & Retain",
      desc: "Through final capstones, rigorous assessments, and post-cohort documentation, we guarantee maximum retention."
    }
  ];

  const targetSectors = [
    "Pharmaceutical Companies",
    "Biotechnology Organizations",
    "Contract Research Organizations (CROs)",
    "Healthcare Institutions",
    "Medical Device Companies",
    "Life Sciences Enterprises"
  ];

  const whatsappUrl = content?.whatsappNumber 
    ? `https://wa.me/${content.whatsappNumber.replace(/[^0-9+]/g, '')}`
    : "https://wa.me/+919010855577";

  function toggleArea(area) {
    setForm(prev => {
      const areas = prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.areas.length === 0) {
      setStatus({ type: "error", text: "Please select at least one training area of interest." });
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("clinformatiq_corporate_inquiries") || "[]");
      const newInquiry = {
        id: `corp_${Date.now()}`,
        ...form,
        timestamp: new Date().toLocaleString()
      };
      localStorage.setItem("clinformatiq_corporate_inquiries", JSON.stringify([...existing, newInquiry]));
      setSubmitted(true);
    } catch (err) {
      setStatus({ type: "error", text: "Failed to submit inquiry. Please try again." });
    }
  }

  if (submitted) {
    return (
      <SuccessPanel
        title="Corporate Inquiry Received!"
        text="Thank you for choosing Clinformatiq. Our academic training consultant will contact your organization representative within 24 hours to map out your custom sandbox training curriculum."
      />
    );
  }

  return (
    <div className="fade-up flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl panel bg-gradient-to-br from-white/95 via-cyan-50/40 to-emerald-50/40 py-16 px-6 sm:px-12 md:py-20 text-center flex flex-col items-center gap-6 shadow-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-clin-green/10 px-3.5 py-1 text-sm font-extrabold text-clin-green border border-clin-green/20">
          <Building2 size={16} /> CORPORATE TRAINING
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-900 max-w-3xl">
          Empower Your <span className="text-gradient">Workforce</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-medium">
          Enhance technical expertise, regulatory compliance, and operational excellence with industry-focused corporate training solutions custom-designed for life sciences and healthcare domains.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <a href="#partner-form" className="btn-primary">
            Partner with Us <ArrowRight size={18} />
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-secondary">
            Schedule Consultation
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Why Choose Our Corporate Training?</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            We bridge the gap between academic theory and clinical workplace reality with professional programs tailored to your organizational KPIs.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="panel p-6 flex flex-col gap-3 hover:-translate-y-1 transition duration-300 group">
              <div className="size-10 rounded-lg bg-clin-green/10 text-clin-green flex items-center justify-center font-bold">
                <Check size={20} className="transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-clin-blue transition">{benefit.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Areas */}
      <section id="training-areas" className="flex flex-col gap-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Specialized Training Domains</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Our expert trainers deliver customized programs across key life sciences, analytics, and compliance sectors.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {trainingAreas.map((area, idx) => (
            <div key={idx} className="panel p-5 flex items-center gap-4 bg-white/70 hover:bg-white hover:shadow-lg transition">
              <div className="size-10 rounded-full bg-clin-blue/10 text-clin-blue flex items-center justify-center flex-shrink-0">
                {area.includes("SAS") || area.includes("R ") || area.includes("BI") ? (
                  <BarChart3 size={18} />
                ) : area.includes("Compliance") || area.includes("Practice") || area.includes("Quality") ? (
                  <ShieldCheck size={18} />
                ) : (
                  <GraduationCap size={18} />
                )}
              </div>
              <span className="text-sm font-bold text-slate-800 leading-tight">{area}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Approach */}
      <section className="flex flex-col gap-12 bg-gradient-to-b from-cyan-50/50 to-emerald-50/50 rounded-3xl p-8 md:p-12 border border-cyan-100">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Structured Approach</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Every organization has unique needs. We design cohorts that guarantee employee readiness from day one.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-4 relative z-10">
              <div className="text-4xl md:text-5xl font-black text-clin-green/20 leading-none">{step.num}</div>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Benefit */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Who Can Benefit?</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Providing workforce development for key industries seeking to upskill talent and meet regulatory demands.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {targetSectors.map((sector, idx) => (
            <div key={idx} className="panel p-6 flex items-start gap-4 hover:shadow-md transition">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-800 leading-tight">{sector}</h3>
                <span className="text-xs text-slate-400 font-semibold">Authorized Upskilling Target</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Inquiry Form */}
      <section id="partner-form" className="scroll-mt-24">
        <FormShell title="Partner with Us" subtitle="Invest in your team's professional growth with customized, practical training programs.">
          <form onSubmit={handleSubmit} className="panel grid gap-5 p-6 sm:p-8">
            {status?.type === "error" && <div className="alert-error">{status.text}</div>}
            
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Company Name" value={form.companyName} onChange={companyName => setForm({ ...form, companyName })} required />
              <TextField label="Contact Person Name" value={form.contactName} onChange={contactName => setForm({ ...form, contactName })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Work Email Address" type="email" value={form.email} onChange={email => setForm({ ...form, email })} required />
              <TextField label="Phone Number" type="tel" value={form.phone} onChange={phone => setForm({ ...form, phone })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="form-label">Estimated Cohort Size</span>
                <select 
                  className="input cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:0.75rem_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
                  value={form.cohortSize} 
                  onChange={e => setForm({ ...form, cohortSize: e.target.value })}
                  required
                >
                  <option value="Less than 10">Less than 10 employees</option>
                  <option value="10-25">10 to 25 employees</option>
                  <option value="25-50">25 to 50 employees</option>
                  <option value="50+">More than 50 employees</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="form-label">Training Areas of Interest</legend>
              <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
                {trainingAreas.map((area, idx) => (
                  <label key={idx} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-clin-green/30 hover:bg-clin-green/5">
                    <input
                      type="checkbox"
                      className="size-4 accent-clin-green"
                      checked={form.areas.includes(area)}
                      onChange={() => toggleArea(area)}
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              <span className="form-label">Custom Requirements / Additional Message</span>
              <textarea 
                className="input min-h-28 resize-y py-3.5 font-sans" 
                value={form.message} 
                placeholder="Please outline any specific objectives, timing constraints, or tools access requirements..."
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </label>

            <button className="btn-primary mt-2 cursor-pointer text-white" type="submit">Submit Partnership Inquiry</button>
          </form>
        </FormShell>
      </section>
    </div>
  );
}

function CareersPage({ setJobApplications, careerListings, siteContent }) {
  const [filter, setFilter] = useState("all");
  const [activeJob, setActiveJob] = useState(null);
  const listings = Array.isArray(careerListings) ? careerListings : defaultCareers;
  const categories = Array.from(new Set(listings.map((job) => job.category || "clinical")));
  const filteredJobs = listings.filter((job) => filter === "all" || job.category === filter);
  const defaultMsg = "No content available. Please contact admin.";

  return (
    <section className="fade-up">
      <SectionHeader title="Join the Clinformatiq Team" subtitle="Grow your skills alongside leading global clinical software specialists and cohort trainers." />
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {[["all", "All Roles"], ...categories.map((category) => [category, category])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${filter === key ? "bg-clin-green text-white" : "bg-white text-slate-500 shadow-sm hover:text-clin-green"}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-5">
        {filteredJobs.length === 0 ? (
          <div className="panel p-10 text-center text-slate-500">No career openings are listed right now.</div>
        ) : filteredJobs.map((job) => (
          <article key={job.id || job.role} className="panel flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-extrabold text-clin-blue">{job.role}</h3>
              {job.description && <RichTextDisplay html={job.description} className="mt-2 max-w-3xl text-sm leading-6 text-slate-600" />}
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin size={16} />{job.location}</span>
                <span className="inline-flex items-center gap-1"><BriefcaseBusiness size={16} />{job.type}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => setActiveJob(job.role)}>Apply Now</button>
          </article>
        ))}
      </div>
      <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-bold text-slate-900">Connect With Us</h3>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          {siteContent?.footerYoutube && <a href={siteContent.footerYoutube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Play size={16} /> YouTube</a>}
          {siteContent?.footerInstagram && <a href={siteContent.footerInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Instagram</a>}
          {siteContent?.footerFacebook && <a href={siteContent.footerFacebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-clin-green"><Globe2 size={16} /> Facebook</a>}
        </div>
        {!siteContent?.footerYoutube && !siteContent?.footerInstagram && !siteContent?.footerFacebook && <p className="text-xs text-slate-400">{defaultMsg}</p>}
      </div>
      {activeJob && <ApplyModal role={activeJob} onClose={() => setActiveJob(null)} setJobApplications={setJobApplications} />}
    </section>
  );
}

function ApplyModal({ role, onClose, setJobApplications }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover: "" });

  function submit(event) {
    event.preventDefault();
    setJobApplications((items) => [...items, { id: `job_${Date.now()}`, role, ...form, timestamp: new Date().toLocaleString() }]);
    setSent(true);
    window.setTimeout(onClose, 1400);
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-5 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="panel w-full max-w-lg p-6">
        <button className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close modal"><X /></button>
        <h2 className="text-2xl font-extrabold text-slate-900">Apply for: {role}</h2>
        <p className="mt-1 text-sm text-slate-500">Fill out the application details to schedule interviews.</p>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          {sent && <div className="alert-success">Application submitted. Close this window.</div>}
          <TextField label="Full Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
          <TextField label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
          <TextField label="Phone Number" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} required />
          <label><span className="form-label">Experience Summary</span><textarea required className="input min-h-24" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} /></label>
          <button className="btn-primary bg-clin-blue hover:bg-clin-blue-dark" type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

function LoginPage({ setStudentUser, setAdminUser }) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });

  function submit(event) {
    event.preventDefault();
    const username = form.username.trim().toLowerCase();
    if (username === "student" && form.password === "student") {
      setStudentUser({ username: "student", role: "student" });
      window.location.hash = "#/dashboard";
      return;
    }
    if (username === "admin@clinformatiq.com" && form.password === "clinformatiq123") {
      sessionStorage.setItem(storageKeys.admin, "true");
      setAdminUser(true);
      window.location.hash = "#/admin";
      return;
    }
    setError("Invalid LMS username or password credentials.");
  }

  return (
    <section className="fade-up mx-auto w-full max-w-md">
      <form onSubmit={submit} className="panel grid gap-5 p-7">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-clin-blue/10 text-clin-blue"><Lock /></div>
        <div className="text-center">
          <h1 className="text-gradient text-3xl font-extrabold">LMS Portal Access</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to access Student Dashboard or Admin Console</p>
        </div>
        {error && <div className="alert-error">{error}</div>}
        <TextField label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} required />
        <label>
          <span className="form-label">Password</span>
          <span className="relative block">
            <input required className="input pr-12" type={visible ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setVisible(!visible)} aria-label="Toggle password visibility">
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="btn-primary w-full" type="submit">Sign In</button>
      </form>
    </section>
  );
}

function Dashboard({ studentUser }) {
  if (!studentUser) {
    window.location.hash = "#/login";
    return null;
  }

  return <UnderConstruction title="Student Portal" subtitle="Active Path: Clinical SAS Programming & Analytics" />;
}

function AdminPage({ adminUser, setAdminUser, teamMembers, setTeamMembers, siteContent, setSiteContent, careerListings, setCareerListings, documents, setDocuments, affiliatedInstitutes, setAffiliatedInstitutes, directors, setDirectors, certificates, setCertificates }) {
  if (!adminUser) {
    window.location.hash = "#/login";
    return null;
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
    window.location.hash = "#/";
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
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
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
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === link.id
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
          <a href="#/" className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-clin-green transition">
            <ExternalLink size={18} /> View Site
          </a>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-extrabold text-slate-800">
            {sidebarLinks.find(l => l.id === activeTab)?.label || "Dashboard"}
          </h1>
        </header>

        {/* Toast notification */}
        {toast && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-sm">
            <CircleCheck size={18} /> {toast}
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "hero" && <AdminHeroTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "features" && <AdminFeaturesTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "metrics" && <AdminMetricsTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "videos" && <AdminVideosTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
          {activeTab === "careers" && <AdminCareersTab careers={careerListings} setCareers={setCareerListings} showToast={showToast} />}
          { activeTab === "courses" && <AdminCoursesTab content={siteContent} setContent={setSiteContent} showToast={showToast} />}
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

/* ─── Admin Sub-Tabs ─── */

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
      {/* Header */}
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

      {/* Add / Edit Form */}
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

      {/* Courses List */}
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
            
            {/* PDF Management Section for Existing Courses */}
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
      alert('Upload failed. Make sure Supabase config is correct.');
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
      {/* Form */}
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

      {/* List */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Current Directors ({directors.length})</h2>
        {directors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No directors added yet.</div>
        ) : (
          <div className="space-y-3">
            {directors.sort((a,b) => (parseInt(a.position)||0) - (parseInt(b.position)||0)).map((member, idx) => (
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
      alert('Upload failed. Make sure Supabase config is correct.');
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
      {/* Form */}
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
            {!storageEnabled && <p className="text-xs text-slate-500 mt-2">Supabase Storage not configured. You must use a direct image URL.</p>}
          </div>
          <RichTextEditor label="Description / Bio" value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            {editIndex !== null && <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>}
            <button type="submit" className="btn-primary inline-flex items-center gap-2"><Users size={16} /> {editIndex !== null ? 'Save Member' : 'Add Member'}</button>
          </div>
        </form>
      </div>

      {/* Members List */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Current Team ({teamMembers.length})</h2>
        {teamMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No team members added yet. Use the form above to add your first member.</div>
        ) : (
          <div className="space-y-3">
            {teamMembers.sort((a,b) => (parseInt(a.position)||0) - (parseInt(b.position)||0)).map((member, idx) => (
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
          Supabase database: {storageEnabled ? "Connected from environment settings" : "Not configured yet. Using browser storage until .env is added."}
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

function OurTeam({ teamMembers, directors = [], siteContent = {} }) {
  const [activeMember, setActiveMember] = useState(null);

  const sortedDirectors = [...directors].sort((a,b) => (parseInt(a.position)||0) - (parseInt(b.position)||0));
  const sortedTeam = [...teamMembers].sort((a,b) => (parseInt(a.position)||0) - (parseInt(b.position)||0));
  
  const marqueeSpeed = siteContent.teamMarqueeSpeed || 40;

  return (
    <section className="fade-up">
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

function formatExternalUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function UnderConstruction({ title, subtitle }) {
  return (
    <section className="fade-up panel mx-auto w-full max-w-3xl p-10 text-center">
      <LayoutDashboard className="mx-auto mb-5 size-12 text-clin-green" />
      <h1 className="text-gradient text-4xl font-extrabold">{title}</h1>
      <p className="mt-3 text-slate-500">{subtitle}</p>
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-extrabold text-amber-700">UNDER CONSTRUCTION</div>
    </section>
  );
}

function FormShell({ title, subtitle, children }) {
  return (
    <section className="fade-up mx-auto w-full max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-gradient text-4xl font-extrabold">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, type = "text", required = false }) {
  return (
    <label>
      <span className="form-label">{label}</span>
      <input className="input" type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
  }, [value]);

  function syncValue() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function runCommand(command, argument = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    syncValue();
  }

  function addLink() {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", formatExternalUrl(url));
  }

  return (
    <div>
      <span className="form-label">{label}</span>
      <div className="rich-editor-wrapper">
        <div className="rich-editor-toolbar" aria-label={`${label} formatting toolbar`}>
          <button type="button" onClick={() => runCommand("bold")} className="rich-editor-tool" title="Bold">B</button>
          <button type="button" onClick={() => runCommand("italic")} className="rich-editor-tool italic" title="Italic">I</button>
          <button type="button" onClick={() => runCommand("underline")} className="rich-editor-tool underline" title="Underline">U</button>
          <button type="button" onClick={() => runCommand("insertUnorderedList")} className="rich-editor-tool" title="Bulleted list">•</button>
          <button type="button" onClick={() => runCommand("insertOrderedList")} className="rich-editor-tool" title="Numbered list">1.</button>
          <select
            className="rich-editor-select"
            defaultValue=""
            onChange={(event) => {
              if (!event.target.value) return;
              runCommand("fontSize", event.target.value);
              event.target.value = "";
            }}
            title="Text size"
          >
            <option value="" disabled>Size</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">XL</option>
            <option value="6">XXL</option>
          </select>
          <button type="button" onClick={addLink} className="rich-editor-tool" title="Add link">Link</button>
          <label className="rich-editor-color" title="Text color">
            <span>Color</span>
            <input type="color" defaultValue="#0f172a" onChange={(event) => runCommand("foreColor", event.target.value)} />
          </label>
          <label className="rich-editor-color" title="Highlight color">
            <span>Highlight</span>
            <input type="color" defaultValue="#fff3bf" onChange={(event) => runCommand("hiliteColor", event.target.value)} />
          </label>
          <button type="button" onClick={() => runCommand("removeFormat")} className="rich-editor-tool" title="Clear formatting">Clear</button>
        </div>
        <div
          ref={editorRef}
          className="rich-editor-input"
          contentEditable
          suppressContentEditableWarning
          onInput={syncValue}
          onBlur={syncValue}
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
}

function RichTextDisplay({ html, className = "" }) {
  if (!html) return null;
  return <div className={`rich-text-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

function SuccessPanel({ title, text }) {
  return (
    <section className="fade-up panel mx-auto max-w-xl p-8 text-center">
      <CircleCheck className="mx-auto mb-4 size-14 text-clin-green" />
      <h1 className="text-3xl font-extrabold text-clin-green">{title}</h1>
      <p className="mt-3 text-slate-600">{text}</p>
      <a href="#/login" className="btn-primary mt-6">Go to LMS Login</a>
    </section>
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
      alert("Upload failed. Make sure Supabase config is correct.");
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
            <div className="alert-error mb-4">Supabase Storage is not configured. File uploads are disabled.</div>
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
      alert("Upload failed. Make sure Supabase config is correct.");
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
      alert("MOU upload failed. Make sure Supabase config is correct.");
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
      alert("MOU upload failed. Make sure Supabase config is correct.");
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
      {/* Page Text Editor */}
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

      {/* Add/Edit Form */}
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
            {!storageEnabled && <p className="text-xs text-slate-500 mt-2">Supabase Storage not configured. You must use a direct image URL.</p>}
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

      {/* Institutes List */}
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

export default App;


// ==============================================
// VERIFY CERTIFICATE PAGE
// ==============================================

function VerifyCertificatePage({ certificates, content }) {
  const [certNumber, setCertNumber] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  function handleVerify(e) {
    e.preventDefault();
    if (!certNumber.trim()) return;
    
    const found = (certificates || []).find(c => String(c["Certificate Number"]).trim().toLowerCase() === certNumber.trim().toLowerCase());
    setResult(found || null);
    setSearched(true);
  }

  return (
    <div className="fade-up max-w-4xl mx-auto w-full">
      <SectionHeader title="Certificate Verification" subtitle="Verify the authenticity of a Clinformatiq certificate." />
      
      <div className="panel p-8 md:p-12 mt-10">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            className="flex-1 input-field"
            placeholder="Enter Certificate Number (e.g., CLIN-1234)"
            value={certNumber}
            onChange={(e) => {
              setCertNumber(e.target.value);
              setSearched(false);
              setResult(null);
            }}
            required
          />
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <ShieldCheck size={20} /> Verify Certificate
          </button>
        </form>

        {searched && (
          <div className={`p-6 md:p-10 rounded-2xl border transition-all ${result ? "bg-emerald-50/80 border-emerald-300 shadow-lg" : "bg-red-50 border-red-200"}`}>
            {result ? (
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner border border-emerald-200">
                  <BadgeCheck size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900 mb-1">Certificate Found & Certified</h3>
                <p className="text-sm font-semibold text-emerald-700 mb-6">This certificate is officially verified in Clinformatiq records.</p>
                
                <div className="mt-6 grid gap-6 sm:grid-cols-2 text-left bg-white p-6 md:p-8 rounded-xl border border-emerald-200 shadow-md">
                  <div className="border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-4">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Candidate Name</label>
                    <div className="text-xl font-extrabold text-slate-900">{result["Name"] || "N/A"}</div>
                  </div>
                  <div className="border-b sm:border-b-0 border-slate-100 pb-4 sm:pb-0">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Certificate Number</label>
                    <div className="text-xl font-extrabold text-clin-blue">{result["Certificate Number"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Course / Track</label>
                    <div className="text-lg font-bold text-slate-800">{result["Course"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Date of Issue</label>
                    <div className="text-lg font-bold text-emerald-800">{result["Date of Issue"] || result["Date of issue"] || result["Details"] || "N/A"}</div>
                  </div>
                  {Object.entries(result).map(([key, val]) => {
                    if (["Certificate Number", "Name", "Course", "Date of Issue", "Date of issue", "Details"].includes(key) || !val) return null;
                    return (
                      <div key={key} className="sm:col-span-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">{key}</label>
                        <div className="text-base font-semibold text-slate-700">{String(val)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-inner">
                  <X size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-red-800 mb-2">Not found in Records</h3>
                <p className="text-red-600/80">The certificate number you entered could not be found in our database. Please check the number and try again.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================================
// ADMIN CERTIFICATES TAB
// ==============================================

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
        
        // Use header: 1 to get a 2D array of cells so we can handle ANY column formatting or layout
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false });
        
        if (!rows || rows.length === 0) {
          showToast("File is empty.");
          return;
        }

        // Find header row index and map column indices
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

          // Check if we found at least Certificate Number or multiple recognizable columns
          if (tempCert !== -1 || tempName !== -1 || tempCourse !== -1 || tempDate !== -1) {
            headerRowIdx = r;
            colMap = { certNo: tempCert, name: tempName, course: tempCourse, dateOfIssue: tempDate };
            // If we found at least 2 columns, this is definitely the header row
            if ([tempCert, tempName, tempCourse, tempDate].filter(i => i !== -1).length >= 2) {
              break;
            }
          }
        }

        // Fallback: If any column index was not identified by keyword, assign sequential unused indices
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

          // Skip completely empty rows or repeating headers
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

            // Capture any extra columns present in the row
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
          <br/>
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

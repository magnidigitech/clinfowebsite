/**
 * Clinformatiq Premium Clinical Analytics & SAS Training - SPA Controller
 * Handles dynamic content state, client-side routing, click micro-animations,
 * form submissions, database lead tracking, and administrative console controls.
 */

// Central Website Content Defaults
const defaultSiteContent = {
  hero: {
    tag: "Clinical Analytics Curriculum",
    title: "Launch Your Clinical Career",
    subtitle: "Accelerate your clinical learning path. Learn directly from field practitioners using curriculum models backed by global compliance mandates and clinical software workflows.",
    cta1Text: "Start Your Journey",
    cta2Text: "Schedule Consultation"
  },
  trustBadges: [
    "500+ CRO Placement Referrals",
    "ICH-GCP Compliance Mapped",
    "CDISC Standards Standardized",
    "ISO 9001:2015 Training Quality"
  ],
  metrics: [
    { value: "5,000+", label: "Trained Professionals" },
    { value: "98%", label: "Career Transition Rate" },
    { value: "150+", label: "Active Global Hiring Partners" },
    { value: "12+", label: "Specialized Learning Modules" }
  ],
  features: [
    {
      title: "Regulatory Alignment",
      description: "Curriculum strictly mapped to ICH-GCP guidelines, FDA 21 CFR Part 11 electronic records mandates, and CDISC SDTM/ADaM clinical standards."
    },
    {
      title: "Interactive Sandbox",
      description: "24/7 access to specialized clinical cloud analytics setups, enabling students to write SAS macros and R scripts on active trial database models."
    },
    {
      title: "Practitioner Mentorship",
      description: "Learn directly from active Contract Research Organization (CRO) programmers, biostatisticians, and safety database administrators."
    },
    {
      title: "Placement Integration",
      description: "Comprehensive portfolio building, standard GxP validation audits competency prep, mock interviews, and automated partner referrals."
    }
  ],
  courses: [
    { id: "cr", name: "Clinical Research", duration: "1 month", skills: "Clinical Trials, Protocol Design, GCP, ICH Guidelines", body: "A detailed introduction covering clinical trials planning, protocol design, ethics committee approvals, and international GCP and ICH regulations." },
    { id: "cdm", name: "Clinical Data Management", duration: "1 month", skills: "CRF Design, EDC Systems, Query Management, CDISC Standards", body: "Focuses on verifying clinical database design, EDC setups, edit check scripts, CRF formatting, database locks, and audit-ready filing." },
    { id: "pv", name: "Pharmacovigilance", duration: "1 month", skills: "Drug Safety Monitoring, MedDRA Coding, Case Processing, Signal Detection", body: "Covers post-marketing safety checks, Adverse Events (AE) reporting, MedDRA dictionary encoding, case narratives, and clinical signal detections." },
    { id: "mc", name: "Medical Coding", duration: "1 month", skills: "ICD-10, CPT, HCPCS Coding, Claims Review", body: "Learn the universal healthcare terminology codes to classify diagnoses, physician procedures, medical treatments, and clinical bills." },
    { id: "ra", name: "Regulatory Affairs", duration: "1 month", skills: "Regulatory Submissions, IND/NDA, Compliance, FDA/EMA Guidelines", body: "Covers global dossier submissions (IND, NDA, ANDA) for marketing approvals, FDA/EMA guidelines, eCTD setups, and medical labels." },
    { id: "cs", name: "Clinical SAS", duration: "3 months", skills: "SAS Programming, Data Cleaning, TFLs, CDISC (SDTM/ADaM)", body: "Professional analytics using SAS programming tools, dataset modifications, generating standard Tables, Figures, and Listings (TFLs), and CDISC standards." },
    { id: "rp", name: "R Programming", duration: "3 months", skills: "Data Visualization, Statistical Modeling & Computing", body: "Modern bio-statistical computing, clean graphs formatting, ggplot2 packages, and statistical model assessments for clinical researchers." },
    { id: "pb", name: "Power BI", duration: "2 months", skills: "DAX Formulas, Interactive Dashboards, Data Modeling, Report Automation", body: "A detailed hands-on pathway teaching how to construct interactive reports, clinical dashboards, automate safety metrics, and model data with DAX." },
    { id: "qa", name: "Data Validation / QC / QA", duration: "1 month", skills: "Source Verification, Quality Audits, SOP Compliance, GxP Data Integrity", body: "Focuses on verifying clinical data quality, regulatory compliance, and process consistency through audits and SOP compliance checks." }
  ],
  testimonials: [
    { quote: "Transitioning from a Biotechnology degree, the R & SAS programming cohorts at Clinformatiq gave me the exact data cleaning and SDTM mapping skills CROs require. I landed a clinical programmer role within two weeks of graduating!", author: "Priya Sharma", role: "Clinical Data Analyst, IQVIA" },
    { quote: "The hands-on sandbox labs with active datasets made all the difference. I didn't just learn pharmacovigilance concepts—I parsed real safety cases and processed narrative reports under global safety audit compliance.", author: "Rajesh Varma", role: "Safety Specialist, Cognizant" },
    { quote: "Clinformatiq's CDM curriculum bridged the gap between theory and standard practice. Learning EDC setup and query workflow directly from an active trial lead helped me breeze through my technical placement interview.", author: "Dr. Anjali Mehta", role: "Associate CDM Lead, Novartis" }
  ],
  faqs: [
    { question: "What is the primary background required for Clinical SAS?", answer: "Candidates with a background in Life Sciences, Biotechnology, Pharmacy (B.Pharm/M.Pharm), Medicine, or Statistics are ideal candidates. The curriculum starts from core foundational elements and scales to advanced SDTM/ADaM database operations." },
    { question: "Are your cohorts live or self-paced recordings?", answer: "All Clinformatiq training pathways are led live by active industry practitioners. You participate in real-time interactive lectures, collaborate on group sandboxes, and receive individual support for portfolio assignments." },
    { question: "How does the placement referral program operate?", answer: "We maintain close hiring pipelines with top Contract Research Organizations (CROs) and pharmaceutical companies. Graduates who pass our GxP competency evaluations are directly referred to partner hiring panels, along with detailed portfolio evaluations." }
  ],
  cta: {
    title: "Ready to Launch Your Career?",
    description: "Be among the first to join our innovative clinical training programs and shape the future of healthcare technology."
  }
};

// Central Application Context State
const state = {
  currentRoute: 'home',
  user: null, // Active student portal session
  adminUser: false, // Active admin portal session
  studentRegistrations: [],
  instructorApplications: [],
  jobApplications: [],
  siteContent: {} // User editable site configurations
};

// Database Initialization
function initDatabase() {
  state.studentRegistrations = JSON.parse(localStorage.getItem('clinformatiq_web_students') || '[]');
  state.instructorApplications = JSON.parse(localStorage.getItem('clinformatiq_web_trainers') || '[]');
  state.jobApplications = JSON.parse(localStorage.getItem('clinformatiq_web_jobs') || '[]');
  state.siteContent = JSON.parse(localStorage.getItem('clinformatiq_site_content')) || JSON.parse(JSON.stringify(defaultSiteContent));
  state.adminUser = sessionStorage.getItem('clinformatiq_admin_session') === 'true';
}

function saveStudents() {
  localStorage.setItem('clinformatiq_web_students', JSON.stringify(state.studentRegistrations));
}

function saveTrainers() {
  localStorage.setItem('clinformatiq_web_trainers', JSON.stringify(state.instructorApplications));
}

function saveJobs() {
  localStorage.setItem('clinformatiq_web_jobs', JSON.stringify(state.jobApplications));
}

function saveSiteContent() {
  localStorage.setItem('clinformatiq_site_content', JSON.stringify(state.siteContent));
}

// Client-Side Router
function handleRoute() {
  const hash = window.location.hash || '#/';
  let route = 'home';

  if (hash.startsWith('#/courses')) route = 'courses';
  else if (hash.startsWith('#/careers')) route = 'careers';
  else if (hash.startsWith('#/student-reg')) route = 'student-reg';
  else if (hash.startsWith('#/instructor-reg')) route = 'instructor-reg';
  else if (hash.startsWith('#/login')) route = 'login';
  else if (hash.startsWith('#/dashboard')) route = 'dashboard';
  else if (hash.startsWith('#/admin')) route = 'admin';

  state.currentRoute = route;

  // Manage active nav highlights
  document.querySelectorAll('#main-nav a').forEach(link => {
    if (link.getAttribute('data-route') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  renderView(route);
}

function renderView(route) {
  const container = document.getElementById('app');
  const templateId = `tpl-${route}`;
  const template = document.getElementById(templateId);

  if (!template) {
    container.innerHTML = `<div class="panel text-center"><h2>404 - Page Not Found</h2><p>The requested page could not be located.</p></div>`;
    return;
  }

  // Clear and inject the template clone
  container.innerHTML = '';
  container.appendChild(template.content.cloneNode(true));

  // Initialize specific controllers based on route
  if (route === 'student-reg') initStudentRegController();
  else if (route === 'instructor-reg') initInstructorRegController();
  else if (route === 'careers') initCareersController();
  else if (route === 'login') initLoginController();
  else if (route === 'dashboard') initDashboardController();
  else if (route === 'admin') initAdminController();
  else if (route === 'home') {
    renderHomeDynamicContent();
    initHomeVideoController();
  } else if (route === 'courses') {
    renderCoursesDynamicContent();
  }
}

function renderUnderConstruction() {
  const container = document.getElementById('app');
  if (!container) return;

  container.innerHTML = `
    <section class="under-construction-screen" aria-label="LMS under construction">
      <h1>UNDER CONSTRUCTION</h1>
    </section>
  `;
}

// ==================== DYNAMIC CONTENT BINDERS ====================

function renderHomeDynamicContent() {
  // Bind Hero Elements
  const heroTag = document.getElementById('dyn-hero-tag');
  const heroTitle = document.getElementById('dyn-hero-title');
  const heroSub = document.getElementById('dyn-hero-subtitle');
  const heroCta1 = document.getElementById('dyn-hero-cta1');
  const heroCta2 = document.getElementById('dyn-hero-cta2');

  if (heroTag) heroTag.textContent = state.siteContent.hero.tag;
  if (heroTitle) heroTitle.textContent = state.siteContent.hero.title;
  if (heroSub) heroSub.textContent = state.siteContent.hero.subtitle;
  if (heroCta1) {
    heroCta1.innerHTML = `${state.siteContent.hero.cta1Text} <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>`;
  }
  if (heroCta2) heroCta2.textContent = state.siteContent.hero.cta2Text;

  // Bind Trust Bar
  const trustBar = document.getElementById('dyn-trust-bar');
  if (trustBar) {
    trustBar.innerHTML = state.siteContent.trustBadges.map(badge => `
      <div class="trust-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${badge}</span>
      </div>
    `).join('');
  }

  // Bind Key Focus Pillars
  const pillarsGrid = document.getElementById('dyn-pillars-grid');
  if (pillarsGrid) {
    const icons = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    ];
    pillarsGrid.innerHTML = state.siteContent.features.map((feat, idx) => `
      <article class="panel pillar-card">
        <div class="pillar-icon-box">
          ${icons[idx] || icons[0]}
        </div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--accent-blue);">${feat.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${feat.description}</p>
      </article>
    `).join('');
  }

  // Bind Metrics Counters
  const metricsGrid = document.getElementById('dyn-metrics-grid');
  if (metricsGrid) {
    metricsGrid.innerHTML = state.siteContent.metrics.map(met => `
      <div class="metric-pill">
        <div class="metric-value">${met.value}</div>
        <div class="metric-label">${met.label}</div>
      </div>
    `).join('');
  }

  // Bind Home Courses Index Table
  const coursesBody = document.getElementById('dyn-home-courses-body');
  if (coursesBody) {
    coursesBody.innerHTML = state.siteContent.courses.map(course => `
      <tr>
        <td style="font-weight: 700; color: var(--brand-primary);">${course.name}</td>
        <td>${course.duration}</td>
        <td>${course.skills}</td>
        <td><a href="#/student-reg?course=${encodeURIComponent(course.name)}" class="enroll-btn">Enroll Now</a></td>
      </tr>
    `).join('');
  }

  // Bind and Initialize Testimonials Slider
  let activeTestIdx = 0;
  function renderTestimonialSlider() {
    const tContainer = document.getElementById('dyn-testimonial-container');
    if (!tContainer) return;

    const t = state.siteContent.testimonials[activeTestIdx];
    tContainer.innerHTML = `
      <div class="testimonial-slide">
        <p class="testimonial-quote">${t.quote}</p>
        <div class="testimonial-meta">
          <span class="testimonial-author">${t.author}</span>
          <span class="testimonial-role">${t.role}</span>
        </div>
      </div>
      <div class="testimonial-dots">
        ${state.siteContent.testimonials.map((_, idx) => `
          <button class="testimonial-dot ${idx === activeTestIdx ? 'active' : ''}" data-idx="${idx}"></button>
        `).join('')}
      </div>
    `;

    // Bind dots click events
    tContainer.querySelectorAll('.testimonial-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        activeTestIdx = parseInt(dot.getAttribute('data-idx'));
        renderTestimonialSlider();
      });
    });
  }
  renderTestimonialSlider();

  // Bind and Initialize FAQs Accordion
  const faqAccordion = document.getElementById('dyn-faq-accordion');
  if (faqAccordion) {
    faqAccordion.innerHTML = state.siteContent.faqs.map((faq, idx) => `
      <div class="faq-item">
        <button class="faq-question">
          <span>${faq.question}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer">
          <p>${faq.answer}</p>
        </div>
      </div>
    `).join('');

    faqAccordion.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Close other FAQs
        faqAccordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // Bind Bottom Call-To-Action (CTA) Box
  const ctaTitle = document.getElementById('dyn-cta-title');
  const ctaDesc = document.getElementById('dyn-cta-desc');
  if (ctaTitle) {
    ctaTitle.innerHTML = state.siteContent.cta.title.replace('Launch', '<span>Launch</span>');
  }
  if (ctaDesc) ctaDesc.textContent = state.siteContent.cta.description;
}

function renderCoursesDynamicContent() {
  const container = document.querySelector('.courses-container');
  if (!container) return;

  container.innerHTML = state.siteContent.courses.map(course => `
    <article class="panel course-card">
      <div class="course-card-header">
        <h2 class="course-card-title">${course.name}</h2>
        <span class="course-duration-badge">Duration: ${course.duration}</span>
      </div>
      <p class="course-card-body">${course.body}</p>
      <div class="course-skills-tag">
        <strong>Key Skills:</strong> ${course.skills}
      </div>
      <a href="#/student-reg?course=${encodeURIComponent(course.name)}" class="btn-primary"
        style="margin-top: 1.5rem; padding: 0.6rem 1.25rem; font-size: 0.88rem;">Enroll Cohort</a>
    </article>
  `).join('');
}

// ==================== CONTROLLER: ADMINISTRATIVE DASHBOARD ====================

function initAdminController() {
  // Guard clause: If the administrator is not authenticated, redirect to LMS Login
  if (!state.adminUser) {
    window.location.hash = '#/login';
    return;
  }

  renderUnderConstruction();
  return;

  // Sidebar tab switching
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });

  // Populate Landing Page Form Fields
  const heroTag = document.getElementById('adm-hero-tag');
  const heroTitle = document.getElementById('adm-hero-title');
  const heroSub = document.getElementById('adm-hero-sub');
  const heroCta1 = document.getElementById('adm-hero-cta1');
  const heroCta2 = document.getElementById('adm-hero-cta2');
  const trustBadgesInput = document.getElementById('adm-trust-badges');
  const ctaTitleInput = document.getElementById('adm-cta-title');
  const ctaDescInput = document.getElementById('adm-cta-desc');

  if (heroTag) heroTag.value = state.siteContent.hero.tag;
  if (heroTitle) heroTitle.value = state.siteContent.hero.title;
  if (heroSub) heroSub.value = state.siteContent.hero.subtitle;
  if (heroCta1) heroCta1.value = state.siteContent.hero.cta1Text;
  if (heroCta2) heroCta2.value = state.siteContent.hero.cta2Text;
  if (trustBadgesInput) trustBadgesInput.value = state.siteContent.trustBadges.join(', ');
  if (ctaTitleInput) ctaTitleInput.value = state.siteContent.cta.title;
  if (ctaDescInput) ctaDescInput.value = state.siteContent.cta.description;

  // Bind Hero submit event
  const heroForm = document.getElementById('admin-hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.siteContent.hero.tag = heroTag.value.trim();
      state.siteContent.hero.title = heroTitle.value.trim();
      state.siteContent.hero.subtitle = heroSub.value.trim();
      state.siteContent.hero.cta1Text = heroCta1.value.trim();
      state.siteContent.hero.cta2Text = heroCta2.value.trim();
      state.siteContent.trustBadges = trustBadgesInput.value.split(',').map(s => s.trim()).filter(Boolean);
      state.siteContent.cta.title = ctaTitleInput.value.trim();
      state.siteContent.cta.description = ctaDescInput.value.trim();

      saveSiteContent();
      showTerminalLog('[UPDATE] Successfully synchronized Hero, Trust Badges, and CTA panel content keys.');
      updateStorageFootprint();
    });
  }

  // Populate Statistics Form Fields
  const m1val = document.getElementById('adm-m1-val');
  const m1lbl = document.getElementById('adm-m1-lbl');
  const m2val = document.getElementById('adm-m2-val');
  const m2lbl = document.getElementById('adm-m2-lbl');
  const m3val = document.getElementById('adm-m3-val');
  const m3lbl = document.getElementById('adm-m3-lbl');
  const m4val = document.getElementById('adm-m4-val');
  const m4lbl = document.getElementById('adm-m4-lbl');

  if (m1val) m1val.value = state.siteContent.metrics[0].value;
  if (m1lbl) m1lbl.value = state.siteContent.metrics[0].label;
  if (m2val) m2val.value = state.siteContent.metrics[1].value;
  if (m2lbl) m2lbl.value = state.siteContent.metrics[1].label;
  if (m3val) m3val.value = state.siteContent.metrics[2].value;
  if (m3lbl) m3lbl.value = state.siteContent.metrics[2].label;
  if (m4val) m4val.value = state.siteContent.metrics[3].value;
  if (m4lbl) m4lbl.value = state.siteContent.metrics[3].label;

  const statsForm = document.getElementById('admin-stats-form');
  if (statsForm) {
    statsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.siteContent.metrics[0].value = m1val.value.trim();
      state.siteContent.metrics[0].label = m1lbl.value.trim();
      state.siteContent.metrics[1].value = m2val.value.trim();
      state.siteContent.metrics[1].label = m2lbl.value.trim();
      state.siteContent.metrics[2].value = m3val.value.trim();
      state.siteContent.metrics[2].label = m3lbl.value.trim();
      state.siteContent.metrics[3].value = m4val.value.trim();
      state.siteContent.metrics[3].label = m4lbl.value.trim();

      saveSiteContent();
      showTerminalLog('[UPDATE] Successfully updated clinical academy statistics metrics.');
      updateStorageFootprint();
    });
  }

  // Populate and Render Course definitions Editor
  const coursesList = document.getElementById('admin-courses-form-list');
  if (coursesList) {
    coursesList.innerHTML = state.siteContent.courses.map((course, idx) => `
      <div class="admin-course-editor-card">
        <h3 style="font-weight: 700; color: var(--accent-blue); font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin: 0;">${course.name}</h3>
        <div class="input-grid" style="margin-bottom: 0;">
          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label style="font-size: 0.8rem;">Course Duration</label>
            <input class="input adm-c-duration" type="text" data-idx="${idx}" value="${course.duration}">
          </div>
          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label style="font-size: 0.8rem;">Key Skills Focus</label>
            <input class="input adm-c-skills" type="text" data-idx="${idx}" value="${course.skills}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0.75rem;">
          <label style="font-size: 0.8rem;">Course Catalog Summary Description</label>
          <textarea class="input adm-c-body" data-idx="${idx}" style="min-height: 60px;">${course.body}</textarea>
        </div>
        <button class="btn-primary btn-small save-single-course-btn" data-idx="${idx}" type="button" style="width: max-content;">Save ${course.name}</button>
      </div>
    `).join('');

    coursesList.querySelectorAll('.save-single-course-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const card = btn.parentElement;
        const durInput = card.querySelector('.adm-c-duration');
        const skillsInput = card.querySelector('.adm-c-skills');
        const bodyInput = card.querySelector('.adm-c-body');

        state.siteContent.courses[idx].duration = durInput.value.trim();
        state.siteContent.courses[idx].skills = skillsInput.value.trim();
        state.siteContent.courses[idx].body = bodyInput.value.trim();

        saveSiteContent();
        showTerminalLog(`[UPDATE] Course parameters updated successfully for: ${state.siteContent.courses[idx].name}`);
        updateStorageFootprint();

        btn.textContent = 'Saved!';
        btn.style.backgroundColor = 'var(--success)';
        setTimeout(() => {
          btn.textContent = `Save ${state.siteContent.courses[idx].name}`;
          btn.style.backgroundColor = '';
        }, 1500);
      });
    });
  }

  // Bind Inbound Lead Console Tab switching
  let activeLeadTab = 'students';
  const leadSubTabs = document.querySelectorAll('.leads-sub-tabs button');
  leadSubTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      leadSubTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLeadTab = btn.getAttribute('data-lead-type');
      renderLeadsTable();
    });
  });

  function renderLeadsTable() {
    const wrapper = document.getElementById('leads-table-wrapper');
    if (!wrapper) return;

    if (activeLeadTab === 'students') {
      if (state.studentRegistrations.length === 0) {
        wrapper.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding: 2.5rem 0; font-size: 0.95rem;">No student registrations registered in browser registry.</p>`;
        return;
      }
      wrapper.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Selected Cohort</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.studentRegistrations.map(st => `
              <tr>
                <td style="font-weight: 700; color: var(--accent-blue);">${st.name}</td>
                <td><code>${st.username}</code></td>
                <td>${st.phone}</td>
                <td><a href="mailto:${st.email}">${st.email}</a></td>
                <td><span class="status-badge status-approved">${st.course}</span></td>
                <td><button class="btn-primary btn-small delete-lead-btn" data-type="student" data-id="${st.id}" style="background-color: var(--error); padding: 0.35rem 0.75rem;">Evict</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeLeadTab === 'instructors') {
      if (state.instructorApplications.length === 0) {
        wrapper.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding: 2.5rem 0; font-size: 0.95rem;">No instructor dossiers submitted.</p>`;
        return;
      }
      wrapper.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Clinical Specialty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.instructorApplications.map(ins => `
              <tr>
                <td style="font-weight: 700; color: var(--accent-blue);">${ins.name}</td>
                <td>${ins.phone}</td>
                <td><a href="mailto:${ins.email}">${ins.email}</a></td>
                <td>${ins.experience} yrs</td>
                <td><span class="status-badge status-pending">${ins.specialty}</span></td>
                <td><button class="btn-primary btn-small delete-lead-btn" data-type="trainer" data-id="${ins.id}" style="background-color: var(--error); padding: 0.35rem 0.75rem;">Evict</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (activeLeadTab === 'careers') {
      if (state.jobApplications.length === 0) {
        wrapper.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding: 2.5rem 0; font-size: 0.95rem;">No careers applications received.</p>`;
        return;
      }
      wrapper.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Applicant</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience Summary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.jobApplications.map(job => `
              <tr>
                <td style="font-weight: 700; color: var(--accent-blue);">${job.role}</td>
                <td>${job.name}</td>
                <td><a href="mailto:${job.email}">${job.email}</a></td>
                <td>${job.phone}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${job.cover}">${job.cover}</td>
                <td><button class="btn-primary btn-small delete-lead-btn" data-type="job" data-id="${job.id}" style="background-color: var(--error); padding: 0.35rem 0.75rem;">Evict</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Bind delete/evict buttons inside lead tables
    wrapper.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const id = btn.getAttribute('data-id');

        if (type === 'student') {
          state.studentRegistrations = state.studentRegistrations.filter(s => s.id !== id);
          saveStudents();
          showTerminalLog(`[DELETE] Evicted student lead ID: ${id} from registry.`);
        } else if (type === 'trainer') {
          state.instructorApplications = state.instructorApplications.filter(i => i.id !== id);
          saveTrainers();
          showTerminalLog(`[DELETE] Evicted trainer dossier ID: ${id} from registry.`);
        } else if (type === 'job') {
          state.jobApplications = state.jobApplications.filter(j => j.id !== id);
          saveJobs();
          showTerminalLog(`[DELETE] Evicted job applicant ID: ${id} from registry.`);
        }

        updateStorageFootprint();
        renderLeadsTable();
      });
    });
  }
  renderLeadsTable();

  // Reset to Factory Defaults click binder
  const resetBtn = document.getElementById('admin-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you absolutely sure you want to revert all Clinformatiq website content back to premium factory defaults? This will erase all landing text customizations.')) {
        state.siteContent = JSON.parse(JSON.stringify(defaultSiteContent));
        saveSiteContent();
        showTerminalLog('[FACTORY RESET] Successfully re-seeded all central content databases to factory defaults.');
        updateStorageFootprint();
        initAdminController(); // Re-trigger to reload form values
      }
    });
  }

  // Logout click binder
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.adminUser = false;
      sessionStorage.removeItem('clinformatiq_admin_session');
      window.location.hash = '#/login';
    });
  }

  // System Terminal Console Log functions
  function showTerminalLog(msg) {
    const term = document.getElementById('admin-terminal');
    if (!term) return;
    const time = new Date().toLocaleTimeString();
    term.innerHTML += `\n[${time}] ${msg}`;
    term.scrollTop = term.scrollHeight;
  }

  // Storage Footprint calculator
  function updateStorageFootprint() {
    const bar = document.getElementById('admin-storage-bar');
    const txt = document.getElementById('admin-storage-text');
    if (!bar || !txt) return;

    let totalBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const kb = (totalBytes / 1024).toFixed(2);
    const maxKbs = 5120; // 5MB limit
    const pct = Math.min((totalBytes / (maxKbs * 1024)) * 100, 100).toFixed(2);

    bar.style.width = `${pct}%`;
    txt.textContent = `${kb} KB / 5.0 MB (${pct}%)`;
  }
  updateStorageFootprint();
}

// ==================== MOUSE CLICK RIPPLE MICRO-ANIMATIONS ====================

function initClickMicroAnimations() {
  document.addEventListener('click', (e) => {
    // Intercept clicks on links, buttons, panels, tables, chapters, accordions
    const target = e.target.closest('a, button, .panel, .highlight-item, .faq-question, tr, .chapter-tab');
    if (!target) return;

    // Apply relative positioning to target if static
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.position === 'static') {
      target.style.position = 'relative';
    }

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    // Coordinates relative to bounding box
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    target.appendChild(ripple);

    // Destruct element after transition complete
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}

// ==================== ORIGINAL FORM AND VIEW CONTROLLERS ====================

// Controller: Student Tutor LMS Registration Form
function initStudentRegController() {
  const form = document.getElementById('student-reg-form');
  if (!form) return;

  // Pre-fill course if specified in URL query
  const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const preSelectedCourse = params.get('course');
  if (preSelectedCourse) {
    const stCourseSelect = document.getElementById('st-course');
    if (stCourseSelect) stCourseSelect.value = preSelectedCourse;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('student-alert');
    const first = document.getElementById('st-first-name').value.trim();
    const last = document.getElementById('st-last-name').value.trim();
    const user = document.getElementById('st-user').value.trim();
    const phone = document.getElementById('st-phone').value.trim();
    const email = document.getElementById('st-email').value.trim();
    const course = document.getElementById('st-course').value;
    const pass = document.getElementById('st-pass').value;
    const confirm = document.getElementById('st-confirm').value;

    // Check pass match
    if (pass !== confirm) {
      alertBox.innerHTML = `
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Error: Registration passwords do not match. Please verify your entry.</span>
        </div>
      `;
      return;
    }

    // Save Student Enrollment details
    const newStudent = {
      id: 'st_' + Date.now(),
      name: `${first} ${last}`,
      username: user,
      phone: phone,
      email: email,
      course: course,
      timestamp: new Date().toLocaleString()
    };

    state.studentRegistrations.push(newStudent);
    saveStudents();

    // Visual Success Checkmark confirmation
    form.innerHTML = `
      <div class="success-checkmark">
        <div class="check-icon"></div>
      </div>
      <h2 style="text-align: center; margin-bottom: 0.5rem; color: var(--brand-primary); font-size: 1.6rem;">Enrollment Complete!</h2>
      <p style="text-align: center; color: var(--text-secondary); margin-bottom: 1.5rem;">Your student account is successfully registered in the Clinformatiq cohort portal.</p>
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.88rem; color: var(--success); text-align: center;">
        <span style="font-weight: 700;">Active Account Credentials:</span> Use username <strong>student</strong> and password <strong>student</strong> to log into the LMS panel simulator.
      </div>
    `;
  });
}

// Controller: Instructor Registration Application
function initInstructorRegController() {
  const form = document.getElementById('instructor-reg-form');
  const resumeInput = document.getElementById('ins-resume');
  const uploadLabel = document.getElementById('file-upload-label');
  if (!form || !resumeInput) return;

  // Dynamic file upload label change
  resumeInput.addEventListener('change', () => {
    if (resumeInput.files && resumeInput.files[0]) {
      uploadLabel.innerText = `Resume Selected: ${resumeInput.files[0].name}`;
      uploadLabel.style.color = 'var(--brand-primary)';
    } else {
      uploadLabel.innerText = 'Choose a file or drag it here';
      uploadLabel.style.color = 'var(--text-muted)';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ins-name').value.trim();
    const phone = document.getElementById('ins-phone').value.trim();
    const email = document.getElementById('ins-email').value.trim();
    const experience = document.getElementById('ins-exp').value;
    const specialty = document.getElementById('ins-specialty').value.trim();

    const newInstructor = {
      id: 'ins_' + Date.now(),
      name: name,
      phone: phone,
      email: email,
      experience: experience,
      specialty: specialty,
      timestamp: new Date().toLocaleString()
    };

    state.instructorApplications.push(newInstructor);
    saveTrainers();

    form.innerHTML = `
      <div class="success-checkmark">
        <div class="check-icon"></div>
      </div>
      <h2 style="text-align: center; margin-bottom: 0.5rem; color: var(--brand-primary); font-size: 1.6rem;">Trainer Application Received!</h2>
      <p style="text-align: center; color: var(--text-secondary); margin-bottom: 1.5rem;">Thank you for your interest in joining the Clinformatiq academic cohort boards.</p>
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.88rem; color: var(--success); text-align: center;">
        Our academic coordinator team will review your resume dossier and specialties and schedule interviews.
      </div>
    `;
  });
}

// Controller: Careers Job Board & Overlay Modal Form
function initCareersController() {
  const modal = document.getElementById('apply-modal');
  const closeBtn = document.getElementById('modal-close');
  const applyForm = document.getElementById('job-apply-form');
  const modalJobTitle = document.getElementById('modal-job-title');
  const applyJobRoleInput = document.getElementById('apply-job-role');

  if (!modal || !applyForm) return;

  // Filter tabs click transitions
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');
      document.querySelectorAll('.job-card').forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Apply modal
  document.querySelectorAll('.btn-apply').forEach(btn => {
    btn.addEventListener('click', () => {
      const roleName = btn.getAttribute('data-role');
      modalJobTitle.innerText = `Apply for: ${roleName}`;
      applyJobRoleInput.value = roleName;
      modal.classList.add('active');
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    applyForm.reset();
    const alertBox = document.getElementById('apply-alert');
    if (alertBox) alertBox.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle application submission
  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('apply-name').value.trim();
    const email = document.getElementById('apply-email').value.trim();
    const phone = document.getElementById('apply-phone').value.trim();
    const cover = document.getElementById('apply-cover').value.trim();
    const role = applyJobRoleInput.value;

    const newApplication = {
      id: 'job_' + Date.now(),
      name: name,
      email: email,
      phone: phone,
      cover: cover,
      role: role,
      timestamp: new Date().toLocaleString()
    };

    state.jobApplications.push(newApplication);
    saveJobs();

    const alertBox = document.getElementById('apply-alert');
    alertBox.innerHTML = `
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Application submitted! Close this window.</span>
      </div>
    `;

    setTimeout(closeModal, 1500);
  });
}

// Controller: LMS Authentication Portal
function initLoginController() {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Password view/hide toggle
  const loginPassInput = document.getElementById('login-pass');
  const loginPassToggle = document.getElementById('login-pass-toggle');
  if (loginPassToggle && loginPassInput) {
    loginPassToggle.addEventListener('click', () => {
      if (loginPassInput.type === 'password') {
        loginPassInput.type = 'text';
        loginPassToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        loginPassInput.type = 'password';
        loginPassToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('login-user').value.trim().toLowerCase();
    const passVal = document.getElementById('login-pass').value;
    const alertBox = document.getElementById('login-alert');

    if (userVal === 'student' && passVal === 'student') {
      state.user = { username: 'student', role: 'student' };
      window.location.hash = '#/dashboard';
    } else if (userVal === 'admin' && passVal === 'admin') {
      state.adminUser = true;
      sessionStorage.setItem('clinformatiq_admin_session', 'true');
      window.location.hash = '#/admin';
    } else {
      alertBox.innerHTML = `
        <div class="alert alert-error" style="animation: shake 0.3s ease-in-out;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Invalid LMS username or password credentials.</span>
        </div>
      `;
    }
  });
}

// Controller: Simulated Student Portal Dashboard
function initDashboardController() {
  if (!state.user) {
    window.location.hash = '#/login';
    return;
  }

  renderUnderConstruction();
  return;

  const logoutBtn = document.getElementById('dash-btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.user = null;
      window.location.hash = '#/';
    });
  }
}

// Controller: Interactive Clinical Overview Video Player
function initHomeVideoController() {
  const topicVideoLink = document.getElementById('hero-topic-video');
  const topicThumbnail = document.getElementById('hero-topic-thumbnail');
  const topicTitle = document.getElementById('hero-topic-title');
  const topicMeta = document.getElementById('hero-topic-meta');
  const tabs = document.querySelectorAll('.chapter-tab');

  if (!topicVideoLink || !topicThumbnail || !tabs.length) return;

  const clinicalVideos = {
    sas: {
      title: 'Clinical SAS Programming',
      meta: 'Watch clinical SAS reference on YouTube',
      videoId: '5Un72EhNUa0'
    },
    sdtm: {
      title: 'CDISC SDTM Standards',
      meta: 'Watch SDTM fundamentals on YouTube',
      videoId: 'iDJ1OYSSrD8'
    },
    gcp: {
      title: 'GCP Audit Readiness',
      meta: 'Watch clinical research GCP reference on YouTube',
      videoId: 'kkElB0iDbZU'
    }
  };

  function setActiveTab(chapter) {
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-chapter') === chapter);
    });
  }

  function loadTopicVideo(chapter) {
    const data = clinicalVideos[chapter] || clinicalVideos.sas;
    setActiveTab(chapter);
    topicVideoLink.href = `https://www.youtube.com/watch?v=${data.videoId}`;
    topicVideoLink.setAttribute('aria-label', `Open ${data.title} reference video on YouTube`);
    topicThumbnail.src = `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;
    topicThumbnail.alt = `${data.title} reference video thumbnail`;
    if (topicTitle) topicTitle.textContent = data.title;
    if (topicMeta) topicMeta.textContent = data.meta;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      loadTopicVideo(tab.getAttribute('data-chapter') || 'sas');
    });
  });
}

// SPA Bootstrap Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  initClickMicroAnimations();

  // Intercept routing hooks
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);

  // Logo navigation delegation
  document.getElementById('nav-logo').addEventListener('click', () => {
    window.location.hash = '#/';
  });
});

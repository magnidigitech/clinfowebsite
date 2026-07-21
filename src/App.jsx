import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  storageKeys,
  defaultSiteContent,
  defaultCareers,
  readJson,
  mergeSiteContent,
} from "./data/defaultData";
import { storageEnabled, loadSiteState, saveSiteState } from "./supabaseStore";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { OurTeam } from "./pages/OurTeam";
import { CareersPage } from "./pages/CareersPage";
import { StudentRegistration } from "./pages/StudentRegistration";
import { InstructorRegistration } from "./pages/InstructorRegistration";
import { AffiliatedInstitutesPage } from "./pages/AffiliatedInstitutesPage";
import { CorporateTrainingPage } from "./pages/CorporateTrainingPage";
import { VerifyCertificatePage } from "./pages/VerifyCertificatePage";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ siteContent, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer content={siteContent} />
    </div>
  );
}

export function App() {
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [studentUser, setStudentUser] = useState(() => readJson(storageKeys.students, null));
  const [adminUser, setAdminUser] = useState(() => sessionStorage.getItem(storageKeys.admin) === "true");

  const [students, setStudents] = useState(() => readJson(storageKeys.students, []));
  const [trainers, setTrainers] = useState(() => readJson(storageKeys.trainers, []));
  const [jobApplications, setJobApplications] = useState(() => readJson(storageKeys.jobs, []));
  const [teamMembers, setTeamMembers] = useState(() => readJson(storageKeys.team, []));
  const [careerListings, setCareerListings] = useState(() => readJson(storageKeys.careers, defaultCareers));
  const [documents, setDocuments] = useState(() => readJson(storageKeys.documents, []));
  const [affiliatedInstitutes, setAffiliatedInstitutes] = useState(() => readJson(storageKeys.affiliated, []));
  const [directors, setDirectors] = useState(() => readJson("clinformatiq_web_directors", []));
  const [certificates, setCertificates] = useState(() => readJson("clinformatiq_web_certificates", []));

  useEffect(() => {
    if (!storageEnabled) return;
    loadSiteState()
      .then((data) => {
        if (data.siteContent) setSiteContent(mergeSiteContent(data.siteContent));
        if (data.teamMembers) setTeamMembers(data.teamMembers);
        if (data.directors) setDirectors(data.directors);
        if (data.careerListings) setCareerListings(data.careerListings);
        if (data.documents) setDocuments(data.documents);
        if (data.affiliatedInstitutes) setAffiliatedInstitutes(data.affiliatedInstitutes);
        if (data.certificates) setCertificates(data.certificates);
      })
      .catch((err) => console.error("Error loading state from PostgreSQL:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKeys.content, JSON.stringify(siteContent));
    if (storageEnabled) saveSiteState("siteContent", siteContent);
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(storageKeys.team, JSON.stringify(teamMembers));
    if (storageEnabled) saveSiteState("teamMembers", teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem("clinformatiq_web_directors", JSON.stringify(directors));
    if (storageEnabled) saveSiteState("directors", directors);
  }, [directors]);

  useEffect(() => {
    localStorage.setItem(storageKeys.careers, JSON.stringify(careerListings));
    if (storageEnabled) saveSiteState("careerListings", careerListings);
  }, [careerListings]);

  useEffect(() => {
    localStorage.setItem(storageKeys.documents, JSON.stringify(documents));
    if (storageEnabled) saveSiteState("documents", documents);
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(storageKeys.affiliated, JSON.stringify(affiliatedInstitutes));
    if (storageEnabled) saveSiteState("affiliatedInstitutes", affiliatedInstitutes);
  }, [affiliatedInstitutes]);

  useEffect(() => {
    localStorage.setItem("clinformatiq_web_certificates", JSON.stringify(certificates));
    if (storageEnabled) saveSiteState("certificates", certificates);
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(storageKeys.students, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(storageKeys.trainers, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem(storageKeys.jobs, JSON.stringify(jobApplications));
  }, [jobApplications]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminPage
              adminUser={adminUser}
              setAdminUser={setAdminUser}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              siteContent={siteContent}
              setSiteContent={setSiteContent}
              careerListings={careerListings}
              setCareerListings={setCareerListings}
              documents={documents}
              setDocuments={setDocuments}
              affiliatedInstitutes={affiliatedInstitutes}
              setAffiliatedInstitutes={setAffiliatedInstitutes}
              directors={directors}
              setDirectors={setDirectors}
              certificates={certificates}
              setCertificates={setCertificates}
            />
          }
        />

        {/* Public Routes inside PublicLayout */}
        <Route
          path="*"
          element={
            <PublicLayout siteContent={siteContent}>
              <Routes>
                <Route path="/" element={<HomePage content={siteContent} />} />
                <Route path="/courses" element={<CoursesPage content={siteContent} />} />
                <Route path="/team" element={<OurTeam teamMembers={teamMembers} directors={directors} siteContent={siteContent} />} />
                <Route path="/careers" element={<CareersPage setJobApplications={setJobApplications} careerListings={careerListings} siteContent={siteContent} />} />
                <Route path="/student-reg" element={<StudentRegistration siteContent={siteContent} setStudents={setStudents} />} />
                <Route path="/instructor-reg" element={<InstructorRegistration setTrainers={setTrainers} />} />
                <Route path="/affiliated-institutes" element={<AffiliatedInstitutesPage affiliatedInstitutes={affiliatedInstitutes} content={siteContent} />} />
                <Route path="/corporate-training" element={<CorporateTrainingPage content={siteContent} />} />
                <Route path="/certificate" element={<VerifyCertificatePage certificates={certificates} content={siteContent} />} />
                
                {/* Legacy redirect for /verify-certificate -> /certificate */}
                <Route path="/verify-certificate" element={<Navigate to="/certificate" replace />} />
                
                <Route path="/login" element={<LoginPage setStudentUser={setStudentUser} setAdminUser={setAdminUser} />} />
                <Route path="/dashboard" element={<Dashboard studentUser={studentUser} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

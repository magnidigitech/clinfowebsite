import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
  'import {\n  ArrowRight',
  'import {\n  ArrowRight,\n  BadgeCheck'
);

content = content.replace(
  'const [affiliatedInstitutes, setAffiliatedInstitutes] = useState(() => []);',
  'const [affiliatedInstitutes, setAffiliatedInstitutes] = useState(() => []);\n  const [certificates, setCertificates] = useState(() => []);'
);

content = content.replace(
  'if (Array.isArray(state.affiliatedInstitutes)) setAffiliatedInstitutes(state.affiliatedInstitutes);',
  'if (Array.isArray(state.affiliatedInstitutes)) setAffiliatedInstitutes(state.affiliatedInstitutes);\n        if (Array.isArray(state.certificates)) setCertificates(state.certificates);'
);

content = content.replace(
  'saveSiteState({ siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors })',
  'saveSiteState({ siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors, certificates })'
);

content = content.replace(
  'adminUser, siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors]);',
  'adminUser, siteContent, careerListings, teamMembers, jobApplications, documents, affiliatedInstitutes, directors, certificates]);'
);

content = content.replace(
  '      directors,\n      setDirectors,\n    };',
  '      directors,\n      setDirectors,\n      certificates,\n      setCertificates,\n    };'
);

content = content.replace(
  'if (route.name === "affiliated-institutes") return <AffiliatedInstitutesPage affiliatedInstitutes={affiliatedInstitutes} content={siteContent} />;',
  'if (route.name === "verify-certificate") return <VerifyCertificatePage certificates={certificates} content={siteContent} />;\n    if (route.name === "affiliated-institutes") return <AffiliatedInstitutesPage affiliatedInstitutes={affiliatedInstitutes} content={siteContent} />;'
);

content = content.replace(
  'route, siteContent, students, trainers, jobApplications, studentUser, adminUser, teamMembers, careerListings, documents, affiliatedInstitutes, directors]);',
  'route, siteContent, students, trainers, jobApplications, studentUser, adminUser, teamMembers, careerListings, documents, affiliatedInstitutes, directors, certificates]);'
);

content = content.replace(
  'path.startsWith("affiliated-institutes") ? "affiliated-institutes" :',
  'path.startsWith("verify-certificate") ? "verify-certificate" :\n    path.startsWith("affiliated-institutes") ? "affiliated-institutes" :'
);

content = content.replace(
  '["affiliated-institutes", "#/affiliated-institutes", "Our Affiliated Institutes"],',
  '["affiliated-institutes", "#/affiliated-institutes", "Our Affiliated Institutes"],\n    ["verify-certificate", "#/verify-certificate", "Verify Certificate"],'
);

content = content.replace(
  'function AdminPage({ adminUser, setAdminUser, teamMembers, setTeamMembers, siteContent, setSiteContent, careerListings, setCareerListings, documents, setDocuments, affiliatedInstitutes, setAffiliatedInstitutes, directors, setDirectors }) {',
  'function AdminPage({ adminUser, setAdminUser, teamMembers, setTeamMembers, siteContent, setSiteContent, careerListings, setCareerListings, documents, setDocuments, affiliatedInstitutes, setAffiliatedInstitutes, directors, setDirectors, certificates, setCertificates }) {'
);

content = content.replace(
  '{ id: "affiliated", label: "Affiliated Institutes", icon: Building2 },',
  '{ id: "affiliated", label: "Affiliated Institutes", icon: Building2 },\n    { id: "certificates", label: "Certificates", icon: BadgeCheck },'
);

content = content.replace(
  '{activeTab === "affiliated" && <AdminAffiliatedTab affiliatedInstitutes={affiliatedInstitutes} setAffiliatedInstitutes={setAffiliatedInstitutes} content={siteContent} setContent={setSiteContent} showToast={showToast} />}',
  '{activeTab === "affiliated" && <AdminAffiliatedTab affiliatedInstitutes={affiliatedInstitutes} setAffiliatedInstitutes={setAffiliatedInstitutes} content={siteContent} setContent={setSiteContent} showToast={showToast} />}\n          {activeTab === "certificates" && <AdminCertificatesTab certificates={certificates} setCertificates={setCertificates} showToast={showToast} />}'
);

const newComponents = `

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
          <div className={\`p-6 md:p-10 rounded-2xl border transition-all \${result ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}\`}>
            {result ? (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
                  <BadgeCheck size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-emerald-800 mb-2">Officially Certified by Clinformatiq</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 text-left bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Name</label>
                    <div className="text-lg font-bold text-slate-800">{result["Name"] || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificate Number</label>
                    <div className="text-lg font-bold text-slate-800">{result["Certificate Number"] || "N/A"}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course / Track</label>
                    <div className="text-lg font-bold text-slate-800">{result["Course"] || "N/A"}</div>
                  </div>
                  {result["Details"] && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Details</label>
                      <div className="text-sm font-medium text-slate-600">{result["Details"]}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-inner">
                  <X size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-red-800 mb-2">Not existed in Records</h3>
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
    String(c["Course"] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleCsvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\\r?\\n/).filter(line => line.trim());
        
        if (lines.length < 2) {
          showToast("CSV file is empty or only contains headers.");
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const newCerts = [];

        for (let i = 1; i < lines.length; i++) {
          // A simple CSV parser (does not handle commas inside quotes well, but good enough for simple use cases)
          // If advanced parsing is needed, we'd add papaparse.
          const values = lines[i].split(",");
          let obj = {};
          headers.forEach((h, idx) => {
            obj[h] = (values[idx] || "").trim();
          });
          
          if (obj["Certificate Number"]) {
            newCerts.push(obj);
          }
        }

        // Merge or replace? We will append to existing, ignoring duplicates based on Certificate Number
        const existingMap = new Map();
        safeCertificates.forEach(c => existingMap.set(c["Certificate Number"], c));
        
        let added = 0;
        let updated = 0;

        newCerts.forEach(nc => {
          if (existingMap.has(nc["Certificate Number"])) {
            updated++;
          } else {
            added++;
          }
          existingMap.set(nc["Certificate Number"], nc);
        });

        const mergedList = Array.from(existingMap.values());
        setCertificates(mergedList);
        
        showToast(\`Successfully imported \${added} new and updated \${updated} certificates.\`);
        e.target.value = ""; // Reset input
      } catch (err) {
        showToast("Error parsing CSV file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function deleteCert(certNumber) {
    if (window.confirm(\`Are you sure you want to delete certificate \${certNumber}?\`)) {
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
      <div className="mb-8 p-6 panel bg-gradient-to-br from-cyan-50 to-white">
        <h3 className="text-xl font-extrabold text-slate-800 mb-2">Upload Certificates CSV</h3>
        <p className="text-slate-600 text-sm mb-4">
          Upload a CSV file containing certificate records. Ensure the first row contains these exact headers:
          <br/>
          <code className="text-xs bg-slate-100 px-2 py-1 rounded text-clin-blue font-bold">Certificate Number, Name, Course, Details</code>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="btn-primary cursor-pointer flex items-center gap-2">
            <FileUp size={18} /> Select CSV File
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
          </label>
          <span className="text-xs text-slate-400">Existing records with the same Certificate Number will be updated.</span>
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
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-slate-500 italic">
                    {safeCertificates.length === 0 ? "No certificates found. Upload a CSV to get started." : "No records match your search."}
                  </td>
                </tr>
              ) : (
                filteredCerts.map((cert, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-bold text-clin-blue">{cert["Certificate Number"] || "N/A"}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{cert["Name"] || "N/A"}</td>
                    <td className="px-5 py-3 text-slate-600">{cert["Course"] || "N/A"}</td>
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
`;

content = content + newComponents;

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx updated successfully.');

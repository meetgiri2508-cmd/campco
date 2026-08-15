import React, { useState } from "react";
import {
  Home, Briefcase, MessageCircle, Users, UserPlus, User, GraduationCap,
  Search, Plus, X, Upload, CheckCircle2, Send, Award, Building2, Calendar,
  MapPin, Tag, ChevronRight, Star, ShieldCheck, FileText, Hash, ThumbsUp,
  ArrowLeft, Sparkles
} from "lucide-react";

// ---------- Design tokens ----------
const C = {
  ink: "#1B1B3A",
  inkSoft: "#2E2E5C",
  inkFaint: "#43436B",
  paper: "#F7F1E3",
  paperCard: "#FFFDF8",
  paperLine: "#E4D9BE",
  marigold: "#F2A93B",
  marigoldDark: "#D6890F",
  teal: "#0E7C7B",
  tealSoft: "#E4F2EF",
  coral: "#E4572E",
  coralSoft: "#FBE6DF",
  textMuted: "#6B6B8F",
};

// ---------- Branches / majors, grouped by stream ----------
const BRANCH_GROUPS = {
  "Engineering": [
    "Computer Engineering",
    "Information Technology",
    "Electronics Engineering",
    "Electronics & Telecommunication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Electrical Engineering",
    "Instrumentation Engineering",
    "Biomedical Engineering",
    "Automobile Engineering",
    "Production Engineering",
    "Artificial Intelligence & Data Science",
    "AI & Machine Learning",
  ],
  "Science (BSc)": [
    "BSc Computer Science",
    "BSc Information Technology",
    "BSc Physics",
    "BSc Chemistry",
    "BSc Mathematics",
    "Biotechnology",
    "BSc Microbiology",
    "BSc Life Sciences",
    "BSc Statistics",
    "BSc Environmental Science",
    "BSc Zoology",
    "BSc Botany",
  ],
  "Commerce & Management": [
    "Commerce",
    "BCom Accounting & Finance",
    "BCom Banking & Insurance",
    "BMS (Management Studies)",
    "BFM (Financial Markets)",
    "Economics",
    "BBA",
    "BBA International Business",
  ],
  "Arts & Humanities": [
    "Arts & Humanities",
    "English Literature",
    "Psychology",
    "Sociology",
    "History",
    "Political Science",
    "Mass Media (BMM)",
  ],
  "Law": ["BA LLB", "BBA LLB", "LLB"],
  "Medicine & Pharmacy": ["MBBS", "BDS", "BAMS", "BHMS", "BPharm", "BSc Nursing"],
  "Design & Architecture": ["Architecture (BArch)", "Fashion Design", "Interior Design", "Applied Art"],
};
const MAJORS = Object.values(BRANCH_GROUPS).flat();

// ---------- Colleges, grouped by category ----------
const COLLEGE_GROUPS = {
  "Engineering": [
    "IIT Bombay",
    "Veermata Jijabai Technological Institute (VJTI)",
    "Sardar Patel Institute of Technology (SPIT)",
    "Institute of Chemical Technology (ICT Mumbai)",
    "K J Somaiya College of Engineering",
    "K J Somaiya Institute of Technology",
    "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
    "Thadomal Shahani Engineering College (TSEC)",
    "Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)",
    "Fr. Conceicao Rodrigues Institute of Technology (Fr. CRIT)",
    "St. Francis Institute of Technology",
    "Vivekanand Education Society's Institute of Technology (VESIT)",
    "Vidyalankar Institute of Technology",
    "Vidyavardhini's College of Engineering & Technology (VCET)",
    "Rajiv Gandhi Institute of Technology (RGIT)",
    "Atharva College of Engineering",
    "Shah & Anchor Kutchhi Engineering College",
    "A. P. Shah Institute of Technology",
    "M. H. Saboo Siddik College of Engineering",
    "Usha Mittal Institute of Technology (SNDT)",
    "Xavier Institute of Engineering",
    "Don Bosco Institute of Technology",
    "Watumull Institute of Electronics Engineering & Computer Technology",
    "Ramrao Adik Institute of Technology",
    "Terna Engineering College",
    "Pillai College of Engineering (Navi Mumbai)",
    "Bharati Vidyapeeth College of Engineering (Navi Mumbai)",
  ],
  "Arts, Science & Commerce": [
    "St. Xavier's College",
    "Mithibai College",
    "Sophia College for Women",
    "K.C. College",
    "H.R. College of Commerce & Economics",
    "Jai Hind College",
    "R.A. Podar College of Commerce & Economics",
    "Narsee Monjee College of Commerce & Economics (NM College)",
    "Sydenham College of Commerce & Economics",
    "Elphinstone College",
    "Wilson College",
    "D.G. Ruparel College",
    "Ramnarain Ruia Autonomous College",
    "K J Somaiya College of Arts & Commerce",
    "SIES College of Arts, Science & Commerce",
    "Guru Nanak Khalsa College",
    "Bhavan's College",
    "St. Andrew's College",
    "V.G. Vaze College",
    "Mulund College of Commerce",
    "Rizvi College of Arts, Science and Commerce",
    "M.M.K. College",
    "L.S. Raheja College of Arts and Commerce",
    "Chetana's H.S. College of Commerce",
    "Birla College (Kalyan)",
    "Patkar-Varde College",
  ],
  "Medical & Pharmacy": [
    "Seth G.S. Medical College & KEM Hospital",
    "Grant Medical College & Sir J.J. Group of Hospitals",
    "Topiwala National Medical College & Nair Hospital",
    "Lokmanya Tilak Municipal Medical College (Sion Hospital)",
    "K J Somaiya Medical College",
    "D.Y. Patil Medical College (Navi Mumbai)",
    "Terna Medical College",
    "MGM Medical College (Navi Mumbai)",
  ],
  "Law, Design & Other": [
    "Government Law College, Mumbai",
    "Rizvi Law College",
    "KES Shri Jayantilal H. Patel Law College",
    "NMIMS (Narsee Monjee Institute of Management Studies)",
    "Sir J.J. School of Art",
    "Sir J.J. Institute of Applied Art",
    "Tata Institute of Social Sciences (TISS)",
  ],
};
const COLLEGES = Object.values(COLLEGE_GROUPS).flat();

// ---------- Verified posters (demo directory) ----------
// In a real build this would be an admin-reviewed table. For this prototype,
// signing up with one of these exact names auto-verifies the account so you
// can see both the "pending" and "verified" posting flows.
const SEED_VERIFIED_COMPANIES = [
  "Zepto",
  "Kotak Mahindra Bank",
  "Tata Consultancy Services (TCS)",
  "Reliance Industries",
  "HDFC Bank",
  "ICICI Bank",
  "Larsen & Toubro (L&T)",
  "Godrej",
  "Mahindra & Mahindra",
  "Wipro",
];
const SEED_VERIFIED_PROFESSORS = ["Prof. Anand Rege", "Prof. Kavita Iyer"];

const initialOpportunities = [
  {
    id: "o1",
    type: "Internship",
    title: "Frontend Intern",
    org: "Zepto",
    description: "Work on the consumer app team building high-traffic React interfaces.",
    stipend: "₹25,000/mo",
    duration: "3 months",
    deadline: "2026-09-10",
    majors: ["Computer Engineering", "BSc Computer Science"],
    postedBy: "Zepto Careers",
    verified: true,
  },
  {
    id: "o2",
    type: "Research",
    title: "Vibration Damping in EV Chassis",
    org: "Prof. Anand Rege · VJTI",
    description: "Studying passive damping materials for lightweight EV frames. Looking for 2 students to assist with lab testing and data logging.",
    stipend: "Unpaid, certificate provided",
    duration: "6 months",
    deadline: "2026-09-01",
    majors: ["Mechanical Engineering"],
    postedBy: "Prof. Anand Rege",
    isResearch: true,
    verified: true,
  },
  {
    id: "o3",
    type: "Internship",
    title: "Data Analyst Intern",
    org: "Kotak Mahindra Bank",
    description: "Support the risk analytics team with dashboards and reporting in Python and SQL.",
    stipend: "₹18,000/mo",
    duration: "4 months",
    deadline: "2026-09-20",
    majors: ["Commerce", "Computer Engineering"],
    postedBy: "Kotak Campus Hiring",
    verified: true,
  },
  {
    id: "o4",
    type: "Research",
    title: "Low-Cost Water Quality Sensors",
    org: "Prof. Kavita Iyer · ICT Mumbai",
    description: "Building an affordable IoT sensor array to test coastal water quality around Mumbai. Recruiting for the field-testing cohort.",
    stipend: "Stipend on completion",
    duration: "5 months",
    deadline: "2026-09-15",
    majors: ["Electronics Engineering", "BSc Physics", "Biotechnology"],
    postedBy: "Prof. Kavita Iyer",
    isResearch: true,
    verified: true,
  },
];

const initialClubs = [
  { id: "c1", name: "Mechanical Engineers' Circle", category: "Major club", major: "Mechanical Engineering", desc: "Design challenges, workshop visits, and SAE India prep.", members: 142, joinType: "open" },
  { id: "c2", name: "Codeware", category: "Major club", major: "Computer Engineering", desc: "Weekly DSA rounds, hackathon squads, and open-source sprints.", members: 261, joinType: "open" },
  { id: "c3", name: "Lens & Light Photography", category: "Interest club", major: null, desc: "Street photography walks across South Bombay and beyond.", members: 89, joinType: "open" },
  { id: "c4", name: "Mumbai Debate Society", category: "Interest club", major: null, desc: "Inter-college BP and Asian parliamentary debate practice.", members: 54, joinType: "approval" },
];

const initialNetwork = [
  { id: "n1", name: "Rhea Kapadia", college: "VJTI Mumbai", major: "Mechanical Engineering", role: "Student", bio: "3rd year, into robotics and CAD.", skills: ["SolidWorks", "MATLAB"] },
  { id: "n2", name: "Prof. Anand Rege", college: "VJTI Mumbai", major: "Mechanical Engineering", role: "Professor", bio: "Researching materials science and EV design.", skills: ["Materials", "FEA"] },
  { id: "n3", name: "Aditya Shah", college: "KJ Somaiya College of Engineering", major: "Computer Engineering", role: "Student", bio: "Building a campus food-delivery app on the side.", skills: ["React", "Node.js"] },
  { id: "n4", name: "Meher D'Souza", college: "St. Xavier's College", major: "BSc Physics", bio: "Astrophysics enthusiast, part of the stargazing club.", role: "Student", skills: ["Python", "Data Analysis"] },
  { id: "n5", name: "Kabir Mehta", college: "NM College", major: "Commerce", role: "Student", bio: "Finance club core member, prepping for CA.", skills: ["Excel", "Valuation"] },
];

const seedChannels = () => {
  const base = {};
  MAJORS.forEach((m) => {
    base[m] = { messages: [], threads: [] };
  });
  base["Computer Engineering"].messages = [
    { id: "m1", user: "Aditya Shah", text: "Anyone else attempting the Zepto frontend intern OA today?", time: "10:12 AM" },
    { id: "m2", user: "Simran Rao", text: "Yeah, just started. The React round looks fair.", time: "10:14 AM" },
  ];
  base["Computer Engineering"].threads = [
    {
      id: "t1",
      title: "Best way to prep for OS viva this sem?",
      body: "Our OS viva covers scheduling + deadlocks heavily. Any resource recs?",
      author: "Simran Rao",
      replies: [
        { id: "r1", user: "Aditya Shah", text: "Gate Smashers playlist on YouTube covers it well.", isBest: false },
        { id: "r2", user: "Devansh Patil", text: "Practice with Galvin's OS book chapter 5 & 7 numericals — that's what got asked last year.", isBest: true },
      ],
    },
  ];
  base["Mechanical Engineering"].messages = [
    { id: "m3", user: "Rhea Kapadia", text: "Prof. Rege's damping research posting looks solid, anyone applying?", time: "9:02 AM" },
  ];
  base["Mechanical Engineering"].threads = [
    {
      id: "t2",
      title: "SolidWorks vs Fusion 360 for our sem project?",
      body: "Which one is actually easier to pick up for the drivetrain assembly project?",
      author: "Rhea Kapadia",
      replies: [
        { id: "r3", user: "Omkar Jadhav", text: "SolidWorks — it's what most Mumbai companies expect on your resume anyway.", isBest: true },
      ],
    },
  ];
  return base;
};

// ---------- Small UI helpers ----------
function Pin() {
  return (
    <div
      className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm"
      style={{ backgroundColor: C.coral, boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
    />
  );
}

function Eyebrow({ children, color = C.teal }) {
  return (
    <div className="text-xs font-bold tracking-[0.18em] uppercase mb-1" style={{ color }}>
      {children}
    </div>
  );
}

function Badge({ children, bg, fg }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

function Card({ children, pinned, className = "", style = {} }) {
  return (
    <div
      className={`relative rounded-2xl p-5 ${className}`}
      style={{ backgroundColor: C.paperCard, border: `1px solid ${C.paperLine}`, boxShadow: "0 1px 2px rgba(27,27,58,0.06)", ...style }}
    >
      {pinned && <Pin />}
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, style = {}, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-transform active:scale-[0.97]"
      style={{ backgroundColor: C.ink, color: C.paper, ...style }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, icon: Icon, active }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-sm border transition-colors"
      style={{
        borderColor: active ? C.teal : C.paperLine,
        backgroundColor: active ? C.tealSoft : "transparent",
        color: active ? C.teal : C.inkSoft,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(27,27,58,0.55)" }}>
      <div className={`rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[85vh] overflow-y-auto`} style={{ backgroundColor: C.paperCard }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: C.paperLine }}>
          <h3 className="font-extrabold text-lg" style={{ color: C.ink }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70" style={{ color: C.inkSoft }}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: `1px solid ${C.paperLine}`,
  backgroundColor: C.paper,
  color: C.ink,
  outline: "none",
  fontSize: "14px",
};

// ---------- Onboarding ----------
const INDUSTRIES = ["Technology", "Finance & Banking", "Consulting", "E-commerce", "Manufacturing", "Healthcare", "Media", "Other"];

function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("2nd Year");
  const [role, setRole] = useState("Student");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [error, setError] = useState("");

  const submit = () => {
    if (role === "Company") {
      if (!name.trim() || !companyName.trim()) {
        setError("Add your name and your company's registered name — we check this against our verified list before you can post internships.");
        return;
      }
      const isVerified = SEED_VERIFIED_COMPANIES.some((c) => c.toLowerCase() === companyName.trim().toLowerCase());
      onComplete({ name, role, companyName: companyName.trim(), industry, college: "", major: "", year: "", isVerified, cvUploaded: false, cvName: "", bio: "", skills: [] });
      return;
    }
    if (!name.trim() || !college || !major) {
      setError("Fill in your name, college, and major to continue — we use this to route you to the right channels and clubs.");
      return;
    }
    const isVerified = role === "Professor" ? SEED_VERIFIED_PROFESSORS.some((p) => p.toLowerCase() === name.trim().toLowerCase()) : false;
    onComplete({ name, college, major, year, role, isVerified, companyName: "", industry: "", cvUploaded: false, cvName: "", bio: "", skills: [] });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: C.ink }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.marigold }}>
            <GraduationCap size={20} color={C.ink} />
          </div>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: C.paper }}>CampusConnect</span>
        </div>
        <div className="rounded-2xl p-7" style={{ backgroundColor: C.paperCard }}>
          <Eyebrow>Before you get in</Eyebrow>
          <h1 className="font-black text-2xl mb-1" style={{ color: C.ink }}>{role === "Company" ? "Tell us about your company" : "Tell us your college & major"}</h1>
          <p className="text-sm mb-5" style={{ color: C.textMuted }}>
            {role === "Company"
              ? "Only verified companies can post internships — this is how we check you against our registry."
              : "This is how we route you to your major's chat, clubs, and relevant opportunities."} You can't skip this step.
          </p>

          <Field label="I am a">
            <div className="flex gap-2">
              {["Student", "Professor", "Company"].map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setError(""); }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border"
                  style={{
                    borderColor: role === r ? C.teal : C.paperLine,
                    backgroundColor: role === r ? C.tealSoft : "transparent",
                    color: role === r ? C.teal : C.inkSoft,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          <Field label={role === "Company" ? "Your name (recruiter / HR contact)" : "Full name"}>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ananya Joshi" />
          </Field>

          {role === "Company" ? (
            <>
              <Field label="Company name (must match your registered name to get verified)">
                <input style={inputStyle} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Zepto" />
              </Field>
              <Field label="Industry">
                <select style={inputStyle} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </Field>
            </>
          ) : (
            <>
              <Field label="College">
                <select style={inputStyle} value={college} onChange={(e) => setCollege(e.target.value)}>
                  <option value="">Select your college ({COLLEGES.length}+ listed)</option>
                  {Object.entries(COLLEGE_GROUPS).map(([group, list]) => (
                    <optgroup label={group} key={group}>
                      {list.map((c) => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  ))}
                  <option value="Other">Other (not listed)</option>
                </select>
              </Field>

              <Field label="Major / Stream">
                <select style={inputStyle} value={major} onChange={(e) => setMajor(e.target.value)}>
                  <option value="">Select your major ({MAJORS.length} branches listed)</option>
                  {Object.entries(BRANCH_GROUPS).map(([group, list]) => (
                    <optgroup label={group} key={group}>
                      {list.map((m) => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>

              <Field label="Year">
                <select style={inputStyle} value={year} onChange={(e) => setYear(e.target.value)}>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"].map((y) => <option key={y}>{y}</option>)}
                </select>
              </Field>
            </>
          )}

          {error && (
            <div className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: C.coralSoft, color: C.coral }}>{error}</div>
          )}

          <PrimaryButton onClick={submit} style={{ width: "100%", justifyContent: "center", backgroundColor: C.marigold, color: C.ink }}>
            Continue to CampusConnect
          </PrimaryButton>
          {role === "Professor" && (
            <p className="text-xs mt-3" style={{ color: C.textMuted }}>
              Professor accounts get a "pending verification" badge until your college email is confirmed — only verified professors can publish research.
            </p>
          )}
          {role === "Company" && (
            <p className="text-xs mt-3" style={{ color: C.textMuted }}>
              Only verified companies can post internships. Unverified accounts can still browse and network while review is pending.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ view, setView, profile }) {
  const items = [{ id: "home", label: "Home", icon: Home }, { id: "opportunities", label: "Internships & Research", icon: Briefcase }];
  if (profile.role !== "Company") {
    items.push({ id: "chat", label: "Major Chat", icon: MessageCircle });
    items.push({ id: "clubs", label: "Clubs", icon: Users });
  }
  items.push({ id: "network", label: "Network", icon: UserPlus });
  items.push({ id: "profile", label: "My Profile", icon: User });
  if (profile.role === "Professor") items.push({ id: "professor", label: "Professor Dashboard", icon: ShieldCheck });
  if (profile.role === "Company") items.push({ id: "company", label: "Company Dashboard", icon: ShieldCheck });

  return (
    <div className="w-64 shrink-0 flex flex-col h-screen sticky top-0" style={{ backgroundColor: C.ink }}>
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.marigold }}>
          <GraduationCap size={18} color={C.ink} />
        </div>
        <span className="font-extrabold text-lg" style={{ color: C.paper }}>CampusConnect</span>
      </div>
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                backgroundColor: active ? C.inkSoft : "transparent",
                color: active ? C.marigold : "#C9C9E8",
                borderLeft: active ? `3px solid ${C.marigold}` : "3px solid transparent",
              }}
            >
              <Icon size={17} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl" style={{ backgroundColor: C.inkSoft }}>
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-bold" style={{ color: C.paper }}>{profile.name}</div>
          {(profile.role === "Company" || profile.role === "Professor") && (
            profile.isVerified
              ? <ShieldCheck size={13} style={{ color: C.marigold }} />
              : <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: C.coral, color: C.paper }}>PENDING</span>
          )}
        </div>
        {profile.role === "Company" ? (
          <>
            <div className="text-xs mt-0.5" style={{ color: "#A6A6D1" }}>{profile.companyName}</div>
            <div className="text-xs" style={{ color: "#A6A6D1" }}>{profile.industry}</div>
          </>
        ) : (
          <>
            <div className="text-xs mt-0.5" style={{ color: "#A6A6D1" }}>{profile.major}</div>
            <div className="text-xs" style={{ color: "#A6A6D1" }}>{profile.college}</div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Home ----------
function HomeView({ profile, setView, opportunities }) {
  const isCompany = profile.role === "Company";
  const relevant = isCompany
    ? opportunities.filter((o) => o.postedBy === (profile.companyName + " Careers") || o.org === profile.companyName).slice(0, 3)
    : opportunities.filter((o) => o.majors.includes(profile.major)).slice(0, 3);

  return (
    <div className="max-w-4xl">
      <Eyebrow>Welcome back</Eyebrow>
      <h1 className="font-black text-3xl mb-1" style={{ color: C.ink }}>Namaste, {profile.name.split(" ")[0]} 👋</h1>
      <p className="mb-8" style={{ color: C.textMuted }}>
        {isCompany
          ? `Here's the latest for ${profile.companyName} on CampusConnect.`
          : `Here's what's relevant to ${profile.major} students at ${profile.college} today.`}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {isCompany ? (
          [
            { label: "Verification status", value: profile.isVerified ? "Verified" : "Pending review", icon: ShieldCheck, color: profile.isVerified ? C.teal : C.coral },
            { label: "Your active postings", value: relevant.length, icon: Briefcase, color: C.marigold },
            { label: "Industry", value: profile.industry, icon: Building2, color: C.teal },
          ].map((s, i) => (
            <Card key={i}>
              <s.icon size={18} style={{ color: s.color }} />
              <div className="mt-3 font-extrabold text-lg" style={{ color: C.ink }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: C.textMuted }}>{s.label}</div>
            </Card>
          ))
        ) : (
          [
            { label: "Open opportunities for you", value: relevant.length, icon: Briefcase, color: C.marigold },
            { label: "Your major's live chat", value: "Active now", icon: MessageCircle, color: C.teal },
            { label: "CV status", value: profile.cvUploaded ? "Uploaded" : "Not uploaded", icon: FileText, color: profile.cvUploaded ? C.teal : C.coral },
          ].map((s, i) => (
            <Card key={i}>
              <s.icon size={18} style={{ color: s.color }} />
              <div className="mt-3 font-extrabold text-lg" style={{ color: C.ink }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: C.textMuted }}>{s.label}</div>
            </Card>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-lg" style={{ color: C.ink }}>{isCompany ? "Your postings" : `Picked for ${profile.major}`}</h2>
        <button onClick={() => setView("opportunities")} className="text-sm font-semibold flex items-center gap-1" style={{ color: C.teal }}>
          View all <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-3">
        {relevant.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>{isCompany ? "You haven't posted anything yet." : "Nothing tagged to your major yet — check the full board."}</p>}
        {relevant.map((o) => (
          <Card key={o.id} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge bg={o.isResearch ? C.tealSoft : C.coralSoft} fg={o.isResearch ? C.teal : C.coral}>{o.type}</Badge>
                <span className="font-bold text-sm" style={{ color: C.ink }}>{o.title}</span>
              </div>
              <div className="text-xs" style={{ color: C.textMuted }}>{o.org} · Deadline {o.deadline}</div>
            </div>
            <ChevronRight size={16} style={{ color: C.textMuted }} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Opportunities ----------
function CvGateModal({ onUpload, onClose }) {
  const [fileName, setFileName] = useState("");
  return (
    <Modal title="Upload your CV to apply" onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: C.textMuted }}>
        Every internship and research application needs your CV on file. Upload it once — we'll reuse it for future applications.
      </p>
      <div className="border-2 border-dashed rounded-xl p-6 text-center mb-4" style={{ borderColor: C.paperLine }}>
        <Upload size={22} style={{ color: C.teal, margin: "0 auto 8px" }} />
        <input
          style={{ ...inputStyle, border: "none", textAlign: "center" }}
          placeholder="Type a filename to simulate upload, e.g. Ananya_Joshi_CV.pdf"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <PrimaryButton
        style={{ width: "100%", justifyContent: "center", backgroundColor: C.teal }}
        icon={Upload}
        onClick={() => fileName.trim() && onUpload(fileName.trim())}
      >
        Save CV & continue
      </PrimaryButton>
    </Modal>
  );
}

function VerifyGateModal({ profile, onClose }) {
  const [requested, setRequested] = useState(false);
  const isCompany = profile.role === "Company";
  return (
    <Modal title={isCompany ? "Company verification required" : "Professor verification required"} onClose={onClose}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={18} style={{ color: C.coral }} />
        <span className="font-bold text-sm" style={{ color: C.coral }}>Pending review</span>
      </div>
      <p className="text-sm mb-4" style={{ color: C.inkSoft }}>
        {isCompany
          ? `Only verified companies can post internships — this keeps the board free of spam and unlisted recruiters. "${profile.companyName}" hasn't been confirmed yet.`
          : `Only verified professors can publish research listings — this confirms you're affiliated with a real Mumbai university department. "${profile.name}" hasn't been confirmed yet.`}
      </p>
      <p className="text-sm mb-5" style={{ color: C.textMuted }}>
        {isCompany
          ? "Verification usually checks your registered company name and official work email domain."
          : "Verification usually checks your college email domain and faculty listing."}
      </p>
      {requested ? (
        <div className="text-sm px-3 py-2.5 rounded-lg" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
          Request sent — reviews are typically completed within 2 business days. We'll email you once you're verified.
        </div>
      ) : (
        <PrimaryButton style={{ width: "100%", justifyContent: "center" }} onClick={() => setRequested(true)}>
          Request verification
        </PrimaryButton>
      )}
    </Modal>
  );
}

function PostOpportunityModal({ onClose, onSubmit, profile }) {
  const isCompany = profile.role === "Company";
  const lockedType = isCompany ? "Internship" : "Research";
  const lockedOrg = isCompany ? profile.companyName : `${profile.name} · ${profile.college}`;
  const [form, setForm] = useState({ title: "", description: "", stipend: "", duration: "", deadline: "", majors: [] });
  const toggleMajor = (m) => setForm((f) => ({ ...f, majors: f.majors.includes(m) ? f.majors.filter((x) => x !== m) : [...f.majors, m] }));
  return (
    <Modal title="Post an opportunity" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
            {lockedType}
          </div>
        </Field>
        <Field label="Posting as">
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
            <ShieldCheck size={14} /> {lockedOrg} · Verified
          </div>
        </Field>
      </div>
      <Field label="Title">
        <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Backend Intern" />
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will the student work on?" />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Stipend"><input style={inputStyle} value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="₹15,000/mo" /></Field>
        <Field label="Duration"><input style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 months" /></Field>
        <Field label="Deadline"><input type="date" style={inputStyle} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
      </div>
      <Field label={`Relevant majors ${form.majors.length ? `(${form.majors.length} selected)` : ""}`}>
        <div className="rounded-xl p-3 max-h-48 overflow-y-auto" style={{ border: `1px solid ${C.paperLine}`, backgroundColor: C.paper }}>
          {Object.entries(BRANCH_GROUPS).map(([group, list]) => (
            <div key={group} className="mb-2 last:mb-0">
              <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: C.textMuted }}>{group}</div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {list.map((m) => (
                  <button key={m} onClick={() => toggleMajor(m)} className="px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: form.majors.includes(m) ? C.teal : C.paperLine, backgroundColor: form.majors.includes(m) ? C.tealSoft : C.paperCard, color: form.majors.includes(m) ? C.teal : C.inkSoft }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Field>
      <PrimaryButton
        style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
        onClick={() => form.title && form.majors.length > 0 && onSubmit({
          ...form,
          id: "o" + Date.now(),
          type: lockedType,
          isResearch: lockedType === "Research",
          org: lockedOrg,
          postedBy: lockedOrg,
          verified: true,
        })}
      >
        Publish listing
      </PrimaryButton>
    </Modal>
  );
}

function OpportunitiesView({ profile, opportunities, setOpportunities, applications, setApplications, onNeedCv }) {
  const [filterMajor, setFilterMajor] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showPost, setShowPost] = useState(false);
  const [showGate, setShowGate] = useState(false);

  const filtered = opportunities.filter(
    (o) => (filterMajor === "All" || o.majors.includes(filterMajor)) && (filterType === "All" || o.type === filterType)
  );

  const apply = (opp) => {
    if (!profile.cvUploaded) { onNeedCv(opp); return; }
    if (applications.find((a) => a.oppId === opp.id)) return;
    setApplications((prev) => [...prev, { id: "a" + Date.now(), oppId: opp.id, title: opp.title, status: "Applied" }]);
  };

  const canPost = (profile.role === "Company" || profile.role === "Professor") && profile.isVerified;
  const postLabel = profile.role === "Company" ? "Post an internship" : "Publish research";

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Eyebrow color={C.coral}>Board</Eyebrow>
          <h1 className="font-black text-3xl" style={{ color: C.ink }}>Internships & Research</h1>
          <p className="text-xs mt-1" style={{ color: C.textMuted }}>Only verified companies and professors can post here.</p>
        </div>
        {profile.role === "Company" || profile.role === "Professor" ? (
          canPost ? (
            <PrimaryButton icon={Plus} onClick={() => setShowPost(true)}>{postLabel}</PrimaryButton>
          ) : (
            <SecondaryButton icon={ShieldCheck} onClick={() => setShowGate(true)}>Get verified to post</SecondaryButton>
          )
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <SecondaryButton active={filterType === "All"} onClick={() => setFilterType("All")}>All types</SecondaryButton>
        <SecondaryButton active={filterType === "Internship"} onClick={() => setFilterType("Internship")}>Internships</SecondaryButton>
        <SecondaryButton active={filterType === "Research"} onClick={() => setFilterType("Research")}>Research</SecondaryButton>
        <span className="mx-1 text-sm" style={{ color: C.paperLine }}>|</span>
        <select style={{ ...inputStyle, width: "auto", padding: "7px 10px" }} value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
          <option value="All">All majors</option>
          {Object.entries(BRANCH_GROUPS).map(([group, list]) => (
            <optgroup label={group} key={group}>
              {list.map((m) => <option key={m} value={m}>{m}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((o) => {
          const applied = applications.find((a) => a.oppId === o.id);
          return (
            <Card key={o.id} pinned>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge bg={o.isResearch ? C.tealSoft : C.coralSoft} fg={o.isResearch ? C.teal : C.coral}>{o.type}</Badge>
                    {o.majors.map((m) => <Badge key={m} bg={C.paper} fg={C.inkSoft}>{m}</Badge>)}
                  </div>
                  <h3 className="font-extrabold text-lg" style={{ color: C.ink }}>{o.title}</h3>
                  <div className="flex items-center gap-1 text-sm mb-2" style={{ color: C.textMuted }}>
                    <Building2 size={13} /> {o.org}
                    {o.verified && (
                      <span className="inline-flex items-center gap-0.5 ml-1" style={{ color: C.teal }} title="Verified poster">
                        <ShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: C.inkSoft }}>{o.description}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color: C.textMuted }}>
                    <span className="flex items-center gap-1"><Award size={12} /> {o.stipend}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {o.duration}</span>
                    <span className="flex items-center gap-1"><Tag size={12} /> Deadline {o.deadline}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {applied ? (
                    <Badge bg={C.tealSoft} fg={C.teal}>
                      <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> {applied.status}</span>
                    </Badge>
                  ) : (
                    <PrimaryButton onClick={() => apply(o)} style={{ backgroundColor: C.marigold, color: C.ink }}>Apply</PrimaryButton>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showPost && (
        <PostOpportunityModal
          profile={profile}
          onClose={() => setShowPost(false)}
          onSubmit={(o) => { setOpportunities((prev) => [o, ...prev]); setShowPost(false); }}
        />
      )}
      {showGate && <VerifyGateModal profile={profile} onClose={() => setShowGate(false)} />}
    </div>
  );
}

// ---------- Chat ----------
function ChatView({ profile, channels, setChannels }) {
  const [active, setActive] = useState(profile.major);
  const [tab, setTab] = useState("chat");
  const [msg, setMsg] = useState("");
  const [openThread, setOpenThread] = useState(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [reply, setReply] = useState("");
  const [channelSearch, setChannelSearch] = useState("");

  const channel = channels[active];

  const sendMsg = () => {
    if (!msg.trim()) return;
    setChannels((prev) => ({
      ...prev,
      [active]: { ...prev[active], messages: [...prev[active].messages, { id: "m" + Date.now(), user: profile.name, text: msg, time: "now" }] },
    }));
    setMsg("");
  };

  const addThread = (title, body) => {
    setChannels((prev) => ({
      ...prev,
      [active]: { ...prev[active], threads: [{ id: "t" + Date.now(), title, body, author: profile.name, replies: [] }, ...prev[active].threads] },
    }));
    setShowNewThread(false);
  };

  const addReply = (threadId) => {
    if (!reply.trim()) return;
    setChannels((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        threads: prev[active].threads.map((t) => t.id === threadId ? { ...t, replies: [...t.replies, { id: "r" + Date.now(), user: profile.name, text: reply, isBest: false }] } : t),
      },
    }));
    setReply("");
  };

  const markBest = (threadId, replyId) => {
    setChannels((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        threads: prev[active].threads.map((t) => t.id === threadId ? { ...t, replies: t.replies.map((r) => ({ ...r, isBest: r.id === replyId })) } : t),
      },
    }));
  };

  const activeThread = openThread ? channel.threads.find((t) => t.id === openThread) : null;

  return (
    <div className="max-w-6xl h-[calc(100vh-4rem)] flex gap-5">
      {/* channel list */}
      <div className="w-64 shrink-0 flex flex-col">
        <Eyebrow>Major channels ({MAJORS.length})</Eyebrow>
        <div className="relative mt-2 mb-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
          <input
            style={{ ...inputStyle, paddingLeft: 28, padding: "7px 10px 7px 28px", fontSize: 13 }}
            placeholder="Search channels"
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
          />
        </div>
        <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 12rem)" }}>
          {Object.entries(BRANCH_GROUPS).map(([group, list]) => {
            const visible = list.filter((m) => m.toLowerCase().includes(channelSearch.toLowerCase()));
            if (visible.length === 0) return null;
            return (
              <div key={group}>
                <div className="text-[10px] font-bold uppercase tracking-wide mb-1 px-1" style={{ color: C.textMuted }}>{group}</div>
                <div className="space-y-0.5">
                  {visible.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setActive(m); setOpenThread(null); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                      style={{ backgroundColor: active === m ? C.tealSoft : "transparent", color: active === m ? C.teal : C.inkSoft }}
                    >
                      <Hash size={13} className="shrink-0" /> <span className="truncate">{m}</span>
                      {m === profile.major && <span className="ml-auto text-[9px] font-bold shrink-0" style={{ color: C.marigoldDark }}>YOURS</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* main pane */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: C.paperCard, border: `1px solid ${C.paperLine}` }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.paperLine }}>
          <div>
            <h2 className="font-extrabold" style={{ color: C.ink }}># {active}</h2>
          </div>
          <div className="flex gap-2">
            <SecondaryButton active={tab === "chat"} onClick={() => setTab("chat")} icon={MessageCircle}>Live chat</SecondaryButton>
            <SecondaryButton active={tab === "qa"} onClick={() => { setTab("qa"); setOpenThread(null); }} icon={Sparkles}>Q&A threads</SecondaryButton>
          </div>
        </div>

        {tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {channel.messages.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>No messages yet — say hi to your {active} batchmates.</p>}
              {channel.messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ backgroundColor: C.marigold, color: C.ink }}>
                    {m.user.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm" style={{ color: C.ink }}>{m.user}</span>
                      <span className="text-xs" style={{ color: C.textMuted }}>{m.time}</span>
                    </div>
                    <p className="text-sm" style={{ color: C.inkSoft }}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2" style={{ borderColor: C.paperLine }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder={`Message #${active}`}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              />
              <PrimaryButton icon={Send} onClick={sendMsg}>Send</PrimaryButton>
            </div>
          </>
        )}

        {tab === "qa" && !activeThread && (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex justify-end mb-4">
              <PrimaryButton icon={Plus} onClick={() => setShowNewThread(true)}>Ask a question</PrimaryButton>
            </div>
            <div className="space-y-3">
              {channel.threads.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>No questions yet in this channel — be the first to ask.</p>}
              {channel.threads.map((t) => {
                const best = t.replies.find((r) => r.isBest);
                return (
                  <Card key={t.id} className="cursor-pointer" style={{}}>
                    <div onClick={() => setOpenThread(t.id)}>
                      <h4 className="font-bold text-sm mb-1" style={{ color: C.ink }}>{t.title}</h4>
                      <p className="text-xs mb-2" style={{ color: C.textMuted }}>Asked by {t.author} · {t.replies.length} replies</p>
                      {best && <Badge bg={C.tealSoft} fg={C.teal}><span className="inline-flex items-center gap-1"><CheckCircle2 size={11} /> Answered</span></Badge>}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {tab === "qa" && activeThread && (
          <div className="flex-1 overflow-y-auto p-5">
            <button onClick={() => setOpenThread(null)} className="flex items-center gap-1 text-sm font-semibold mb-4" style={{ color: C.teal }}>
              <ArrowLeft size={14} /> Back to threads
            </button>
            <h3 className="font-extrabold text-lg mb-1" style={{ color: C.ink }}>{activeThread.title}</h3>
            <p className="text-xs mb-3" style={{ color: C.textMuted }}>Asked by {activeThread.author}</p>
            <p className="text-sm mb-5" style={{ color: C.inkSoft }}>{activeThread.body}</p>

            <div className="space-y-3 mb-5">
              {activeThread.replies.map((r) => (
                <Card key={r.id} style={{ backgroundColor: r.isBest ? C.tealSoft : C.paper, borderColor: r.isBest ? C.teal : C.paperLine }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm" style={{ color: C.ink }}>{r.user}</span>
                        {r.isBest && <Badge bg={C.teal} fg={C.paper}><span className="inline-flex items-center gap-1"><Star size={10} /> Best answer</span></Badge>}
                      </div>
                      <p className="text-sm" style={{ color: C.inkSoft }}>{r.text}</p>
                    </div>
                    {activeThread.author === profile.name && !r.isBest && (
                      <button onClick={() => markBest(activeThread.id, r.id)} className="text-xs font-semibold shrink-0" style={{ color: C.teal }}>Mark best</button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Write a reply..." value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReply(activeThread.id)} />
              <PrimaryButton icon={Send} onClick={() => addReply(activeThread.id)}>Reply</PrimaryButton>
            </div>
          </div>
        )}
      </div>

      {showNewThread && (
        <NewThreadModal onClose={() => setShowNewThread(false)} onSubmit={addThread} />
      )}
    </div>
  );
}

function NewThreadModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <Modal title="Ask a question" onClose={onClose}>
      <Field label="Question title">
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best resources for thermodynamics CIE?" />
      </Field>
      <Field label="Details">
        <textarea style={{ ...inputStyle, minHeight: 90 }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add context so people can actually help." />
      </Field>
      <PrimaryButton style={{ width: "100%", justifyContent: "center" }} onClick={() => title.trim() && onSubmit(title, body)}>Post question</PrimaryButton>
    </Modal>
  );
}

// ---------- Clubs ----------
function ClubsView({ profile, clubs, setClubs }) {
  const [showCreate, setShowCreate] = useState(false);
  const [joined, setJoined] = useState({});

  const toggleJoin = (id) => setJoined((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Eyebrow color={C.marigoldDark}>Community</Eyebrow>
          <h1 className="font-black text-3xl" style={{ color: C.ink }}>Clubs</h1>
        </div>
        <PrimaryButton icon={Plus} onClick={() => setShowCreate(true)}>Create a club</PrimaryButton>
      </div>

      <h2 className="font-extrabold text-sm uppercase tracking-wide mb-3" style={{ color: C.teal }}>Suggested for {profile.major}</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {clubs.filter((c) => c.major === profile.major).map((c) => (
          <ClubCard key={c.id} club={c} joined={joined[c.id]} onToggle={() => toggleJoin(c.id)} />
        ))}
      </div>

      <h2 className="font-extrabold text-sm uppercase tracking-wide mb-3" style={{ color: C.teal }}>All clubs</h2>
      <div className="grid grid-cols-2 gap-4">
        {clubs.map((c) => (
          <ClubCard key={c.id} club={c} joined={joined[c.id]} onToggle={() => toggleJoin(c.id)} />
        ))}
      </div>

      {showCreate && (
        <CreateClubModal
          onClose={() => setShowCreate(false)}
          onSubmit={(c) => { setClubs((prev) => [c, ...prev]); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function ClubCard({ club, joined, onToggle }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <Badge bg={club.major ? C.tealSoft : C.coralSoft} fg={club.major ? C.teal : C.coral}>{club.category}</Badge>
        <span className="text-xs font-semibold" style={{ color: C.textMuted }}>{club.members} members</span>
      </div>
      <h3 className="font-extrabold" style={{ color: C.ink }}>{club.name}</h3>
      <p className="text-sm my-2" style={{ color: C.inkSoft }}>{club.desc}</p>
      <SecondaryButton active={joined} onClick={onToggle} icon={joined ? CheckCircle2 : Plus}>
        {joined ? "Joined" : club.joinType === "approval" ? "Request to join" : "Join club"}
      </SecondaryButton>
    </Card>
  );
}

function CreateClubModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", desc: "", category: "Interest club", major: "", joinType: "open" });
  return (
    <Modal title="Create a club" onClose={onClose}>
      <Field label="Club name"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 70 }} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></Field>
      <Field label="Type">
        <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, major: e.target.value === "Interest club" ? "" : form.major })}>
          <option>Interest club</option>
          <option>Major club</option>
        </select>
      </Field>
      {form.category === "Major club" && (
        <Field label="Major">
          <select style={inputStyle} value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })}>
            <option value="">Select major</option>
            {Object.entries(BRANCH_GROUPS).map(([group, list]) => (
              <optgroup label={group} key={group}>
                {list.map((m) => <option key={m} value={m}>{m}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
      )}
      <Field label="Joining">
        <div className="flex gap-2">
          {["open", "approval"].map((j) => (
            <button key={j} onClick={() => setForm({ ...form, joinType: j })} className="flex-1 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: form.joinType === j ? C.teal : C.paperLine, backgroundColor: form.joinType === j ? C.tealSoft : "transparent", color: form.joinType === j ? C.teal : C.inkSoft }}>
              {j === "open" ? "Open join" : "Approval needed"}
            </button>
          ))}
        </div>
      </Field>
      <PrimaryButton
        style={{ width: "100%", justifyContent: "center" }}
        onClick={() => form.name && onSubmit({ ...form, id: "c" + Date.now(), members: 1, major: form.major || null })}
      >
        Create club
      </PrimaryButton>
    </Modal>
  );
}

// ---------- Network ----------
function NetworkView({ profile, people }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({});

  const cycle = (id) => setStatus((prev) => ({ ...prev, [id]: prev[id] === "Connected" ? "Connected" : prev[id] === "Pending" ? "Connected" : "Pending" }));

  const filtered = people.filter((p) => (p.name + p.college + p.major).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl">
      <Eyebrow color={C.coral}>Network</Eyebrow>
      <h1 className="font-black text-3xl mb-4" style={{ color: C.ink }}>Find people across Mumbai colleges</h1>
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
        <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search by name, college, or major" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
                {p.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm" style={{ color: C.ink }}>{p.name}</h3>
                  {p.role === "Professor" && <Badge bg={C.marigold} fg={C.ink}>Professor</Badge>}
                </div>
                <div className="text-xs" style={{ color: C.textMuted }}>{p.major} · {p.college}</div>
                <p className="text-sm mt-1.5 mb-2" style={{ color: C.inkSoft }}>{p.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.skills.map((s) => <Badge key={s} bg={C.paper} fg={C.inkSoft}>{s}</Badge>)}
                </div>
                <SecondaryButton active={!!status[p.id]} onClick={() => cycle(p.id)} icon={status[p.id] === "Connected" ? CheckCircle2 : UserPlus}>
                  {status[p.id] === "Connected" ? "Connected" : status[p.id] === "Pending" ? "Request sent" : "Connect"}
                </SecondaryButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Profile ----------
function ProfileView({ profile, applications, onNeedCv }) {
  const isCompany = profile.role === "Company";
  const isPoster = profile.role === "Company" || profile.role === "Professor";
  return (
    <div className="max-w-3xl">
      <Eyebrow>Your profile</Eyebrow>
      <div className="flex items-center gap-2 mb-6">
        <h1 className="font-black text-3xl" style={{ color: C.ink }}>{profile.name}</h1>
        {isPoster && (
          profile.isVerified
            ? <Badge bg={C.tealSoft} fg={C.teal}><span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> Verified</span></Badge>
            : <Badge bg={C.coralSoft} fg={C.coral}>Pending verification</Badge>
        )}
      </div>

      <Card className="mb-4">
        {isCompany ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Company</span>{profile.companyName}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Industry</span>{profile.industry}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Role</span>{profile.role}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Status</span>{profile.isVerified ? "Verified — can post internships" : "Pending review"}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>College</span>{profile.college}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Major</span>{profile.major}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Year</span>{profile.year}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Role</span>{profile.role}</div>
          </div>
        )}
      </Card>

      {!isCompany && (
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: C.ink }}>CV</h3>
              <p className="text-sm" style={{ color: C.textMuted }}>{profile.cvUploaded ? profile.cvName : "No CV uploaded yet — required to apply for internships or research."}</p>
            </div>
            {profile.cvUploaded ? <Badge bg={C.tealSoft} fg={C.teal}>On file</Badge> : <PrimaryButton icon={Upload} onClick={onNeedCv}>Upload CV</PrimaryButton>}
          </div>
        </Card>
      )}

      {!isCompany && (
        <Card>
          <h3 className="font-extrabold mb-3" style={{ color: C.ink }}>My applications</h3>
          {applications.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>You haven't applied to anything yet.</p>}
          <div className="space-y-2">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: C.paperLine }}>
                <span className="text-sm font-semibold" style={{ color: C.ink }}>{a.title}</span>
                <Badge bg={C.tealSoft} fg={C.teal}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------- Verified-poster dashboard (Professor & Company) ----------
function PosterDashboard({ profile, opportunities }) {
  const isCompany = profile.role === "Company";
  const identity = isCompany ? profile.companyName : profile.name;
  const mine = opportunities.filter((o) => o.postedBy === identity || o.org === identity);
  return (
    <div className="max-w-4xl">
      <Eyebrow color={C.marigoldDark}>{isCompany ? "Company tools" : "Professor tools"}</Eyebrow>
      <h1 className="font-black text-3xl mb-2" style={{ color: C.ink }}>{isCompany ? "Company Dashboard" : "Professor Dashboard"}</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>
        {isCompany
          ? `Post internships from the Internships & Research board once "${identity}" is verified.`
          : `Publish research from the Internships & Research board once your professor account is verified.`}
      </p>
      {profile.isVerified ? (
        <Card className="mb-4" style={{ backgroundColor: C.tealSoft, borderColor: "transparent" }}>
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: C.teal }}>
            <ShieldCheck size={16} /> Verified — your postings carry a verified badge visible to students.
          </p>
        </Card>
      ) : (
        <Card className="mb-4" style={{ backgroundColor: C.coralSoft, borderColor: "transparent" }}>
          <p className="text-sm font-semibold" style={{ color: C.coral }}>
            Verification pending — {isCompany ? "once your company is confirmed against our registry" : "once your college email is confirmed"}, you'll be able to post here.
          </p>
        </Card>
      )}
      <h3 className="font-extrabold mb-3" style={{ color: C.ink }}>Your postings</h3>
      {mine.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>You haven't published anything yet.</p>}
      <div className="space-y-3">
        {mine.map((o) => (
          <Card key={o.id}>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold" style={{ color: C.ink }}>{o.title}</h4>
              {o.verified && <ShieldCheck size={13} style={{ color: C.teal }} />}
            </div>
            <p className="text-xs" style={{ color: C.textMuted }}>{o.majors.join(", ")}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("home");
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [applications, setApplications] = useState([]);
  const [clubs, setClubs] = useState(initialClubs);
  const [channels, setChannels] = useState(seedChannels());
  const [cvModalOpp, setCvModalOpp] = useState(null);
  const [cvModalOpen, setCvModalOpen] = useState(false);

  if (!profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  const handleCvUpload = (fileName) => {
    setProfile((p) => ({ ...p, cvUploaded: true, cvName: fileName }));
    setCvModalOpen(false);
    if (cvModalOpp) {
      setApplications((prev) => [...prev, { id: "a" + Date.now(), oppId: cvModalOpp.id, title: cvModalOpp.title, status: "Applied" }]);
      setCvModalOpp(null);
    }
  };

  const requestCv = (opp) => {
    setCvModalOpp(opp || null);
    setCvModalOpen(true);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.paper, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar view={view} setView={setView} profile={profile} />
      <div className="flex-1 p-8 overflow-y-auto">
        {view === "home" && <HomeView profile={profile} setView={setView} opportunities={opportunities} />}
        {view === "opportunities" && (
          <OpportunitiesView
            profile={profile}
            opportunities={opportunities}
            setOpportunities={setOpportunities}
            applications={applications}
            setApplications={setApplications}
            onNeedCv={requestCv}
          />
        )}
        {view === "chat" && profile.role !== "Company" && <ChatView profile={profile} channels={channels} setChannels={setChannels} />}
        {view === "clubs" && profile.role !== "Company" && <ClubsView profile={profile} clubs={clubs} setClubs={setClubs} />}
        {view === "network" && <NetworkView profile={profile} people={initialNetwork} />}
        {view === "profile" && <ProfileView profile={profile} applications={applications} onNeedCv={() => requestCv(null)} />}
        {view === "professor" && profile.role === "Professor" && <PosterDashboard profile={profile} opportunities={opportunities} />}
        {view === "company" && profile.role === "Company" && <PosterDashboard profile={profile} opportunities={opportunities} />}
      </div>
      {cvModalOpen && <CvGateModal onUpload={handleCvUpload} onClose={() => setCvModalOpen(false)} />}
    </div>
  );
}

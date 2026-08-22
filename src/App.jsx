import React, { useState, useEffect, useRef } from "react";
import {
  Home, Briefcase, MessageCircle, Users, UserPlus, User, GraduationCap,
  Search, Plus, X, Upload, CheckCircle2, Send, Award, Building2, Calendar,
  MapPin, Tag, ChevronRight, Star, ShieldCheck, FileText, Hash, ThumbsUp,
  ArrowLeft, Sparkles, Bell, UserCheck, Menu, Heart, MessageSquare
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

// Discord-inspired palette, scoped to the Major Chat section only.
const DC = {
  bgSidebar: "#2b2d31",
  bgMain: "#313338",
  bgMember: "#2b2d31",
  bgActive: "#404249",
  bgHover: "#35373c",
  bgInput: "#383a40",
  textPrimary: "#f2f3f5",
  textMuted: "#949ba4",
  textFaint: "#6d6f78",
  brand: "#5865f2",
  online: "#23a55a",
  divider: "#26272b",
};
const AVATAR_COLORS = ["#F2A93B", "#0E7C7B", "#E4572E", "#5865F2", "#57F287", "#EB459E", "#FEE75C"];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function colorForName(name) {
  return AVATAR_COLORS[hashStr(name) % AVATAR_COLORS.length];
}
const FILLER_MEMBERS = [
  "Isha Nair", "Rohan Kulkarni", "Sanaya Katrak", "Arjun Bhatia", "Neha Deshmukh",
  "Vivaan Shetty", "Ananya Bose", "Yash Chheda", "Priya Menon", "Karan Oberoi",
  "Tanya Sequeira", "Dev Patil", "Riya Gala", "Aryan Khanna", "Simran Chawla",
  "Farhan Sheikh", "Ishita Save", "Rutuja More", "Zaid Contractor", "Alisha Pinto",
];
function getChannelMembers(channelName, profile) {
  const matched = initialNetwork.filter((p) => p.major === channelName).map((p) => p.name);
  const h = hashStr(channelName);
  const onlineFillerCount = 3 + (h % 5);
  const offlineCount = 2 + (h % 3);
  const pool = FILLER_MEMBERS.filter((n) => !matched.includes(n));
  const start = h % pool.length;
  const picked = [];
  for (let i = 0; i < onlineFillerCount + offlineCount; i++) picked.push(pool[(start + i) % pool.length]);
  let online = [...matched, ...picked.slice(0, onlineFillerCount)];
  const offline = picked.slice(onlineFillerCount);
  if (channelName === profile.major) online = [profile.name, ...online];
  return { online: [...new Set(online)], offline: [...new Set(offline)] };
}

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

// Google verification: instead of typing an exact name, an account can verify
// by "signing in with Google" and having their work/college email domain checked
// against known domains. This is mocked (no real OAuth) but the domain-check
// logic mirrors how a real Google Workspace verification would work.
const KNOWN_COMPANY_DOMAINS = {
  "zepto.com": "Zepto",
  "kotak.com": "Kotak Mahindra Bank",
  "tcs.com": "Tata Consultancy Services (TCS)",
  "ril.com": "Reliance Industries",
  "hdfcbank.com": "HDFC Bank",
  "icicibank.com": "ICICI Bank",
  "larsentoubro.com": "Larsen & Toubro (L&T)",
  "godrej.com": "Godrej",
  "mahindra.com": "Mahindra & Mahindra",
  "wipro.com": "Wipro",
};
const COLLEGE_EMAIL_SUFFIXES = [".ac.in", ".edu.in", ".edu"];
const MOCK_GOOGLE_ACCOUNTS = [
  { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
  { name: "Aakash Mehta", email: "recruiter@zepto.com" },
  { name: "Anand Rege", email: "anand.rege@vjti.ac.in" },
  { name: "Sneha Iyer", email: "hr@kotak.com" },
  { name: "Rahul Jain", email: "founder@unknownstartup.io" },
];
function emailDomain(email) {
  return email.split("@")[1] || "";
}
function isCollegeDomain(domain) {
  return COLLEGE_EMAIL_SUFFIXES.some((suf) => domain.endsWith(suf));
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.8 4.2-17 10.3z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.3 5.3C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function GoogleButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm border transition-colors"
      style={{ borderColor: "#dadce0", backgroundColor: "#fff", color: "#3c4043", ...style }}
    >
      <GoogleIcon size={17} />
      {children}
    </button>
  );
}

function GoogleAccountPicker({ onClose, onSelect }) {
  return (
    <Modal title="Sign in with Google" onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: C.textMuted }}>Choose an account to continue.</p>
      <div className="space-y-1">
        {MOCK_GOOGLE_ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            onClick={() => onSelect(acc)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:opacity-80"
            style={{ border: `1px solid ${C.paperLine}` }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: colorForName(acc.name), color: "#1e1f22" }}>
              {acc.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{acc.name}</div>
              <div className="text-xs truncate" style={{ color: C.textMuted }}>{acc.email}</div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-[11px] mt-4" style={{ color: C.textMuted }}>
        This is a simulated Google sign-in for the prototype — no real Google account data is used.
      </p>
    </Modal>
  );
}

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
  {
    id: "o5",
    type: "Internship",
    title: "Software Testing Intern",
    org: "Wipro",
    description: "Join the QA automation team writing test suites for enterprise SaaS products.",
    stipend: "₹15,000/mo",
    duration: "3 months",
    deadline: "2026-09-25",
    majors: ["Computer Engineering", "Information Technology", "BSc Information Technology"],
    postedBy: "Wipro",
    verified: true,
  },
  {
    id: "o6",
    type: "Internship",
    title: "Cloud Support Intern",
    org: "Tata Consultancy Services (TCS)",
    description: "Assist enterprise clients with AWS/Azure migration tickets and basic scripting fixes.",
    stipend: "₹20,000/mo",
    duration: "6 months",
    deadline: "2026-10-01",
    majors: ["Computer Engineering", "Information Technology", "AI & Machine Learning"],
    postedBy: "Tata Consultancy Services (TCS)",
    verified: true,
  },
  {
    id: "o7",
    type: "Internship",
    title: "Credit Risk Analyst Intern",
    org: "HDFC Bank",
    description: "Support the retail lending team with credit scoring models and portfolio reports.",
    stipend: "₹20,000/mo",
    duration: "4 months",
    deadline: "2026-09-18",
    majors: ["Commerce", "Economics", "BFM (Financial Markets)", "BCom Banking & Insurance"],
    postedBy: "HDFC Bank",
    verified: true,
  },
  {
    id: "o8",
    type: "Internship",
    title: "Digital Marketing Intern",
    org: "ICICI Bank",
    description: "Run campaign analytics and content calendars for ICICI's digital banking products.",
    stipend: "₹12,000/mo",
    duration: "3 months",
    deadline: "2026-09-12",
    majors: ["BMS (Management Studies)", "Mass Media (BMM)", "Commerce"],
    postedBy: "ICICI Bank",
    verified: true,
  },
  {
    id: "o9",
    type: "Internship",
    title: "Site Engineering Intern",
    org: "Larsen & Toubro (L&T)",
    description: "Shadow site engineers on an ongoing Mumbai metro civil works package — surveying, quality checks, and daily progress reporting.",
    stipend: "₹18,000/mo",
    duration: "6 months",
    deadline: "2026-10-05",
    majors: ["Civil Engineering"],
    postedBy: "Larsen & Toubro (L&T)",
    verified: true,
  },
  {
    id: "o10",
    type: "Internship",
    title: "Product Design Intern",
    org: "Godrej",
    description: "Work with the appliances design studio on CAD models, prototyping, and user testing for a new refrigerator line.",
    stipend: "₹16,000/mo",
    duration: "4 months",
    deadline: "2026-09-28",
    majors: ["Mechanical Engineering", "Production Engineering", "Interior Design"],
    postedBy: "Godrej",
    verified: true,
  },
  {
    id: "o11",
    type: "Internship",
    title: "Automobile R&D Intern",
    org: "Mahindra & Mahindra",
    description: "Support the EV powertrain team with bench testing, data logging, and report writing.",
    stipend: "₹22,000/mo",
    duration: "6 months",
    deadline: "2026-10-10",
    majors: ["Automobile Engineering", "Mechanical Engineering", "Electrical Engineering"],
    postedBy: "Mahindra & Mahindra",
    verified: true,
  },
  {
    id: "o12",
    type: "Internship",
    title: "Process Engineering Intern",
    org: "Reliance Industries",
    description: "Assist plant engineers with process optimization studies and safety audits at a petrochemical facility near Mumbai.",
    stipend: "₹25,000/mo",
    duration: "5 months",
    deadline: "2026-09-30",
    majors: ["Chemical Engineering", "Instrumentation Engineering"],
    postedBy: "Reliance Industries",
    verified: true,
  },
  {
    id: "o13",
    type: "Internship",
    title: "Supply Chain Analytics Intern",
    org: "Zepto",
    description: "Build dashboards forecasting dark-store demand and delivery times across Mumbai zones.",
    stipend: "₹22,000/mo",
    duration: "3 months",
    deadline: "2026-09-22",
    majors: ["BSc Statistics", "Commerce", "Computer Engineering", "Economics"],
    postedBy: "Zepto Careers",
    verified: true,
  },
  {
    id: "o14",
    type: "Internship",
    title: "Legal & Compliance Intern",
    org: "Kotak Mahindra Bank",
    description: "Assist the compliance desk with regulatory filings, contract review, and KYC policy documentation.",
    stipend: "₹15,000/mo",
    duration: "3 months",
    deadline: "2026-09-16",
    majors: ["BA LLB", "BBA LLB", "LLB"],
    postedBy: "Kotak Campus Hiring",
    verified: true,
  },
  {
    id: "o15",
    type: "Internship",
    title: "Content & Social Media Intern",
    org: "Zepto",
    description: "Write and schedule social content, and help plan influencer collabs for city-specific campaigns.",
    stipend: "₹10,000/mo",
    duration: "3 months",
    deadline: "2026-09-14",
    majors: ["Mass Media (BMM)", "English Literature", "BMS (Management Studies)"],
    postedBy: "Zepto Careers",
    verified: true,
  },
];

const CLUB_ICONS = ["⚙️", "💻", "📷", "🎤", "🎨", "🎭", "♟️", "🏏", "🎵", "🌱", "🚀", "📚", "🧪", "⚖️", "🩺", "🎬"];
const CLUB_COLORS = ["#F2A93B", "#0E7C7B", "#E4572E", "#5865F2", "#57F287", "#EB459E", "#9B59B6", "#3498DB"];

const initialClubs = [
  {
    id: "c1", name: "Mechanical Engineers' Circle", category: "Major club", major: "Mechanical Engineering",
    icon: "🛠️", color: "#F2A93B", tagline: "Design, build, break, repeat.",
    desc: "Design challenges, workshop visits, and SAE India prep. We run a termly build sprint culminating in a demo day judged by alumni.",
    members: 142, joinType: "open", tags: ["SAE India", "CAD", "Workshops"],
    founded: 2019, activity: "Very active", officers: ["Rhea Kapadia", "Omkar Jadhav"],
    events: [
      { title: "Baja SAE design review", date: "Aug 28", location: "Workshop Lab, VJTI", attendees: 34, rsvpedByMe: false },
      { title: "Factory visit — Mahindra plant", date: "Sep 5", location: "Kandivali", attendees: 28, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Demo day judging panel confirmed — two alumni from Mahindra R&D joining this year.", ts: Date.now() - 1000 * 60 * 60 * 6 },
      { text: "Chassis sub-team needs 2 more members before Friday's sprint.", ts: Date.now() - 1000 * 60 * 60 * 30 },
    ],
  },
  {
    id: "c2", name: "Codeware", category: "Major club", major: "Computer Engineering",
    icon: "💻", color: "#0E7C7B", tagline: "DSA by day, hackathons by night.",
    desc: "Weekly DSA rounds, hackathon squads, and open-source sprints. We've placed teams in the top 10 at Smart India Hackathon two years running.",
    members: 261, joinType: "open", tags: ["Hackathons", "Open Source", "DSA"],
    founded: 2018, activity: "Very active", officers: ["Aditya Shah", "Simran Rao"],
    events: [
      { title: "Contest #14 — Codeforces div 3 watch party", date: "Aug 24", location: "CS Lab 2", attendees: 52, rsvpedByMe: false },
      { title: "Open-source sprint: first PR day", date: "Aug 30", location: "Online", attendees: 37, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Team formation for Smart India Hackathon closes this weekend — DM if you need teammates.", ts: Date.now() - 1000 * 60 * 45 },
      { text: "Recording from last week's system design session is up in the channel.", ts: Date.now() - 1000 * 60 * 60 * 20 },
    ],
  },
  {
    id: "c3", name: "Lens & Light Photography", category: "Interest club", major: null,
    icon: "📸", color: "#E4572E", tagline: "Chasing golden hour across Bombay.",
    desc: "Street photography walks across South Bombay and beyond, plus monthly print critiques and a end-of-year gallery show.",
    members: 89, joinType: "open", tags: ["Street Photography", "Film", "Editing"],
    founded: 2021, activity: "Steady", officers: ["Meher D'Souza"],
    events: [
      { title: "Sunday walk: Bandra bandstand at sunrise", date: "Aug 23", location: "Bandra", attendees: 19, rsvpedByMe: false },
      { title: "Print critique night", date: "Sep 2", location: "Fine Arts Room", attendees: 14, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Bring your own film or borrow a camera from the club kit for Sunday's walk.", ts: Date.now() - 1000 * 60 * 60 * 3 },
    ],
  },
  {
    id: "c4", name: "Mumbai Debate Society", category: "Interest club", major: null,
    icon: "🎤", color: "#8B5CF6", tagline: "Change my mind — properly, this time.",
    desc: "Inter-college BP and Asian parliamentary debate practice, with a competitive circuit team that travels to nationals.",
    members: 54, joinType: "approval", tags: ["British Parliamentary", "Public Speaking"],
    founded: 2017, activity: "Steady", officers: ["Kabir Mehta"],
    events: [
      { title: "Novice debate bootcamp", date: "Aug 26", location: "Seminar Hall 3", attendees: 22, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Nationals squad shortlist goes up Monday after this week's practice rounds.", ts: Date.now() - 1000 * 60 * 60 * 12 },
    ],
  },
  {
    id: "c5", name: "E-Cell Mumbai", category: "Interest club", major: null,
    icon: "🚀", color: "#D6890F", tagline: "Turn your side project into a startup.",
    desc: "Pitch nights, founder AMAs, and a pre-seed pitch competition with real investor judges every spring.",
    members: 176, joinType: "open", tags: ["Startups", "Pitching", "Networking"],
    founded: 2020, activity: "Very active", officers: ["Aditya Shah"],
    events: [
      { title: "Founder AMA: Zepto co-founder", date: "Sep 1", location: "Auditorium", attendees: 61, rsvpedByMe: false },
      { title: "Pitch night — round 1", date: "Sep 10", location: "Innovation Cell", attendees: 33, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Applications for the pre-seed pitch competition open next week.", ts: Date.now() - 1000 * 60 * 60 * 9 },
    ],
  },
  {
    id: "c6", name: "Civil Builders Guild", category: "Major club", major: "Civil Engineering",
    icon: "🏗️", color: "#3B7A78", tagline: "From blueprints to site visits.",
    desc: "Site visits, structural design competitions, and a mentorship track with practicing civil engineers in Mumbai.",
    members: 67, joinType: "open", tags: ["Site Visits", "AutoCAD", "Structures"],
    founded: 2019, activity: "Steady", officers: ["Devansh Patil"],
    events: [
      { title: "Metro line site visit", date: "Aug 29", location: "Mumbai Metro Line 3", attendees: 24, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Structural design competition brief released — teams of 3, submissions due Sep 20.", ts: Date.now() - 1000 * 60 * 60 * 15 },
    ],
  },
  {
    id: "c7", name: "Finance & Investment Club", category: "Interest club", major: "Commerce",
    icon: "📈", color: "#22A55A", tagline: "Reading balance sheets for fun.",
    desc: "Stock pitch competitions, a paper trading league, and CA/CFA prep groups that run through exam season.",
    members: 134, joinType: "open", tags: ["Stock Pitches", "CFA Prep", "Trading League"],
    founded: 2018, activity: "Very active", officers: ["Kabir Mehta"],
    events: [
      { title: "Paper trading league kickoff", date: "Aug 25", location: "Commerce Block", attendees: 45, rsvpedByMe: false },
    ],
    announcements: [
      { text: "This month's stock pitch winner gets a shadow day at Kotak's equity research desk.", ts: Date.now() - 1000 * 60 * 60 * 18 },
    ],
  },
  {
    id: "c8", name: "Acapella Collective", category: "Interest club", major: null,
    icon: "🎵", color: "#EC4899", tagline: "No instruments, all vibes.",
    desc: "Weekly rehearsals building toward inter-college acapella competitions and a winter showcase.",
    members: 48, joinType: "approval", tags: ["Vocals", "Beatboxing", "Performance"],
    founded: 2023, activity: "New", officers: ["Tanya Sequeira"],
    events: [
      { title: "Open audition day", date: "Aug 27", location: "Music Room", attendees: 17, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Auditions open to all years this cycle — no prior acapella experience needed.", ts: Date.now() - 1000 * 60 * 60 * 26 },
    ],
  },
  {
    id: "c9", name: "Kaleidoscope Dramatics", category: "Interest club", major: null,
    icon: "🎭", color: "#C2410C", tagline: "Drama that isn't just group chats.",
    desc: "Original scripts, an annual one-act festival, and backstage crews for lighting, sets, and sound.",
    members: 72, joinType: "open", tags: ["Theatre", "Scriptwriting", "Stage Craft"],
    founded: 2016, activity: "Steady", officers: ["Farhan Sheikh"],
    events: [
      { title: "One-act festival auditions", date: "Sep 3", location: "Black Box Theatre", attendees: 20, rsvpedByMe: false },
    ],
    announcements: [],
  },
  {
    id: "c10", name: "Competitive Coding Club", category: "Major club", major: "Computer Engineering",
    icon: "⚡", color: "#3B82F6", tagline: "Rated contests, unrated banter.",
    desc: "ICPC-style training, weekly rated contests, and a mentorship ladder pairing Div 1 coders with beginners.",
    members: 198, joinType: "open", tags: ["ICPC", "Competitive Programming"],
    founded: 2019, activity: "Very active", officers: ["Devansh Patil", "Aditya Shah"],
    events: [
      { title: "Mock ICPC regional", date: "Sep 7", location: "Computer Lab 4", attendees: 40, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Mentorship ladder pairings for this semester are posted in the channel.", ts: Date.now() - 1000 * 60 * 60 * 8 },
    ],
  },
  {
    id: "c11", name: "Quill Literary Circle", category: "Interest club", major: "Arts & Humanities",
    icon: "📚", color: "#92400E", tagline: "Words, workshopped weekly.",
    desc: "Poetry slams, short-fiction workshops, and a termly zine that anyone can submit to.",
    members: 41, joinType: "open", tags: ["Poetry", "Zine", "Workshops"],
    founded: 2022, activity: "New", officers: ["Ishita Save"],
    events: [
      { title: "Open mic poetry night", date: "Aug 30", location: "Library Courtyard", attendees: 15, rsvpedByMe: false },
    ],
    announcements: [],
  },
  {
    id: "c12", name: "Chem-E Society", category: "Major club", major: "Chemical Engineering",
    icon: "🧪", color: "#0891B2", tagline: "Reactions, ratios, and road trips to plants.",
    desc: "Industry plant visits, a process-design case competition, and safety-certification workshops.",
    members: 58, joinType: "open", tags: ["Plant Visits", "Process Design"],
    founded: 2018, activity: "Steady", officers: ["Rutuja More"],
    events: [
      { title: "Reliance refinery visit (limited seats)", date: "Sep 12", location: "Jamnagar (day trip)", attendees: 26, rsvpedByMe: false },
    ],
    announcements: [
      { text: "Refinery visit seats are first-come — sign-up sheet posted in the channel.", ts: Date.now() - 1000 * 60 * 60 * 4 },
    ],
  },
];

function getClubMembers(club, count = 6) {
  const h = hashStr(club.id);
  const start = h % FILLER_MEMBERS.length;
  const picked = [];
  for (let i = 0; i < count; i++) picked.push(FILLER_MEMBERS[(start + i) % FILLER_MEMBERS.length]);
  return picked;
}

const CLUB_CANNED_REPLIES = [
  "Welcome! Great to have you here.",
  "Nice, count me in for that.",
  "Anyone got notes from last time?",
  "Same, been meaning to ask about this too.",
  "See you all at the next meetup!",
  "Haha true 😄",
  "+1, let's do it",
  "Can we get a time confirmed for this?",
  "Love this energy in the group.",
  "Someone should pin this for the newer members.",
];
function seedClubChat(club) {
  const officer = (club.officers && club.officers[0]) || getClubMembers(club, 1)[0];
  return [
    { id: "cm" + club.id + "1", user: officer, text: `Welcome to ${club.name}! Drop a hi and check the Events tab for what's coming up.`, ts: Date.now() - 1000 * 60 * 60 * 5 },
    { id: "cm" + club.id + "2", user: getClubMembers(club, 2)[1], text: `Excited to be part of this — ${club.tagline.toLowerCase()}`, ts: Date.now() - 1000 * 60 * 60 * 2 },
  ];
}

const initialNetwork = [
  { id: "n1", name: "Rhea Kapadia", college: "VJTI Mumbai", major: "Mechanical Engineering", role: "Student", bio: "3rd year, into robotics and CAD.", skills: ["SolidWorks", "MATLAB"] },
  { id: "n2", name: "Prof. Anand Rege", college: "VJTI Mumbai", major: "Mechanical Engineering", role: "Professor", bio: "Researching materials science and EV design.", skills: ["Materials", "FEA"] },
  { id: "n3", name: "Aditya Shah", college: "KJ Somaiya College of Engineering", major: "Computer Engineering", role: "Student", bio: "Building a campus food-delivery app on the side.", skills: ["React", "Node.js"] },
  { id: "n4", name: "Meher D'Souza", college: "St. Xavier's College", major: "BSc Physics", bio: "Astrophysics enthusiast, part of the stargazing club.", role: "Student", skills: ["Python", "Data Analysis"] },
  { id: "n5", name: "Kabir Mehta", college: "NM College", major: "Commerce", role: "Student", bio: "Finance club core member, prepping for CA.", skills: ["Excel", "Valuation"] },
];

const initialProjectPosts = [
  {
    id: "p1",
    author: "Aditya Shah",
    college: "KJ Somaiya College of Engineering",
    title: "Campus food-delivery app — MVP is live",
    body: "Built a React Native app that lets hostel students order from the canteen and track pickup slots. Looking for a couple of beta testers this week.",
    club: "Codeware",
    likes: 12,
    ts: Date.now() - 1000 * 60 * 55,
  },
  {
    id: "p2",
    author: "Rhea Kapadia",
    college: "VJTI Mumbai",
    title: "3D-printed drivetrain bracket, rev 3",
    body: "Cut the weight by 18% versus the aluminium version without losing yield strength. Full FEA report in the Mechanical channel if anyone wants to review it.",
    club: "Mechanical Engineers' Circle",
    likes: 8,
    ts: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "p3",
    author: "Meher D'Souza",
    college: "St. Xavier's College",
    title: "Variable star light-curve analysis",
    body: "Used data from a small home telescope + Python to plot brightness variation over 3 weeks. Presenting this at the astronomy club meetup on Friday.",
    club: null,
    likes: 5,
    ts: Date.now() - 1000 * 60 * 60 * 22,
  },
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
      className={`relative rounded-2xl p-4 sm:p-5 ${className}`}
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

function Modal({ title, onClose, children, wide, dark }) {
  const bg = dark ? DC.bgMain : C.paperCard;
  const border = dark ? DC.divider : C.paperLine;
  const textColor = dark ? DC.textPrimary : C.ink;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className={`rounded-t-2xl sm:rounded-2xl w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[90vh] overflow-y-auto`} style={{ backgroundColor: bg }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b sticky top-0" style={{ borderColor: border, backgroundColor: bg }}>
          <h3 className="font-extrabold text-base sm:text-lg" style={{ color: textColor }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70 shrink-0" style={{ color: dark ? DC.textMuted : C.inkSoft }}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
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

// ---------- Notifications ----------
function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function NotificationBell({ notifications, onOpen, unreadCount, mobile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    setOpen((o) => {
      if (!o) onOpen();
      return !o;
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative flex items-center justify-center rounded-full"
        style={mobile ? { width: 32, height: 32 } : { width: 34, height: 34, backgroundColor: C.inkSoft }}
      >
        <Bell size={mobile ? 17 : 16} color={mobile ? C.paper : "#C9C9E8"} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-[3px] rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ backgroundColor: C.coral, color: "#fff" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 max-w-[85vw] rounded-2xl overflow-hidden z-40"
          style={{ backgroundColor: C.paperCard, border: `1px solid ${C.paperLine}`, boxShadow: "0 8px 24px rgba(27,27,58,0.18)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: C.paperLine }}>
            <h4 className="font-extrabold text-sm" style={{ color: C.ink }}>Notifications</h4>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-sm px-4 py-6 text-center" style={{ color: C.textMuted }}>Nothing yet — activity like accepted connections will show up here.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 flex items-start gap-2.5 border-b last:border-0" style={{ borderColor: C.paperLine, backgroundColor: n.read ? "transparent" : C.tealSoft }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: n.iconBg || C.marigold, color: C.ink }}>
                  <n.icon size={13} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-snug" style={{ color: C.ink }}>{n.text}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>{timeAgo(n.ts)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationToast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed top-14 sm:top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none">
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-xl pointer-events-auto cc-toast-anim"
        style={{ backgroundColor: C.ink, boxShadow: "0 8px 24px rgba(27,27,58,0.35)" }}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: toast.iconBg || C.marigold, color: C.ink }}>
          <toast.icon size={13} />
        </div>
        <p className="text-sm font-semibold" style={{ color: C.paper }}>{toast.text}</p>
      </div>
    </div>
  );
}

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
  const [googleAccount, setGoogleAccount] = useState(null);
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  const handleGoogleSelect = (acc) => {
    setGoogleAccount(acc);
    setShowGooglePicker(false);
    if (!name.trim()) setName(acc.name);
    const domain = emailDomain(acc.email);
    if (role === "Company" && KNOWN_COMPANY_DOMAINS[domain] && !companyName.trim()) {
      setCompanyName(KNOWN_COMPANY_DOMAINS[domain]);
    }
  };

  const googleGrantsVerification = () => {
    if (!googleAccount) return false;
    const domain = emailDomain(googleAccount.email);
    if (role === "Company") return !!KNOWN_COMPANY_DOMAINS[domain];
    if (role === "Professor") return isCollegeDomain(domain);
    return false;
  };

  const submit = () => {
    if (role === "Company") {
      if (!name.trim() || !companyName.trim()) {
        setError("Add your name and your company's registered name — we check this against our verified list before you can post internships.");
        return;
      }
      const nameMatch = SEED_VERIFIED_COMPANIES.some((c) => c.toLowerCase() === companyName.trim().toLowerCase());
      const isVerified = nameMatch || googleGrantsVerification();
      onComplete({
        name, role, companyName: companyName.trim(), industry, college: "", major: "", year: "",
        isVerified, verifiedVia: isVerified ? (googleGrantsVerification() ? "google" : "registry") : null,
        googleEmail: googleAccount?.email || "", cvUploaded: false, cvName: "", bio: "", skills: [],
      });
      return;
    }
    if (!name.trim() || !college || !major) {
      setError("Fill in your name, college, and major to continue — we use this to route you to the right channels and clubs.");
      return;
    }
    const nameMatch = role === "Professor" && SEED_VERIFIED_PROFESSORS.some((p) => p.toLowerCase() === name.trim().toLowerCase());
    const isVerified = role === "Professor" ? (nameMatch || googleGrantsVerification()) : false;
    onComplete({
      name, college, major, year, role, isVerified, verifiedVia: isVerified ? (googleGrantsVerification() ? "google" : "registry") : null,
      googleEmail: googleAccount?.email || "", companyName: "", industry: "", cvUploaded: false, cvName: "", bio: "", skills: [],
    });
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
        <div className="rounded-2xl p-5 sm:p-7" style={{ backgroundColor: C.paperCard }}>
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

          {(role === "Company" || role === "Professor") && (
            <div className="mb-4">
              {googleAccount ? (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: googleGrantsVerification() ? C.tealSoft : C.paper, border: `1px solid ${googleGrantsVerification() ? C.teal : C.paperLine}` }}>
                  <GoogleIcon size={16} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate" style={{ color: C.ink }}>{googleAccount.email}</div>
                    <div className="text-[11px]" style={{ color: googleGrantsVerification() ? C.teal : C.textMuted }}>
                      {googleGrantsVerification() ? "Domain verified — instant approval" : "Domain not on our registry yet"}
                    </div>
                  </div>
                  <button onClick={() => setGoogleAccount(null)} className="text-xs font-semibold shrink-0" style={{ color: C.textMuted }}>Change</button>
                </div>
              ) : (
                <GoogleButton onClick={() => setShowGooglePicker(true)}>
                  Verify with Google {role === "Company" ? "Workspace" : "(college email)"}
                </GoogleButton>
              )}
              <p className="text-[11px] mt-1.5" style={{ color: C.textMuted }}>
                {role === "Company" ? "Faster than manual review — matches your work email's domain against our registry." : "Faster than manual review — checks your college email domain."}
              </p>
            </div>
          )}

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
      {showGooglePicker && <GoogleAccountPicker onClose={() => setShowGooglePicker(false)} onSelect={handleGoogleSelect} />}
    </div>
  );
}

// ---------- Sidebar ----------
function navItemsFor(profile) {
  const items = [{ id: "home", label: "Home", icon: Home }, { id: "opportunities", label: "Internships", icon: Briefcase }];
  if (profile.role !== "Company") {
    items.push({ id: "chat", label: "Chat", icon: MessageCircle });
    items.push({ id: "clubs", label: "Clubs", icon: Users });
  }
  items.push({ id: "network", label: "Network", icon: UserPlus });
  items.push({ id: "profile", label: "Profile", icon: User });
  if (profile.role === "Professor") items.push({ id: "professor", label: "Faculty", icon: ShieldCheck });
  if (profile.role === "Company") items.push({ id: "company", label: "Company", icon: ShieldCheck });
  return items;
}

function Sidebar({ view, setView, profile, notifications, unreadCount, onOpenNotifications }) {
  const items = navItemsFor(profile);

  return (
    <div className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0" style={{ backgroundColor: C.ink }}>
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.marigold }}>
            <GraduationCap size={18} color={C.ink} />
          </div>
          <span className="font-extrabold text-lg truncate" style={{ color: C.paper }}>CampusConnect</span>
        </div>
        <NotificationBell notifications={notifications} unreadCount={unreadCount} onOpen={onOpenNotifications} />
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
              {it.label === "Internships" ? "Internships & Research" : it.label === "Chat" ? "Major Chat" : it.label === "Profile" ? "My Profile" : it.label === "Faculty" ? "Professor Dashboard" : it.label === "Company" ? "Company Dashboard" : it.label}
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

// ---------- Mobile top bar + bottom nav ----------
function MobileTopBar({ profile, setView, notifications, unreadCount, onOpenNotifications, onOpenMenu }) {
  return (
    <div className="flex md:hidden items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 z-30" style={{ backgroundColor: C.ink }}>
      <div className="flex items-center gap-2.5">
        <button onClick={onOpenMenu} className="p-1 -ml-1" style={{ color: C.paper }} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.marigold }}>
          <GraduationCap size={16} color={C.ink} />
        </div>
        <span className="font-extrabold text-base" style={{ color: C.paper }}>CampusConnect</span>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell notifications={notifications} unreadCount={unreadCount} onOpen={onOpenNotifications} mobile />
        <button onClick={() => setView("profile")} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 relative" style={{ backgroundColor: C.marigold, color: C.ink }}>
          {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          {(profile.role === "Company" || profile.role === "Professor") && !profile.isVerified && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: C.coral, borderColor: C.ink }} />
          )}
        </button>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, view, setView, profile }) {
  const items = navItemsFor(profile);
  return (
    <>
      <div
        className="md:hidden fixed inset-0 z-40 transition-opacity duration-200"
        style={{ backgroundColor: "rgba(27,27,58,0.55)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />
      <div
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[82vw] flex flex-col transition-transform duration-250 ease-out"
        style={{ backgroundColor: C.ink, transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.marigold }}>
              <GraduationCap size={18} color={C.ink} />
            </div>
            <span className="font-extrabold text-lg truncate" style={{ color: C.paper }}>CampusConnect</span>
          </div>
          <button onClick={onClose} className="p-1 shrink-0" style={{ color: "#C9C9E8" }}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto">
          {items.map((it) => {
            const Icon = it.icon;
            const active = view === it.id;
            return (
              <button
                key={it.id}
                onClick={() => { setView(it.id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: active ? C.inkSoft : "transparent",
                  color: active ? C.marigold : "#C9C9E8",
                  borderLeft: active ? `3px solid ${C.marigold}` : "3px solid transparent",
                }}
              >
                <Icon size={17} />
                {it.label === "Internships" ? "Internships & Research" : it.label === "Chat" ? "Major Chat" : it.label === "Profile" ? "My Profile" : it.label === "Faculty" ? "Professor Dashboard" : it.label === "Company" ? "Company Dashboard" : it.label}
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
    </>
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
      <h1 className="font-black text-2xl sm:text-3xl mb-1" style={{ color: C.ink }}>Namaste, {profile.name.split(" ")[0]} 👋</h1>
      <p className="mb-8" style={{ color: C.textMuted }}>
        {isCompany
          ? `Here's the latest for ${profile.companyName} on CampusConnect.`
          : `Here's what's relevant to ${profile.major} students at ${profile.college} today.`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
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

function VerifyGateModal({ profile, onClose, onVerifiedViaGoogle }) {
  const [requested, setRequested] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleResult, setGoogleResult] = useState(null); // { matched: bool, account }
  const isCompany = profile.role === "Company";

  const handleGoogleSelect = (acc) => {
    setShowGooglePicker(false);
    const domain = emailDomain(acc.email);
    const matched = isCompany ? !!KNOWN_COMPANY_DOMAINS[domain] : isCollegeDomain(domain);
    setGoogleResult({ matched, account: acc });
    if (matched) onVerifiedViaGoogle(acc);
  };

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

      {googleResult?.matched ? (
        <div className="text-sm px-3 py-2.5 rounded-lg mb-4 flex items-center gap-2" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
          <ShieldCheck size={15} /> Verified via Google — you can post now.
        </div>
      ) : (
        <>
          <GoogleButton onClick={() => setShowGooglePicker(true)} style={{ marginBottom: 8 }}>
            Verify with Google {isCompany ? "Workspace" : "(college email)"}
          </GoogleButton>
          {googleResult && !googleResult.matched && (
            <p className="text-xs mb-3" style={{ color: C.coral }}>
              "{googleResult.account.email}" isn't on our verified domain list yet — try "Request verification" below instead.
            </p>
          )}
          <p className="text-[11px] mb-4" style={{ color: C.textMuted }}>
            {isCompany ? "Checks your work email's domain against our registry." : "Checks your college email domain."}
          </p>

          <div className="text-center text-xs mb-4" style={{ color: C.textMuted }}>or</div>

          {requested ? (
            <div className="text-sm px-3 py-2.5 rounded-lg" style={{ backgroundColor: C.paper, color: C.inkSoft }}>
              Request sent — reviews are typically completed within 2 business days. We'll email you once you're verified.
            </div>
          ) : (
            <SecondaryButton onClick={() => setRequested(true)}>
              Request manual verification
            </SecondaryButton>
          )}
        </>
      )}

      {showGooglePicker && <GoogleAccountPicker onClose={() => setShowGooglePicker(false)} onSelect={handleGoogleSelect} />}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

function OpportunitiesView({ profile, opportunities, setOpportunities, applications, setApplications, onNeedCv, onVerifiedViaGoogle }) {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 mb-6">
        <div>
          <Eyebrow color={C.coral}>Board</Eyebrow>
          <h1 className="font-black text-2xl sm:text-3xl" style={{ color: C.ink }}>Internships & Research</h1>
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
        <span className="mx-1 text-sm hidden sm:inline" style={{ color: C.paperLine }}>|</span>
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
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    <Badge bg={o.isResearch ? C.tealSoft : C.coralSoft} fg={o.isResearch ? C.teal : C.coral}>{o.type}</Badge>
                    {o.majors.map((m) => <Badge key={m} bg={C.paper} fg={C.inkSoft}>{m}</Badge>)}
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg" style={{ color: C.ink }}>{o.title}</h3>
                  <div className="flex flex-wrap items-center gap-1 text-sm mb-2" style={{ color: C.textMuted }}>
                    <Building2 size={13} /> {o.org}
                    {o.verified && (
                      <span className="inline-flex items-center gap-0.5 ml-1" style={{ color: C.teal }} title="Verified poster">
                        <ShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: C.inkSoft }}>{o.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: C.textMuted }}>
                    <span className="flex items-center gap-1"><Award size={12} /> {o.stipend}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {o.duration}</span>
                    <span className="flex items-center gap-1"><Tag size={12} /> Deadline {o.deadline}</span>
                  </div>
                </div>
                <div className="shrink-0 w-full sm:w-auto">
                  {applied ? (
                    <Badge bg={C.tealSoft} fg={C.teal}>
                      <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} /> {applied.status}</span>
                    </Badge>
                  ) : (
                    <PrimaryButton onClick={() => apply(o)} style={{ backgroundColor: C.marigold, color: C.ink, width: "100%" }}>Apply</PrimaryButton>
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
      {showGate && (
        <VerifyGateModal
          profile={profile}
          onClose={() => setShowGate(false)}
          onVerifiedViaGoogle={(acc) => { onVerifiedViaGoogle(acc); setTimeout(() => setShowGate(false), 1200); }}
        />
      )}
    </div>
  );
}

// ---------- Chat (Discord-style) ----------
function ChatView({ profile, channels, setChannels }) {
  const [active, setActive] = useState(profile.major);
  const [tab, setTab] = useState("chat");
  const [msg, setMsg] = useState("");
  const [openThread, setOpenThread] = useState(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [reply, setReply] = useState("");
  const [channelSearch, setChannelSearch] = useState("");
  const [mobileShowList, setMobileShowList] = useState(true);
  const [showMembers, setShowMembers] = useState(false);

  const channel = channels[active];
  const members = getChannelMembers(active, profile);

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
  const darkInput = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "none", backgroundColor: DC.bgInput, color: DC.textPrimary, outline: "none", fontSize: "14px" };

  return (
    <div className="max-w-6xl h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col md:flex-row rounded-2xl overflow-hidden" style={{ border: `1px solid ${DC.divider}` }}>
      {/* channel sidebar */}
      <div className={`${mobileShowList ? "flex" : "hidden"} md:flex w-full md:w-64 shrink-0 flex-col`} style={{ backgroundColor: DC.bgSidebar }}>
        <div className="px-4 py-3.5 border-b flex items-center gap-2" style={{ borderColor: DC.divider }}>
          <Hash size={16} style={{ color: DC.textMuted }} />
          <span className="font-extrabold text-sm truncate" style={{ color: DC.textPrimary }}>CampusConnect Chat</span>
        </div>
        <div className="px-3 pt-3">
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: DC.textMuted }} />
            <input
              style={{ ...darkInput, paddingLeft: 28, padding: "6px 10px 6px 28px", fontSize: 13 }}
              placeholder="Search channels"
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-3">
          {Object.entries(BRANCH_GROUPS).map(([group, list]) => {
            const visible = list.filter((m) => m.toLowerCase().includes(channelSearch.toLowerCase()));
            if (visible.length === 0) return null;
            return (
              <div key={group}>
                <div className="text-[10px] font-bold uppercase tracking-wide mb-1 px-2" style={{ color: DC.textMuted }}>{group}</div>
                <div className="space-y-0.5">
                  {visible.map((m) => {
                    const isActive = active === m;
                    return (
                      <button
                        key={m}
                        onClick={() => { setActive(m); setOpenThread(null); setMobileShowList(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5"
                        style={{ backgroundColor: isActive ? DC.bgActive : "transparent", color: isActive ? DC.textPrimary : DC.textMuted }}
                      >
                        <Hash size={15} className="shrink-0" style={{ color: isActive ? DC.textPrimary : DC.textFaint }} />
                        <span className="truncate">{m}</span>
                        {m === profile.major && <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: C.marigold }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* user mini-bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t" style={{ borderColor: DC.divider, backgroundColor: "#232428" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: colorForName(profile.name), color: "#1e1f22" }}>
            {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate" style={{ color: DC.textPrimary }}>{profile.name}</div>
            <div className="text-[10px] flex items-center gap-1" style={{ color: DC.online }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DC.online }} /> Online
            </div>
          </div>
        </div>
      </div>

      {/* main pane */}
      <div className={`${mobileShowList ? "hidden" : "flex"} md:flex flex-1 flex-col`} style={{ backgroundColor: DC.bgMain }}>
        <div className="px-3 sm:px-4 py-3 border-b flex items-center justify-between gap-2" style={{ borderColor: DC.divider }}>
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setMobileShowList(true)} className="md:hidden p-1 -ml-1 shrink-0" style={{ color: DC.textMuted }}>
              <ArrowLeft size={18} />
            </button>
            <Hash size={16} style={{ color: DC.textMuted }} className="shrink-0" />
            <h2 className="font-bold truncate text-sm sm:text-base" style={{ color: DC.textPrimary }}>{active}</h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setTab("chat")}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5"
              style={{ backgroundColor: tab === "chat" ? DC.bgActive : "transparent", color: tab === "chat" ? DC.textPrimary : DC.textMuted }}
            >
              <MessageCircle size={13} /> <span className="hidden sm:inline">Live chat</span>
            </button>
            <button
              onClick={() => { setTab("qa"); setOpenThread(null); }}
              className="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5"
              style={{ backgroundColor: tab === "qa" ? DC.bgActive : "transparent", color: tab === "qa" ? DC.textPrimary : DC.textMuted }}
            >
              <Sparkles size={13} /> <span className="hidden sm:inline">Q&A threads</span>
            </button>
            <button
              onClick={() => setShowMembers((s) => !s)}
              className="lg:hidden p-1.5 rounded-md"
              style={{ backgroundColor: showMembers ? DC.bgActive : "transparent", color: DC.textMuted }}
              aria-label="Members"
            >
              <Users size={16} />
            </button>
          </div>
        </div>

        {tab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
              {channel.messages.length === 0 && <p className="text-sm" style={{ color: DC.textMuted }}>No messages yet — say hi to your {active} batchmates.</p>}
              {channel.messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ backgroundColor: colorForName(m.user), color: "#1e1f22" }}>
                    {m.user.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm" style={{ color: colorForName(m.user) }}>{m.user}</span>
                      <span className="text-[11px]" style={{ color: DC.textFaint }}>{m.time}</span>
                    </div>
                    <p className="text-sm break-words" style={{ color: "#dbdee1" }}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 rounded-lg px-3" style={{ backgroundColor: DC.bgInput }}>
                <input
                  style={{ ...darkInput, backgroundColor: "transparent", padding: "10px 0" }}
                  placeholder={`Message #${active}`}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                />
                <button onClick={sendMsg} className="p-1.5 rounded-md shrink-0" style={{ color: msg.trim() ? DC.brand : DC.textFaint }}>
                  <Send size={17} />
                </button>
              </div>
            </div>
          </>
        )}

        {tab === "qa" && !activeThread && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowNewThread(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: DC.brand, color: "#fff" }}>
                <Plus size={15} /> Ask a question
              </button>
            </div>
            <div className="space-y-2.5">
              {channel.threads.length === 0 && <p className="text-sm" style={{ color: DC.textMuted }}>No questions yet in this channel — be the first to ask.</p>}
              {channel.threads.map((t) => {
                const best = t.replies.find((r) => r.isBest);
                return (
                  <button
                    key={t.id}
                    onClick={() => setOpenThread(t.id)}
                    className="w-full text-left rounded-xl p-3.5"
                    style={{ backgroundColor: DC.bgSidebar, border: `1px solid ${DC.divider}` }}
                  >
                    <h4 className="font-bold text-sm mb-1" style={{ color: DC.textPrimary }}>{t.title}</h4>
                    <p className="text-xs mb-2" style={{ color: DC.textMuted }}>Asked by {t.author} · {t.replies.length} replies</p>
                    {best && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(35,165,90,0.15)", color: DC.online }}>
                        <CheckCircle2 size={11} /> Answered
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "qa" && activeThread && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <button onClick={() => setOpenThread(null)} className="flex items-center gap-1 text-sm font-semibold mb-4" style={{ color: DC.textMuted }}>
              <ArrowLeft size={14} /> Back to threads
            </button>
            <h3 className="font-extrabold text-lg mb-1" style={{ color: DC.textPrimary }}>{activeThread.title}</h3>
            <p className="text-xs mb-3" style={{ color: DC.textMuted }}>Asked by {activeThread.author}</p>
            <p className="text-sm mb-5" style={{ color: "#dbdee1" }}>{activeThread.body}</p>

            <div className="space-y-2.5 mb-5">
              {activeThread.replies.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-3.5"
                  style={{ backgroundColor: r.isBest ? "rgba(35,165,90,0.1)" : DC.bgSidebar, border: `1px solid ${r.isBest ? DC.online : DC.divider}` }}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm" style={{ color: colorForName(r.user) }}>{r.user}</span>
                        {r.isBest && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(35,165,90,0.2)", color: DC.online }}>
                            <Star size={10} /> Best answer
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "#dbdee1" }}>{r.text}</p>
                    </div>
                    {activeThread.author === profile.name && !r.isBest && (
                      <button onClick={() => markBest(activeThread.id, r.id)} className="text-xs font-semibold shrink-0" style={{ color: DC.brand }}>Mark best</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3" style={{ backgroundColor: DC.bgInput }}>
              <input
                style={{ ...darkInput, backgroundColor: "transparent", padding: "10px 0" }}
                placeholder="Write a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addReply(activeThread.id)}
              />
              <button onClick={() => addReply(activeThread.id)} className="p-1.5 rounded-md shrink-0" style={{ color: reply.trim() ? DC.brand : DC.textFaint }}>
                <Send size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* member list */}
      <div className={`${showMembers ? "flex" : "hidden"} lg:flex w-full lg:w-52 shrink-0 flex-col p-3 overflow-y-auto`} style={{ backgroundColor: DC.bgMember, borderLeft: `1px solid ${DC.divider}` }}>
        <div className="text-[11px] font-bold uppercase tracking-wide mb-2 px-1" style={{ color: DC.textMuted }}>Online — {members.online.length}</div>
        <div className="space-y-1 mb-4">
          {members.online.map((name) => (
            <div key={name} className="flex items-center gap-2 px-1 py-1 rounded-md">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: colorForName(name), color: "#1e1f22" }}>
                  {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: DC.online, borderColor: DC.bgMember }} />
              </div>
              <span className="text-xs font-medium truncate" style={{ color: DC.textMuted }}>{name}{name === profile.name ? " (you)" : ""}</span>
            </div>
          ))}
        </div>
        {members.offline.length > 0 && (
          <>
            <div className="text-[11px] font-bold uppercase tracking-wide mb-2 px-1" style={{ color: DC.textMuted }}>Offline — {members.offline.length}</div>
            <div className="space-y-1">
              {members.offline.map((name) => (
                <div key={name} className="flex items-center gap-2 px-1 py-1 rounded-md opacity-50">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0" style={{ backgroundColor: colorForName(name), color: "#1e1f22" }}>
                    {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-xs font-medium truncate" style={{ color: DC.textMuted }}>{name}</span>
                </div>
              ))}
            </div>
          </>
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
  const darkInput = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${DC.divider}`, backgroundColor: DC.bgInput, color: DC.textPrimary, outline: "none", fontSize: "14px" };
  return (
    <Modal title="Ask a question" onClose={onClose} dark>
      <label className="block mb-4">
        <span className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: DC.textMuted }}>Question title</span>
        <input style={darkInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best resources for thermodynamics CIE?" />
      </label>
      <label className="block mb-4">
        <span className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: DC.textMuted }}>Details</span>
        <textarea style={{ ...darkInput, minHeight: 90 }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add context so people can actually help." />
      </label>
      <button
        onClick={() => title.trim() && onSubmit(title, body)}
        className="w-full py-2.5 rounded-lg font-semibold text-sm"
        style={{ backgroundColor: DC.brand, color: "#fff" }}
      >
        Post question
      </button>
    </Modal>
  );
}

// ---------- Clubs ----------
function ClubsView({ profile, clubs, setClubs, posts, setPosts, pushNotification }) {
  const [showCreate, setShowCreate] = useState(false);
  const [joined, setJoined] = useState({});
  const [tab, setTab] = useState("clubs");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openClubId, setOpenClubId] = useState(null);

  const toggleJoin = (id) => {
    const club = clubs.find((c) => c.id === id);
    const willJoin = !joined[id];
    setJoined((prev) => ({ ...prev, [id]: willJoin }));
    if (willJoin) {
      pushNotification({ text: `You joined ${club.name} 🎉`, icon: Users, iconBg: C.tealSoft, showToast: false });
    }
  };

  const openClub = openClubId ? clubs.find((c) => c.id === openClubId) : null;

  if (openClub) {
    return (
      <ClubDetailView
        club={openClub}
        profile={profile}
        joined={!!joined[openClub.id]}
        onToggleJoin={() => toggleJoin(openClub.id)}
        clubs={clubs}
        setClubs={setClubs}
        posts={posts}
        setPosts={setPosts}
        pushNotification={pushNotification}
        onBack={() => setOpenClubId(null)}
      />
    );
  }

  const FILTERS = ["All", "My Clubs", "Major clubs", "Interest clubs", "New", "Most active"];
  const joinedCount = Object.values(joined).filter(Boolean).length;
  const currentYear = new Date().getFullYear();
  const filtered = clubs.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)) || c.tagline.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter === "My Clubs") return !!joined[c.id];
    if (filter === "Major clubs") return c.category === "Major club";
    if (filter === "Interest clubs") return c.category === "Interest club";
    if (filter === "New") return c.founded >= currentYear;
    if (filter === "Most active") return c.activity === "Very active";
    return true;
  });
  const suggested = filtered.filter((c) => c.major === profile.major);
  const featured = [...clubs].sort((a, b) => b.members - a.members)[0];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-5">
        <div>
          <Eyebrow color={C.marigoldDark}>Community</Eyebrow>
          <h1 className="font-black text-2xl sm:text-3xl" style={{ color: C.ink }}>Clubs</h1>
          {joinedCount > 0 && (
            <p className="text-xs mt-1" style={{ color: C.teal }}>You're in {joinedCount} club{joinedCount === 1 ? "" : "s"}</p>
          )}
        </div>
        {tab === "clubs" && <PrimaryButton icon={Plus} onClick={() => setShowCreate(true)}>Create a club</PrimaryButton>}
      </div>

      <div className="flex gap-2 mb-6">
        <SecondaryButton active={tab === "clubs"} onClick={() => setTab("clubs")} icon={Users}>Clubs</SecondaryButton>
        <SecondaryButton active={tab === "feed"} onClick={() => setTab("feed")} icon={Sparkles}>Project Feed</SecondaryButton>
      </div>

      {tab === "clubs" && (
        <>
          {!search && filter === "All" && (
            <FeaturedClubBanner
              club={featured}
              joined={!!joined[featured.id]}
              onToggle={() => toggleJoin(featured.id)}
              onOpen={() => setOpenClubId(featured.id)}
            />
          )}

          <div className="relative mb-4 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
            <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search clubs by name or tag" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map((f) => (
              <SecondaryButton key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}{f === "My Clubs" && joinedCount > 0 ? ` (${joinedCount})` : ""}
              </SecondaryButton>
            ))}
          </div>

          {filter === "My Clubs" && joinedCount === 0 && (
            <p className="text-sm mb-6" style={{ color: C.textMuted }}>You haven't joined any clubs yet — browse below and hit "Join club" to get started.</p>
          )}

          {!search && filter === "All" && suggested.length > 0 && (
            <>
              <h2 className="font-extrabold text-sm uppercase tracking-wide mb-3" style={{ color: C.teal }}>Suggested for {profile.major}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {suggested.map((c) => (
                  <ClubCard key={c.id} club={c} joined={joined[c.id]} onToggle={() => toggleJoin(c.id)} onOpen={() => setOpenClubId(c.id)} />
                ))}
              </div>
            </>
          )}

          <h2 className="font-extrabold text-sm uppercase tracking-wide mb-3" style={{ color: C.teal }}>
            {search || filter !== "All" ? `${filtered.length} club${filtered.length === 1 ? "" : "s"} found` : "All clubs"}
          </h2>
          {filtered.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>No clubs match that search — try a different term or create one yourself.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <ClubCard key={c.id} club={c} joined={joined[c.id]} onToggle={() => toggleJoin(c.id)} onOpen={() => setOpenClubId(c.id)} />
            ))}
          </div>
        </>
      )}

      {tab === "feed" && (
        <ProjectFeed profile={profile} clubs={clubs} posts={posts} setPosts={setPosts} pushNotification={pushNotification} />
      )}

      {showCreate && (
        <CreateClubModal
          profile={profile}
          onClose={() => setShowCreate(false)}
          onSubmit={(c) => { setClubs((prev) => [c, ...prev]); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function ProjectFeed({ profile, clubs, posts, setPosts, pushNotification }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [clubTag, setClubTag] = useState("");

  const post = () => {
    if (!title.trim() || !body.trim()) return;
    const newPost = {
      id: "p" + Date.now(),
      author: profile.name,
      college: profile.college || profile.companyName,
      title: title.trim(),
      body: body.trim(),
      club: clubTag || null,
      likes: 0,
      likedByMe: false,
      ts: Date.now(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setBody("");
    setClubTag("");

    // Simulate someone from the network reacting to the post a little later.
    const reactors = initialNetwork.filter((p) => p.name !== profile.name);
    const reactor = reactors[Math.floor(Math.random() * reactors.length)];
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      setPosts((prev) => prev.map((p) => (p.id === newPost.id ? { ...p, likes: p.likes + 1 } : p)));
      pushNotification({
        text: `${reactor.name} liked your project "${newPost.title}"`,
        icon: Heart,
        iconBg: C.coralSoft,
      });
    }, delay);
  };

  const toggleLike = (id) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const likedByMe = !p.likedByMe;
      return { ...p, likedByMe, likes: p.likes + (likedByMe ? 1 : -1) };
    }));
  };

  return (
    <div className="max-w-2xl">
      <Card className="mb-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: C.marigold, color: C.ink }}>
            {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <input
              style={{ ...inputStyle, marginBottom: 8, fontWeight: 600 }}
              placeholder="Project title — what did you build?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              style={{ ...inputStyle, minHeight: 70, marginBottom: 8 }}
              placeholder="Tell people what it does, what you used, or what help you're looking for..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <select style={{ ...inputStyle, flex: 1 }} value={clubTag} onChange={(e) => setClubTag(e.target.value)}>
                <option value="">No club tag</option>
                {clubs.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <PrimaryButton onClick={post} icon={Sparkles} style={{ backgroundColor: C.marigold, color: C.ink }}>Post project</PrimaryButton>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>No projects posted yet — be the first to share what you're building.</p>}
        {posts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
                {p.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-bold text-sm" style={{ color: C.ink }}>{p.author}</span>
                  <span className="text-xs" style={{ color: C.textMuted }}>{p.college}</span>
                  <span className="text-xs" style={{ color: C.textMuted }}>· {timeAgo(p.ts)}</span>
                </div>
                <h4 className="font-extrabold text-sm mt-1.5" style={{ color: C.ink }}>{p.title}</h4>
                <p className="text-sm mt-1" style={{ color: C.inkSoft }}>{p.body}</p>
                {p.club && <div className="mt-2"><Badge bg={C.paper} fg={C.inkSoft}>{p.club}</Badge></div>}
                <div className="flex items-center gap-4 mt-3">
                  <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: p.likedByMe ? C.coral : C.textMuted }}>
                    <Heart size={15} fill={p.likedByMe ? C.coral : "none"} /> {p.likes}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.textMuted }}>
                    <MessageSquare size={15} /> Reply
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClubCard({ club, joined, onToggle, onOpen }) {
  return (
    <Card className="cursor-pointer overflow-hidden" style={{ padding: 0 }}>
      <div onClick={onOpen}>
        <div className="h-16 relative" style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color}99)` }}>
          <div
            className="absolute -bottom-5 left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: C.paperCard, border: `2px solid ${C.paperCard}`, boxShadow: "0 2px 6px rgba(27,27,58,0.15)" }}
          >
            {club.icon}
          </div>
        </div>
        <div className="pt-7 px-4 pb-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-sm leading-tight" style={{ color: C.ink }}>{club.name}</h3>
            <span className="text-xs font-semibold shrink-0" style={{ color: C.textMuted }}>{club.members}</span>
          </div>
          <p className="text-xs mb-2.5 italic" style={{ color: C.textMuted }}>{club.tagline}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge bg={club.major ? C.tealSoft : C.coralSoft} fg={club.major ? C.teal : C.coral}>{club.category}</Badge>
            {club.tags.slice(0, 2).map((t) => <Badge key={t} bg={C.paper} fg={C.inkSoft}>{t}</Badge>)}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <SecondaryButton active={joined} onClick={(e) => { e?.stopPropagation?.(); onToggle(); }} icon={joined ? CheckCircle2 : Plus}>
          {joined ? "Joined" : club.joinType === "approval" ? "Request to join" : "Join club"}
        </SecondaryButton>
      </div>
    </Card>
  );
}

function FeaturedClubBanner({ club, joined, onToggle, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer rounded-2xl overflow-hidden mb-8 relative"
      style={{ background: `linear-gradient(120deg, ${club.color}, ${club.color}cc)` }}
    >
      <div className="p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
          {club.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}>🔥 Trending club</span>
          </div>
          <h2 className="font-black text-xl sm:text-2xl text-white">{club.name}</h2>
          <p className="text-sm text-white/90 italic mt-0.5">{club.tagline}</p>
          <p className="text-xs text-white/80 mt-1.5">{club.members} members · {club.activity}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="shrink-0 px-4 py-2 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: joined ? "rgba(255,255,255,0.25)" : "#fff", color: joined ? "#fff" : C.ink }}
        >
          {joined ? "Joined ✓" : "Join now"}
        </button>
      </div>
    </div>
  );
}

// ---------- Club detail ----------
function ClubDetailView({ club, profile, joined, onToggleJoin, clubs, setClubs, posts, setPosts, pushNotification, onBack }) {
  const [tab, setTab] = useState("feed");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [chatInput, setChatInput] = useState("");
  const clubMembers = getClubMembers(club, Math.min(10, club.members));
  const clubPosts = posts.filter((p) => p.club === club.name);

  const sendClubMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setClubs((prev) => prev.map((c) => c.id === club.id
      ? { ...c, chatMessages: [...(c.chatMessages || []), { id: "cm" + Date.now(), user: profile.name, text, ts: Date.now() }] }
      : c));
    setChatInput("");

    const candidates = (club.officers || []).concat(clubMembers).filter((n) => n !== profile.name);
    const responder = candidates[Math.floor(Math.random() * candidates.length)];
    const reply = CLUB_CANNED_REPLIES[Math.floor(Math.random() * CLUB_CANNED_REPLIES.length)];
    const delay = 2500 + Math.random() * 3500;
    setTimeout(() => {
      setClubs((prev) => prev.map((c) => c.id === club.id
        ? { ...c, chatMessages: [...(c.chatMessages || []), { id: "cm" + Date.now(), user: responder, text: reply, ts: Date.now() }] }
        : c));
      pushNotification({ text: `${responder} replied in ${club.name}`, icon: MessageCircle, iconBg: C.tealSoft, showToast: false });
    }, delay);
  };

  const rsvp = (eventTitle) => {
    if (!joined) { onToggleJoin(); return; }
    setClubs((prev) => prev.map((c) => {
      if (c.id !== club.id) return c;
      return {
        ...c,
        events: c.events.map((ev) => ev.title === eventTitle ? { ...ev, rsvpedByMe: !ev.rsvpedByMe, attendeeBump: ev.rsvpedByMe ? -1 : 1 } : ev),
      };
    }));
  };

  const postToClub = () => {
    if (!postTitle.trim() || !postBody.trim()) return;
    const newPost = {
      id: "p" + Date.now(),
      author: profile.name,
      college: profile.college || profile.companyName,
      title: postTitle.trim(),
      body: postBody.trim(),
      club: club.name,
      likes: 0,
      likedByMe: false,
      ts: Date.now(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostTitle("");
    setPostBody("");
    const reactors = initialNetwork.filter((p) => p.name !== profile.name);
    const reactor = reactors[Math.floor(Math.random() * reactors.length)];
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      setPosts((prev) => prev.map((p) => (p.id === newPost.id ? { ...p, likes: p.likes + 1 } : p)));
      pushNotification({ text: `${reactor.name} liked your post in ${club.name}`, icon: Heart, iconBg: C.coralSoft });
    }, delay);
  };

  return (
    <div className="max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: C.teal }}>
        <ArrowLeft size={15} /> Back to clubs
      </button>

      <div className="rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${C.paperLine}` }}>
        <div className="h-24 sm:h-28 relative" style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color}99)` }}>
          <div
            className="absolute -bottom-7 left-5 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: C.paperCard, boxShadow: "0 2px 8px rgba(27,27,58,0.2)" }}
          >
            {club.icon}
          </div>
        </div>
        <div className="pt-10 px-5 pb-5" style={{ backgroundColor: C.paperCard }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl sm:text-2xl" style={{ color: C.ink }}>{club.name}</h1>
                {joined && <Badge bg={C.tealSoft} fg={C.teal}><span className="inline-flex items-center gap-1"><CheckCircle2 size={11} /> Member</span></Badge>}
              </div>
              <p className="text-sm italic mt-0.5" style={{ color: C.textMuted }}>{club.tagline}</p>
            </div>
            <SecondaryButton active={joined} onClick={onToggleJoin} icon={joined ? CheckCircle2 : Plus}>
              {joined ? "Joined" : club.joinType === "approval" ? "Request to join" : "Join club"}
            </SecondaryButton>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <Badge bg={club.major ? C.tealSoft : C.coralSoft} fg={club.major ? C.teal : C.coral}>{club.category}</Badge>
            {club.tags.map((t) => <Badge key={t} bg={C.paper} fg={C.inkSoft}>{t}</Badge>)}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: C.textMuted }}>
            <span>{club.members} members</span>
            <span>· Founded {club.founded}</span>
            <span>· {club.activity}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        <SecondaryButton active={tab === "feed"} onClick={() => setTab("feed")} icon={Sparkles}>Feed</SecondaryButton>
        <SecondaryButton active={tab === "chat"} onClick={() => setTab("chat")} icon={MessageCircle}>Chat</SecondaryButton>
        <SecondaryButton active={tab === "events"} onClick={() => setTab("events")} icon={Calendar}>Events</SecondaryButton>
        <SecondaryButton active={tab === "members"} onClick={() => setTab("members")} icon={Users}>Members</SecondaryButton>
        <SecondaryButton active={tab === "about"} onClick={() => setTab("about")} icon={FileText}>About</SecondaryButton>
      </div>

      {tab === "chat" && (
        <div className="rounded-2xl overflow-hidden flex flex-col" style={{ border: `1px solid ${C.paperLine}`, backgroundColor: C.paperCard, height: "28rem" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {(club.chatMessages || []).length === 0 && (
              <p className="text-sm" style={{ color: C.textMuted }}>No messages yet — say hi to your fellow members.</p>
            )}
            {(club.chatMessages || []).map((m) => (
              <div key={m.id} className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: colorForName(m.user), color: "#1e1f22" }}>
                  {m.user.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm" style={{ color: colorForName(m.user) }}>{m.user}</span>
                    <span className="text-[11px]" style={{ color: C.textMuted }}>{timeAgo(m.ts)}</span>
                  </div>
                  <p className="text-sm break-words" style={{ color: C.inkSoft }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          {joined ? (
            <div className="p-3 border-t flex gap-2" style={{ borderColor: C.paperLine }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder={`Message ${club.name}`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendClubMessage()}
              />
              <PrimaryButton icon={Send} onClick={sendClubMessage} style={{ backgroundColor: club.color, color: "#fff" }} />
            </div>
          ) : (
            <div className="p-3 border-t flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: C.paperLine, backgroundColor: C.paper }}>
              <p className="text-sm" style={{ color: C.inkSoft }}>Join to chat with other {club.name} members.</p>
              <SecondaryButton onClick={onToggleJoin} icon={Plus}>{club.joinType === "approval" ? "Request to join" : "Join club"}</SecondaryButton>
            </div>
          )}
        </div>
      )}

      {tab === "feed" && (
        <div className="space-y-4">
          {joined ? (
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: club.color, color: "#fff" }}>
                  {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    style={{ ...inputStyle, marginBottom: 8, fontWeight: 600 }}
                    placeholder={`Post something in ${club.name}...`}
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <textarea
                    style={{ ...inputStyle, minHeight: 60, marginBottom: 8 }}
                    placeholder="Share an update, ask for help, or post a project..."
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                  />
                  <PrimaryButton onClick={postToClub} icon={Sparkles} style={{ backgroundColor: club.color, color: "#fff" }}>Post to club</PrimaryButton>
                </div>
              </div>
            </Card>
          ) : (
            <Card style={{ backgroundColor: C.paper, borderColor: C.paperLine }}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm" style={{ color: C.inkSoft }}>Join {club.name} to post in the club feed and RSVP to events.</p>
                <SecondaryButton onClick={onToggleJoin} icon={Plus}>{club.joinType === "approval" ? "Request to join" : "Join club"}</SecondaryButton>
              </div>
            </Card>
          )}

          {club.announcements && club.announcements.length > 0 && (
            <Card style={{ backgroundColor: C.tealSoft, borderColor: "transparent" }}>
              <h4 className="font-bold text-xs uppercase tracking-wide mb-2" style={{ color: C.teal }}>📌 Pinned announcements</h4>
              <div className="space-y-2">
                {club.announcements.map((a, i) => (
                  <div key={i} className="text-sm" style={{ color: C.inkSoft }}>
                    {a.text}
                    <span className="text-xs block mt-0.5" style={{ color: C.textMuted }}>{timeAgo(a.ts)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {clubPosts.length === 0 && (
            <p className="text-sm" style={{ color: C.textMuted }}>No posts in this club's feed yet{joined ? " — be the first." : "."}</p>
          )}
          {clubPosts.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: C.tealSoft, color: C.teal }}>
                  {p.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-bold text-sm" style={{ color: C.ink }}>{p.author}</span>
                    <span className="text-xs" style={{ color: C.textMuted }}>· {timeAgo(p.ts)}</span>
                  </div>
                  <h4 className="font-extrabold text-sm mt-1" style={{ color: C.ink }}>{p.title}</h4>
                  <p className="text-sm mt-1" style={{ color: C.inkSoft }}>{p.body}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold" style={{ color: C.textMuted }}>
                    <Heart size={14} /> {p.likes}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "events" && (
        <div className="space-y-3">
          {!joined && (club.events && club.events.length > 0) && (
            <Card style={{ backgroundColor: C.paper, borderColor: C.paperLine }}>
              <p className="text-sm" style={{ color: C.inkSoft }}>Join {club.name} to RSVP — you can still see what's coming up.</p>
            </Card>
          )}
          {(!club.events || club.events.length === 0) && <p className="text-sm" style={{ color: C.textMuted }}>No upcoming events scheduled.</p>}
          {club.events && club.events.map((ev) => {
            const count = ev.attendees + (ev.attendeeBump || 0);
            return (
              <Card key={ev.title}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: C.ink }}>{ev.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs" style={{ color: C.textMuted }}>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                      <span>{count} attending</span>
                    </div>
                  </div>
                  <SecondaryButton active={ev.rsvpedByMe} onClick={() => rsvp(ev.title)} icon={ev.rsvpedByMe ? CheckCircle2 : Plus}>
                    {ev.rsvpedByMe ? "Going" : joined ? "RSVP" : "Join to RSVP"}
                  </SecondaryButton>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "members" && (
        <div>
          <h4 className="font-extrabold text-sm mb-3" style={{ color: C.ink }}>Officers</h4>
          <div className="flex flex-wrap gap-3 mb-6">
            {(club.officers || clubMembers.slice(0, 2)).map((name) => (
              <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: C.paperCard, border: `1px solid ${C.paperLine}` }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: colorForName(name), color: "#1e1f22" }}>
                  {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="text-sm font-semibold" style={{ color: C.ink }}>{name}</span>
              </div>
            ))}
          </div>
          <h4 className="font-extrabold text-sm mb-3" style={{ color: C.ink }}>Members ({club.members})</h4>
          <div className="flex flex-wrap gap-2">
            {joined && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ backgroundColor: C.tealSoft, border: `1px solid ${C.teal}` }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px]" style={{ backgroundColor: colorForName(profile.name), color: "#1e1f22" }}>
                  {profile.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="text-xs font-semibold" style={{ color: C.teal }}>{profile.name} (you)</span>
              </div>
            )}
            {clubMembers.map((name) => (
              <div key={name} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ backgroundColor: C.paper }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px]" style={{ backgroundColor: colorForName(name), color: "#1e1f22" }}>
                  {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <span className="text-xs font-medium" style={{ color: C.inkSoft }}>{name}</span>
              </div>
            ))}
            <span className="text-xs px-2.5 py-1.5" style={{ color: C.textMuted }}>+{Math.max(0, club.members - clubMembers.length)} more</span>
          </div>
        </div>
      )}

      {tab === "about" && (
        <Card>
          <p className="text-sm mb-4" style={{ color: C.inkSoft }}>{club.desc}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Category</span>{club.category}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Founded</span>{club.founded}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Joining</span>{club.joinType === "approval" ? "Approval needed" : "Open"}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Activity</span>{club.activity}</div>
          </div>
        </Card>
      )}
    </div>
  );
}

function CreateClubModal({ onClose, onSubmit, profile }) {
  const [form, setForm] = useState({ name: "", tagline: "", desc: "", category: "Interest club", major: "", joinType: "open", icon: CLUB_ICONS[0], color: CLUB_COLORS[0] });
  return (
    <Modal title="Create a club" onClose={onClose}>
      <Field label="Pick an icon">
        <div className="grid grid-cols-8 gap-1.5">
          {CLUB_ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setForm({ ...form, icon: ic })}
              className="aspect-square rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: form.icon === ic ? C.tealSoft : C.paper, border: `1px solid ${form.icon === ic ? C.teal : C.paperLine}` }}
            >
              {ic}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Pick a color">
        <div className="flex gap-2">
          {CLUB_COLORS.map((col) => (
            <button
              key={col}
              onClick={() => setForm({ ...form, color: col })}
              className="w-7 h-7 rounded-full shrink-0"
              style={{ backgroundColor: col, border: form.color === col ? `2px solid ${C.ink}` : "2px solid transparent", boxShadow: form.color === col ? "0 0 0 2px #fff inset" : "none" }}
            />
          ))}
        </div>
      </Field>
      <Field label="Club name"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Robotics Club" /></Field>
      <Field label="Tagline (one short line)"><input style={inputStyle} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Building bots that don't fall over" /></Field>
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
        onClick={() => form.name && onSubmit({
          ...form,
          id: "c" + Date.now(),
          members: 1,
          major: form.major || null,
          tagline: form.tagline || "A brand new club — come shape what it becomes.",
          tags: ["New"],
          founded: new Date().getFullYear(),
          activity: "New",
          officers: [profile?.name || "Founder"],
          events: [],
          announcements: [],
        })}
      >
        Create club
      </PrimaryButton>
    </Modal>
  );
}

// ---------- Network ----------
function NetworkView({ profile, people, onConnect }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({});

  const connect = (p) => {
    if (status[p.id]) return; // already requested / connected
    setStatus((prev) => ({ ...prev, [p.id]: "Pending" }));
    onConnect(p, "Pending");
    setTimeout(() => {
      setStatus((prev) => ({ ...prev, [p.id]: "Connected" }));
      onConnect(p, "Connected");
    }, 2500);
  };

  const filtered = people.filter((p) => (p.name + p.college + p.major).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-5xl">
      <Eyebrow color={C.coral}>Network</Eyebrow>
      <h1 className="font-black text-2xl sm:text-3xl mb-4" style={{ color: C.ink }}>Find people across Mumbai colleges</h1>
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
        <input style={{ ...inputStyle, paddingLeft: 34 }} placeholder="Search by name, college, or major" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <SecondaryButton active={!!status[p.id]} onClick={() => connect(p)} icon={status[p.id] === "Connected" ? CheckCircle2 : status[p.id] === "Pending" ? undefined : UserPlus}>
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
        <h1 className="font-black text-2xl sm:text-3xl" style={{ color: C.ink }}>{profile.name}</h1>
        {isPoster && (
          profile.isVerified
            ? <Badge bg={C.tealSoft} fg={C.teal}><span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> Verified</span></Badge>
            : <Badge bg={C.coralSoft} fg={C.coral}>Pending verification</Badge>
        )}
      </div>

      <Card className="mb-4">
        {isCompany ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Company</span>{profile.companyName}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Industry</span>{profile.industry}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Role</span>{profile.role}</div>
            <div><span className="block text-xs font-bold uppercase" style={{ color: C.textMuted }}>Status</span>{profile.isVerified ? `Verified${profile.verifiedVia === "google" ? " via Google" : ""} — can post internships` : "Pending review"}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
function PosterDashboard({ profile, opportunities, onVerifiedViaGoogle }) {
  const isCompany = profile.role === "Company";
  const identity = isCompany ? profile.companyName : profile.name;
  const mine = opportunities.filter((o) => o.postedBy === identity || o.org === identity);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleMiss, setGoogleMiss] = useState(null);

  const handleGoogleSelect = (acc) => {
    setShowGooglePicker(false);
    const domain = emailDomain(acc.email);
    const matched = isCompany ? !!KNOWN_COMPANY_DOMAINS[domain] : isCollegeDomain(domain);
    if (matched) {
      setGoogleMiss(null);
      onVerifiedViaGoogle(acc);
    } else {
      setGoogleMiss(acc.email);
    }
  };

  return (
    <div className="max-w-4xl">
      <Eyebrow color={C.marigoldDark}>{isCompany ? "Company tools" : "Professor tools"}</Eyebrow>
      <h1 className="font-black text-2xl sm:text-3xl mb-2" style={{ color: C.ink }}>{isCompany ? "Company Dashboard" : "Professor Dashboard"}</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>
        {isCompany
          ? `Post internships from the Internships & Research board once "${identity}" is verified.`
          : `Publish research from the Internships & Research board once your professor account is verified.`}
      </p>
      {profile.isVerified ? (
        <Card className="mb-4" style={{ backgroundColor: C.tealSoft, borderColor: "transparent" }}>
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: C.teal }}>
            <ShieldCheck size={16} /> Verified{profile.verifiedVia === "google" ? " via Google" : ""} — your postings carry a verified badge visible to students.
          </p>
        </Card>
      ) : (
        <Card className="mb-4" style={{ backgroundColor: C.coralSoft, borderColor: "transparent" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: C.coral }}>
            Verification pending — {isCompany ? "once your company is confirmed against our registry" : "once your college email is confirmed"}, you'll be able to post here.
          </p>
          <GoogleButton onClick={() => setShowGooglePicker(true)}>
            Verify with Google {isCompany ? "Workspace" : "(college email)"}
          </GoogleButton>
          {googleMiss && (
            <p className="text-xs mt-2" style={{ color: C.coral }}>"{googleMiss}" isn't on our verified domain list yet.</p>
          )}
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
      {showGooglePicker && <GoogleAccountPicker onClose={() => setShowGooglePicker(false)} onSelect={handleGoogleSelect} />}
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("home");
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [applications, setApplications] = useState([]);
  const [clubs, setClubs] = useState(() => initialClubs.map((c) => ({ ...c, chatMessages: seedClubChat(c) })));
  const [projectPosts, setProjectPosts] = useState(initialProjectPosts);
  const [channels, setChannels] = useState(seedChannels());
  const [cvModalOpp, setCvModalOpp] = useState(null);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const pushNotification = ({ text, icon, iconBg, showToast = true }) => {
    const n = { id: "n" + Date.now() + Math.random().toString(36).slice(2, 6), text, icon, iconBg, ts: Date.now(), read: false };
    setNotifications((prev) => [n, ...prev]);
    if (showToast) {
      setToast(n);
      setTimeout(() => setToast((cur) => (cur && cur.id === n.id ? null : cur)), 3500);
    }
  };

  const handleConnect = (person, stage) => {
    if (stage === "Pending") {
      pushNotification({ text: `Connection request sent to ${person.name}`, icon: UserPlus, iconBg: C.tealSoft, showToast: false });
    } else {
      pushNotification({ text: `${person.name} accepted your connection request`, icon: UserCheck, iconBg: C.marigold });
    }
  };

  const handleGoogleVerification = (acc) => {
    setProfile((p) => ({ ...p, isVerified: true, verifiedVia: "google", googleEmail: acc.email }));
    pushNotification({ text: `Verified via Google (${acc.email}) — you can post now`, icon: ShieldCheck, iconBg: C.tealSoft });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ backgroundColor: C.paper, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar view={view} setView={setView} profile={profile} notifications={notifications} unreadCount={unreadCount} onOpenNotifications={markAllRead} />
      <MobileTopBar profile={profile} setView={setView} notifications={notifications} unreadCount={unreadCount} onOpenNotifications={markAllRead} onOpenMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} view={view} setView={setView} profile={profile} />
      <NotificationToast toast={toast} />
      <div className="flex-1 p-4 pt-16 sm:p-6 sm:pt-16 md:p-8 md:pt-8 overflow-y-auto">
        {view === "home" && <HomeView profile={profile} setView={setView} opportunities={opportunities} />}
        {view === "opportunities" && (
          <OpportunitiesView
            profile={profile}
            opportunities={opportunities}
            setOpportunities={setOpportunities}
            applications={applications}
            setApplications={setApplications}
            onNeedCv={requestCv}
            onVerifiedViaGoogle={handleGoogleVerification}
          />
        )}
        {view === "chat" && profile.role !== "Company" && <ChatView profile={profile} channels={channels} setChannels={setChannels} />}
        {view === "clubs" && profile.role !== "Company" && <ClubsView profile={profile} clubs={clubs} setClubs={setClubs} posts={projectPosts} setPosts={setProjectPosts} pushNotification={pushNotification} />}
        {view === "network" && <NetworkView profile={profile} people={initialNetwork} onConnect={handleConnect} />}
        {view === "profile" && <ProfileView profile={profile} applications={applications} onNeedCv={() => requestCv(null)} />}
        {view === "professor" && profile.role === "Professor" && <PosterDashboard profile={profile} opportunities={opportunities} onVerifiedViaGoogle={handleGoogleVerification} />}
        {view === "company" && profile.role === "Company" && <PosterDashboard profile={profile} opportunities={opportunities} onVerifiedViaGoogle={handleGoogleVerification} />}
      </div>
      {cvModalOpen && <CvGateModal onUpload={handleCvUpload} onClose={() => setCvModalOpen(false)} />}
    </div>
  );
}

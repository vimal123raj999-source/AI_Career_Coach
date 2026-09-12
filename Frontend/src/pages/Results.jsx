import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  Star,

  
  AlertTriangle,
  Briefcase,
  Lightbulb,
  CheckCircle,
  XCircle,
  UploadCloud,
  ArrowLeft,
  FileWarning,
  Sparkles,
  Layers,
  Wrench,
  FileText,
  AlertCircle,
  ListOrdered
} from "lucide-react";

// Helper to safely render strings or object values
const renderItem = (item) => {
  if (typeof item === "object" && item !== null) {
    return Object.values(item).join(" | ");
  }
  return String(item);
};

function ScoreRing({ score, max = 100 }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / max) * circ;
  const color = score >= 70 ? "#00e5ff" : score >= 40 ? "#9b59ff" : "#ff4d9e";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-arc"
          style={{ "--offset": offset, filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-gray-400 text-xs">/ {max}</span>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children, className = "" }) {
  return (
    <div className={`result-card backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <h3 className="font-bold text-white text-lg sm:text-xl" style={{ fontFamily: "Space Grotesk" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function TagList({ items, color }) {
  if (!items?.length) return <p className="text-gray-500 text-sm">None identified</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
        >
          {renderItem(item)}
        </span>
      ))}
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const scoreRef = useRef(null);

  const data = location.state?.result;
  const filename = location.state?.filename || "uploaded resume";

  // Data format comes straight from Gemini API matching new requested JSON structure
  const isValid = data !== undefined && data.error === undefined;
  const invalidReason = data?.error || "Invalid resume. Please upload a valid resume or CV.";

  const overallScore = data?.overall_score || 0;
  const atsScore = data?.ats_score || 0;

  useEffect(() => {
    if (!data) return;

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    if (isValid) {
      gsap.fromTo(
        scoreRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.9, delay: 0.2, ease: "back.out(1.1)" }
      );
      gsap.fromTo(
        ".result-card",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        ".ats-bar",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, stagger: 0.08, delay: 0.7, ease: "power2.out", transformOrigin: "left center" }
      );
    }
  }, [data, isValid]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black grid-bg flex flex-col items-center justify-center gap-6 px-4">
        <Brain size={60} className="text-cyan-400 opacity-40" />
        <p className="text-gray-400 text-xl">No evaluation data found.</p>
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2"
        >
          <UploadCloud size={18} /> Upload Resume
        </button>
      </div>
    );
  }

  // REJECTION SCREEN FOR NON-RESUME DOCUMENTS
  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] grid-bg flex flex-col items-center justify-center px-4 py-20 text-[#f5f5ee]">
        <div className="max-w-xl w-full backdrop-blur-2xl bg-red-950/20 border border-red-500/30 rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl shadow-red-500/10">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center mb-6">
            <FileWarning size={42} className="text-red-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-widest mb-4">
            <AlertCircle size={14} /> INVALID RESUME
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "Space Grotesk" }}>
            Invalid Resume
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-4 w-full">
            {invalidReason}
          </p>

          <p className="text-gray-400 text-xs sm:text-sm mb-8 leading-relaxed">
            Please upload a valid resume or CV file (PDF, DOC, or DOCX) containing work experience, skills, education, and contact details.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="w-full py-4 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-red-500/20"
          >
            <UploadCloud size={20} /> Upload a Valid Resume / CV
          </button>
        </div>
      </div>
    );
  }

  // VALID RESUME ANALYSIS REPORT SCREEN
  const scoreLabel = overallScore >= 75 ? "Excellent" : overallScore >= 55 ? "Good" : overallScore >= 35 ? "Average" : "Needs Work";
  const scoreColor = overallScore >= 75 ? "#00ff87" : overallScore >= 55 ? "#00e5ff" : overallScore >= 35 ? "#9b59ff" : "#ff4d9e";

  return (
    <div className="min-h-screen bg-[#0b0b0e] grid-bg overflow-x-hidden pt-28 pb-24 px-4 sm:px-6 lg:px-8 text-[#f5f5ee]">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] -top-40 -right-40" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] -bottom-40 -left-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        {/* Header Navigation Bar */}
        <div ref={headerRef} className="flex items-center justify-between">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Upload Another Resume
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles size={13} className="text-emerald-400 animate-pulse" />
              <span>AI Connected (Gemini)</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-emerald-400" />
              <span className="font-bold text-white text-sm sm:text-base" style={{ fontFamily: "Space Grotesk" }}>
                AI Career Coach
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Analysis Complete</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white" style={{ fontFamily: "Space Grotesk" }}>
            AI Resume Analysis Report
          </h1>
          <p className="text-gray-400 text-sm break-all">{filename}</p>
        </div>

        {/* Overall Score Card */}
        <div
          ref={scoreRef}
          className="result-card backdrop-blur-2xl bg-white/[0.035] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          <div className="flex flex-col items-center">
            <ScoreRing score={overallScore} />
            <div
              className="mt-4 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}
            >
              {scoreLabel}
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
              Overall AI Evaluation
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed bg-white/5 border border-white/10 p-5 rounded-2xl">
              {data.summary || "No summary provided."}
            </p>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>ATS Compatibility Score</span>
              <span>{atsScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="ats-bar h-full rounded-full"
                style={{
                  width: `${atsScore}%`,
                  background: `linear-gradient(90deg, #9d4edd, #ff4d9e)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* REPORT SECTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STRENGTHS */}
          <Section icon={Star} title="1. Key Strengths" color="#00ff87">
            <div className="space-y-3">
              {data.strengths?.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={17} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">{renderItem(s)}</span>
                </div>
              )) || <p className="text-gray-500 text-sm">No data available</p>}
            </div>
          </Section>

          {/* WEAKNESSES */}
          <Section icon={AlertTriangle} title="2. Areas for Improvement" color="#ff4d9e">
            <div className="space-y-3">
              {data.weaknesses?.map((w, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle size={17} className="text-pink-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">{renderItem(w)}</span>
                </div>
              )) || <p className="text-gray-500 text-sm">No weaknesses detected</p>}
            </div>
          </Section>

          {/* WHAT TO IMPROVE */}
          <Section icon={Lightbulb} title="3. Recommended Improvements" color="#00e5ff" className="md:col-span-2">
            <div className="space-y-3">
              {data.recommended_improvements?.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-200 text-sm leading-relaxed">{renderItem(imp)}</span>
                </div>
              )) || <p className="text-gray-500 text-sm">No specific improvements suggested</p>}
            </div>
          </Section>

          {/* ATS ANALYSIS */}
          <Section icon={Layers} title="4. ATS Issues" color="#9d4edd" className="md:col-span-2">
            <div className="space-y-4">
              {data.ats_issues?.length > 0 ? (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">Parsing Risks to Avoid</p>
                  {data.ats_issues.map((risk, i) => (
                    <p key={i} className="text-gray-300 text-xs leading-relaxed">• {renderItem(risk)}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No major ATS compatibility issues detected.</p>
              )}
            </div>
          </Section>

          {/* SKILLS ANALYSIS */}
          <Section icon={Wrench} title="5. Skills Analysis" color="#f59e0b" className="md:col-span-2">
            <div className="space-y-5">
              {data.skills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">All Skills</p>
                  <TagList items={data.skills} color="#00ff87" />
                </div>
              )}
              {data.technical_skills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Technical Skills</p>
                  <TagList items={data.technical_skills} color="#00e5ff" />
                </div>
              )}
              {data.soft_skills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Soft Skills</p>
                  <TagList items={data.soft_skills} color="#f59e0b" />
                </div>
              )}
              {data.missing_skills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Recommended Missing Skills</p>
                  <TagList items={data.missing_skills} color="#ff4d9e" />
                </div>
              )}
            </div>
          </Section>

          {/* EXPERIENCE & PROJECTS */}
          <Section icon={Briefcase} title="6. Experience & Projects" color="#3b82f6" className="md:col-span-2">
            <div className="space-y-4">
              {data.experience?.length > 0 && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Experience Found</p>
                  {data.experience.map((exp, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed">• {renderItem(exp)}</p>
                  ))}
                </div>
              )}

              {data.projects?.length > 0 && (
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Projects Highlighted</p>
                  {data.projects.map((proj, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed">• {renderItem(proj)}</p>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* EDUCATION & ROLES */}
          <Section icon={FileText} title="7. Education & Recommended Roles" color="#ec4899" className="md:col-span-2">
            <div className="space-y-4">
              {data.education?.length > 0 && (
                <div className="p-4 bg-white/5 border border-pink-500/30 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-1.5">
                    Education Listed
                  </p>
                  {data.education.map((edu, i) => (
                     <p key={i} className="text-gray-200 text-sm leading-relaxed italic bg-black/40 p-3.5 rounded-xl border border-white/10">
                       &quot;{renderItem(edu)}&quot;
                     </p>
                  ))}
                </div>
              )}

              {data.recommended_roles?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Recommended Roles</p>
                  <TagList items={data.recommended_roles} color="#ec4899" />
                </div>
              )}
            </div>
          </Section>

          {/* FINAL ACTION PLAN */}
          <Section icon={ListOrdered} title="8. Career Advice" color="#10b981" className="md:col-span-2">
            <div className="space-y-4">
              {data.career_advice?.length > 0 ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                  {data.career_advice.map((item, i) => (
                    <p key={i} className="text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{renderItem(item)}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No specific career advice generated.</p>
              )}
            </div>
          </Section>
        </div>

        {/* Re-upload CTA */}
        <div className="pt-8 text-center">
          <button
            onClick={() => navigate("/upload")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 text-black rounded-full font-black text-base sm:text-lg flex items-center gap-2.5 mx-auto hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
            style={{ fontFamily: "Space Grotesk" }}
          >
            <UploadCloud size={20} /> Analyze Another Resume PDF / DOCX
          </button>
        </div>
      </div>
    </div>
  );
}

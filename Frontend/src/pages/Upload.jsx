import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import {
  UploadCloud,
  FileText,
  X,
  Zap,
  CheckCircle,
  Sparkles,
  FolderPlus,
  ArrowDownRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadResume() {
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);
  const pinwheelRef = useRef(null);
  const helixRef = useRef(null);
  const bracketRef = useRef(null);
  const dropRef = useRef(null);
  const whySectionRef = useRef(null);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadingMessages = [
    "Validating document format and content...",
    "Checking ATS compatibility & section structure...",
    "Evaluating strengths, weaknesses, and missing skills...",
    "Preparing personalized AI career recommendations...",
  ];

  useEffect(() => {
    // Entrance Animations
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-line-1",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    )
      .fromTo(
        ".hero-line-2",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        bracketRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        dropRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.1)" },
        "-=0.3"
      )
      .fromTo(
        ".gsap-feature-card",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=0.2"
      );

    // Continuous 3D Pinwheel Animation
    gsap.to(pinwheelRef.current, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Continuous Floating 3D Helix
    gsap.to(helixRef.current, {
      y: -10,
      rotate: 10,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const validateFileLocally = (selectedFile) => {
    if (!selectedFile) return false;

    const ext = selectedFile.name.toLowerCase().split(".").pop();
    const validExts = ["pdf", "doc", "docx"];

    if (!validExts.includes(ext)) {
      setError("Invalid file format. Please upload a valid PDF, DOC, or DOCX resume.");
      return false;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds maximum 10MB limit. Please upload a smaller resume file.");
      return false;
    }

    setFile(selectedFile);
    setError("");
    gsap.fromTo(
      dropRef.current,
      { scale: 1.015 },
      { scale: 1, duration: 0.35, ease: "bounce.out" }
    );
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    validateFileLocally(dropped);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    validateFileLocally(selected);
  };

  const openFilePicker = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a valid PDF, DOC, or DOCX resume first.");
      return;
    }

    setAnalyzing(true);
    setLoadingStep(0);
    setError("");

    // Step sequence interval
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      // Call single backend API for upload and AI analysis
      const formData = new FormData();
      formData.append("file", file);

      // 90s timeout — Gemini AI analysis can take up to 35s on first attempt
      const analyzeRes = await axios.post(
        "http://127.0.0.1:8000/api/resume/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 90000,
        }
      );

      clearInterval(stepInterval);
      setAnalyzing(false);

      const result = analyzeRes.data;

      if (result.error) {
        setError(result.error);
        return;
      }

      // Navigate to Results page with report (the new JSON payload is in result.data)
      navigate("/results", { state: { result: result.data, filename: file.name } });

    } catch (err) {
      clearInterval(stepInterval);
      setAnalyzing(false);

      if (err.code === "ECONNREFUSED" || err.message?.includes("Network Error")) {
        setError("Cannot connect to server. Please make sure the backend is running on port 8000.");
      } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Analysis is taking longer than expected. Please try again.");
      } else {
        const friendlyErr = err.response?.data?.error || "Something went wrong. Please try again.";
        setError(friendlyErr);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0b0b0e] grid-bg overflow-x-hidden relative text-[#f5f5ee] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 w-full"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-pink-500/10 rounded-full blur-[150px] -top-40 -left-40" />
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-purple-600/10 to-cyan-500/10 rounded-full blur-[150px] top-1/2 -right-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16 sm:space-y-20 lg:space-y-24">
        {/* HERO SECTION — RESPONSIVE KINETIC TYPOGRAPHY */}
        <div ref={heroTextRef} className="space-y-8 sm:space-y-10 w-full">
          <div className="space-y-2 sm:space-y-3 w-full">
            <div className="hero-line-1 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2 w-full">
              <span className="gsap-hero-title">An</span>
              <div
                ref={pinwheelRef}
                className="gsap-pinwheel w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16"
              >
                <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="gsap-hero-title">alyze</span>
            </div>

            <div className="hero-line-2 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2 w-full">
              <span className="gsap-hero-title">anyth</span>
              <div
                ref={helixRef}
                className="gsap-helix-icon w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14"
              >
                <Cpu className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <span className="gsap-hero-title">ing</span>
            </div>
          </div>

          {/* Subtitle Bracket & Action Button */}
          <div
            ref={bracketRef}
            className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full"
          >
            <div className="gsap-bracket max-w-xl text-xs sm:text-sm">
              <span className="gsap-bracket-symbol">&#123;</span>
              <span>
                AI CAREER COACH – ATS Resume Intelligence & Skill Evaluation Engine
              </span>
              <span className="gsap-bracket-symbol">&#125;</span>
            </div>

            <button
              type="button"
              onClick={openFilePicker}
              className="gsap-pill-btn gsap-pill-btn-primary self-start sm:self-auto text-xs sm:text-sm"
            >
              Analyze Resume <ArrowDownRight size={15} />
            </button>
          </div>
        </div>

        <hr className="border-white/10 w-full" />

        {/* WHY AI CAREER COACH SECTION */}
        <div ref={whySectionRef} className="space-y-6 sm:space-y-8 max-w-4xl w-full">
          <div className="gsap-bracket">
            <span className="gsap-bracket-symbol">&#123;</span>
            <span className="text-white font-medium">Why AI Career Coach®</span>
            <span className="gsap-bracket-symbol">&#125;</span>
          </div>

          <h2
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug sm:leading-tight text-gray-100 tracking-tight"
            style={{ fontFamily: "Space Grotesk" }}
          >
            AI Career Coach allows you to effortlessly analyze any resume document. Delivering silky-smooth ATS scoring, instant skill gap discovery, and actionable career guidance.
          </h2>
        </div>

        {/* INTERACTIVE FILE UPLOADER CARD */}
        <div className="space-y-6 sm:space-y-8 w-full">
          <div
            ref={dropRef}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={openFilePicker}
            className={`drop-zone p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center relative backdrop-blur-2xl w-full ${
              dragOver ? "drag-over" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/10">
                  <FileText size={36} className="text-emerald-400 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p
                    className="text-white font-bold text-xl sm:text-2xl break-all"
                    style={{ fontFamily: "Space Grotesk" }}
                  >
                    {file.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {(file.size / 1024).toFixed(1)} KB — Ready for validation & AI evaluation
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="gsap-pill-btn text-xs px-4 py-2"
                  >
                    <FolderPlus size={14} /> Change Document
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 text-center max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-xl">
                  <UploadCloud size={38} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight"
                    style={{ fontFamily: "Space Grotesk" }}
                  >
                    Drop Your Resume Here
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    or click anywhere inside this dropzone to select a PDF, DOC, or DOCX file
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openFilePicker}
                  className="gsap-pill-btn gsap-pill-btn-primary text-xs sm:text-sm px-6 py-3 mt-1"
                >
                  <FolderPlus size={16} /> Select Resume File
                </button>

                <p className="text-xs text-gray-500 pt-1">
                  Supports PDF, DOC, and DOCX files up to 10MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
              <AlertTriangle size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* RUN AI ANALYSIS ACTION BUTTON & PROGRESSIVE LOADING */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !file}
            className="w-full py-4 sm:py-5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 text-black rounded-full font-black text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 sm:gap-3 hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            style={{ fontFamily: "Space Grotesk" }}
          >
            {analyzing ? (
              <>
                <div className="spinner border-black border-t-transparent" />
                <span>{loadingMessages[loadingStep]}</span>
              </>
            ) : (
              <>
                <Zap size={20} /> Run AI Resume Analysis <ArrowDownRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* RESPONSIVE FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4 w-full">
          <div className="gsap-feature-card glass-card p-6 sm:p-8 md:p-10 space-y-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <BarChart3 size={24} className="text-amber-400" />
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Space Grotesk" }}
            >
              ATS Score Breakdown
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Instant evaluation across 10 critical ATS criteria including keywords, formatting, sections, and experience density.
            </p>
          </div>

          <div className="gsap-feature-card glass-card p-6 sm:p-8 md:p-10 space-y-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Flame size={24} className="text-purple-400" />
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Space Grotesk" }}
            >
              Skill Gap Discovery
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI highlights missing in-demand skills and framework keywords required for top-tier industry engineering roles.
            </p>
          </div>

          <div className="gsap-feature-card glass-card p-6 sm:p-8 md:p-10 space-y-4 w-full">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={24} className="text-emerald-400" />
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Space Grotesk" }}
            >
              AI Career Guidance
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get personalized position recommendations and bullet-point optimization advice from our generative AI career coach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

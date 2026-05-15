import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertCircle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Code2,
  FileText,
  GraduationCap,
  HeartPulse,
  Loader2,
  PanelTop,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  X
} from "lucide-react";
import "./styles.css";

const HISTORY_KEY = "resumeiq.reviewHistory.v1";

const cvTemplates = [
  {
    industry: "IT & Software",
    role: "Junior Software Developer",
    icon: Code2,
    accent: "from-blue-500 to-teal-500",
    sections: ["Profile", "Technical Skills", "Projects", "Experience", "Education", "Certifications"],
    keywords: ["JavaScript", "React", "Node.js", "Git", "APIs", "Testing", "SQL"],
    profile:
      "Junior software developer with hands-on experience building responsive web applications using React, Node.js and REST APIs. Strong problem solver with a portfolio of projects, clean Git habits and a focus on accessible, maintainable code.",
    bullets: [
      "Built a full-stack web app using React, Express and a REST API, improving confidence with component design and backend routing.",
      "Used Git and GitHub for version control, feature branches and deployment-ready project documentation.",
      "Implemented form validation, loading states and error handling to improve reliability and user experience."
    ]
  },
  {
    industry: "Data & Analytics",
    role: "Graduate Data Analyst",
    icon: BarChart3,
    accent: "from-teal-500 to-emerald-500",
    sections: ["Profile", "Analytical Skills", "Projects", "Experience", "Education", "Tools"],
    keywords: ["SQL", "Excel", "Power BI", "Python", "Dashboards", "Data cleaning", "Insights"],
    profile:
      "Graduate data analyst with experience cleaning, analysing and visualising datasets to support better decisions. Comfortable with SQL, Excel, dashboarding and presenting clear insights to non-technical audiences.",
    bullets: [
      "Cleaned and analysed large datasets using SQL and Excel to identify trends, anomalies and improvement opportunities.",
      "Created interactive dashboards to communicate KPIs and make performance data easier to monitor.",
      "Presented findings with clear recommendations, linking analysis to business impact."
    ]
  },
  {
    industry: "Business & Finance",
    role: "Finance Assistant",
    icon: BriefcaseBusiness,
    accent: "from-amber-500 to-rose-500",
    sections: ["Profile", "Key Skills", "Experience", "Education", "Achievements", "Systems"],
    keywords: ["Excel", "Reporting", "Reconciliation", "Budgeting", "Accuracy", "Stakeholders"],
    profile:
      "Detail-oriented finance graduate with strong Excel, reporting and numerical analysis skills. Able to work accurately under deadlines, support reconciliations and communicate financial information clearly.",
    bullets: [
      "Prepared accurate spreadsheet reports, checking figures and resolving inconsistencies before submission.",
      "Supported invoice tracking and reconciliation tasks while maintaining clear records.",
      "Worked with stakeholders to gather missing information and keep reporting deadlines on track."
    ]
  },
  {
    industry: "Marketing",
    role: "Digital Marketing Assistant",
    icon: PanelTop,
    accent: "from-pink-500 to-orange-500",
    sections: ["Profile", "Marketing Skills", "Campaigns", "Experience", "Education", "Tools"],
    keywords: ["SEO", "Analytics", "Content", "Social media", "Campaigns", "Canva", "Email"],
    profile:
      "Creative digital marketing graduate with experience supporting content, social media and campaign reporting. Confident using analytics to understand performance and improve engagement.",
    bullets: [
      "Created social content calendars and campaign assets aligned with brand tone and audience needs.",
      "Tracked campaign performance using analytics tools and summarised results for stakeholders.",
      "Improved content quality by applying SEO basics, clear calls to action and consistent formatting."
    ]
  },
  {
    industry: "Healthcare",
    role: "Healthcare Assistant",
    icon: HeartPulse,
    accent: "from-emerald-500 to-cyan-500",
    sections: ["Profile", "Care Skills", "Experience", "Training", "Education", "Safeguarding"],
    keywords: ["Patient care", "Communication", "Safeguarding", "Confidentiality", "Teamwork", "Records"],
    profile:
      "Compassionate healthcare candidate with strong communication, teamwork and patient care awareness. Committed to confidentiality, safeguarding and providing reliable support in busy care environments.",
    bullets: [
      "Supported service users with dignity, patience and clear communication.",
      "Maintained accurate records and followed confidentiality procedures.",
      "Worked calmly with colleagues to prioritise care tasks in a fast-paced setting."
    ]
  },
  {
    industry: "Education",
    role: "Teaching Assistant",
    icon: GraduationCap,
    accent: "from-indigo-500 to-blue-500",
    sections: ["Profile", "Classroom Skills", "Experience", "Education", "Training", "Achievements"],
    keywords: ["Lesson support", "Safeguarding", "SEN", "Behaviour", "Communication", "Planning"],
    profile:
      "Supportive education candidate with experience helping learners stay engaged, organised and confident. Strong communicator with awareness of safeguarding, inclusion and classroom routines.",
    bullets: [
      "Supported small groups and individual learners with class activities and confidence building.",
      "Helped maintain a positive classroom environment through calm communication and consistency.",
      "Prepared learning materials and supported teachers with lesson organisation."
    ]
  },
  {
    industry: "Retail & Customer Service",
    role: "Customer Service Advisor",
    icon: Building2,
    accent: "from-coral to-gold",
    sections: ["Profile", "Customer Skills", "Experience", "Achievements", "Education", "Systems"],
    keywords: ["Customer service", "Sales", "Complaints", "Communication", "Targets", "POS"],
    profile:
      "Reliable customer service candidate with strong communication, problem solving and sales awareness. Experienced in helping customers, resolving issues and contributing to team targets.",
    bullets: [
      "Handled customer queries professionally, resolving issues and escalating complex cases when needed.",
      "Maintained product knowledge to support confident recommendations and improved customer experience.",
      "Worked flexibly with team members to meet service standards during busy periods."
    ]
  }
];

const emptyAnalysis = {
  score: 0,
  atsScore: 0,
  summary: "",
  strengths: [],
  weaknesses: [],
  missingSkills: [],
  suggestedImprovements: []
};

function App() {
  const [activeView, setActiveView] = useState("analyser");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(emptyAnalysis);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState(() => loadReviewHistory());
  const inputRef = useRef(null);

  const canAnalyse = Boolean(file) && !isLoading;
  const matchLabel = useMemo(() => {
    if (!analysis.missingSkills.length) return "Keyword coverage looks healthy";
    return `${analysis.missingSkills.length} likely gap${analysis.missingSkills.length === 1 ? "" : "s"} found`;
  }, [analysis.missingSkills.length]);

  const progressDelta = useMemo(() => {
    if (!meta || history.length < 2) return null;
    return history[0].score - history[1].score;
  }, [history, meta]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function selectFile(nextFile) {
    setError("");
    setAnalysis(emptyAnalysis);
    setMeta(null);

    if (!nextFile) return;
    if (nextFile.type !== "application/pdf") {
      setError("Please upload a PDF CV.");
      return;
    }

    setFile(nextFile);
  }

  async function analyseCv() {
    if (!file) return;

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not analyse this CV.");
      }

      setAnalysis(data.analysis);
      const nextMeta = {
        fileName: data.fileName,
        wordCount: data.wordCount,
        preview: data.extractedTextPreview
      };
      setMeta(nextMeta);
      saveReview(data.analysis, nextMeta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function saveReview(nextAnalysis, nextMeta) {
    const review = {
      id: `${Date.now()}-${nextMeta.fileName}`,
      date: new Date().toISOString(),
      fileName: nextMeta.fileName,
      wordCount: nextMeta.wordCount,
      score: nextAnalysis.score,
      atsScore: nextAnalysis.atsScore,
      missingSkillsCount: nextAnalysis.missingSkills.length,
      summary: nextAnalysis.summary
    };

    setHistory(previous => [review, ...previous].slice(0, 5));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_8%,_rgba(15,118,110,0.20),_transparent_30%),radial-gradient(circle_at_92%_4%,_rgba(232,93,117,0.14),_transparent_28%),linear-gradient(135deg,_#FAF7F2_0%,_#EEF7F4_48%,_#F7F3FF_100%)] px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="animate-in flex flex-col gap-5 border-b border-white/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-white/70 px-3 py-1 text-sm font-black uppercase text-mint shadow-sm backdrop-blur">
              CV Builder by <span className="ps-mark ml-1">PS</span>
            </p>
            <h1 className="pb-2 bg-gradient-to-r from-slate-950 via-teal-900 to-coral bg-clip-text text-4xl font-black leading-[1.08] tracking-normal text-transparent sm:text-6xl">
              Build a better CV with every upload
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Upload a PDF, get AI feedback, then track the last five reviews locally so you can compare your progress without creating an account.
            </p>
          </div>
          <div className="score-shimmer flex items-center gap-2 rounded-lg border border-white/80 bg-gradient-to-r from-white via-teal-50 to-rose-50 px-4 py-3 shadow-glow backdrop-blur">
            <Sparkles className="soft-pulse h-5 w-5 text-coral" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-700">PDF parsing + AI review + progress history</span>
          </div>
        </header>

        <nav className="animate-in flex flex-wrap gap-2" style={{ animationDelay: "60ms" }} aria-label="Main sections">
          <button
            className={`min-h-11 rounded-lg px-4 text-sm font-black transition ${activeView === "analyser" ? "bg-ink text-white shadow-soft" : "border border-white/80 bg-white/80 text-slate-700 hover:bg-white"}`}
            type="button"
            onClick={() => setActiveView("analyser")}
          >
            AI CV Analyser
          </button>
          <button
            className={`min-h-11 rounded-lg px-4 text-sm font-black transition ${activeView === "templates" ? "bg-ink text-white shadow-soft" : "border border-white/80 bg-white/80 text-slate-700 hover:bg-white"}`}
            type="button"
            onClick={() => setActiveView("templates")}
          >
            CV Templates
          </button>
        </nav>

        {activeView === "templates" ? (
          <TemplatesPage />
        ) : (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="animate-in grid gap-5" style={{ animationDelay: "90ms" }}>
            <UploadPanel
              file={file}
              inputRef={inputRef}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onSelectFile={selectFile}
              onClear={() => {
                setFile(null);
                setAnalysis(emptyAnalysis);
                setMeta(null);
                setError("");
              }}
            />

            <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">Target job description</h2>
                <span className="text-sm font-bold text-slate-500">Optional</span>
              </div>
              <textarea
                className="min-h-44 w-full resize-y rounded-lg border border-teal-100 bg-white/80 p-4 leading-6 outline-none transition duration-300 focus:border-mint focus:bg-white focus:ring-4 focus:ring-teal-100"
                value={jobDescription}
                onChange={event => setJobDescription(event.target.value)}
                placeholder="Paste the job advert here so the AI can check relevance, missing skills and keyword alignment."
              />
            </section>

            {error ? (
              <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : null}

            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-mint to-ocean px-5 font-black text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:shadow-soft disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              type="button"
              disabled={!canAnalyse}
              onClick={analyseCv}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
              {isLoading ? "Analysing CV" : "Analyse CV"}
            </button>

            <HistoryPanel history={history} onClear={() => setHistory([])} />
          </div>

          <Results analysis={analysis} meta={meta} matchLabel={matchLabel} progressDelta={progressDelta} />
        </section>
        )}
      </div>
    </main>
  );
}

function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(cvTemplates[0]);

  return (
    <section className="animate-in grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" style={{ animationDelay: "90ms" }}>
      <div className="grid gap-4">
        <section className="rounded-lg border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
          <p className="text-sm font-black uppercase text-mint">Template library</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950">Choose a strong structure for your industry</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use these as starter CV layouts, then upload the finished PDF back into the analyser to measure your progress.
          </p>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          {cvTemplates.map(template => {
            const Icon = template.icon;
            const isSelected = selectedTemplate.industry === template.industry;

            return (
              <button
                className={`group rounded-lg border p-4 text-left shadow-soft transition duration-300 hover:-translate-y-1 ${
                  isSelected ? "border-teal-300 bg-teal-50/90" : "border-white/80 bg-white/80 hover:bg-white"
                }`}
                type="button"
                key={template.industry}
                onClick={() => setSelectedTemplate(template)}
              >
                <span className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r ${template.accent} text-white shadow-sm transition group-hover:scale-105`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-black text-slate-950">{template.industry}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{template.role}</p>
              </button>
            );
          })}
        </div>
      </div>

      <TemplatePreview template={selectedTemplate} />
    </section>
  );
}

function TemplatePreview({ template }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-5 shadow-glow backdrop-blur">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-mint">{template.industry}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{template.role}</h2>
        </div>
        <span className={`inline-flex rounded-full bg-gradient-to-r ${template.accent} px-3 py-1 text-xs font-black uppercase text-white shadow-sm`}>
          ATS friendly
        </span>
      </div>

      <div className="grid gap-5">
        <PreviewBlock title="Suggested sections">
          <div className="flex flex-wrap gap-2">
            {template.sections.map(section => (
              <span className="rounded-full bg-pearl px-3 py-1 text-sm font-bold text-slate-700" key={section}>
                {section}
              </span>
            ))}
          </div>
        </PreviewBlock>

        <PreviewBlock title="Profile example">
          <p className="rounded-lg bg-teal-50/80 p-4 text-sm leading-6 text-slate-700">{template.profile}</p>
        </PreviewBlock>

        <PreviewBlock title="Achievement bullet examples">
          <ul className="grid gap-2">
            {template.bullets.map(bullet => (
              <li className="rounded-r-lg border-l-4 border-mint bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700" key={bullet}>
                {bullet}
              </li>
            ))}
          </ul>
        </PreviewBlock>

        <PreviewBlock title="Keywords to include">
          <div className="flex flex-wrap gap-2">
            {template.keywords.map(keyword => (
              <span className="rounded-full border border-teal-100 bg-white px-3 py-1 text-sm font-black text-mint" key={keyword}>
                {keyword}
              </span>
            ))}
          </div>
        </PreviewBlock>
      </div>
    </section>
  );
}

function PreviewBlock({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black uppercase text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function UploadPanel({ file, inputRef, isDragging, setIsDragging, onSelectFile, onClear }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">Upload CV</h2>
        <span className="text-sm font-bold text-slate-500">PDF only</span>
      </div>

      <button
        className={`group flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 text-center transition duration-300 ${
          isDragging ? "scale-[1.01] border-mint bg-teal-50" : "border-teal-200 bg-gradient-to-br from-white to-teal-50/70 hover:-translate-y-0.5 hover:border-mint hover:bg-teal-50"
        }`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={event => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={event => {
          event.preventDefault();
          setIsDragging(false);
          onSelectFile(event.dataTransfer.files?.[0]);
        }}
      >
        <UploadCloud className="h-12 w-12 text-mint transition duration-300 group-hover:-translate-y-1" aria-hidden="true" />
        <span className="text-xl font-black">Drag and drop your CV</span>
        <span className="max-w-md text-sm leading-6 text-slate-600">
          The backend extracts text with pdf-parse before sending it to OpenAI for structured feedback.
        </span>
      </button>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="application/pdf"
        onChange={event => onSelectFile(event.target.files?.[0])}
      />

      {file ? (
        <div className="animate-in mt-4 flex items-center justify-between gap-3 rounded-lg border border-teal-100 bg-teal-50/70 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-mint" aria-hidden="true" />
            <span className="truncate text-sm font-bold text-slate-800">{file.name}</span>
          </div>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-red-600"
            type="button"
            onClick={onClear}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Results({ analysis, meta, matchLabel, progressDelta }) {
  const hasResults = Boolean(meta);

  return (
    <section className="animate-in grid gap-5" style={{ animationDelay: "160ms" }}>
      <div className="grid gap-4 sm:grid-cols-3">
        <ScoreCard label="ATS score" value={hasResults ? analysis.atsScore : "-"} text="Structure, scanability and keyword readiness" tone="mint" />
        <ScoreCard
          label="Overall score"
          value={hasResults ? analysis.score : "-"}
          text={hasResults ? analysis.summary : "Upload a PDF to begin"}
          tone="coral"
          delta={progressDelta}
        />
        <ScoreCard label="Skill gaps" value={hasResults ? analysis.missingSkills.length : "-"} text={hasResults ? matchLabel : "Add a job description for better targeting"} tone="ocean" />
      </div>

      <section className="rounded-lg border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-mint" aria-hidden="true" />
          <h2 className="text-lg font-black">AI feedback</h2>
        </div>
        {hasResults ? (
          <div className="grid gap-5">
            <InsightList title="Strengths" items={analysis.strengths} tone="mint" />
            <InsightList title="Weaknesses" items={analysis.weaknesses} tone="amber" />
            <InsightList title="Missing skills" items={analysis.missingSkills} tone="blue" />
            <InsightList title="Suggested improvements" items={analysis.suggestedImprovements} tone="slate" />
          </div>
        ) : (
          <div className="rounded-lg bg-white/70 p-6 text-slate-600">
            Results will appear here after the PDF is uploaded, parsed and analysed.
          </div>
        )}
      </section>

      {meta ? (
        <section className="animate-in rounded-lg border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur">
          <h2 className="mb-3 text-lg font-black">Extracted text preview</h2>
          <p className="mb-3 text-sm font-bold text-slate-500">
            {meta.fileName} - {meta.wordCount} words extracted
          </p>
          <p className="max-h-36 overflow-auto rounded-lg bg-pearl/80 p-4 text-sm leading-6 text-slate-700">{meta.preview}</p>
        </section>
      ) : null}
    </section>
  );
}

function ScoreCard({ label, value, text, tone, delta }) {
  const gradient = {
    mint: "from-teal-500 to-emerald-600",
    coral: "from-coral to-gold",
    ocean: "from-ocean to-indigo-600"
  }[tone];

  return (
    <article className="group rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <div className="mt-2 flex items-end gap-2">
        <strong className={`bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-black text-transparent`}>{value}</strong>
        {typeof delta === "number" ? (
          <span className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${delta >= 0 ? "bg-teal-50 text-mint" : "bg-rose-50 text-coral"}`}>
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{text}</p>
    </article>
  );
}

function InsightList({ title, items, tone }) {
  const borderColor = {
    mint: "border-mint",
    amber: "border-amber-500",
    blue: "border-ocean",
    slate: "border-slate-400"
  }[tone];

  return (
    <div>
      <h3 className="mb-3 text-sm font-black uppercase text-slate-500">{title}</h3>
      <ul className="grid gap-2">
        {(items.length ? items : ["No issues found in this category."]).map(item => (
          <li className={`rounded-r-lg border-l-4 ${borderColor} bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700 transition duration-300 hover:translate-x-1 hover:bg-pearl`} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HistoryPanel({ history, onClear }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-mint" aria-hidden="true" />
          <h2 className="text-lg font-black">Progress history</h2>
        </div>
        {history.length ? (
          <button
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 text-sm font-black text-coral transition hover:bg-rose-100"
            type="button"
            onClick={onClear}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>

      {history.length ? (
        <ol className="grid gap-3">
          {history.map((review, index) => {
            const previous = history[index + 1];
            const delta = previous ? review.score - previous.score : null;

            return (
              <li className="animate-in rounded-lg border border-teal-100 bg-gradient-to-r from-white to-teal-50/70 p-4" key={review.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800">{review.fileName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatDate(review.date)} - {review.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-mint shadow-sm">{review.score}/100</span>
                    {typeof delta === "number" ? (
                      <span className={`rounded-full px-2 py-1 text-xs font-black ${delta >= 0 ? "bg-teal-100 text-mint" : "bg-rose-100 text-coral"}`}>
                        {delta >= 0 ? "+" : ""}
                        {delta}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{review.summary}</p>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="rounded-lg bg-white/70 p-4 text-sm leading-6 text-slate-600">
          Your last 5 reviews will be saved in this browser after each analysis, even if you refresh the page.
        </div>
      )}
    </section>
  );
}

function loadReviewHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(stored) ? stored.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

createRoot(document.getElementById("root")).render(<App />);

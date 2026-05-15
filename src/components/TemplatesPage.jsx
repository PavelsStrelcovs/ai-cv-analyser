import { useState } from "react";
import { cvTemplates } from "../data/cvTemplates";

const emptyBuilder = {
  name: "",
  headline: "",
  contact: "",
  profile: "",
  skills: "",
  experience: "",
  education: "",
  projects: ""
};

export function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(cvTemplates[0]);
  const [builder, setBuilder] = useState(emptyBuilder);

  function updateBuilder(field, value) {
    setBuilder(current => ({ ...current, [field]: value }));
  }

  function useTemplateDefaults() {
    setBuilder({
      name: builder.name,
      headline: selectedTemplate.role,
      contact: builder.contact,
      profile: selectedTemplate.profile,
      skills: selectedTemplate.keywords.join(", "),
      experience: selectedTemplate.bullets.join("\n"),
      education: builder.education,
      projects: selectedTemplate.industry === "IT & Software" ? selectedTemplate.bullets[0] : builder.projects
    });
  }

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

      <div className="grid gap-5">
        <TemplatePreview template={selectedTemplate} />
        <CvBuilder
          builder={builder}
          template={selectedTemplate}
          onChange={updateBuilder}
          onUseDefaults={useTemplateDefaults}
          onClear={() => setBuilder(emptyBuilder)}
        />
      </div>
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

function CvBuilder({ builder, template, onChange, onUseDefaults, onClear }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-mint">CV builder</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Fill this {template.industry} template</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="min-h-10 rounded-lg bg-ink px-3 text-sm font-black text-white" type="button" onClick={onUseDefaults}>
            Use template text
          </button>
          <button className="min-h-10 rounded-lg border border-rose-100 bg-rose-50 px-3 text-sm font-black text-coral" type="button" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <BuilderInput label="Name" value={builder.name} onChange={value => onChange("name", value)} placeholder="Your name" />
        <BuilderInput label="Headline" value={builder.headline} onChange={value => onChange("headline", value)} placeholder={template.role} />
        <BuilderInput label="Contact" value={builder.contact} onChange={value => onChange("contact", value)} placeholder="email@example.com | LinkedIn | Portfolio" />
        <BuilderTextarea label="Profile" value={builder.profile} onChange={value => onChange("profile", value)} placeholder={template.profile} />
        <BuilderTextarea label="Skills" value={builder.skills} onChange={value => onChange("skills", value)} placeholder={template.keywords.join(", ")} />
        <BuilderTextarea label="Experience" value={builder.experience} onChange={value => onChange("experience", value)} placeholder={template.bullets.join("\n")} />
        <BuilderTextarea label="Projects" value={builder.projects} onChange={value => onChange("projects", value)} placeholder="Project name - what you built, tools used, and result" />
        <BuilderTextarea label="Education" value={builder.education} onChange={value => onChange("education", value)} placeholder="Degree, university, dates, relevant modules" />
      </div>

      <div className="mt-4 rounded-lg bg-pearl/80 p-4">
        <h3 className="text-sm font-black uppercase text-slate-500">Preview</h3>
        <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{buildCvText(builder, template)}</pre>
      </div>

      <button
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-mint to-ocean px-5 text-sm font-black text-white shadow-soft"
        type="button"
        onClick={() => downloadCvPdf(builder, template)}
      >
        Download CV PDF
      </button>
    </section>
  );
}

function BuilderInput({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <input
        className="min-h-11 rounded-lg border border-teal-100 bg-white/80 px-3 outline-none transition focus:border-mint focus:ring-4 focus:ring-teal-100"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function BuilderTextarea({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <textarea
        className="min-h-24 rounded-lg border border-teal-100 bg-white/80 p-3 outline-none transition focus:border-mint focus:ring-4 focus:ring-teal-100"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function buildCvText(builder, template) {
  return [
    builder.name || "Your Name",
    builder.headline || template.role,
    builder.contact || "email@example.com | LinkedIn | Portfolio",
    "",
    "PROFILE",
    builder.profile || template.profile,
    "",
    "SKILLS",
    builder.skills || template.keywords.join(", "),
    "",
    "EXPERIENCE",
    builder.experience || template.bullets.map(bullet => `- ${bullet}`).join("\n"),
    "",
    "PROJECTS",
    builder.projects || "- Add a relevant project, tools used and outcome.",
    "",
    "EDUCATION",
    builder.education || "- Add your degree, institution and relevant modules."
  ].join("\n");
}

async function downloadCvPdf(builder, template) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lines = doc.splitTextToSize(buildCvText(builder, template), maxWidth);
  let y = 52;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 14;
  }
  doc.save(`${(builder.name || template.role).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-cv.pdf`);
}

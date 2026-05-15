import { useState } from "react";
import { cvTemplates } from "../data/cvTemplates";

export function TemplatesPage() {
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

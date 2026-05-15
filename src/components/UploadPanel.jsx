import { FileText, ShieldCheck, UploadCloud, X } from "lucide-react";

export function UploadPanel({ file, inputRef, isDragging, setIsDragging, onSelectFile, onClear }) {
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
          The backend extracts text with pdf-parse before sending cleaned, capped text to OpenAI.
        </span>
      </button>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="application/pdf"
        onChange={event => onSelectFile(event.target.files?.[0])}
      />

      <div className="mt-4 flex gap-2 rounded-lg border border-teal-100 bg-white/70 p-3 text-sm leading-5 text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
        <p>Your PDF is processed in memory. The app stores only a small review summary in this browser for progress tracking.</p>
      </div>

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

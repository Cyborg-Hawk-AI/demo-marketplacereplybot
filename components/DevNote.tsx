"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface DevNoteProps {
  title: string;
  children: React.ReactNode;
}

export function DevNote({ title, children }: DevNoteProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/20 text-brand-400 transition hover:bg-brand-600/30 hover:text-brand-300"
        aria-label={`Developer note: ${title}`}
        title="DEV NOTE"
      >
        <Info className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute left-6 top-0 z-50 w-72 animate-fade-in rounded-lg border border-brand-500/30 bg-surface-800 p-3 shadow-xl">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="badge bg-brand-600/20 text-brand-300">DEV NOTE</span>
            <span className="text-xs font-semibold text-slate-200">{title}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">{children}</p>
        </div>
      )}
    </div>
  );
}

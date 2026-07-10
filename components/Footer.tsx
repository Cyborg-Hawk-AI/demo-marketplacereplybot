import Link from "next/link";
import { Bot } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              MarketplaceReplyBot
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/demo"
              className="text-sm text-slate-400 transition hover:text-brand-300"
            >
              Demo
            </Link>
            <Link
              href="/developers"
              className="text-sm text-slate-400 transition hover:text-brand-300"
            >
              Developers
            </Link>
            <Link
              href="/research"
              className="text-sm text-slate-400 transition hover:text-brand-300"
            >
              How we found this idea
            </Link>
          </nav>
          <p className="text-xs text-slate-500">
            Mock demo · Idea Miner pipeline · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Bot } from "lucide-react";

interface HeaderProps {
  active?: "home" | "demo" | "developers" | "research";
}

const links = [
  { href: "/demo", label: "Demo", key: "demo" as const },
  { href: "/developers", label: "Developers", key: "developers" as const },
  { href: "/research", label: "Research", key: "research" as const },
];

export function Header({ active = "home" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-surface-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white">
            MarketplaceReplyBot
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active === link.key
                  ? "bg-brand-600/20 text-brand-300"
                  : "text-slate-400 hover:bg-surface-700 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/demo" className="btn-primary text-sm">
          Try Demo
        </Link>
      </div>
    </header>
  );
}

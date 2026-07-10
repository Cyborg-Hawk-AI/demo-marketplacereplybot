import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle,
  Code2,
  Database,
  Globe,
  Inbox,
  Link2,
  Server,
  Shield,
  Sparkles,
  BarChart3,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";

const features = [
  {
    id: "connections",
    icon: Link2,
    title: "Marketplace Connections",
    demoPath: "/demo → Connections tab",
    tryIt: 'Click "Connect Marketplace" to walk through the 3-step OAuth wizard. Click "Sync Now" on any store card.',
    mocked:
      "OAuth redirect, token storage, and API polling are simulated with toasts and state updates.",
    production:
      "OAuth 2.0 per marketplace (Amazon SP-API, Etsy Open API v3, Shopify Admin API, eBay Trading API). Tokens encrypted in Secrets Manager. Background worker polls every 5 min.",
    dataFlow:
      "Seller clicks Connect → OAuth consent → callback stores refresh token → nightly + on-demand sync pulls listings, policies, messages.",
  },
  {
    id: "knowledge",
    icon: BookOpen,
    title: "Knowledge Base (Catalog, FAQs, Policies)",
    demoPath: "/demo → Knowledge Base tab",
    tryIt:
      'Switch between Products, FAQs, and Policies sub-tabs. Click any product row or FAQ card to open detail modals. Click "Edit policy" on return policy cards.',
    mocked:
      "Static product catalog, FAQ list, and return policies from mockData.ts. Modal edits show toast confirmations only.",
    production:
      "Nightly sync from marketplace APIs ingests SKUs, descriptions, images. Seller-uploaded FAQs parsed into vector DB. Return policies scraped from seller settings pages.",
    dataFlow:
      "Sync job → normalize to common schema → embed with sentence-transformers → store in pgvector/Qdrant → RAG retrieval at draft time.",
  },
  {
    id: "inbox",
    icon: Inbox,
    title: "Multilingual Reply Inbox",
    demoPath: "/demo → Inbox tab",
    tryIt:
      "Use search and marketplace/status filters. Click any message to view the customer message and AI draft. Messages in French, German, Japanese, Korean, Spanish, and English.",
    mocked:
      "8 pre-populated customer messages with realistic multilingual content. Filter/search runs client-side on hardcoded data.",
    production:
      "Webhook listeners + polling ingest buyer messages. Language detected via fastText/langdetect. Messages queued for AI drafting pipeline.",
    dataFlow:
      "Marketplace API → message normalizer → language detector → draft queue → LLM worker → inbox UI.",
  },
  {
    id: "drafting",
    icon: Sparkles,
    title: "AI Context-Aware Drafting",
    demoPath: "/demo → Inbox tab → select any message",
    tryIt:
      'View the AI Draft panel showing confidence score, tone, and policy-informed reply. Click "Regenerate" to simulate a new draft with higher confidence.',
    mocked:
      "Pre-written drafts in detected customer language. Regenerate bumps confidence score after 1.5s delay.",
    production:
      "RAG retrieves relevant products, FAQs, policies. Self-hosted Mistral/LLaMA drafts reply matching store tone profile. Confidence scored by separate classifier model.",
    dataFlow:
      "Message + RAG context + tone profile → LLM prompt → draft + confidence score → inbox or auto-send queue.",
  },
  {
    id: "approve",
    icon: CheckCircle,
    title: "One-Click Approve & Edit",
    demoPath: "/demo → Inbox → Draft Ready message",
    tryIt:
      'Click "Approve & Send" on msg-1 (Marie Dubois). Click "Edit Draft" to modify text inline, then "Send Edited Reply".',
    mocked:
      "Status changes to Sent, toast notification, activity feed update. No actual message delivery.",
    production:
      "Approved reply posted via marketplace messaging API. Edit history logged. Rate limits respected per platform.",
    dataFlow:
      "Seller approves → API post to marketplace → status webhook confirms delivery → analytics event logged.",
  },
  {
    id: "auto",
    icon: Zap,
    title: "Fully-Auto Mode",
    demoPath: "/demo → top bar toggle OR Automation tab",
    tryIt:
      "Toggle Auto Mode ON/OFF in the header. In Automation tab, adjust confidence threshold slider and click category badges.",
    mocked:
      "Toggle state persists in React. Toast explains behavior change. msg-6 (Sophie Laurent) shows an auto-sent example.",
    production:
      "Background agent auto-sends when confidence > threshold AND category is in auto-send list AND no escalation rules triggered.",
    dataFlow:
      "Draft complete → rule engine check → if pass: auto-send via API; else: human queue.",
  },
  {
    id: "escalation",
    icon: Shield,
    title: "Escalation Rules Engine",
    demoPath: "/demo → Automation tab → Escalation Rules",
    tryIt:
      "Toggle rules on/off. Click edit icon to open rule modal. View escalated messages (msg-2 James Whitfield, msg-8 Anna Kowalski) in Inbox. Click 'Resolve Escalation'.",
    mocked:
      "5 pre-configured rules with trigger counts. Toggle updates state. Escalated messages show red badges with reasons.",
    production:
      "Sentiment analysis (negative < -0.3), keyword matching (refund, chargeback), confidence threshold, repeat-complaint detection. Notifications via email/Slack.",
    dataFlow:
      "Incoming message → parallel: sentiment + keyword + confidence checks → if any rule fires: flag + notify + block auto-send.",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Weekly Analytics Dashboard",
    demoPath: "/demo → Analytics tab",
    tryIt:
      "View stat cards, bar chart (reply volume), line chart (response time & escalations). Switch week/month/quarter range. Click marketplace breakdown cards to filter inbox.",
    mocked:
      "Charts use ANALYTICS_DATA from mockData.ts. Range buttons show toast. Marketplace cards navigate to filtered inbox.",
    production:
      "Events logged on every reply/escalation/sync. Aggregated nightly. Daily digest email auto-generated by agent.",
    dataFlow:
      "Reply event → timeseries DB → nightly aggregation → dashboard API → optional email digest.",
  },
];

const architecture = [
  {
    icon: Globe,
    label: "Frontend",
    value: "Next.js 14 App Router (this demo)",
  },
  {
    icon: Server,
    label: "API Layer",
    value: "Python FastAPI + Celery workers",
  },
  {
    icon: Bot,
    label: "LLM",
    value: "Self-hosted Mistral/LLaMA via vLLM",
  },
  {
    icon: Database,
    label: "Data",
    value: "PostgreSQL + pgvector for RAG",
  },
  {
    icon: Code2,
    label: "Integrations",
    value: "Amazon SP-API, Etsy, Shopify, eBay OAuth",
  },
];

export default function DevelopersPage() {
  return (
    <>
      <Header active="developers" />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-600/10 px-4 py-1.5 text-sm text-brand-300">
            <Code2 className="h-4 w-4" />
            Developer documentation
          </div>
          <h1 className="font-display text-4xl font-bold text-white">
            Feature map & integration notes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Every interactive element in the demo is documented below — what it
            does, where to click, what&apos;s mocked vs. production, and the
            intended data flow for a real implementation.
          </p>
          <Link href="/demo" className="btn-primary mt-6">
            Open Interactive Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Architecture overview */}
        <section className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">
            Planned production architecture
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {architecture.map((item) => (
              <div key={item.label} className="glass-panel p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20">
                  <item.icon className="h-5 w-5 text-brand-400" />
                </div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature docs */}
        <section className="space-y-8">
          <h2 className="font-display text-2xl font-bold text-white">
            Demo features ({features.length})
          </h2>
          {features.map((feature, index) => (
            <article
              key={feature.id}
              id={feature.id}
              className="glass-panel overflow-hidden"
            >
              <div className="border-b border-slate-700 bg-surface-700/30 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600/20 text-sm font-bold text-brand-300">
                    {index + 1}
                  </span>
                  <feature.icon className="h-5 w-5 text-brand-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-brand-300">
                  📍 {feature.demoPath}
                </p>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    How to try it
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {feature.tryIt}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    What&apos;s mocked
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.mocked}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Production implementation
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {feature.production}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Data flow
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.dataFlow}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* DEV NOTE explanation */}
        <section className="mt-12 glass-panel p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-white">
            About DEV NOTE tooltips
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Throughout the{" "}
            <Link href="/demo" className="text-brand-400 hover:underline">
              /demo
            </Link>{" "}
            page, you&apos;ll see small{" "}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/20 text-brand-400">
              i
            </span>{" "}
            icons beside major controls. Click any icon to see a popup explaining
            what that feature does in the real product and how it would integrate
            with marketplace APIs, the LLM pipeline, and the escalation engine.
          </p>
        </section>
      </div>
    </>
  );
}

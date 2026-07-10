import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";
import { Header } from "@/components/Header";

const features = [
  {
    icon: Globe,
    title: "Multilingual by Default",
    description:
      "Detects customer language and drafts replies in French, German, Japanese, Korean, and 40+ more — matching your store tone.",
  },
  {
    icon: Shield,
    title: "Policy-Aware Context",
    description:
      "Injects your actual return policies, FAQs, and product catalog at draft time. No generic AI fluff.",
  },
  {
    icon: MessageSquare,
    title: "One-Click Approve",
    description:
      "Review AI drafts, edit inline, and send — or enable fully-auto mode for routine shipping and product questions.",
  },
  {
    icon: Zap,
    title: "Smart Escalation",
    description:
      "Negative sentiment, refund requests, and low-confidence drafts are flagged for human review automatically.",
  },
  {
    icon: BarChart3,
    title: "Weekly Analytics",
    description:
      "Track reply volume, average response time, auto-send rate, and escalation trends across all marketplaces.",
  },
  {
    icon: Sparkles,
    title: "4 Marketplace APIs",
    description:
      "Connect Amazon, eBay, Etsy, and Shopify. Auto-sync catalogs, policies, and incoming messages.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: 49,
    replies: "500 replies/mo",
    features: [
      "2 marketplace connections",
      "Multilingual AI drafts",
      "Manual approve workflow",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: 99,
    replies: "2,000 replies/mo",
    popular: true,
    features: [
      "4 marketplace connections",
      "Fully-auto mode",
      "Escalation rules engine",
      "Weekly analytics dashboard",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: 249,
    replies: "Unlimited replies",
    features: [
      "Unlimited marketplaces",
      "Custom tone training",
      "Advanced escalation rules",
      "API access",
      "Dedicated onboarding",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <Header active="home" />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-surface-900 to-surface-900" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-60 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-600/10 px-4 py-1.5 text-sm text-brand-300">
              <Bot className="h-4 w-4" />
              AI-powered marketplace customer support
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Reply to every marketplace customer{" "}
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                in their language
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              MarketplaceReplyBot drafts multilingual, policy-aware replies for
              Amazon, eBay, Etsy, and Shopify sellers — in seconds, not hours.
              Approve with one click or let the AI handle routine queries
              automatically.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/demo" className="btn-primary px-8 py-3 text-base">
                Launch Interactive Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/research" className="btn-secondary px-8 py-3 text-base">
                See the research
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-400" />
                Avg. 7 min response time
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-400" />8 languages served
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-400" />
                68% auto-reply rate
              </span>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="relative border-t border-slate-800/60 bg-surface-900/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-white">
                Everything sellers need, nothing they don&apos;t
              </h2>
              <p className="mt-4 text-slate-400">
                Built for ecommerce sellers managing 2+ marketplaces with
                international customers. Not another generic helpdesk.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-panel group p-6 transition hover:border-brand-500/30"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400 transition group-hover:bg-brand-600/30">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-white">
                Simple pricing by reply volume
              </h2>
              <p className="mt-4 text-slate-400">
                Pay for what you use. Upgrade as your marketplace business grows.
              </p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {pricing.map((plan) => (
                <div
                  key={plan.name}
                  className={`glass-panel relative flex flex-col p-8 ${
                    plan.popular
                      ? "border-brand-500/50 ring-1 ring-brand-500/30"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-brand-600 text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-slate-400">/mo</span>
                  </div>
                  <p className="mt-1 text-sm text-brand-300">{plan.replies}</p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/demo"
                    className={`mt-8 w-full text-center ${
                      plan.popular ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Try in demo
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-t border-slate-800/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel mx-auto max-w-3xl p-10 text-center">
              <h2 className="font-display text-3xl font-bold text-white">
                See it in action — no signup required
              </h2>
              <p className="mt-4 text-slate-400">
                Explore the full interactive demo with realistic marketplace
                data, multilingual drafts, escalation rules, and analytics.
              </p>
              <Link href="/demo" className="btn-primary mt-8 px-8 py-3 text-base">
                Open Interactive Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

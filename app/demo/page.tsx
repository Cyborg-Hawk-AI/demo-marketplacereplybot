"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Edit3,
  Globe,
  Inbox,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  X,
  ExternalLink,
  Package,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Header } from "@/components/Header";
import { DevNote } from "@/components/DevNote";
import { Modal } from "@/components/Modal";
import { ToastContainer, useToast } from "@/components/Toast";
import {
  ACTIVITY_FEED,
  ANALYTICS_DATA,
  AVAILABLE_MARKETPLACES,
  CUSTOMER_MESSAGES,
  ESCALATION_RULES,
  FAQS,
  MARKETPLACE_CONNECTIONS,
  MARKETPLACE_COLORS,
  MARKETPLACE_LABELS,
  PRODUCTS,
  RETURN_POLICIES,
  STORE_PROFILE,
  WEEKLY_STATS,
} from "@/lib/mockData";
import type {
  CustomerMessage,
  EscalationRule,
  Marketplace,
  MessageStatus,
} from "@/lib/types";

type Tab = "inbox" | "connections" | "knowledge" | "automation" | "analytics";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "automation", label: "Automation", icon: Settings },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: MessageStatus }) {
  const styles: Record<MessageStatus, string> = {
    pending: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    draft_ready: "bg-brand-500/20 text-brand-300 border-brand-500/30",
    sent: "bg-green-500/20 text-green-300 border-green-500/30",
    escalated: "bg-red-500/20 text-red-300 border-red-500/30",
    auto_sent: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };
  const labels: Record<MessageStatus, string> = {
    pending: "Pending",
    draft_ready: "Draft Ready",
    sent: "Sent",
    escalated: "Escalated",
    auto_sent: "Auto-Sent",
  };
  return (
    <span className={`badge border ${styles[status]}`}>{labels[status]}</span>
  );
}

export default function DemoPage() {
  const { toasts, addToast, dismissToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [messages, setMessages] = useState(CUSTOMER_MESSAGES);
  const [selectedId, setSelectedId] = useState<string | null>("msg-1");
  const [editDraft, setEditDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [autoThreshold, setAutoThreshold] = useState(0.92);
  const [rules, setRules] = useState(ESCALATION_RULES);
  const [connections, setConnections] = useState(MARKETPLACE_CONNECTIONS);
  const [filterMarketplace, setFilterMarketplace] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState(1);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [knowledgeTab, setKnowledgeTab] = useState<"products" | "faqs" | "policies">("products");
  const [analyticsRange, setAnalyticsRange] = useState("week");
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);
  const [activityFeed, setActivityFeed] = useState(ACTIVITY_FEED);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filterMarketplace !== "all" && m.marketplace !== filterMarketplace)
        return false;
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.customerName.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.orderId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, filterMarketplace, filterStatus, searchQuery]);

  const handleSelectMessage = (msg: CustomerMessage) => {
    setSelectedId(msg.id);
    setEditDraft(msg.aiDraft);
    setIsEditing(false);
  };

  const handleApprove = () => {
    if (!selectedMessage) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, status: "sent" as MessageStatus, responseTime: "2 min" }
          : m
      )
    );
    setActivityFeed((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "reply_sent",
        description: `Approved and sent reply to ${selectedMessage.customerName}`,
        timestamp: new Date().toISOString(),
        marketplace: selectedMessage.marketplace,
      },
      ...prev,
    ]);
    addToast({
      type: "success",
      title: "Reply sent",
      message: `Response delivered to ${selectedMessage.customerName} via ${MARKETPLACE_LABELS[selectedMessage.marketplace]}.`,
    });
  };

  const handleEditSend = () => {
    if (!selectedMessage) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, status: "sent" as MessageStatus, aiDraft: editDraft, responseTime: "5 min" }
          : m
      )
    );
    setIsEditing(false);
    addToast({
      type: "success",
      title: "Edited reply sent",
      message: "Your customized response has been delivered.",
    });
  };

  const handleRegenerate = () => {
    if (!selectedMessage) return;
    addToast({
      type: "info",
      title: "Regenerating draft",
      message: "AI is re-drafting with updated policy context…",
    });
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? { ...m, confidence: Math.min(0.99, m.confidence + 0.03) }
            : m
        )
      );
      addToast({
        type: "success",
        title: "Draft updated",
        message: "New draft generated with refreshed catalog and policy context.",
      });
    }, 1500);
  };

  const handleResolveEscalation = () => {
    if (!selectedMessage) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id ? { ...m, status: "draft_ready" as MessageStatus } : m
      )
    );
    addToast({
      type: "success",
      title: "Escalation resolved",
      message: "Message moved back to review queue for approval.",
    });
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    const rule = rules.find((r) => r.id === id);
    addToast({
      type: "info",
      title: rule?.enabled ? "Rule disabled" : "Rule enabled",
      message: `${rule?.name} escalation rule ${rule?.enabled ? "disabled" : "enabled"}.`,
    });
  };

  const handleSync = (connId: string) => {
    setSyncingId(connId);
    addToast({
      type: "info",
      title: "Sync started",
      message: "Pulling latest products, FAQs, and policies…",
    });
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) =>
          c.id === connId
            ? { ...c, status: "connected" as const, lastSync: new Date().toISOString() }
            : c
        )
      );
      setSyncingId(null);
      addToast({
        type: "success",
        title: "Sync complete",
        message: "Catalog and policies updated successfully.",
      });
    }, 2000);
  };

  const handleConnect = () => {
    if (connectStep < 3) {
      setConnectStep(connectStep + 1);
      return;
    }
    const mp = AVAILABLE_MARKETPLACES.find((m) => m.id === selectedMarketplace);
    if (mp) {
      setConnections((prev) => [
        ...prev,
        {
          id: `conn-${Date.now()}`,
          marketplace: mp.id as Marketplace,
          storeName: `New ${mp.name} Store`,
          region: "United States",
          connectedAt: new Date().toISOString(),
          status: "syncing" as const,
          lastSync: new Date().toISOString(),
          productCount: 0,
          messageCount: 0,
        },
      ]);
      addToast({
        type: "success",
        title: `${mp.name} connected`,
        message: "OAuth complete. Initial catalog sync in progress.",
      });
    }
    setShowConnectModal(false);
    setConnectStep(1);
    setSelectedMarketplace(null);
  };

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    addToast({
      type: autoMode ? "warning" : "success",
      title: autoMode ? "Auto mode disabled" : "Auto mode enabled",
      message: autoMode
        ? "All replies will require manual approval."
        : `Routine queries with confidence >${autoThreshold} will auto-send.`,
    });
  };

  return (
    <>
      <Header active="demo" />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {/* Demo header bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-white">
                {STORE_PROFILE.name}
              </h1>
              <span className="badge border border-brand-500/30 bg-brand-500/20 text-brand-300">
                {STORE_PROFILE.plan} Plan
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {STORE_PROFILE.repliesUsed} / {STORE_PROFILE.repliesLimit} replies
              used this month · Tone: {STORE_PROFILE.tone}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <DevNote title="Fully-Auto Mode">
                In production, a background worker polls marketplaces every 5
                minutes. Replies with confidence above the threshold auto-send
                via marketplace APIs.
              </DevNote>
              <button
                type="button"
                onClick={toggleAutoMode}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  autoMode
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                    : "border-slate-600 bg-surface-700 text-slate-300"
                }`}
              >
                {autoMode ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
                Auto Mode {autoMode ? "ON" : "OFF"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addToast({
                  type: "info",
                  title: "Refreshing inbox",
                  message: "Polling all connected marketplaces for new messages…",
                });
                setTimeout(() => {
                  addToast({
                    type: "success",
                    title: "Inbox updated",
                    message: "2 new messages imported from Amazon and Etsy.",
                  });
                }, 1500);
              }}
              className="btn-secondary"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-700/60 bg-surface-800/50 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white"
                  : "text-slate-400 hover:bg-surface-700 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* INBOX TAB */}
        {activeTab === "inbox" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Message list */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    <Inbox className="h-4 w-4 text-brand-400" />
                    Inbox
                    <DevNote title="Message Ingestion">
                      Production: webhook listeners + polling via Amazon
                      SP-API, Etsy Open API, Shopify Admin API, and eBay Trading
                      API ingest new buyer messages every 5 minutes.
                    </DevNote>
                  </h2>
                  <span className="badge bg-surface-600 text-slate-300">
                    {filteredMessages.length}
                  </span>
                </div>

                {/* Filters */}
                <div className="mb-4 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search messages…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={filterMarketplace}
                        onChange={(e) => setFilterMarketplace(e.target.value)}
                        className="input-field appearance-none pr-8"
                      >
                        <option value="all">All marketplaces</option>
                        <option value="amazon">Amazon</option>
                        <option value="ebay">eBay</option>
                        <option value="etsy">Etsy</option>
                        <option value="shopify">Shopify</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                    <div className="relative flex-1">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field appearance-none pr-8"
                      >
                        <option value="all">All statuses</option>
                        <option value="draft_ready">Draft Ready</option>
                        <option value="escalated">Escalated</option>
                        <option value="sent">Sent</option>
                        <option value="auto_sent">Auto-Sent</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="max-h-[600px] space-y-2 overflow-y-auto">
                  {filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      type="button"
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedId === msg.id
                          ? "border-brand-500/50 bg-brand-600/10"
                          : "border-slate-700/50 bg-surface-700/30 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white">
                              {msg.customerName}
                            </span>
                            <span>{msg.languageFlag}</span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {msg.subject}
                          </p>
                        </div>
                        <StatusBadge status={msg.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`badge border text-[10px] ${MARKETPLACE_COLORS[msg.marketplace]}`}
                        >
                          {MARKETPLACE_LABELS[msg.marketplace]}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(msg.receivedAt)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message detail + draft */}
            <div className="lg:col-span-8">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="glass-panel p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-white">
                            {selectedMessage.customerName}
                          </h3>
                          <StatusBadge status={selectedMessage.status} />
                          {selectedMessage.escalationReason && (
                            <span className="badge border border-red-500/30 bg-red-500/10 text-red-300">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {selectedMessage.escalationReason}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {selectedMessage.customerEmail} · Order{" "}
                          {selectedMessage.orderId} ·{" "}
                          {selectedMessage.currency}
                          {selectedMessage.orderAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Globe className="h-4 w-4" />
                        {selectedMessage.detectedLanguage}
                        <span
                          className={`badge border ${MARKETPLACE_COLORS[selectedMessage.marketplace]}`}
                        >
                          {MARKETPLACE_LABELS[selectedMessage.marketplace]}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-700 bg-surface-900/50 p-4">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Customer message
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-slate-300">
                        {selectedMessage.originalMessage}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Product: {selectedMessage.productName}</span>
                      <span>·</span>
                      <span>SKU: {selectedMessage.productSku}</span>
                      <span>·</span>
                      <span>Category: {selectedMessage.category}</span>
                      <span>·</span>
                      <span>Sentiment: {selectedMessage.sentiment}</span>
                    </div>
                  </div>

                  {/* AI Draft */}
                  <div className="glass-panel p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-white">
                        <Sparkles className="h-4 w-4 text-brand-400" />
                        AI Draft
                        <DevNote title="Context-Aware Drafting">
                          Production: RAG pipeline retrieves relevant products,
                          FAQs, and return policies. Self-hosted LLM drafts in
                          detected language matching store tone profile.
                        </DevNote>
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className={`badge ${
                            selectedMessage.confidence >= 0.92
                              ? "bg-green-500/20 text-green-300"
                              : selectedMessage.confidence >= 0.85
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {(selectedMessage.confidence * 100).toFixed(0)}%
                          confidence
                        </span>
                        <span className="text-slate-500">
                          Tone: {selectedMessage.tone}
                        </span>
                      </div>
                    </div>

                    {isEditing ? (
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        rows={10}
                        className="input-field font-mono text-sm"
                      />
                    ) : (
                      <div className="rounded-lg border border-brand-500/20 bg-brand-600/5 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {selectedMessage.aiDraft}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedMessage.status === "escalated" && (
                        <button
                          type="button"
                          onClick={handleResolveEscalation}
                          className="btn-secondary"
                        >
                          <Check className="h-4 w-4" />
                          Resolve Escalation
                        </button>
                      )}
                      {(selectedMessage.status === "draft_ready" ||
                        selectedMessage.status === "escalated") && (
                        <>
                          {!isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleApprove}
                                className="btn-primary"
                              >
                                <Send className="h-4 w-4" />
                                Approve & Send
                                <DevNote title="One-Click Approve">
                                  Production: approved reply posts back via
                                  marketplace messaging API (Amazon Buyer-Seller
                                  Messaging, Etsy conversations, etc.).
                                </DevNote>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditDraft(selectedMessage.aiDraft);
                                  setIsEditing(true);
                                }}
                                className="btn-secondary"
                              >
                                <Edit3 className="h-4 w-4" />
                                Edit Draft
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={handleEditSend}
                                className="btn-primary"
                              >
                                <Send className="h-4 w-4" />
                                Send Edited Reply
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn-secondary"
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={handleRegenerate}
                            className="btn-ghost"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Regenerate
                          </button>
                        </>
                      )}
                      {(selectedMessage.status === "sent" ||
                        selectedMessage.status === "auto_sent") && (
                        <span className="flex items-center gap-2 text-sm text-green-400">
                          <Check className="h-4 w-4" />
                          Sent {selectedMessage.responseTime && `in ${selectedMessage.responseTime}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel flex h-96 items-center justify-center">
                  <p className="text-slate-500">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === "connections" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Link2 className="h-5 w-5 text-brand-400" />
                Marketplace Connections
                <DevNote title="OAuth Integration">
                  Production: OAuth 2.0 flows for each marketplace. Tokens
                  stored encrypted. SP-API (Amazon), Etsy Open API v3, Shopify
                  Admin API, eBay Trading API.
                </DevNote>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowConnectModal(true);
                  setConnectStep(1);
                }}
                className="btn-primary"
              >
                <Plus className="h-4 w-4" />
                Connect Marketplace
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {connections.map((conn) => (
                <div key={conn.id} className="glass-panel p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold ${MARKETPLACE_COLORS[conn.marketplace]}`}
                      >
                        {MARKETPLACE_LABELS[conn.marketplace][0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {conn.storeName}
                        </h3>
                        <p className="text-sm text-slate-400">{conn.region}</p>
                      </div>
                    </div>
                    <span
                      className={`badge border ${
                        conn.status === "connected"
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
                          : conn.status === "syncing"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {conn.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Products</p>
                      <p className="font-semibold text-white">
                        {conn.productCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Messages</p>
                      <p className="font-semibold text-white">
                        {conn.messageCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Connected</p>
                      <p className="text-slate-300">
                        {formatDate(conn.connectedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Last sync</p>
                      <p className="text-slate-300">
                        {formatDate(conn.lastSync)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSync(conn.id)}
                      disabled={syncingId === conn.id}
                      className="btn-secondary flex-1 text-sm"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${syncingId === conn.id ? "animate-spin" : ""}`}
                      />
                      {syncingId === conn.id ? "Syncing…" : "Sync Now"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToast({
                          type: "info",
                          title: "Connection settings",
                          message: `Managing OAuth tokens and webhook config for ${conn.storeName}.`,
                        });
                      }}
                      className="btn-ghost"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KNOWLEDGE BASE TAB */}
        {activeTab === "knowledge" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <BookOpen className="h-5 w-5 text-brand-400" />
                Knowledge Base
                <DevNote title="Auto-Ingest">
                  Production: nightly sync pulls product catalog via marketplace
                  APIs. FAQs and return policies parsed from seller settings and
                  stored in vector DB for RAG retrieval.
                </DevNote>
              </h2>
            </div>

            <div className="mb-4 flex gap-1 rounded-lg border border-slate-700/60 bg-surface-800/50 p-1">
              {(["products", "faqs", "policies"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setKnowledgeTab(tab)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
                    knowledgeTab === tab
                      ? "bg-brand-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "faqs" ? "FAQs" : tab}
                </button>
              ))}
            </div>

            {knowledgeTab === "products" && (
              <div className="glass-panel overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-surface-700/50">
                      <th className="px-4 py-3 text-left font-medium text-slate-400">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-400">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-400">
                        Marketplace
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-400">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-400">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setShowProductModal(true);
                        }}
                        className="cursor-pointer border-b border-slate-700/50 transition hover:bg-surface-700/30"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-white">{product.name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge border ${MARKETPLACE_COLORS[product.marketplace]}`}
                          >
                            {MARKETPLACE_LABELS[product.marketplace]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          {product.currency} {product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          {product.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {knowledgeTab === "faqs" && (
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => {
                      setSelectedFaq(faq.id);
                      setShowFaqModal(true);
                    }}
                    className="glass-panel w-full p-4 text-left transition hover:border-brand-500/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{faq.question}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="badge bg-surface-600 text-slate-300">
                          {faq.category}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          Used {faq.usageCount}×
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {knowledgeTab === "policies" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {RETURN_POLICIES.map((policy) => (
                  <div key={policy.id} className="glass-panel p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        {MARKETPLACE_LABELS[policy.marketplace]} Return Policy
                      </h3>
                      <span
                        className={`badge border ${MARKETPLACE_COLORS[policy.marketplace]}`}
                      >
                        {policy.windowDays}-day window
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      {policy.conditions}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Restocking fee:{" "}
                        {policy.restockingFee > 0
                          ? `${policy.restockingFee}%`
                          : "None"}
                      </span>
                      <span>Updated {policy.lastUpdated}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({
                          type: "info",
                          title: "Policy editor",
                          message: `Editing ${MARKETPLACE_LABELS[policy.marketplace]} return policy rules.`,
                        })
                      }
                      className="btn-ghost mt-3 text-xs"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit policy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUTOMATION TAB */}
        {activeTab === "automation" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Bot className="h-5 w-5 text-brand-400" />
                Auto-Reply Settings
                <DevNote title="Confidence Threshold">
                  Production: agent scores each draft 0–1. Above threshold +
                  routine category = auto-send. Below = human queue.
                </DevNote>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-surface-700/30 p-4">
                  <div>
                    <p className="font-medium text-white">Fully-Auto Mode</p>
                    <p className="text-sm text-slate-400">
                      Auto-send routine queries above confidence threshold
                    </p>
                  </div>
                  <button type="button" onClick={toggleAutoMode}>
                    {autoMode ? (
                      <ToggleRight className="h-8 w-8 text-purple-400" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-slate-500" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Confidence threshold: {(autoThreshold * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.80"
                    max="0.99"
                    step="0.01"
                    value={autoThreshold}
                    onChange={(e) => setAutoThreshold(parseFloat(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>80%</span>
                    <span>99%</span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm text-slate-400">Auto-send categories</p>
                  <div className="flex flex-wrap gap-2">
                    {["shipping", "product", "general"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          addToast({
                            type: "info",
                            title: "Category toggled",
                            message: `${cat} auto-send preference updated.`,
                          })
                        }
                        className="badge border border-green-500/30 bg-green-500/10 text-green-300 capitalize"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {cat}
                      </button>
                    ))}
                    {["returns", "order"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          addToast({
                            type: "info",
                            title: "Category toggled",
                            message: `${cat} requires manual approval.`,
                          })
                        }
                        className="badge border border-slate-600 bg-surface-600 text-slate-400 capitalize"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Shield className="h-5 w-5 text-brand-400" />
                  Escalation Rules
                  <DevNote title="Escalation Engine">
                    Production: sentiment analysis + keyword matching + confidence
                    scoring trigger rules. Escalated messages skip auto-send and
                    notify seller via email/Slack.
                  </DevNote>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRule(null);
                    setShowRuleModal(true);
                  }}
                  className="btn-ghost text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-surface-700/30 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{rule.name}</p>
                        <span className="text-xs text-slate-500">
                          {rule.triggerCount} triggers
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-400">
                        {rule.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleModal(true);
                        }}
                        className="btn-ghost p-1"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => toggleRule(rule.id)}>
                        {rule.enabled ? (
                          <ToggleRight className="h-6 w-6 text-green-400" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="glass-panel p-6 lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {activityFeed.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 border-b border-slate-700/50 pb-3 last:border-0"
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.type === "escalated"
                          ? "bg-red-500/20 text-red-400"
                          : item.type === "auto_sent"
                            ? "bg-purple-500/20 text-purple-400"
                            : item.type === "reply_sent"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-brand-500/20 text-brand-400"
                      }`}
                    >
                      {item.type === "escalated" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : item.type === "auto_sent" ? (
                        <Bot className="h-4 w-4" />
                      ) : item.type === "reply_sent" ? (
                        <Send className="h-4 w-4" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{item.description}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatDate(item.timestamp)}
                        {item.marketplace &&
                          ` · ${MARKETPLACE_LABELS[item.marketplace]}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <BarChart3 className="h-5 w-5 text-brand-400" />
                Weekly Analytics
                <DevNote title="Analytics Pipeline">
                  Production: events logged on every reply/escalation. Aggregated
                  nightly into dashboard metrics. Exported to daily digest email.
                </DevNote>
              </h2>
              <div className="flex gap-1 rounded-lg border border-slate-700 bg-surface-800 p-1">
                {["week", "month", "quarter"].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setAnalyticsRange(range);
                      addToast({
                        type: "info",
                        title: "Range updated",
                        message: `Showing ${range}ly analytics data.`,
                      });
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm capitalize transition ${
                      analyticsRange === range
                        ? "bg-brand-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Replies",
                  value: WEEKLY_STATS.totalReplies,
                  sub: "+12% vs last week",
                },
                {
                  label: "Avg Response Time",
                  value: `${WEEKLY_STATS.avgResponseMinutes} min`,
                  sub: "-2.1 min vs last week",
                },
                {
                  label: "Auto-Reply Rate",
                  value: `${WEEKLY_STATS.autoReplyRate}%`,
                  sub: `${WEEKLY_STATS.timeSavedHours}h saved`,
                },
                {
                  label: "Escalation Rate",
                  value: `${WEEKLY_STATS.escalationRate}%`,
                  sub: `${WEEKLY_STATS.languagesServed} languages`,
                },
              ].map((stat) => (
                <div key={stat.label} className="glass-panel p-5">
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-brand-400">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass-panel p-6">
                <h3 className="mb-4 font-semibold text-white">Reply Volume</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a2234",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="replies"
                      name="Total Replies"
                      fill="#1a7ff5"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="autoReplies"
                      name="Auto Replies"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-panel p-6">
                <h3 className="mb-4 font-semibold text-white">
                  Response Time & Escalations
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a2234",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgResponseMinutes"
                      name="Avg Response (min)"
                      stroke="#22d3ee"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="escalations"
                      name="Escalations"
                      stroke="#f87171"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 glass-panel p-6">
              <h3 className="mb-4 font-semibold text-white">
                Marketplace Breakdown
              </h3>
              <div className="grid gap-4 sm:grid-cols-4">
                {connections.map((conn) => (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => {
                      setActiveTab("inbox");
                      setFilterMarketplace(conn.marketplace);
                      addToast({
                        type: "info",
                        title: "Filtered inbox",
                        message: `Showing ${MARKETPLACE_LABELS[conn.marketplace]} messages only.`,
                      });
                    }}
                    className="rounded-lg border border-slate-700 bg-surface-700/30 p-4 text-left transition hover:border-brand-500/30"
                  >
                    <span
                      className={`badge border ${MARKETPLACE_COLORS[conn.marketplace]}`}
                    >
                      {MARKETPLACE_LABELS[conn.marketplace]}
                    </span>
                    <p className="mt-2 font-display text-2xl font-bold text-white">
                      {conn.messageCount}
                    </p>
                    <p className="text-xs text-slate-500">messages this week</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connect Marketplace Modal */}
      <Modal
        open={showConnectModal}
        onClose={() => {
          setShowConnectModal(false);
          setConnectStep(1);
        }}
        title={`Connect Marketplace — Step ${connectStep} of 3`}
      >
        {connectStep === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Select a marketplace to connect via OAuth:
            </p>
            {AVAILABLE_MARKETPLACES.map((mp) => (
              <button
                key={mp.id}
                type="button"
                onClick={() => setSelectedMarketplace(mp.id)}
                className={`flex w-full items-center justify-between rounded-lg border p-4 transition ${
                  selectedMarketplace === mp.id
                    ? "border-brand-500 bg-brand-600/10"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-white">{mp.name}</p>
                  <p className="text-sm text-slate-400">{mp.description}</p>
                </div>
                {selectedMarketplace === mp.id && (
                  <Check className="h-5 w-5 text-brand-400" />
                )}
              </button>
            ))}
          </div>
        )}
        {connectStep === 2 && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/20">
              <ExternalLink className="h-8 w-8 text-brand-400" />
            </div>
            <p className="text-slate-300">
              Redirecting to{" "}
              {AVAILABLE_MARKETPLACES.find((m) => m.id === selectedMarketplace)?.name}{" "}
              OAuth consent screen…
            </p>
            <p className="text-sm text-slate-500">
              (Mock: click Continue to simulate OAuth callback)
            </p>
          </div>
        )}
        {connectStep === 3 && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-slate-300">
              Authorization successful! Initial catalog sync will begin
              automatically.
            </p>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          {connectStep > 1 && (
            <button
              type="button"
              onClick={() => setConnectStep(connectStep - 1)}
              className="btn-secondary"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleConnect}
            disabled={connectStep === 1 && !selectedMarketplace}
            className="btn-primary"
          >
            {connectStep === 3 ? "Finish" : "Continue"}
          </button>
        </div>
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Product Details"
      >
        {selectedProduct && (() => {
          const product = PRODUCTS.find((p) => p.id === selectedProduct);
          if (!product) return null;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-brand-400" />
                <div>
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-slate-400">{product.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Price</p>
                  <p className="text-white">
                    {product.currency} {product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Stock</p>
                  <p className="text-white">{product.stock} units</p>
                </div>
                <div>
                  <p className="text-slate-500">Category</p>
                  <p className="text-white">{product.category}</p>
                </div>
                <div>
                  <p className="text-slate-500">Marketplace</p>
                  <span
                    className={`badge border ${MARKETPLACE_COLORS[product.marketplace]}`}
                  >
                    {MARKETPLACE_LABELS[product.marketplace]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                This product data is synced from marketplace APIs and used as RAG
                context when drafting replies.
              </p>
            </div>
          );
        })()}
      </Modal>

      {/* FAQ Detail Modal */}
      <Modal
        open={showFaqModal}
        onClose={() => setShowFaqModal(false)}
        title="FAQ Details"
      >
        {selectedFaq && (() => {
          const faq = FAQS.find((f) => f.id === selectedFaq);
          if (!faq) return null;
          return (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-6 w-6 text-brand-400" />
                <div>
                  <h3 className="font-semibold text-white">{faq.question}</h3>
                  <span className="badge mt-2 bg-surface-600 text-slate-300">
                    {faq.category}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{faq.answer}</p>
              <p className="text-xs text-slate-500">
                Referenced {faq.usageCount} times in AI drafts this month.
              </p>
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: "success",
                    title: "FAQ updated",
                    message: "Changes will apply to future AI drafts.",
                  });
                  setShowFaqModal(false);
                }}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          );
        })()}
      </Modal>

      {/* Escalation Rule Modal */}
      <Modal
        open={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        title={editingRule ? "Edit Escalation Rule" : "Add Escalation Rule"}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Rule name</label>
            <input
              type="text"
              defaultValue={editingRule?.name ?? ""}
              placeholder="e.g. VIP Customer Flag"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Description
            </label>
            <textarea
              defaultValue={editingRule?.description ?? ""}
              placeholder="Describe when this rule should trigger…"
              rows={3}
              className="input-field"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              addToast({
                type: "success",
                title: editingRule ? "Rule updated" : "Rule created",
                message: "Escalation rule saved successfully.",
              });
              setShowRuleModal(false);
            }}
            className="btn-primary"
          >
            Save Rule
          </button>
        </div>
      </Modal>
    </>
  );
}

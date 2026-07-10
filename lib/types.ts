export type Marketplace = "amazon" | "ebay" | "etsy" | "shopify";

export type MessageStatus =
  | "pending"
  | "draft_ready"
  | "sent"
  | "escalated"
  | "auto_sent";

export type MessageCategory =
  | "shipping"
  | "returns"
  | "product"
  | "order"
  | "general";

export interface MarketplaceConnection {
  id: string;
  marketplace: Marketplace;
  storeName: string;
  region: string;
  connectedAt: string;
  status: "connected" | "syncing" | "error";
  lastSync: string;
  productCount: number;
  messageCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  marketplace: Marketplace;
  price: number;
  currency: string;
  stock: number;
  category: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  usageCount: number;
}

export interface ReturnPolicy {
  id: string;
  marketplace: Marketplace;
  windowDays: number;
  conditions: string;
  restockingFee: number;
  lastUpdated: string;
}

export interface CustomerMessage {
  id: string;
  customerName: string;
  customerEmail: string;
  marketplace: Marketplace;
  orderId: string;
  subject: string;
  originalMessage: string;
  detectedLanguage: string;
  languageFlag: string;
  category: MessageCategory;
  sentiment: "positive" | "neutral" | "negative";
  status: MessageStatus;
  receivedAt: string;
  productName: string;
  productSku: string;
  orderAmount: number;
  currency: string;
  aiDraft: string;
  confidence: number;
  tone: string;
  escalationReason?: string;
  responseTime?: string;
}

export interface EscalationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerCount: number;
  lastTriggered: string;
}

export interface ActivityItem {
  id: string;
  type: "reply_sent" | "auto_sent" | "escalated" | "sync" | "connected";
  description: string;
  timestamp: string;
  marketplace?: Marketplace;
}

export interface AnalyticsDataPoint {
  day: string;
  replies: number;
  autoReplies: number;
  escalations: number;
  avgResponseMinutes: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

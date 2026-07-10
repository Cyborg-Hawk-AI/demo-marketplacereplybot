import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — MarketplaceReplyBot",
  description:
    "Try the full MarketplaceReplyBot demo with multilingual AI drafts, marketplace connections, and analytics.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

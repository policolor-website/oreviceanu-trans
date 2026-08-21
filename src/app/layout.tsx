import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
  description:
    "Exclusive airport transfers and chauffeur service in Munich, Frankfurt, Berlin, Cologne, Hamburg, Düsseldorf. First-class vehicles, professional chauffeurs, 24/7 availability.",
  openGraph: {
    title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
    description:
      "Exclusive airport transfers and chauffeur service in Germany. First-class vehicles, professional chauffeurs, 24/7 availability.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

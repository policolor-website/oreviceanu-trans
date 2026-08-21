import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Chef3DWrapper from "@/components/chef-3d-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
  description: "Exclusive airport transfers and chauffeur service in Munich, Frankfurt, Berlin, Cologne, Hamburg, Düsseldorf. First-class vehicles, professional chauffeurs, 24/7 availability.",
  openGraph: {
    title: "TrendMyDrive | Premium Chauffeur Service & Airport Transfers",
    description: "Exclusive airport transfers and chauffeur service in Germany. First-class vehicles, professional chauffeurs, 24/7 availability.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..700&family=Inter:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-cream font-body relative">
        <Chef3DWrapper />
        <Header />
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

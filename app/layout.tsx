import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryNav from "@/components/CategoryNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ... (keep existing)
  title: {
    default: "GamePortal – Play Free HTML5 Games Online",
    template: "%s | GamePortal",
  },
  description: "Discover and play hundreds of free HTML5 games instantly.",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface-950 text-white min-h-screen flex flex-col`}>
        <Header />
        <CategoryNav />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  );
}

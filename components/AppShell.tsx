"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryNav from "@/components/CategoryNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-grow w-full">{children}</main>;
  }

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </>
  );
}

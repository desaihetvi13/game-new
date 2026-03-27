import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | GamePortal",
    template: "%s | Admin | GamePortal",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

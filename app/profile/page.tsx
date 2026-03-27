import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Update your admin profile information.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Update Profile</h1>
        <p className="text-white/65">
          This is a basic admin profile screen. You can connect this form to a backend API for
          saving profile changes later.
        </p>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm text-white/70">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              defaultValue={session.user?.name || "Admin"}
              className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-white outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue={session.user?.email || ""}
              readOnly
              className="w-full rounded-xl border border-white/10 bg-surface-900/50 px-4 py-3 text-white/70 outline-none"
            />
          </div>

          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

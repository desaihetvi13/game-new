import type { Metadata } from "next";
import Link from "next/link";
import { Users, ShieldCheck, User as UserIcon } from "lucide-react";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Users",
};

export const dynamic = "force-dynamic";

function isConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("can't reach database server") ||
    message.includes("database server") ||
    message.includes("connection") ||
    message.includes("p1001") ||
    message.includes("p1000") ||
    message.includes("p1012") ||
    message.includes("environment variable not found")
  );
}

export default async function AdminUsersPage() {
  let users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date;
  }> = [];
  let dbUnavailable = false;

  try {
    const prisma = getPrisma();
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (isConnectionError(error)) {
      dbUnavailable = true;
    } else {
      throw error;
    }
  }

  const adminCount = users.filter((user) => user.role === "admin").length;
  const userCount = users.length - adminCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-white/50 text-sm mt-1">Manage authenticated accounts in your portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Total Users</p>
          <p className="text-white text-xl font-bold mt-1">{users.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Admins</p>
          <p className="text-white text-xl font-bold mt-1">{adminCount}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Regular Users</p>
          <p className="text-white text-xl font-bold mt-1">{userCount}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold">Account List</h2>
          <span className="text-xs text-white/40">{users.length} records</span>
        </div>

        {dbUnavailable ? (
          <div className="px-6 py-10 text-center">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">Database is unreachable from local environment.</p>
            <p className="text-white/35 text-xs mt-1">
              Check local network/VPN, Neon allowlist, and local `.env` values.
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No users found yet.</p>
            <p className="text-white/30 text-xs mt-1">
              Users will appear after they authenticate at least once.
            </p>
            <Link
              href="/login"
              className="inline-flex mt-4 rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-xs font-medium text-primary-300"
            >
              Go to login page
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-sm text-white">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-300">
                          <UserIcon className="w-4 h-4" />
                        </span>
                        <span className="truncate max-w-[220px]">{user.name || "Unnamed user"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-white/70">{user.email || "-"}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                          user.role === "admin"
                            ? "bg-primary/20 text-primary-300"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-white/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

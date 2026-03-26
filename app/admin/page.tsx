import { listAllGames, getCategories } from "@/lib/games";
import { LayoutDashboard, Gamepad2, Tag, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const games = await listAllGames();
  const categories = await getCategories();
  const totalPlays = games.reduce((sum, g) => sum + g.plays, 0);
  const featured = games.filter((g) => g.featured === 1).length;

  const stats = [
    { label: "Total Games", value: games.length, icon: Gamepad2, color: "from-primary to-primary-700", href: "/admin/games" },
    { label: "Categories", value: categories.length, icon: Tag, color: "from-cyan-500 to-cyan-700", href: "/admin/games" },
    { label: "Total Plays", value: totalPlays.toLocaleString(), icon: TrendingUp, color: "from-green-500 to-green-700", href: "/admin/games" },
    { label: "Featured", value: featured, icon: LayoutDashboard, color: "from-yellow-500 to-orange-500", href: "/admin/games" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome to the GamePortal admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            href={stat.href}
            key={stat.label}
            className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Games */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Games</h2>
          <Link href="/admin/games" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {games.slice(0, 8).map((game) => (
            <div key={game.slug} className="px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-4 h-4 text-primary-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{game.title}</p>
                  <p className="text-white/40 text-xs">{game.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-white/40 text-xs">{game.plays.toLocaleString()} plays</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${game.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {game.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
          {games.length === 0 && (
            <div className="px-6 py-8 text-center text-white/30 text-sm">
              No games yet.{" "}
              <Link href="/admin/games" className="text-primary-400 hover:underline">
                Upload your first game →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

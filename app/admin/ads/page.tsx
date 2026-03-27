"use client";

import { useState, useEffect } from "react";
import {
  Save,
  DollarSign,
  Layout,
  Sidebar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { AdsConfig } from "@/lib/config";

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdsConfig>({
    enabled: false,
    publisherId: "",
    leaderboardSlotId: "",
    sidebarSlotId: "",
    interstitialSlotId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/config/ads")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.ads) setAds(data.ads);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load ad settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await fetch("/api/config/ads", {
        method: "POST",
        body: JSON.stringify(ads),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "Failed to save ad settings.");
        return;
      }
      setSuccess("Ad settings saved successfully.");
    } catch {
      setError("Failed to save ad settings.");
    } finally {
      setSaving(false);
    }
  };

  const slotCount = [ads.leaderboardSlotId, ads.sidebarSlotId, ads.interstitialSlotId].filter(
    Boolean,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ads Management</h1>
        <p className="text-white/50 text-sm mt-1">
          Configure Google AdSense monetization and placement slots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Status</p>
          <p className="text-white font-semibold mt-1">{ads.enabled ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Configured Slots</p>
          <p className="text-white font-semibold mt-1">{slotCount} / 3</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Publisher ID</p>
          <p className="text-white font-mono text-sm mt-1 truncate">
            {ads.publisherId || "Not configured"}
          </p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-yellow-200 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>
          Make sure your website is approved by Google AdSense before adding IDs. Ads are typically
          visible in production only.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-8xl">
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Enable Monetization</p>
                <p className="text-white/40 text-xs">Toggle all ad slots on or off site-wide.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ads.enabled}
                onChange={(e) => setAds({ ...ads, enabled: e.target.checked })}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Google Publisher ID
              </label>
              <input
                type="text"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                value={ads.publisherId}
                onChange={(e) => setAds({ ...ads, publisherId: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary/50"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5" /> Leaderboard ID
                </label>
                <input
                  type="text"
                  value={ads.leaderboardSlotId}
                  onChange={(e) => setAds({ ...ads, leaderboardSlotId: e.target.value })}
                  className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                  placeholder="Slot ID"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Sidebar className="w-3.5 h-3.5" /> Sidebar ID
                </label>
                <input
                  type="text"
                  value={ads.sidebarSlotId}
                  onChange={(e) => setAds({ ...ads, sidebarSlotId: e.target.value })}
                  className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                  placeholder="Slot ID"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Interstitial ID
              </label>
              <input
                type="text"
                value={ads.interstitialSlotId}
                onChange={(e) => setAds({ ...ads, interstitialSlotId: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                placeholder="Slot ID (Level breaks)"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Loading..." : saving ? "Saving..." : "Save Ad Configuration"}
        </button>
      </form>
    </div>
  );
}

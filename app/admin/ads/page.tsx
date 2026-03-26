"use client";

import { useState, useEffect } from "react";
import { Save, DollarSign, Layout, Sidebar, MessageSquare, AlertCircle } from "lucide-react";
import type { AdsConfig } from "@/lib/config";

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdsConfig>({
    enabled: false,
    publisherId: "",
    leaderboardSlotId: "",
    sidebarSlotId: "",
    interstitialSlotId: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config/ads")
      .then(res => res.json())
      .then(data => data.ads && setAds(data.ads));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/config/ads", {
        method: "POST",
        body: JSON.stringify(ads),
        headers: { "Content-Type": "application/json" }
      });
      alert("Ads configuration saved!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Ads Management</h1>
        <p className="text-white/50 text-sm mt-1">Configure Google AdSense slots for monetization.</p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-yellow-200 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>Make sure your website is approved by Google AdSense before adding Publisher IDs. Ads will only be visible in production mode.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setAds({...ads, enabled: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Google Publisher ID</label>
              <input 
                type="text" 
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                value={ads.publisherId}
                onChange={(e) => setAds({...ads, publisherId: e.target.value})}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-primary/50"
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
                  onChange={(e) => setAds({...ads, leaderboardSlotId: e.target.value})}
                  className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                  placeholder="Slot ID"
                />
              </div>

               <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Sidebar className="w-3.5 h-3.5" /> Sidebar ID
                </label>
                <input 
                  type="text" 
                  value={ads.sidebarSlotId}
                  onChange={(e) => setAds({...ads, sidebarSlotId: e.target.value})}
                  className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                  placeholder="Slot ID"
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
                onChange={(e) => setAds({...ads, interstitialSlotId: e.target.value})}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-primary/50"
                placeholder="Slot ID (Level breaks)"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Ad Configuration"}
        </button>
      </form>
    </div>
  );
}

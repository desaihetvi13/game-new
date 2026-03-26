"use client";

import { useState, useEffect } from "react";
import { Save, Palette, Image as ImageIcon, Globe } from "lucide-react";
import type { BrandingConfig } from "@/lib/config";

export default function AdminBrandingPage() {
  const [branding, setBranding] = useState<BrandingConfig>({
    logoUrl: "/logo.svg",
    siteName: "GamePortal",
    primaryColor: "#7c3aed",
    tagline: "Play Free HTML5 Games Online"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config/branding")
      .then(res => res.json())
      .then(data => data.branding && setBranding(data.branding));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/config/branding", {
        method: "POST",
        body: JSON.stringify(branding),
        headers: { "Content-Type": "application/json" }
      });
      alert("Branding saved!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Branding Settings</h1>
        <p className="text-white/50 text-sm mt-1">Customize the look and feel of your portal.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/40 uppercase flex items-center gap-2">
              <Globe className="w-4 h-4" /> Site Name
            </label>
            <input 
              type="text" 
              value={branding.siteName}
              onChange={(e) => setBranding({...branding, siteName: e.target.value})}
              className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/40 uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Logo URL
            </label>
            <div className="flex gap-4">
               <input 
                type="text" 
                value={branding.logoUrl}
                onChange={(e) => setBranding({...branding, logoUrl: e.target.value})}
                className="flex-1 bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
              />
              <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => (e.target as HTMLImageElement).src="https://lucide.dev/api/icons/gamepad-2?stroke=%237c3aed"} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/40 uppercase flex items-center gap-2">
              <Palette className="w-4 h-4" /> Primary Color
            </label>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={branding.primaryColor}
                onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                className="flex-1 bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
              />
              <input 
                type="color" 
                value={branding.primaryColor}
                onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                className="w-12 h-12 p-0 bg-transparent border-none rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/40 uppercase">Tagline</label>
            <textarea 
              value={branding.tagline}
              onChange={(e) => setBranding({...branding, tagline: e.target.value})}
              className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 min-h-[80px]"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Branding"}
        </button>
      </form>

      {/* Preview Card */}
      <div className="glass-card rounded-xl p-6 border-dashed border-white/20">
        <h2 className="text-white/40 text-xs font-bold uppercase mb-4 tracking-widest">Live Preview</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800 border border-white/5">
           <div 
             className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
             style={{ backgroundColor: branding.primaryColor }}
           >
             <span className="text-white font-bold text-xl">{branding.siteName.charAt(0)}</span>
           </div>
           <div>
             <h3 className="text-white font-bold text-lg">{branding.siteName}</h3>
             <p className="text-white/40 text-xs">{branding.tagline}</p>
           </div>
           <button 
             className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
             style={{ backgroundColor: branding.primaryColor }}
           >
             PLAY NOW
           </button>
        </div>
      </div>
    </div>
  );
}

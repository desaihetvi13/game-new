"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Palette,
  Image as ImageIcon,
  Globe,
  CheckCircle2,
  Loader2,
  Type,
} from "lucide-react";
import type { BrandingConfig } from "@/lib/config";

export default function AdminBrandingPage() {
  const [branding, setBranding] = useState<BrandingConfig>({
    logoUrl: "/logo.svg",
    siteName: "GamePortal",
    primaryColor: "#7c3aed",
    tagline: "Play Free HTML5 Games Online",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/config/branding")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.branding) setBranding(data.branding);
      })
      .catch(() => {
        if (!active) return;
        setError("Failed to load branding settings.");
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
      const response = await fetch("/api/config/branding", {
        method: "POST",
        body: JSON.stringify(branding),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "Failed to save branding settings.");
        return;
      }
      setSuccess("Branding settings saved successfully.");
    } catch {
      setError("Failed to save branding settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Branding Settings</h1>
        <p className="text-white/50 text-sm mt-1">Customize the portal identity and visual theme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Site Name</p>
          <p className="text-white font-semibold mt-1 truncate">{branding.siteName || "GamePortal"}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Primary Color</p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-4 w-4 rounded-full border border-white/20"
              style={{ backgroundColor: branding.primaryColor }}
            />
            <span className="text-white font-mono text-sm">{branding.primaryColor}</span>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Tagline Length</p>
          <p className="text-white font-semibold mt-1">{branding.tagline.length} chars</p>
        </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/40 uppercase flex items-center gap-2">
                <Globe className="w-4 h-4" /> Site Name
              </label>
              <input
                type="text"
                value={branding.siteName}
                onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                disabled={loading}
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
                  onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                  className="flex-1 bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                  disabled={loading}
                />
                <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                  <img
                    src={branding.logoUrl}
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://lucide.dev/api/icons/gamepad-2?stroke=%237c3aed")
                    }
                  />
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
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                  disabled={loading}
                />
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-12 h-12 p-0 bg-transparent border-none rounded-lg cursor-pointer"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/40 uppercase flex items-center gap-2">
                <Type className="w-4 h-4" />
                Tagline
              </label>
              <textarea
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="w-full bg-surface-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 min-h-[80px]"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Loading..." : saving ? "Saving..." : "Save Branding"}
          </button>
        </form>

        <div className="glass-card rounded-xl p-6 border-dashed border-white/20">
          <h2 className="text-white/40 text-xs font-bold uppercase mb-4 tracking-widest">Live Preview</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800 border border-white/5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <span className="text-white font-bold text-xl">
                  {(branding.siteName || "G").charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{branding.siteName || "GamePortal"}</h3>
                <p className="text-white/40 text-xs line-clamp-2">{branding.tagline}</p>
              </div>
              <button
                className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: branding.primaryColor }}
              >
                PLAY NOW
              </button>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
              Tip: use a short, brand-consistent tagline for better readability in mobile headers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

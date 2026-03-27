import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about GamePortal.",
};

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">About GamePortal</h1>
        <p className="text-white/70 leading-relaxed">
          GamePortal is a browser-based gaming destination focused on fast, accessible, and fun
          play sessions. We bring together free HTML5 games across action, puzzle, racing, sports,
          and strategy categories so players can start in seconds without installing software.
        </p>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Our Mission</h2>
          <p className="text-white/65 leading-relaxed">
            Our mission is to make online gaming simple and welcoming for everyone. We prioritize
            instant loading, mobile-friendly layouts, and lightweight game pages so people can play
            on any device, at any time.
          </p>
          <p className="text-white/65 leading-relaxed">
            This is dummy content and can be replaced with your real mission statement, milestones,
            and long-term product roadmap.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/65">
            <div className="rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-2">Curated Library</h3>
              <p>Handpicked titles across trending and evergreen genres. (dummy)</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-2">No Install Required</h3>
              <p>Instant play in modern browsers with smooth game launch flow. (dummy)</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-2">Regular Updates</h3>
              <p>New content drops, seasonal events, and homepage refreshes. (dummy)</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-medium mb-2">Safe Experience</h3>
              <p>Moderation-first discovery and player-friendly design defaults. (dummy)</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-white">Company Snapshot (Dummy)</h2>
          <p className="text-white/60">Founded: 2026</p>
          <p className="text-white/60">Headquarters: Web City, Internet District</p>
          <p className="text-white/60">Games Hosted: 500+</p>
          <p className="text-white/60">Monthly Active Players: 100k+</p>
        </div>
      </div>
    </div>
  );
}

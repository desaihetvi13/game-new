import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact page for GamePortal.",
};

export default function ContactPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Contact</h1>
        <p className="text-white/70">
          Need help with an issue, feedback, or business inquiry? Reach out using the channels
          below. This page contains dummy contact details for demonstration and testing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-5 text-white/65">
            <h2 className="text-lg font-semibold text-white mb-2">Player Support</h2>
            <p>Email: support@gameportal.example</p>
            <p>Hours: Mon-Fri, 9:00-18:00 UTC</p>
            <p>Response time: 1-3 business days</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-5 text-white/65">
            <h2 className="text-lg font-semibold text-white mb-2">Business Inquiries</h2>
            <p>Email: business@gameportal.example</p>
            <p>Partnerships: partnerships@gameportal.example</p>
            <p>Press: media@gameportal.example</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-3 text-white/65">
          <h2 className="text-lg font-semibold text-white">What to Include in Your Message</h2>
          <p>- Game name and page URL (if issue is game-specific)</p>
          <p>- Device, browser name, and browser version</p>
          <p>- A short description of what happened</p>
          <p>- Screenshot or screen recording link if available</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 text-white/65">
          <h2 className="text-lg font-semibold text-white mb-2">Mailing Address (Dummy)</h2>
          <p>GamePortal HQ</p>
          <p>123 Demo Street</p>
          <p>Web City, WC 00001</p>
          <p>Country: Internetland</p>
        </div>
      </div>
    </div>
  );
}

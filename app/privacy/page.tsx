import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for GamePortal.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-white/70">
          This Privacy Policy explains how information may be collected, used, and protected when
          people visit GamePortal. This is full dummy content for layout and testing purposes and
          must be replaced with legally approved policy text before production.
        </p>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-4 text-white/65">
          <h2 className="text-xl font-semibold text-white">1) Information We Collect</h2>
          <p>
            We may collect technical information such as browser type, device category, screen
            size, referrer URL, and session duration. We may also collect gameplay events like game
            start, completion, and error logs to improve quality. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">2) How We Use Information</h2>
          <p>
            Information may be used to operate the platform, measure performance, prevent abuse,
            and improve recommendations. We may use aggregated analytics to understand trends and
            optimize user experience. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">3) Cookies and Tracking</h2>
          <p>
            Cookies or similar technologies may be used to remember preferences, keep sessions
            active, and measure engagement. Users can usually manage cookie behavior from browser
            settings. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">4) Data Sharing</h2>
          <p>
            We may share limited data with service providers that help with analytics, hosting, and
            security. These providers are expected to process information only for approved
            operational purposes. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">5) Data Retention and Security</h2>
          <p>
            We retain data only for as long as needed for legitimate business purposes and apply
            reasonable safeguards to protect stored information. No system can guarantee absolute
            security. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">6) Children&apos;s Privacy</h2>
          <p>
            We do not knowingly collect personal data from children in violation of applicable laws.
            If you believe a child shared personal data, contact us so we can review and remove
            information when required. (dummy)
          </p>
          <h2 className="text-xl font-semibold text-white">7) Contact</h2>
          <p>
            For privacy requests, access inquiries, or deletion requests, contact:
            privacy@gameportal.example (dummy)
          </p>
        </div>
      </div>
    </div>
  );
}

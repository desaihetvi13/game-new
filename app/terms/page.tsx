import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using GamePortal.",
};

export default function TermsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
        <p className="text-white/70">
          These Terms of Service govern the use of GamePortal and related services. The text below
          is full dummy content intended for UI display only and should be replaced with reviewed
          legal copy prior to launch.
        </p>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-6 space-y-4 text-white/65">
          <h2 className="text-xl font-semibold text-white">1) Acceptance of Terms</h2>
          <p>
            By accessing or using GamePortal, users agree to comply with these terms and any
            applicable laws. If a user does not agree, they should discontinue use of the service.
            (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">2) Eligibility and Accounts</h2>
          <p>
            Users may be required to create an account for some features. Users are responsible for
            maintaining account security and for all activity under their credentials. (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">3) Acceptable Use</h2>
          <p>
            Users must not abuse the platform, exploit vulnerabilities, upload malicious code, or
            interfere with other users. Automated scraping and fraudulent traffic are prohibited.
            (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">4) Content and Availability</h2>
          <p>
            Game availability, categories, and site features may change, be updated, or removed at
            any time. We do not guarantee uninterrupted access in all regions or devices. (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">5) Intellectual Property</h2>
          <p>
            All trademarks, branding assets, and platform materials are owned by their respective
            owners. Unauthorized copying, resale, or redistribution is not allowed. (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">6) Disclaimer and Liability</h2>
          <p>
            The service is provided on an &quot;as is&quot; basis without warranties of any kind. To the
            fullest extent allowed by law, liability for indirect or consequential damages is
            limited. (dummy)
          </p>

          <h2 className="text-xl font-semibold text-white">7) Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use after updates may indicate
            acceptance of the revised terms. The latest update date can be shown at the top of this
            page. (dummy)
          </p>
        </div>
      </div>
    </div>
  );
}

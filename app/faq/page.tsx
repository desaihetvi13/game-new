import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions for GamePortal.",
};

const faqs = [
  {
    question: "Do I need to download anything?",
    answer:
      "No downloads are required. All games run directly in your browser using HTML5 technology, so you can start with one click. (dummy)",
  },
  {
    question: "Is GamePortal free to use?",
    answer:
      "Yes, GamePortal is free for players. Some games may show ads or optional upgrade prompts depending on game settings. (dummy)",
  },
  {
    question: "Can I save my progress?",
    answer:
      "Progress handling depends on the game. Some titles store data locally in your browser, while others can support account-based saves. (dummy)",
  },
  {
    question: "How can I report a broken game?",
    answer:
      "Use the Contact page and include the game title, your browser name/version, and a short description of the issue so support can reproduce it. (dummy)",
  },
  {
    question: "What devices are supported?",
    answer:
      "Most modern desktop and mobile browsers are supported, including Chrome, Edge, Firefox, and Safari. Performance may vary by game. (dummy)",
  },
  {
    question: "Why is a game not loading?",
    answer:
      "Try refreshing the page, disabling strict ad/script blockers for the site, and clearing cached data. If it still fails, contact support. (dummy)",
  },
  {
    question: "Can I submit my own game?",
    answer:
      "Yes, publisher onboarding can be offered through a submission review process. Use the business contact channel for details. (dummy)",
  },
];

export default function FaqPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="text-white/70 leading-relaxed">
          Find quick answers to common questions about gameplay, performance, account access, and
          support. All content on this page is dummy text and can be replaced with production copy.
        </p>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-2xl border border-white/10 bg-surface-900/60 p-5">
              <h2 className="text-lg font-semibold text-white">{item.question}</h2>
              <p className="text-white/60 mt-2">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-5 text-white/65">
          <h2 className="text-lg font-semibold text-white mb-2">Still Need Help?</h2>
          <p>
            If your question is not listed here, please use the Contact page and include relevant
            details so our team can respond faster. Typical response time is 1-3 business days.
            (dummy)
          </p>
        </div>
      </div>
    </div>
  );
}

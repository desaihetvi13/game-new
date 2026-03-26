import Link from "next/link";
import { Gamepad2, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-white/5 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Game<span className="text-primary-400">Portal</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Play hundreds of free HTML5 games online. No downloads, no plugins — just instant fun.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
            <ul className="space-y-2">
              {["Action", "Puzzle", "Racing", "Sports", ".io"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="text-white/40 hover:text-primary-300 text-sm transition-colors"
                  >
                    {cat} Games
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Info</h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/40 hover:text-primary-300 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} GamePortal. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

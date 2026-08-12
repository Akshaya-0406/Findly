import React from "react";
import Link from "next/link";
import Logo from "./Logo";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    discover: [
      { name: "Browse Lost Items", href: "/lost" },
      { name: "Browse Found Items", href: "/found" },
      { name: "Search platform", href: "/search" },
    ],
    support: [
      { name: "How It Works", href: "/how-it-works" },
      { name: "Safety Guidelines", href: "/safety" },
      { name: "About Findly", href: "/about" },
    ],
    legal: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Cookie Settings", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t border-neutral-100 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand statement */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
              "Lost something? Find it again." Report lost items, discover things others have found, and reconnect safely.
            </p>
          </div>

          {/* Column 1: Discover */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase mb-4">Discover</h3>
            <ul className="space-y-3">
              {links.discover.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: support */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase mb-4">Support & Trust</h3>
            <ul className="space-y-3">
              {links.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-wider uppercase mb-4">Safety & Terms</h3>
            <ul className="space-y-3">
              {links.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            &copy; {currentYear} Findly Technologies Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-neutral-400">
            <span>Designed for community safety & verified ownership.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

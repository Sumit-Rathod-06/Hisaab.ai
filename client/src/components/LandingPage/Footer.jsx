import React from 'react';
import { Instagram, Facebook, Youtube, Twitter, DollarSign } from 'lucide-react';

// Data structure for the navigation links
const footerLinks = [
  {
    title: "Features",
    links: [
      { name: "Dashboard", href: "#" },
      { name: "Transactions", href: "#" },
      { name: "Analytics", href: "#" },
      { name: "Goals", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Blog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Support", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

// Main Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section: Logo & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              {/* Hisaab.ai Logo Icon */}
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-wider">
                Hisaab.ai
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Your AI-powered financial assistant for smart expense tracking, investment insights, and goal planning.
            </p>
          </div>

          {/* Columns 2, 3, 4: Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="md:col-span-1">
              <h3 className="text-white font-semibold mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Separator Line */}
        <div className="mt-16 mb-8 border-t border-gray-800"></div>

        {/* Bottom Section: Copyright and Social Icons */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
          {/* Copyright */}
          <p className="text-gray-400 mb-4 sm:mb-0">
            &copy; {currentYear} Hisaab.ai. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-6">
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

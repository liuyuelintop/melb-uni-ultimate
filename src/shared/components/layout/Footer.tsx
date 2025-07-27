import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SOCIAL_LINKS } from "@shared/data/social";

export default function Footer() {
  const socialLinks = [
    {
      href: SOCIAL_LINKS.instagram,
      icon: FaInstagram,
      label: "Instagram",
      hoverColor: "hover:text-pink-400",
      bgHover: "hover:bg-pink-500/10",
    },
    {
      href: SOCIAL_LINKS.facebook,
      icon: FaFacebook,
      label: "Facebook",
      hoverColor: "hover:text-blue-400",
      bgHover: "hover:bg-blue-500/10",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10 max-w-7xl mx-auto">
        {/* Desktop: Two column layout, Mobile: Stacked */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start space-y-6 lg:space-y-0">
          {/* Club Info - Takes more space on desktop */}
          <div className="text-center sm:text-left lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-bold mb-2 lg:mb-3 text-white">
              MU Ultimate Frisbee Club
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-lg mx-auto sm:mx-0 lg:max-w-none">
              Join our community of passionate Ultimate players at the
              University of Melbourne.
            </p>

            {/* Contact Info - Desktop inline */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-start xl:items-center sm:space-x-6 lg:space-x-0 xl:space-x-6 space-y-2 sm:space-y-0 lg:space-y-2 xl:space-y-0 mt-4">
              <a
                href="mailto:unimelbultimate@gmail.com"
                className="flex items-center justify-center sm:justify-start lg:justify-start space-x-2 text-gray-300 hover:text-blue-300 transition-colors text-sm"
              >
                <FaEnvelope className="text-blue-400 text-xs" />
                <span>unimelbultimate@gmail.com</span>
              </a>
              <div className="flex items-center justify-center sm:justify-start lg:justify-start space-x-2 text-gray-300 text-sm">
                <FaMapMarkerAlt className="text-blue-400 text-xs" />
                <span>University of Melbourne</span>
              </div>
            </div>
          </div>

          {/* Social & CTA - Right column on desktop */}
          <div className="lg:col-span-1 space-y-4">
            {/* Social Media */}
            <div>
              <h4 className="text-base font-semibold mb-3 text-white text-center lg:text-left">
                Connect
              </h4>
              <div className="flex justify-center lg:justify-start space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full bg-gray-800 ${social.hoverColor} ${social.bgHover} transition-all duration-300 hover:scale-110`}
                      aria-label={social.label}
                    >
                      <IconComponent className="text-lg" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CTA - Compact */}
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-3 text-center lg:text-left">
              <p className="text-xs text-gray-300 mb-1">Ready to join?</p>
              <Link
                href="/contact"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Reduced spacing */}
        <div className="border-t border-gray-800 pt-4 mt-6 lg:mt-8">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 MU Ultimate Frisbee Club. All rights reserved.
            </p>
            <div className="flex justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

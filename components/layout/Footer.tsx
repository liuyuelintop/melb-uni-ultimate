import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SOCIAL_LINKS } from "@/data/footer.js";

export default function Footer() {
  const quickLinks = [
    { href: "/announcements", label: "Announcements" },
    { href: "/events", label: "Events" },
    { href: "/roster", label: "Roster" },
    { href: "/alumni", label: "Alumni" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

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
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Club Information - Takes more space on larger screens */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-white">
                Melbourne University Ultimate Frisbee Club
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Promoting the sport of Ultimate Frisbee at the University of
                Melbourne since 2000. Join our community of passionate athletes
                and experience the spirit of the game.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:unimelbultimate@gmail.com"
                  className="hover:text-blue-300 transition-colors duration-200"
                >
                  unimelbultimate@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaMapMarkerAlt className="text-blue-400 flex-shrink-0" />
                <span>University of Melbourne, Parkville VIC 3010</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <nav>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social Media & Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Connect With Us
            </h4>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-gray-800 ${social.hoverColor} ${social.bgHover} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    aria-label={social.label}
                  >
                    <IconComponent className="text-xl" />
                  </a>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">Ready to join us?</p>
              <Link
                href="/contact"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Melbourne University Ultimate Frisbee Club. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

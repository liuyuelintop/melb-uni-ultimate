"use client";

import { Link2Icon } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/data/social";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect with Us</h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-700 mb-6">
          We&apos;re most active on social media. Feel free to reach out to us
          there!
        </p>

        {/* Responsive: flex-col on mobile, flex-row on sm+ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 justify-center items-center">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 text-lg font-medium transition-colors"
          >
            <FaInstagram className="text-2xl" />
            <span>Instagram</span>
          </a>

          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-lg font-medium transition-colors"
          >
            <FaFacebook className="text-2xl" />
            <span>Facebook</span>
          </a>
          <a
            href={SOCIAL_LINKS.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 text-lg font-medium transition-colors"
          >
            <Link2Icon className="text-2xl" />
            <span>Linktree</span>
          </a>
        </div>
      </div>
    </div>
  );
}

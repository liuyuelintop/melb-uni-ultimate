"use client";

import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect with Us</h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-700 mb-6">
          We&apos;re most active on social media. Feel free to reach out to us
          there!
        </p>

        <div className="flex justify-center space-x-8">
          <a
            href="https://www.instagram.com/unimelb_ultimate/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 text-lg font-medium"
          >
            <FaInstagram className="text-2xl" />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.facebook.com/melbuniultimate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-lg font-medium"
          >
            <FaFacebook className="text-2xl" />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}

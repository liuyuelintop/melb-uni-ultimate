"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Announcements", href: "/announcements" },
    { name: "Events", href: "/events" },
    { name: "Roster", href: "/roster" },
    { name: "Alumni", href: "/alumni" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-blue-600"
            >
              MU Ultimate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded="false"
            aria-label="Main menu"
          >
            <svg
              className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop auth section */}
          <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <span className="text-sm text-gray-700 truncate max-w-24 lg:max-w-none">
                    {session.user?.name}
                  </span>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Profile
                  </Link>
                </div>
                {session.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-4 py-3 bg-white border-t shadow-lg">
          {/* Main navigation - compact grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`px-3 py-2 text-sm font-medium rounded-md text-center transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact link if we have more than 6 items */}
          {navigation.length > 6 && (
            <Link
              href="/contact"
              onClick={closeMenu}
              className={`block px-3 py-2 text-sm font-medium rounded-md text-center mb-3 transition-colors ${
                pathname === "/contact"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Contact
            </Link>
          )}

          {/* Auth section - compact */}
          <div className="border-t border-gray-200 pt-3">
            {status === "loading" ? (
              <div className="text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : session ? (
              <div className="flex flex-col space-y-2">
                <div className="text-center">
                  <span className="text-sm text-gray-700">
                    Hi, {session.user?.name?.split(" ")[0]}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-center"
                  >
                    Profile
                  </Link>
                  {session.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-center"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-center"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

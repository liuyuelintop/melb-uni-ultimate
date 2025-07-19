"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Announcements", href: "/announcements" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const protectedNavigation = [
    { name: "Roster", href: "/roster" },
    { name: "Alumni", href: "/alumni" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MU Ultimate
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Protected routes - shown when authenticated */}
            {session &&
              protectedNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {session.user?.name}
                  </span>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

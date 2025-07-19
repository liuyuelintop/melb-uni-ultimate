"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function TestLoginPage() {
  const { data: session, status } = useSession();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setMessage(`Login failed: ${result.error}`);
      } else {
        setMessage("Login successful! Check the session info below.");
      }
    } catch (error) {
      setMessage("Login error occurred");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/test-login" });
  };

  const handleRefreshSession = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          "Session refresh data retrieved. Please sign out and sign back in to apply changes."
        );
        console.log("Session refresh data:", data);
      } else {
        setMessage("Failed to refresh session");
      }
    } catch (error) {
      setMessage("Error refreshing session");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Test Page</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Login Form</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {message && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  message.includes("successful")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Test Accounts:</strong>
              </p>
              <p>Admin: admin@muultimate.com / admin123</p>
              <p>Or use your own account credentials</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>

            <div className="mb-4">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-blue-600">{status}</span>
              </p>
            </div>

            {status === "loading" && (
              <div className="text-gray-600">Loading session...</div>
            )}

            {status === "unauthenticated" && (
              <div className="text-red-600">Not authenticated</div>
            )}

            {status === "authenticated" && session && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    User Info:
                  </h3>
                  <p>
                    <strong>Name:</strong> {session.user?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {session.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>ID:</strong> {session.user?.id || "N/A"}
                  </p>
                  <p>
                    <strong>Role:</strong> {session.user?.role || "N/A"}
                  </p>
                  <p>
                    <strong>Student ID:</strong>{" "}
                    {(session.user as { studentId?: string })?.studentId ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Position:</strong>{" "}
                    {(session.user as { position?: string })?.position || "N/A"}
                  </p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {(session.user as { experience?: string })?.experience ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {(session.user as { isVerified?: boolean })?.isVerified
                      ? "Yes"
                      : "No"}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Permissions:
                  </h3>
                  <p>
                    <strong>Is Admin:</strong>{" "}
                    {session.user?.role === "admin" ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <strong>Can Delete Players:</strong>{" "}
                    {session.user?.role === "admin" ? "✅ Yes" : "❌ No"}
                  </p>
                  <p>
                    <strong>Can Delete Alumni:</strong>{" "}
                    {session.user?.role === "admin" ? "✅ Yes" : "❌ No"}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleRefreshSession}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                  >
                    Refresh Session Data
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/debug-session"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Debug Session
            </a>
            <a
              href="/update-role"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Update Role
            </a>
            <a
              href="/roster"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Go to Roster
            </a>
            <a
              href="/alumni"
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
            >
              Go to Alumni
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

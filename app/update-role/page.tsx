"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UpdateRolePage() {
  const { data: session, status } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const updateRole = async (newRole: "user" | "admin") => {
    setIsUpdating(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Role updated to ${newRole} successfully! Please sign out and sign back in to refresh your session.`
        );
      } else {
        setMessage(data.error || "Failed to update role");
      }
    } catch (error) {
      setMessage("Network error while updating role");
    }

    setIsUpdating(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p className="mb-4">Please sign in to update your role.</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Your Role
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Current role:{" "}
            <span className="font-semibold">
              {session.user?.role || "user"}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              <strong>Current User:</strong> {session.user?.name} (
              {session.user?.email})
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Current Role:</strong> {session.user?.role || "user"}
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => updateRole("user")}
              disabled={isUpdating || session.user?.role === "user"}
              className={`w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium ${
                session.user?.role === "user"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isUpdating ? "Updating..." : "Set as User"}
            </button>

            <button
              onClick={() => updateRole("admin")}
              disabled={isUpdating || session.user?.role === "admin"}
              className={`w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium ${
                session.user?.role === "admin"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {isUpdating ? "Updating..." : "Set as Admin"}
            </button>
          </div>

          {message.includes("successfully") && (
            <div className="mt-4">
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out & Refresh Session
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

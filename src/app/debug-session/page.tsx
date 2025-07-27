"use client";

import { useSession } from "next-auth/react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug Information</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="text-lg mb-4">
            <strong>Status:</strong>{" "}
            <span className="text-blue-600">{status}</span>
          </p>

          {status === "loading" && (
            <div className="text-gray-600">Loading session...</div>
          )}

          {status === "unauthenticated" && (
            <div className="text-red-600">Not authenticated</div>
          )}

          {status === "authenticated" && session && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Session Data:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(session, null, 2)}
              </pre>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-900">
                    User Information
                  </h4>
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
                  <h4 className="font-semibold text-green-900">Permissions</h4>
                  <p>
                    <strong>Can Access Admin:</strong>{" "}
                    {session.user?.role === "admin" ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Can Delete Players:</strong>{" "}
                    {session.user?.role === "admin" ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Can Delete Alumni:</strong>{" "}
                    {session.user?.role === "admin" ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Can Toggle Status:</strong>{" "}
                    {session.user?.role === "admin" ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Quick Actions:</h4>
                <div className="flex space-x-4">
                  <a
                    href="/update-role"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Update Role
                  </a>
                  <a
                    href="/roster"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Go to Roster
                  </a>
                  <a
                    href="/alumni"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Go to Alumni
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

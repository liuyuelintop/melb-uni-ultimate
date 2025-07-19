"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Player {
  _id: string;
  name: string;
  email: string;
  studentId?: string; // Optional
  position: "handler" | "cutter" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  jerseyNumber: number;
  phoneNumber?: string;
  graduationYear: number;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  affiliation?: string; // New optional field
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default function RosterPage() {
  const { data: session, status } = useSession();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterExperience, setFilterExperience] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    email: "",
    studentId: "",
    position: "any" as "handler" | "cutter" | "any",
    experience: "beginner" as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "expert",
    jerseyNumber: "",
    phoneNumber: "",
    graduationYear: "",
    affiliation: "", // New field
  });

  // Fetch players on component mount
  useEffect(() => {
    if (session) {
      fetchPlayers();
    }
  }, [session]);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        addNotification("error", "Failed to fetch players");
      }
    } catch (error) {
      addNotification("error", "Network error while fetching players");
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { type, message, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const addPlayer = async () => {
    // Validation
    const requiredFields = ["name", "email", "jerseyNumber", "graduationYear"];
    const missingFields = requiredFields.filter(
      (field) => !newPlayer[field as keyof typeof newPlayer]
    );

    if (missingFields.length > 0) {
      addNotification(
        "error",
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!newPlayer.email.includes("@")) {
      addNotification("error", "Please enter a valid email address");
      return;
    }

    const jerseyNum = parseInt(newPlayer.jerseyNumber);
    if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 99) {
      addNotification("error", "Jersey number must be between 1 and 99");
      return;
    }

    const gradYear = parseInt(newPlayer.graduationYear);
    if (isNaN(gradYear) || gradYear < 2020 || gradYear > 2030) {
      addNotification("error", "Graduation year must be between 2020 and 2030");
      return;
    }

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPlayer.name,
          email: newPlayer.email,
          studentId: newPlayer.studentId,
          position: newPlayer.position,
          experience: newPlayer.experience,
          jerseyNumber: jerseyNum,
          phoneNumber: newPlayer.phoneNumber,
          graduationYear: gradYear,
          affiliation: newPlayer.affiliation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", "Player added successfully!");
        setPlayers([data.player, ...players]);
        setNewPlayer({
          name: "",
          email: "",
          studentId: "",
          position: "any",
          experience: "beginner",
          jerseyNumber: "",
          phoneNumber: "",
          graduationYear: "",
          affiliation: "",
        });
        setShowAddForm(false);
      } else {
        addNotification("error", data.error || "Failed to add player");
      }
    } catch (error) {
      addNotification("error", "Network error while adding player");
    }
  };

  const deletePlayer = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this player? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addNotification("success", "Player deleted successfully");
        setPlayers(players.filter((p) => p._id !== id));
      } else {
        const data = await response.json();
        addNotification("error", data.error || "Failed to delete player");
      }
    } catch (error) {
      addNotification("error", "Network error while deleting player");
    }
  };

  const togglePlayerStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/players/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        const data = await response.json();
        setPlayers(players.map((p) => (p._id === id ? data.player : p)));
        addNotification(
          "success",
          `Player ${
            data.player.isActive ? "activated" : "deactivated"
          } successfully`
        );
      } else {
        const data = await response.json();
        addNotification(
          "error",
          data.error || "Failed to update player status"
        );
      }
    } catch (error) {
      addNotification("error", "Network error while updating player status");
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.studentId?.includes(searchTerm);
    const matchesPosition =
      filterPosition === "all" || player.position === filterPosition;
    const matchesExperience =
      filterExperience === "all" || player.experience === filterExperience;

    return matchesSearch && matchesPosition && matchesExperience;
  });

  const stats = {
    totalPlayers: players.length,
    activePlayers: players.filter((p) => p.isActive).length,
    handlers: players.filter((p) => p.position === "handler").length,
    cutters: players.filter((p) => p.position === "cutter").length,
    anyPosition: players.filter((p) => p.position === "any").length,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading players...</div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Roster</h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to view the team roster.
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-md shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Roster</h1>
        {session?.user?.role === "admin" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showAddForm ? "Cancel" : "Add Player"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalPlayers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.activePlayers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Handlers</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.handlers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Cutters</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.cutters}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Any</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.anyPosition}
          </p>
        </div>
      </div>

      {/* Add Player Form */}
      {showAddForm && session?.user?.role === "admin" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={newPlayer.name}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="student@student.unimelb.edu.au"
                value={newPlayer.email}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                placeholder="12345678"
                value={newPlayer.studentId}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, studentId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliation
              </label>
              <input
                type="text"
                placeholder="e.g. Melbourne Uni, External, Coach"
                value={newPlayer.affiliation}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, affiliation: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jersey Number *
              </label>
              <input
                type="number"
                placeholder="1-99"
                min="1"
                max="99"
                value={newPlayer.jerseyNumber}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year *
              </label>
              <input
                type="number"
                placeholder="2025"
                min="2020"
                max="2030"
                value={newPlayer.graduationYear}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, graduationYear: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+61 400 123 456"
                value={newPlayer.phoneNumber}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={newPlayer.position}
                onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    position: e.target.value as "handler" | "cutter" | "any",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="handler">Handler</option>
                <option value="cutter">Cutter</option>
                <option value="any">Any</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={newPlayer.experience}
                onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    experience: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced"
                      | "expert",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Player
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Positions</option>
            <option value="handler">Handler</option>
            <option value="cutter">Cutter</option>
            <option value="any">Any</option>
          </select>
          <select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Experience Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {player.jerseyNumber}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {player.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.email}</div>
                    {player.phoneNumber && (
                      <div className="text-sm text-gray-500">
                        {player.phoneNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {player.position.charAt(0).toUpperCase() +
                        player.position.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.experience.charAt(0).toUpperCase() +
                        player.experience.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        player.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {player.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {session?.user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => togglePlayerStatus(player._id)}
                            className={`text-sm px-3 py-1 rounded ${
                              player.isActive
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                          >
                            {player.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deletePlayer(player._id)}
                            className="text-sm px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No players found matching your criteria.
        </div>
      )}
    </div>
  );
}

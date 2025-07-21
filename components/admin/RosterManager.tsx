import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface Player {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  gender: "male" | "female" | "other";
  position: "handler" | "cutter" | "any";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  jerseyNumber: number;
  phoneNumber?: string;
  graduationYear: number;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  affiliation?: string;
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default function RosterManager() {
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
    gender: "other" as "male" | "female" | "other",
    position: "any" as "handler" | "cutter" | "any",
    experience: "beginner" as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "expert",
    jerseyNumber: "",
    phoneNumber: "",
    graduationYear: "",
    affiliation: "",
  });
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [editForm, setEditForm] = useState<
    (Partial<Player> & { jerseyNumber: string; graduationYear: string }) | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Stats
  const stats = {
    totalPlayers: players.length,
    activePlayers: players.filter((p) => p.isActive).length,
    handlers: players.filter((p) => p.position === "handler").length,
    cutters: players.filter((p) => p.position === "cutter").length,
    anyPosition: players.filter((p) => p.position === "any").length,
  };

  // Filtering
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

  // Add, delete, toggle status, etc.
  const deletePlayer = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this player? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(`/api/players/${id}`, { method: "DELETE" });
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
      const response = await fetch(`/api/players/${id}`, { method: "PATCH" });
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

  const openEditModal = (player: Player) => {
    setEditPlayer(player);
    setEditForm({
      ...player,
      jerseyNumber: player.jerseyNumber ? player.jerseyNumber.toString() : "",
      graduationYear: player.graduationYear
        ? player.graduationYear.toString()
        : "",
    } as Partial<Player> & { jerseyNumber: string; graduationYear: string });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditPlayer(null);
    setEditForm(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlayer || !editForm) return;
    try {
      const response = await fetch(`/api/players/${editPlayer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          jerseyNumber: parseInt(editForm.jerseyNumber),
          graduationYear: parseInt(editForm.graduationYear),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPlayers(
          players.map((p) => (p._id === editPlayer._id ? data.player : p))
        );
        addNotification("success", "Player updated successfully");
        closeEditModal();
      } else {
        addNotification("error", data.error || "Failed to update player");
      }
    } catch (error) {
      addNotification("error", "Network error while updating player");
    }
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
        <h1 className="text-3xl font-bold">Admin Roster</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showAddForm ? "Cancel" : "Add Player"}
        </button>
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
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
          {/* ...form fields for newPlayer... */}
          {/* ...submit button, validation, etc... */}
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
                  Gender
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
                    <div className="text-sm text-gray-900">
                      {player.gender
                        ? player.gender.charAt(0).toUpperCase() +
                          player.gender.slice(1)
                        : "Not specified"}
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
                      <button
                        onClick={() => openEditModal(player)}
                        className="text-sm px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePlayer(player._id)}
                        className="text-sm px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Delete
                      </button>
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

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Player"
      >
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-player-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="edit-player-name"
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="edit-player-email"
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-studentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Student ID
              </label>
              <input
                id="edit-player-studentId"
                type="text"
                name="studentId"
                value={editForm.studentId || ""}
                onChange={handleEditChange}
                placeholder="Student ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="edit-player-gender"
                name="gender"
                value={editForm.gender}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-player-position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position
              </label>
              <select
                id="edit-player-position"
                name="position"
                value={editForm.position}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="handler">Handler</option>
                <option value="cutter">Cutter</option>
                <option value="any">Any</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-player-experience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience
              </label>
              <select
                id="edit-player-experience"
                name="experience"
                value={editForm.experience}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-player-jerseyNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Jersey Number
              </label>
              <input
                id="edit-player-jerseyNumber"
                type="number"
                name="jerseyNumber"
                value={editForm.jerseyNumber}
                onChange={handleEditChange}
                placeholder="Jersey Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={1}
                max={99}
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-graduationYear"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Graduation Year
              </label>
              <input
                id="edit-player-graduationYear"
                type="number"
                name="graduationYear"
                value={editForm.graduationYear}
                onChange={handleEditChange}
                placeholder="Graduation Year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={2010}
                max={2030}
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="edit-player-phoneNumber"
                type="tel"
                name="phoneNumber"
                value={editForm.phoneNumber || ""}
                onChange={handleEditChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="edit-player-affiliation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Affiliation
              </label>
              <input
                id="edit-player-affiliation"
                type="text"
                name="affiliation"
                value={editForm.affiliation || ""}
                onChange={handleEditChange}
                placeholder="Affiliation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

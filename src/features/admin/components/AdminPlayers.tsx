import { useState, useEffect } from "react";
import PlayerStats from "@features/roster/components/PlayerStats";
import PlayerFilters from "@features/roster/components/PlayerFilters";
import PlayerTable from "@features/roster/components/PlayerTable";
import PlayerEditModal from "@features/roster/components/PlayerEditModal";
import PlayerCreateModal from "@features/roster/components/PlayerCreateModal";
import { PlayerForm } from "@features/roster/components/PlayerFormModal";
import { useNotification } from "@shared/context/NotificationContext";

interface Player {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  gender: "male" | "female" | "other";
  position: "handler" | "cutter" | "utility";
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

export default function PlayerManager() {
  const { notify } = useNotification();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterExperience, setFilterExperience] = useState("all");
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [editForm, setEditForm] = useState<PlayerForm | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState<PlayerForm>({
    name: "",
    email: "",
    studentId: "",
    gender: "male",
    position: "handler",
    experience: "beginner",
    jerseyNumber: "",
    phoneNumber: "",
    graduationYear: "",
    affiliation: "",
    isActive: true,
  });

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        notify("error", "Failed to fetch players");
      }
    } catch (error) {
      notify("error", "Network error while fetching players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const stats = {
    totalPlayers: players.length,
    activePlayers: players.filter((p) => p.isActive).length,
    handlers: players.filter((p) => p.position === "handler").length,
    cutters: players.filter((p) => p.position === "cutter").length,
    utilityPosition: players.filter((p) => p.position === "utility").length,
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
        notify("success", "Player deleted successfully");
        setPlayers(players.filter((p) => p._id !== id));
      } else {
        const data = await response.json();
        notify("error", data.error || "Failed to delete player");
      }
    } catch (error) {
      notify("error", "Network error while deleting player");
    }
  };

  const openEditModal = (player: Player) => {
    setEditPlayer(player);
    setEditForm({
      name: player.name ?? "",
      email: player.email ?? "",
      studentId: player.studentId ?? "",
      gender:
        player.gender === "male" ||
        player.gender === "female" ||
        player.gender === "other"
          ? player.gender
          : "male",
      position:
        player.position === "handler" ||
        player.position === "cutter" ||
        player.position === "utility"
          ? player.position
          : "handler",
      experience: player.experience ?? "beginner",
      jerseyNumber:
        player.jerseyNumber !== undefined && player.jerseyNumber !== null
          ? String(player.jerseyNumber)
          : "",
      phoneNumber: player.phoneNumber ?? "",
      graduationYear:
        player.graduationYear !== undefined && player.graduationYear !== null
          ? String(player.graduationYear)
          : "",
      affiliation: player.affiliation ?? "",
      isActive: typeof player.isActive === "boolean" ? player.isActive : true,
    });
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
          isActive: editForm.isActive,
          jerseyNumber: parseInt(editForm.jerseyNumber || ""),
          graduationYear: parseInt(editForm.graduationYear || ""),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPlayers(
          players.map((p) => (p._id === editPlayer._id ? data.player : p))
        );
        notify("success", "Player updated successfully");
        closeEditModal();
      } else {
        notify("error", data.error || "Failed to update player");
      }
    } catch (error) {
      notify("error", "Network error while updating player");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPlayer,
          jerseyNumber: newPlayer.jerseyNumber
            ? parseInt(newPlayer.jerseyNumber)
            : undefined,
          graduationYear: newPlayer.graduationYear
            ? parseInt(newPlayer.graduationYear)
            : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPlayers((prev) => [data, ...prev]);
        notify("success", "Player added successfully");
        setIsAddModalOpen(false);
        setNewPlayer({
          name: "",
          email: "",
          studentId: "",
          gender: "male",
          position: "handler",
          experience: "beginner",
          jerseyNumber: "",
          phoneNumber: "",
          graduationYear: "",
          affiliation: "",
          isActive: true,
        });
      } else {
        notify("error", data.error || "Failed to add player");
      }
    } catch (error) {
      notify("error", "Network error while adding player");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Player Information</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage players, view stats, and build your team.
        </p>
      </header>

      <section className="mb-6 sm:mb-8">
        <PlayerStats {...stats} />
      </section>

      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 gap-4 sm:gap-0">
          <h2 className="text-lg font-semibold">Player Management</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Create Player</span>
            <span className="sm:hidden">+ Player</span>
          </button>
        </div>
      </section>

      <PlayerCreateModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        handleAddSubmit={handleAddSubmit}
      />

      <PlayerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPosition={filterPosition}
        setFilterPosition={setFilterPosition}
        filterExperience={filterExperience}
        setFilterExperience={setFilterExperience}
      />
      <PlayerTable
        players={filteredPlayers}
        onEdit={openEditModal}
        onDelete={deletePlayer}
      />
      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No players found matching your criteria.
        </div>
      )}
      <PlayerEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editForm={editForm as PlayerForm}
        setEditForm={
          setEditForm as React.Dispatch<React.SetStateAction<PlayerForm>>
        }
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
}

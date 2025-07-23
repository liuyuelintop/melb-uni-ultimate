import React from "react";

interface PlayerStatsProps {
  totalPlayers: number;
  activePlayers: number;
  handlers: number;
  cutters: number;
  utilityPosition: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  totalPlayers,
  activePlayers,
  handlers,
  cutters,
  utilityPosition,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Total</h3>
      <p className="text-2xl font-bold text-blue-600">{totalPlayers}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Active</h3>
      <p className="text-2xl font-bold text-green-600">{activePlayers}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Handlers</h3>
      <p className="text-2xl font-bold text-purple-600">{handlers}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Cutters</h3>
      <p className="text-2xl font-bold text-orange-600">{cutters}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Utility</h3>
      <p className="text-2xl font-bold text-yellow-600">{utilityPosition}</p>
    </div>
  </div>
);

export default PlayerStats;

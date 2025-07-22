import React from "react";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "announcements", label: "Announcements" },
  { key: "events", label: "Events" },
  { key: "players", label: "Players" },
  { key: "alumni", label: "Alumni" },
  { key: "tournaments", label: "Tournaments" },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => (
  <nav className="flex space-x-8 mb-8">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${
          activeTab === tab.key
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

export default AdminTabs;

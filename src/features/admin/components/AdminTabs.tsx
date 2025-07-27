import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "announcements", label: "Announcements", icon: "📢" },
  { key: "events", label: "Events", icon: "📅" },
  { key: "players", label: "Players", icon: "👥" },
  { key: "alumni", label: "Alumni", icon: "🎓" },
  { key: "tournaments", label: "Tournaments", icon: "🏆" },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="mb-8">
      {/* Desktop Tabs */}
      <nav className="hidden md:flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <span className="mr-2">
              {tabs.find((tab) => tab.key === activeTab)?.icon}
            </span>
            <span className="font-medium text-gray-900">
              {tabs.find((tab) => tab.key === activeTab)?.label}
            </span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  onTabChange(tab.key);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTabs;

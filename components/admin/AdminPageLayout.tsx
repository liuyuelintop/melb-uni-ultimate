import React from "react";
import AdminTabs from "./AdminTabs";

interface AdminPageLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => (
  <div className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your ultimate frisbee club operations
        </p>
      </div>
      <AdminTabs activeTab={activeTab} onTabChange={onTabChange} />
      {children}
    </div>
  </div>
);

export default AdminPageLayout;

// resources/js/Layouts/AuthenticatedLayout.jsx
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import TopNavigation from '@/Components/TopNavigation';

export default function AuthenticatedLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />

      <div className={(
        "transition-all duration-300",
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <TopNavigation />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

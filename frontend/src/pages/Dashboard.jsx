import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import { FaTimes } from "react-icons/fa";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Overlay - only active on mobile when sidebar is open */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${sidebarOpen ? "block md:hidden" : "hidden"}
        `}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar - always fixed on all breakpoints */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Hamburger menu button (mobile only, when sidebar closed) */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-gray-100 p-2 rounded shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar"
        >
          <span className="sr-only">Open sidebar</span>
          &#9776;
        </button>
      )}

      {/* Sidebar close button (mobile only, when sidebar open) */}
      {sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-gray-100 p-2 rounded shadow"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Sidebar"
        >
          <FaTimes size={18} />
        </button>
      )}

      {/* Main content. Offset for sidebar on md+ screens */}
      <main
        className={`
          flex-1 flex flex-col min-h-screen bg-[#fff] transition-all duration-300
          md:ml-80
        `}
      >
        <div className="w-[94%] max-w-5xl mx-auto min-h-[70vh] pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

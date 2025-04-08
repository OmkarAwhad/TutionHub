import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/Sidebar";

function Dashboard() {
  return (
    <div className="relative flex ">
      <Sidebar />
      <div className="w-[80%] ml-[20%] bg-[#ffffff] ">
        <div className="w-[90%] mx-auto my-10 min-h-[90vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

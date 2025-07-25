import React from "react";
import { Link } from "react-router-dom";

function AdminAttendance() {
   return (
      <div className="w-full p-4 sm:p-6">
         <div className="w-full min-h-[70vh] sm:h-[80vh] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-20">
            <Link
               to={"/dashboard/admin-attendance/mark-attendance"}
               className="w-full max-w-sm sm:max-w-none bg-medium-gray px-6 py-8 sm:px-20 sm:py-14 text-white font-extrabold text-lg sm:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               Mark Attendance
            </Link>
            <Link
               to={"/dashboard/admin-attendance/view-attendance"}
               className="w-full max-w-sm sm:max-w-none bg-medium-gray px-6 py-8 sm:px-20 sm:py-14 text-white font-extrabold text-lg sm:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               View Attendance
            </Link>
         </div>
      </div>
   );
}

export default AdminAttendance;

import React from "react";
import { Link } from "react-router-dom";

function AdminMarks() {
   return (
      <div className="w-full min-h-[70vh] sm:h-[80vh] flex items-center justify-center p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 w-full max-w-6xl">
            <Link
               to={"/dashboard/admin-marks/add-marks"}
               className="w-full sm:w-auto bg-medium-gray px-8 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               Add Marks
            </Link>
            <Link
               to={"/dashboard/admin-marks/view-marks"}
               className="w-full sm:w-auto bg-medium-gray px-8 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               Marks List
            </Link>
         </div>
      </div>
   );
}

export default AdminMarks;

import React from "react";
import { Link } from "react-router-dom";

function AdminSubjects() {
   return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-3 sm:p-4 lg:p-6">
         <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <Link
               to={"/dashboard/admin-subjects/assign-standard"}
               className="w-full bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
            >
               Assign Standard
            </Link>
            
            <Link
               to={"/dashboard/admin-subjects/create-subject"}
               className="w-full bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
            >
               Create Subject
            </Link>
            
            <Link
               to={"/dashboard/admin-subjects/subjects-list"}
               className="w-full bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
            >
               Get All Subjects
            </Link>
            
            <Link
               to={"/dashboard/admin-subjects/assign-subjects"}
               className="w-full bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
            >
               Assign Subjects
            </Link>
         </div>
      </div>
   );
}

export default AdminSubjects;

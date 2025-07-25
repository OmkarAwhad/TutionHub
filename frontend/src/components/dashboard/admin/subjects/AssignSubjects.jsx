import React from "react";
import { FaArrowLeftLong, FaBook } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function AssignSubjects() {
   const navigate = useNavigate();

   return (
      <div className="p-3 sm:p-4 lg:p-6">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaBook className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  Assign Subjects
               </h1>
            </div>
            <button
               onClick={() => navigate("/dashboard/admin-subjects")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Links Container - Responsive */}
         <div className="w-full min-h-[50vh] flex items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-20">
               <Link
                  to={"/dashboard/admin-subjects/assign-subjects/students"}
                  className="w-full sm:w-[45%] bg-medium-gray px-8 sm:px-12 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
               >
                  Students
               </Link>
               <Link
                  to={"/dashboard/admin-subjects/assign-subjects/tutors"}
                  className="w-full sm:w-[45%] bg-medium-gray px-8 sm:px-12 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-xl sm:text-2xl lg:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
               >
                  Tutors
               </Link>
            </div>
         </div>
      </div>
   );
}

export default AssignSubjects;

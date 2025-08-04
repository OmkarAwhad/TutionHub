import React from "react";
import { Link } from "react-router-dom";

function TutorHomework() {
   return (
      <div className="p-4 sm:p-6">
         <div className="min-h-[70vh] sm:h-[80vh] flex items-center">
            <div className="w-full flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-20">
               <Link
                  to={"/dashboard/tutor-homework/upload-homework"}
                  className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
               >
                  Upload Homework
               </Link>
               <Link
                  to={"/dashboard/tutor-homework/homework-list"}
                  className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
               >
                  View Homeworks
               </Link>
               <Link
                  to={"/dashboard/tutor-homework/view-submissions"}
                  className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
               >
                  View Submissions
               </Link>
            </div>
         </div>
      </div>
   );
}

export default TutorHomework;

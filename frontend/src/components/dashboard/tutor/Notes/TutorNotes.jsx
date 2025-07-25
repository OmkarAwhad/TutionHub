import React from "react";
import { Link } from "react-router-dom";

function TutorNotes() {
   return (
      <div className="w-full p-4 sm:p-6">
         <div className="w-full min-h-[70vh] sm:h-[80vh] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-20">
            <Link
               to={"/dashboard/tutor-notes/upload-note"}
               className="w-full max-w-sm sm:max-w-none bg-medium-gray px-6 py-8 sm:px-20 sm:py-14 text-white font-extrabold text-lg sm:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               Upload Note
            </Link>
            <Link
               to={"/dashboard/tutor-notes/notes-list"}
               className="w-full max-w-sm sm:max-w-none bg-medium-gray px-6 py-8 sm:px-20 sm:py-14 text-white font-extrabold text-lg sm:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
            >
               View Notes
            </Link>
         </div>
      </div>
   );
}

export default TutorNotes;

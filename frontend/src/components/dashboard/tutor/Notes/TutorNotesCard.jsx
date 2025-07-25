import React from "react";
import {
   getFileTypeDescription,
   getDownloadUrl,
} from "../../../../utils/fileUtils";
import FileDownloadButton from "../../Students/notes/FileDownloadButton";
import { RiDeleteBinLine } from "react-icons/ri";
import {
   FaUser,
   FaGraduationCap,
   FaFile,
   FaBook,
} from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

function TutorNotesCard({ note, handleDeleteClick }) {
   return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray">
         {/* Header */}
         <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex-1 pr-3 sm:pr-4">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-2 line-clamp-2">
                  {note.title}
               </h3>
               <div className="flex items-center gap-2 text-medium-gray">
                  <FaBook className="text-sm flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                     {note.subject.name} ({note.subject.code})
                  </span>
               </div>
            </div>

            <button
               onClick={() => handleDeleteClick(note)}
               className="p-2 group cursor-pointer bg-light-gray text-slate-gray hover:bg-charcoal-gray hover:text-white rounded-lg transition-colors duration-200 flex-shrink-0"
               title="Delete Note"
            >
               <RiDeleteBinLine className="text-base sm:text-lg group-hover:text-white" />
            </button>
         </div>

         {/* Info Section */}
         <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            {/* Tutor */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg">
               <FaUser className="text-charcoal-gray text-sm flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray">Tutor</p>
                  <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                     {note.tutor.name}
                  </p>
               </div>
            </div>

            {/* Date and Standard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
               <div className="flex items-center gap-2 p-2 sm:p-3 shadow rounded-lg">
                  <FaCalendarAlt className="text-medium-gray text-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Date</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray">
                        {new Date(note.uploadDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 p-2 sm:p-3 shadow rounded-lg">
                  <FaGraduationCap className="text-medium-gray text-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Standard</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                        {note.standard.standardName}
                     </p>
                  </div>
               </div>
            </div>

            {/* File Type */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg">
               <FaFile className="text-medium-gray text-sm flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray">File Type</p>
                  <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                     {getFileTypeDescription(note.file)}
                  </p>
               </div>
            </div>
         </div>

         {/* Download Button */}
         <FileDownloadButton
            fileUrl={getDownloadUrl(note.file)}
            title={note.title}
            buttonText={<span>Download Notes</span>}
            className="w-full flex items-center justify-center gap-2 sm:gap-4 cursor-pointer py-2 sm:py-3 px-3 sm:px-4 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200 text-sm sm:text-base"
         />
      </div>
   );
}

export default TutorNotesCard;

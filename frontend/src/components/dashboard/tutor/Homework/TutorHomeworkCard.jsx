import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaDownload, FaUser, FaGraduationCap, FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { getDownloadUrl } from "../../../../utils/fileUtils";

function TutorHomeworkCard({ homework, handleDeleteClick }) {
   return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray h-auto sm:h-[500px] flex flex-col">
         {/* Header - Responsive height */}
         <div className="flex justify-between items-start mb-3 sm:mb-4 min-h-[60px] sm:h-[80px]">
            <div className="flex-1 pr-3 sm:pr-4">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-2 line-clamp-2">
                  {homework.title}
               </h3>
               <div className="flex items-center gap-2 text-medium-gray">
                  <FaBook className="text-sm flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">
                     {homework.subject.name} ({homework.subject.code})
                  </span>
               </div>
            </div>

            <button
               onClick={() => handleDeleteClick(homework)}
               className="p-2 group cursor-pointer bg-light-gray text-slate-gray hover:bg-charcoal-gray hover:text-white rounded-lg transition-colors duration-200 h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] flex items-center justify-center flex-shrink-0"
               title="Delete Homework"
            >
               <RiDeleteBinLine className="text-base sm:text-lg group-hover:text-white" />
            </button>
         </div>

         {/* Info Section - Responsive spacing */}
         <div className="space-y-2 sm:space-y-3 mb-2 flex-grow">
            {/* Standard - Responsive height */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg min-h-[50px] sm:h-[60px]">
               <FaGraduationCap className="text-medium-gray flex-shrink-0 text-sm" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray">Standard</p>
                  <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                     {homework.standard.standardName}
                  </p>
               </div>
            </div>

            {/* Upload Date and Due Date - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
               <div className="flex items-center gap-2 p-2 sm:p-3 shadow rounded-lg min-h-[50px] sm:h-[60px]">
                  <FaCalendarAlt className="text-medium-gray flex-shrink-0 text-sm" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Uploaded</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                        {new Date(homework.createdAt).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 p-2 sm:p-3 shadow rounded-lg min-h-[50px] sm:h-[60px]">
                  <FaCalendarAlt className="text-medium-gray flex-shrink-0 text-sm" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Due Date</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                        {new Date(homework.dueDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>
            </div>

            {/* Due Date Status - Responsive height */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg min-h-[50px] sm:h-[60px]">
               <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                     new Date(homework.dueDate) < new Date()
                        ? "bg-charcoal-gray"
                        : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                        ? "bg-medium-gray"
                        : "bg-slate-gray"
                  }`}
               />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray">Status</p>
                  <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                     <span className="hidden sm:inline">
                        {new Date(homework.dueDate) < new Date()
                           ? "Overdue"
                           : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                           ? "Due Soon"
                           : "Active"}
                     </span>
                     <span className="sm:hidden">
                        {new Date(homework.dueDate) < new Date()
                           ? "Late"
                           : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                           ? "Soon"
                           : "OK"}
                     </span>
                  </p>
               </div>
            </div>

            {/* Description - Responsive height container */}
            <div className="flex items-start gap-2 sm:gap-3 p-2 shadow rounded-lg min-h-[50px] sm:min-h-[60px]">
               <div className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 bg-light-gray rounded-full flex-shrink-0" />
               <div className="flex-1 min-w-0 h-full">
                  <p className="text-xs text-slate-gray mb-1">Description</p>
                  <div className="overflow-hidden">
                     {homework.description ? (
                        <p className="text-xs sm:text-sm font-medium text-charcoal-gray line-clamp-2">
                           {homework.description}
                        </p>
                     ) : (
                        <p className="text-xs sm:text-sm font-medium text-slate-gray italic">
                           No description provided
                        </p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Download Button - Responsive height */}
         <div className="h-[40px] sm:h-[45px] mt-2 sm:mt-0">
            {homework.fileUrl ? (
               <a
                  href={getDownloadUrl(homework.fileUrl)}
                  download
                  title={`Download ${homework.title}`}
                  className="w-full h-full flex items-center justify-center gap-2 sm:gap-4 cursor-pointer py-2 sm:py-3 px-3 sm:px-4 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200 text-xs sm:text-sm"
               >
                  <FaDownload className="text-sm" />
                  <span>Download Homework</span>
               </a>
            ) : (
               <div className="w-full h-full flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-3 px-3 sm:px-4 bg-light-gray text-slate-gray font-medium rounded-lg text-xs sm:text-sm">
                  <span>No file available</span>
               </div>
            )}
         </div>
      </div>
   );
}

export default TutorHomeworkCard;

import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaDownload, FaUser, FaGraduationCap, FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { getDownloadUrl } from "../../../../utils/fileUtils";

function TutorHomeworkCard({ homework, handleDeleteClick }) {
   return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray">
         {/* Header */}
         <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
               <h3 className="text-lg font-semibold text-charcoal-gray mb-2 line-clamp-2">
                  {homework.title}
               </h3>
               <div className="flex items-center gap-2 text-medium-gray">
                  <FaBook className="text-sm" />
                  <span className="text-sm">
                     {homework.subject.name} ({homework.subject.code})
                  </span>
               </div>
            </div>

            <button
               onClick={() => handleDeleteClick(homework)}
               className="p-2 group cursor-pointer bg-light-gray text-slate-gray hover:bg-charcoal-gray hover:text-white rounded-lg transition-colors duration-200"
               title="Delete Homework"
            >
               <RiDeleteBinLine className="text-lg group-hover:text-white" />
            </button>
         </div>

         {/* Info Section */}
         <div className="space-y-3 mb-4">
            {/* Tutor */}
            <div className="flex items-center gap-3 p-3 shadow rounded-lg">
               <FaUser className="text-charcoal-gray" />
               <div>
                  <p className="text-xs text-slate-gray">Tutor</p>
                  <p className="text-sm font-medium text-charcoal-gray">
                     {homework.tutor.name}
                  </p>
               </div>
            </div>

            {/* Standard */}
            <div className="flex items-center gap-3 p-3 shadow rounded-lg">
               <FaGraduationCap className="text-medium-gray" />
               <div>
                  <p className="text-xs text-slate-gray">Standard</p>
                  <p className="text-sm font-medium text-charcoal-gray">
                     {homework.standard.standardName}
                  </p>
               </div>
            </div>

            {/* Upload Date and Due Date */}
            <div className="grid grid-cols-2 gap-3">
               <div className="flex items-center gap-2 p-3 shadow rounded-lg">
                  <FaCalendarAlt className="text-medium-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Uploaded</p>
                     <p className="text-sm font-medium text-charcoal-gray">
                        {new Date(homework.createdAt).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 p-3 shadow rounded-lg">
                  <FaCalendarAlt className="text-medium-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Due Date</p>
                     <p className="text-sm font-medium text-charcoal-gray">
                        {new Date(homework.dueDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>
            </div>

            {/* Due Date Status */}
            <div className="flex items-center gap-3 p-3 shadow rounded-lg">
               <div
                  className={`w-3 h-3 rounded-full ${
                     new Date(homework.dueDate) < new Date()
                        ? "bg-charcoal-gray"
                        : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                        ? "bg-medium-gray"
                        : "bg-slate-gray"
                  }`}
               />
               <div>
                  <p className="text-xs text-slate-gray">Status</p>
                  <p className="text-sm font-medium text-charcoal-gray">
                     {new Date(homework.dueDate) < new Date()
                        ? "Overdue"
                        : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                        ? "Due Soon"
                        : "Active"}
                  </p>
               </div>
            </div>

            {/* Description */}
            {homework.description && (
               <div className="flex items-start gap-3 p-3 shadow rounded-lg">
                  <div className="w-4 h-4 mt-0.5 bg-light-gray rounded-full flex-shrink-0" />
                  <div>
                     <p className="text-xs text-slate-gray">Description</p>
                     <p className="text-sm font-medium text-charcoal-gray line-clamp-2">
                        {homework.description}
                     </p>
                  </div>
               </div>
            )}
         </div>

         {/* Download Button */}
         {homework.fileUrl && (
            <a
               href={getDownloadUrl(homework.fileUrl)}
               download
               title={`Download ${homework.title}`}
               className="w-full flex items-center justify-center gap-4 cursor-pointer py-3 px-4 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
            >
               <FaDownload className="text-sm" />
               <span>Download Homework</span>
            </a>
         )}
      </div>
   );
}

export default TutorHomeworkCard;

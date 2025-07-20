import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaDownload, FaUser, FaGraduationCap, FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { getDownloadUrl } from "../../../../utils/fileUtils";

function TutorHomeworkCard({ homework, handleDeleteClick }) {
   return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray h-[500px] flex flex-col">
         {/* Header - Fixed height */}
         <div className="flex justify-between items-start mb-4 h-[80px]">
            <div className="flex-1 pr-4">
               <h3 className="text-lg font-semibold text-charcoal-gray mb-2 line-clamp-2 h-[50px]">
                  {homework.title}
               </h3>
               <div className="flex items-center gap-2 text-medium-gray h-[20px]">
                  <FaBook className="text-sm" />
                  <span className="text-sm truncate">
                     {homework.subject.name} ({homework.subject.code})
                  </span>
               </div>
            </div>

            <button
               onClick={() => handleDeleteClick(homework)}
               className="p-2 group cursor-pointer bg-light-gray text-slate-gray hover:bg-charcoal-gray hover:text-white rounded-lg transition-colors duration-200 h-[40px] w-[40px] flex items-center justify-center"
               title="Delete Homework"
            >
               <RiDeleteBinLine className="text-lg group-hover:text-white" />
            </button>
         </div>

         {/* Info Section - Fixed spacing */}
         <div className="space-y-3 mb-2 flex-grow">
            {/* Tutor - Fixed height */}
            {/* <div className="flex items-center gap-3 p-3 shadow rounded-lg h-[60px]">
               <FaUser className="text-charcoal-gray flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray h-[16px]">Tutor</p>
                  <p className="text-sm font-medium text-charcoal-gray h-[20px] truncate">
                     {homework.tutor.name}
                  </p>
               </div>
            </div> */}

            {/* Standard - Fixed height */}
            <div className="flex items-center gap-3 p-3 shadow rounded-lg h-[60px]">
               <FaGraduationCap className="text-medium-gray flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-gray h-[16px]">Standard</p>
                  <p className="text-sm font-medium text-charcoal-gray h-[20px] truncate">
                     {homework.standard.standardName}
                  </p>
               </div>
            </div>

            {/* Upload Date and Due Date - Fixed heights */}
            <div className="grid grid-cols-2 gap-3 h-[60px]">
               <div className="flex items-center gap-2 p-3 shadow rounded-lg">
                  <FaCalendarAlt className="text-medium-gray flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray h-[16px]">Uploaded</p>
                     <p className="text-sm font-medium text-charcoal-gray h-[20px] truncate">
                        {new Date(homework.createdAt).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 p-3 shadow rounded-lg">
                  <FaCalendarAlt className="text-medium-gray flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray h-[16px]">Due Date</p>
                     <p className="text-sm font-medium text-charcoal-gray h-[20px] truncate">
                        {new Date(homework.dueDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
               </div>
            </div>

            {/* Due Date Status - Fixed height */}
            <div className="flex items-center gap-3 p-3 shadow rounded-lg h-[60px]">
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
                  <p className="text-xs text-slate-gray h-[16px]">Status</p>
                  <p className="text-sm font-medium text-charcoal-gray h-[20px] truncate">
                     {new Date(homework.dueDate) < new Date()
                        ? "Overdue"
                        : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                        ? "Due Soon"
                        : "Active"}
                  </p>
               </div>
            </div>

            {/* Description - Fixed height container */}
            <div className="flex items-start gap-3 p-2 shadow rounded-lg min-h-[60px]">
               <div className="w-4 h-4 mt-0.5 bg-light-gray rounded-full flex-shrink-0" />
               <div className="flex-1 min-w-0 h-full">
                  <p className="text-xs text-slate-gray h-[16px] mb-1">Description</p>
                  <div className="h-[46px] overflow-hidden">
                     {homework.description ? (
                        <p className="text-sm font-medium text-charcoal-gray line-clamp-2">
                           {homework.description}
                        </p>
                     ) : (
                        <p className="text-sm font-medium text-slate-gray italic">
                           No description provided
                        </p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Download Button - Fixed at bottom with fixed height */}
         <div className=" h-[45px]">
            {homework.fileUrl ? (
               <a
                  href={getDownloadUrl(homework.fileUrl)}
                  download
                  title={`Download ${homework.title}`}
                  className="w-full h-full flex items-center justify-center gap-4 cursor-pointer py-3 px-4 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
               >
                  <FaDownload className="text-sm" />
                  <span>Download Homework</span>
               </a>
            ) : (
               <div className="w-full h-full flex items-center justify-center gap-4 py-3 px-4 bg-light-gray text-slate-gray font-medium rounded-lg">
                  <span>No file available</span>
               </div>
            )}
         </div>
      </div>
   );
}

export default TutorHomeworkCard;

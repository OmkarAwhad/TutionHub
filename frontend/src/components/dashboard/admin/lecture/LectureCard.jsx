import React from "react";
import { format } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
   FaEye,
   FaClock,
   FaUser,
   FaGraduationCap,
   FaClipboardList,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditLecture } from "../../../../slices/lecture.slice";
import { setMarkLecture } from "../../../../slices/attendance.slice";

function LectureCard({ lecture, isPastDate, handleDeleteClick }) {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray">
         <div className="space-y-3 sm:space-y-4 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
               <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-charcoal-gray truncate">
                     {lecture.subject?.name}
                  </h3>
                  <p className="text-sm sm:text-base text-medium-gray font-medium">
                     {format(new Date(lecture.date), "PPP")}
                  </p>
               </div>
               <span
                  className={`px-2 py-1 sm:px-3 sm:py-1 shadow rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                     isPastDate(lecture.date)
                        ? "bg-slate-gray text-white"
                        : "bg-charcoal-gray/20 text-charcoal-gray"
                  }`}
               >
                  {isPastDate(lecture.date) ? "Past" : "Upcoming"}
               </span>
            </div>

            {/* Info Section */}
            <div className="space-y-2 sm:space-y-3">
               <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <FaClock className="text-medium-gray flex-shrink-0" />
                  <span className="text-charcoal-gray font-medium">
                     {lecture.time}
                  </span>
               </div>

               <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <FaUser className="text-medium-gray flex-shrink-0" />
                  <span className="text-charcoal-gray font-medium truncate">
                     {lecture.tutor?.name}
                  </span>
               </div>

               <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <FaGraduationCap className="text-medium-gray flex-shrink-0" />
                  <span className="text-charcoal-gray font-medium truncate">
                     {lecture.standard?.standardName}
                  </span>
               </div>

               <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <FaClipboardList className="text-medium-gray mt-0.5 flex-shrink-0" />
                  <span className="text-charcoal-gray font-medium">
                     {lecture.description}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-light-gray">
               {!isPastDate(lecture.date) ? (
                  <>
                     <button
                        onClick={() => {
                           dispatch(setEditLecture(lecture));
                           navigate("/dashboard/admin-lecture/edit-lecture");
                        }}
                        className="flex-1 py-2 sm:py-2.5 rounded-lg bg-charcoal-gray text-white text-xs sm:text-sm font-medium hover:bg-medium-gray transition-all duration-200 flex gap-2 items-center justify-center"
                     >
                        <MdModeEdit />
                        Edit
                     </button>
                     <button
                        onClick={() => handleDeleteClick(lecture)}
                        className="flex-1 py-2 sm:py-2.5 rounded-lg bg-light-gray text-slate-gray text-xs sm:text-sm font-medium hover:bg-charcoal-gray hover:text-white transition-all duration-200 flex gap-2 items-center justify-center"
                     >
                        <RiDeleteBin6Line />
                        Delete
                     </button>
                  </>
               ) : (
                  <>
                     <button
                        onClick={() => {
                           dispatch(setMarkLecture(lecture));
                           navigate(
                              `/dashboard/admin-attendance/view-attendance/${lecture._id}`
                           );
                        }}
                        className="flex-1 py-2 sm:py-2.5 rounded-lg bg-charcoal-gray text-white text-xs sm:text-sm font-medium hover:bg-medium-gray transition-all duration-200 flex gap-2 items-center justify-center"
                     >
                        <FaEye />
                        <span className="hidden sm:inline">View Attendance</span>
                        <span className="sm:hidden">View</span>
                     </button>
                     <button
                        onClick={() => handleDeleteClick(lecture)}
                        className="flex-1 group py-2 sm:py-2.5 rounded-lg bg-light-gray text-slate-gray text-xs sm:text-sm font-medium hover:bg-charcoal-gray hover:text-white transition-all duration-200 flex gap-2 items-center justify-center"
                     >
                        <RiDeleteBin6Line className="group-hover:text-white" />
                        <span className="group-hover:text-white">Delete</span>
                     </button>
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

export default LectureCard;

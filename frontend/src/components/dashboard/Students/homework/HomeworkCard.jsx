import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFileTypeDescription } from "../../../../utils/fileUtils";
import { FaBook, FaUser, FaFile, FaClock } from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import EnhancedDownloader from "./EnhancedDownloader";
import { HWSubmittedByStud } from "../../../../services/operations/homework.service";
import { FiFileText } from "react-icons/fi";

function HomeworkCard({ item }) {
   const navigate = useNavigate();
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();

   const handleCardClick = () => {
      navigate("/dashboard/get-homework/view-homework", {
         state: { homework: item },
      });
   };

   const [submission, setSubmission] = useState(null);

   useEffect(() => {
      const fetchSubmission = async () => {
         try {
            const response = await dispatch(HWSubmittedByStud(token));
            const submissions = response?.homework || [];
            const submittedHomework = submissions.find((sub) => sub._id === item._id);
            if (submittedHomework) {
               setSubmission(submittedHomework);
            }
         } catch (error) {
            console.error("Error fetching submission:", error);
         }
      };

      fetchSubmission();
   }, [dispatch, token, item._id]);

   // Check if homework is overdue
   const isOverdue = new Date(item.dueDate) < new Date();
   const isDueSoon =
      new Date(item.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000 && !isOverdue;

   // Check submission status
   const isSubmitted = submission !== null;

   return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray group h-auto sm:h-[420px] flex flex-col">
         {/* Card Content */}
         <div className="flex-1 flex flex-col cursor-pointer" onClick={handleCardClick}>
            {/* Title - Responsive height */}
            <div className="mb-3 sm:mb-4">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray line-clamp-2">
                  {item.title}
               </h3>
            </div>

            {/* Subject - Responsive height */}
            <div className="flex items-center gap-2 text-medium-gray mb-3 sm:mb-4">
               <FaBook className="text-sm flex-shrink-0" />
               <span className="text-xs sm:text-sm truncate">
                  {item.subject.name} ({item.subject.code})
               </span>
            </div>

            {/* Info Grid - Responsive layout */}
            <div className="space-y-2 sm:space-y-3 flex-1">
               {/* Tutor - Responsive height */}
               <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg">
                  <FaUser className="text-charcoal-gray flex-shrink-0 text-sm" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Tutor</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                        {item.tutor.name}
                     </p>
                  </div>
               </div>

               {/* Due Date - Responsive height */}
               <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg">
                  <FaClock className="text-medium-gray flex-shrink-0 text-sm" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs text-slate-gray">Due Date</p>
                     <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                        {new Date(item.dueDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </p>
                  </div>
                  {/* Status Badge - Responsive */}
                  <div
                     className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        isOverdue
                           ? "bg-charcoal-gray text-white"
                           : isDueSoon
                           ? "bg-medium-gray text-white"
                           : "bg-slate-gray text-white"
                     }`}
                  >
                     <span className="hidden sm:inline">
                        {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Active"}
                     </span>
                     <span className="sm:hidden">
                        {isOverdue ? "Late" : isDueSoon ? "Soon" : "OK"}
                     </span>
                  </div>
               </div>

               {/* Description or File Type - Responsive height */}
               <div className="min-h-[60px] sm:min-h-[80px]">
                  {item.description ? (
                     <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg h-full">
                        <FiFileText className="text-medium-gray mt-0.5 flex-shrink-0 text-sm" />
                        <div className="flex-1 min-w-0 h-full">
                           <p className="text-xs text-slate-gray mb-1">Description</p>
                           <div className="overflow-hidden">
                              <p className="text-xs sm:text-sm font-medium text-charcoal-gray line-clamp-2 sm:line-clamp-2">
                                 {item.description}
                              </p>
                           </div>
                        </div>
                     </div>
                  ) : item.fileUrl ? (
                     <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 shadow rounded-lg h-full">
                        <FaFile className="text-medium-gray flex-shrink-0 text-sm" />
                        <div className="flex-1 min-w-0">
                           <p className="text-xs text-slate-gray">File Type</p>
                           <p className="text-xs sm:text-sm font-medium text-charcoal-gray truncate">
                              {getFileTypeDescription(item.fileUrl)}
                           </p>
                        </div>
                     </div>
                  ) : (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-slate-gray italic">No additional details</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Submission Status - Fixed at bottom with responsive height */}
            <div className="text-center mt-3 sm:mt-4 flex items-center justify-center">
               {isSubmitted ? (
                  <div className="flex bg-slate-gray h-[28px] sm:h-[32px] w-fit mx-auto px-3 sm:px-4 text-white rounded-md items-center justify-center gap-2">
                     <FaCheckCircle className="text-xs sm:text-sm" />
                     <p className="text-xs font-medium">Submitted</p>
                  </div>
               ) : (
                  <div className="flex border border-slate-gray items-center h-[28px] sm:h-[32px] w-fit mx-auto px-3 sm:px-4 text-charcoal-gray rounded-md justify-center gap-2">
                     <FaTimesCircle className="text-xs sm:text-sm" />
                     <p className="text-xs font-medium">Not Submitted</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default HomeworkCard;

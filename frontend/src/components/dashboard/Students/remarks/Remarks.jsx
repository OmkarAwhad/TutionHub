import React, { useEffect, useState } from "react";
import { viewRemarks } from "../../../../services/operations/remarks.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaCommentDots, FaUser, FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

function Remarks() {
   const [remarks, setRemarks] = useState([]);
   const [loading, setLoading] = useState(true);
   const { token } = useSelector((state) => state.auth);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchRemarks = async () => {
         try {
            setLoading(true);
            const data = await viewRemarks(token);
            setRemarks(data);
         } catch (error) {
            console.error("Error fetching remarks:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchRemarks();
   }, [token]);

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
               <FaCommentDots className="text-charcoal-gray text-lg sm:text-xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Remarks</h1>
            </div>

            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Remarks Count */}
         <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-medium-gray font-medium">
               Total remarks: <span className="text-charcoal-gray font-semibold">{remarks.length}</span>
            </p>
         </div>

         {/* Remarks List */}
         {remarks.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
               {remarks.map((remark, index) => (
                  <div
                     key={remark._id}
                     className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200"
                     style={{
                        animationDelay: `${index * 0.1}s`,
                     }}
                  >
                     {/* Subject */}
                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <div className="flex items-center gap-2">
                           <FaBook className="text-charcoal-gray text-sm flex-shrink-0" />
                           <span className="text-xs sm:text-sm text-medium-gray font-medium">Subject:</span>
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-charcoal-gray pl-6 sm:pl-0">
                           {remark.subject.name}
                        </span>
                     </div>

                     {/* Remark */}
                     <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm text-medium-gray font-medium mb-2">Remark:</p>
                        <div className="bg-light-gray p-3 sm:p-4 rounded-lg">
                           <p className="text-sm sm:text-base text-charcoal-gray font-medium leading-relaxed">
                              {remark.remark}
                           </p>
                        </div>
                     </div>

                     {/* Tutor and Date */}
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                           <FaUser className="text-medium-gray flex-shrink-0" />
                           <span className="text-medium-gray">Tutor:</span>
                           <span className="font-medium text-charcoal-gray">
                              {remark.tutor.name}
                           </span>
                        </div>

                        <div className="flex items-center gap-2">
                           <FaCalendarAlt className="text-medium-gray flex-shrink-0" />
                           <span className="text-slate-gray">
                              {new Date(remark.createdAt).toLocaleDateString("en-GB", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaCommentDots className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2">No remarks available</p>
               <p className="text-slate-gray text-sm sm:text-base">Your remarks will appear here when added by tutors</p>
            </div>
         )}
      </div>
   );
}

export default Remarks;

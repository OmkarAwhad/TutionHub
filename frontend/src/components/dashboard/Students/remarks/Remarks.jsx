import React, { useEffect, useState } from "react";
import { viewRemarks } from "../../../../services/operations/remarks.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaCommentDots, FaUser, FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

function Remarks() {
   const [remarks, setRemarks] = useState([]);
   const { token } = useSelector((state) => state.auth);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchRemarks = async () => {
         try {
            const data = await viewRemarks(token);
            setRemarks(data);
         } catch (error) {
            console.error("Error fetching remarks:", error);
         }
      };

      fetchRemarks();
   }, [token]);

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <FaCommentDots className="text-charcoal-gray text-xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Remarks</h1>
            </div>

            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Remarks List */}
         {remarks.length > 0 ? (
            <div className="space-y-4">
               {remarks.map((remark, index) => (
                  <div
                     key={remark._id}
                     className="bg-white p-6 rounded-lg shadow-md border border-light-gray"
                     style={{
                        animationDelay: `${index * 0.1}s`,
                     }}
                  >
                     {/* Subject */}
                     <div className="flex items-center gap-2 mb-3">
                        <FaBook className="text-charcoal-gray text-sm" />
                        <span className="text-sm text-medium-gray font-medium">Subject:</span>
                        <span className="text-sm font-semibold text-charcoal-gray">
                           {remark.subject.name}
                        </span>
                     </div>

                     {/* Remark */}
                     <div className="mb-3">
                        <p className="text-sm text-medium-gray font-medium mb-1">Remark:</p>
                        <p className="text-charcoal-gray font-medium">
                           {remark.remark}
                        </p>
                     </div>

                     {/* Tutor and Date */}
                     <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <FaUser className="text-medium-gray" />
                           <span className="text-medium-gray">Tutor:</span>
                           <span className="font-medium text-charcoal-gray">
                              {remark.tutor.name}
                           </span>
                        </div>

                        <div className="flex items-center gap-2">
                           <FaCalendarAlt className="text-medium-gray" />
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
            <div className="text-center py-12">
               <p className="text-medium-gray text-xl">No remarks available</p>
            </div>
         )}
      </div>
   );
}

export default Remarks;

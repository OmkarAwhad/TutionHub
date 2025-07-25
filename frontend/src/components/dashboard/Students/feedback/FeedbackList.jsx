import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { myFeedbacks } from "../../../../services/operations/feedback.service";
import { FaArrowLeftLong, FaList } from "react-icons/fa6";
import { FaCalendarAlt, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FeedbackList() {
   const [feedbacks, setFeedbacks] = useState([]);
   const [loading, setLoading] = useState(true);

   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      const fetchFeedbacks = async () => {
         try {
            setLoading(true);
            const result = await dispatch(myFeedbacks(token));
            if (result) {
               setFeedbacks(result);
            }
         } catch (error) {
            toast.error("Failed to fetch feedbacks");
         } finally {
            setLoading(false);
         }
      };

      fetchFeedbacks();
   }, [dispatch, token]);

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
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaList className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">My Feedback History</h1>
            </div>
            
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Feedback Count */}
         <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-medium-gray font-medium">
               Total feedback submitted: <span className="text-charcoal-gray font-semibold">{feedbacks.length}</span>
            </p>
         </div>

         {/* Feedback List */}
         {feedbacks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
               <FaComment className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2">No feedback submitted yet</p>
               <p className="text-slate-gray text-sm sm:text-base">Your feedback history will appear here</p>
            </div>
         ) : (
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
               {feedbacks.map((feedback, index) => (
                  <div
                     key={feedback._id}
                     className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200"
                     style={{
                        animationDelay: `${index * 0.1}s`,
                     }}
                  >
                     {/* Feedback Header */}
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2">
                           <FaComment className="text-charcoal-gray text-base sm:text-lg" />
                           <span className="text-xs sm:text-sm font-medium text-charcoal-gray">
                              Feedback #{feedbacks.length - index}
                           </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-gray">
                           <FaCalendarAlt className="text-xs" />
                           <span>
                              {new Date(feedback.createdAt).toLocaleDateString("en-GB", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </span>
                        </div>
                     </div>

                     {/* Feedback Content */}
                     <div className="mb-3 sm:mb-4">
                        <p className="text-charcoal-gray leading-relaxed text-sm sm:text-base">
                           {feedback.comment}
                        </p>
                     </div>

                     {/* Feedback Meta */}
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 sm:pt-4 border-t border-light-gray">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                              feedback.isAnonymous ? 'bg-medium-gray' : 'bg-charcoal-gray'
                           }`}></div>
                           <span className="text-xs sm:text-sm text-slate-gray">
                              {feedback.isAnonymous ? "Anonymous" : "Named"} Submission
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default FeedbackList;

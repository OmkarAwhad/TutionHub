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
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaList className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">My Feedback History</h1>
            </div>
            
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Feedback Count */}
         <div className="mb-6">
            <p className="text-medium-gray font-medium">
               Total feedback submitted: <span className="text-charcoal-gray font-semibold">{feedbacks.length}</span>
            </p>
         </div>

         {/* Feedback List */}
         {feedbacks.length === 0 ? (
            <div className="text-center py-12">
               <FaComment className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl mb-2">No feedback submitted yet</p>
               <p className="text-slate-gray">Your feedback history will appear here</p>
            </div>
         ) : (
            <div className="max-w-4xl mx-auto space-y-4">
               {feedbacks.map((feedback, index) => (
                  <div
                     key={feedback._id}
                     className="bg-white p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200"
                     style={{
                        animationDelay: `${index * 0.1}s`,
                     }}
                  >
                     {/* Feedback Header */}
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <FaComment className="text-charcoal-gray text-lg" />
                           <span className="text-sm font-medium text-charcoal-gray">
                              Feedback #{feedbacks.length - index}
                           </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-gray">
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
                     <div className="mb-4">
                        <p className="text-charcoal-gray leading-relaxed">
                           {feedback.comment}
                        </p>
                     </div>

                     {/* Feedback Meta */}
                     <div className="flex items-center justify-between pt-4 border-t border-light-gray">
                        <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 rounded-full ${
                              feedback.isAnonymous ? 'bg-medium-gray' : 'bg-charcoal-gray'
                           }`}></div>
                           <span className="text-sm text-slate-gray">
                              {feedback.isAnonymous ? "Anonymous" : "Named"} Submission
                           </span>
                        </div>
                        
                        {/* <div className="text-xs text-slate-gray">
                           Submitted {new Date(feedback.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                           })}
                        </div> */}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default FeedbackList;

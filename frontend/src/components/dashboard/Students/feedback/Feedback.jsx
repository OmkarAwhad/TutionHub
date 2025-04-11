import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { makeAFeedback, myFeedbacks } from "../../../../services/operations/feedback.service";

function Feedback() {
   const [activeView, setActiveView] = useState(null);
   const [feedbacks, setFeedbacks] = useState([]);

   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const submitHandler = async (data) => {
      try {
         dispatch(makeAFeedback(data, token));
      } catch (error) {
         toast.error("Failed to submit feedback");
      }
   };

   const fetchFeedbacks = async () => {
      try {
         const result = await dispatch(myFeedbacks(token))
         // console.log(result)
         setFeedbacks(result);
      } catch (error) {
         toast.error("Failed to fetch feedbacks");
      }
   };

   const handleViewClick = (view) => {
      setActiveView(view);
      if (view === "list") {
         fetchFeedbacks();
      }
   };

   return (
      <div className="w-full p-6">
         {!activeView ? (
            <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh] animate-fade-in">
               <button
                  onClick={() => handleViewClick("form")}
                  className="bg-medium-gray text-white px-8 py-4 rounded-sm text-xl w-full max-w-md hover:bg-charcoal-gray transition-all transform hover:scale-[103%] cursor-pointer"
               >
                  Submit a Feedback
               </button>
               <button
                  onClick={() => handleViewClick("list")}
                  className="bg-medium-gray text-white px-8 py-4 rounded-sm text-xl w-full max-w-md hover:bg-charcoal-gray transition-all transform hover:scale-[103%] cursor-pointer"
               >
                  View all Feedbacks
               </button>
            </div>
         ) : activeView === "form" ? (
            <div className="bg-white shadow shadow-slate-gray p-6 rounded-md w-full max-w-2xl mx-auto animate-slide-in">
               <h1 className="pb-5 pt-5 text-medium-gray logo-text text-center font-extrabold text-4xl">
                  Submit Feedback
               </h1>
               <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="flex flex-col gap-4"
               >
                  <label>
                     <p className="pl-2 text-base text-medium-gray pb-1">
                        Comment
                     </p>
                     <textarea
                        placeholder="Enter your feedback here..."
                        {...register("comment", {
                           required: true,
                        })}
                        className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md min-h-[150px] resize-y"
                     />
                     {errors.comment && (
                        <p className="text-red-200 text-sm ml-2">
                           Comment is required
                        </p>
                     )}
                  </label>
                  <label className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        {...register("isAnonymous")}
                        className="w-4 h-4"
                     />
                     <span className="text-medium-gray">
                        Submit anonymously
                     </span>
                  </label>
                  <div className="flex gap-4">
                     <button
                        className="bg-slate-gray text-white w-fit px-6 py-2 rounded-sm mt-4 hover:bg-slate-700 transition-all transform hover:scale-105"
                        type="submit"
                     >
                        Submit Feedback
                     </button>
                     <button
                        onClick={() => setActiveView(null)}
                        className="bg-gray-300 text-slate-gray w-fit px-6 py-2 rounded-sm mt-4 hover:bg-gray-400 transition-all transform hover:scale-105"
                        type="button"
                     >
                        Back
                     </button>
                  </div>
               </form>
            </div>
         ) : (
            <div className="bg-white shadow shadow-slate-gray p-6 rounded-md w-full max-w-4xl mx-auto animate-slide-in">
               <div className="flex justify-between items-center mb-6">
                  <h1 className="text-medium-gray logo-text font-extrabold text-4xl">
                     All Feedbacks
                  </h1>
                  <button
                     onClick={() => setActiveView(null)}
                     className="bg-gray-300 text-slate-gray px-4 py-2 rounded-sm hover:bg-gray-400 hover:text-white transition-all transform hover:scale-105"
                  >
                     Back
                  </button>
               </div>
               <div className="space-y-4">
                  {feedbacks.length === 0 ? (
                     <p className="text-center text-medium-gray text-lg">
                        No feedbacks found.
                     </p>
                  ) : (
                     feedbacks.map((feedback, index) => (
                        <div
                           key={feedback._id}
                           className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-all transform hover:scale-[1.01] animate-fade-in"
                           style={{
                              animationDelay: `${index * 0.1}s`,
                           }}
                        >
                           <p className="text-medium-gray mb-2">
                              {feedback.comment}
                           </p>
                           <div className="flex justify-between text-sm text-gray-500">
                              <span>
                                 Anonymous: {feedback.isAnonymous ? "Yes" : "No"}
                              </span>
                              <span>
                                 {new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

export default Feedback;

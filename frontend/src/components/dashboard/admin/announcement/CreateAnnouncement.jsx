import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createAnnouncementService } from "../../../../services/operations/announcement.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service"; // Add this import
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaBullhorn, FaMessage, FaUsers, FaBook, FaGraduationCap } from "react-icons/fa6";
import toast from "react-hot-toast";

function CreateAnnouncement() {
   const { token } = useSelector((state) => state.auth);
   const [subjects, setSubjects] = useState([]);
   const [standards, setStandards] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      reset,
   } = useForm({
      defaultValues: {
         target: "All"
      }
   });

   // Watch the target field to show/hide standards
   const selectedTarget = watch("target");
   const showStandards = selectedTarget === "Students" || selectedTarget === "All";

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [subjectsResult, standardsResult] = await Promise.all([
               dispatch(getAllSubjects(token)),
               dispatch(getAllStandards(token))
            ]);
            setSubjects(subjectsResult || []);
            setStandards(standardsResult || []);
         } catch (error) {
            toast.error("Failed to fetch required data");
            console.error("Error fetching data:", error);
         }
      };
      fetchData();
   }, [dispatch, token]);

   const onSubmit = async (data) => {
      try {
         setIsSubmitting(true);
         const payload = {
            message: data.message,
            target: data.target,
            subject: data.subject || null,
            standard: (showStandards && data.standard) ? data.standard : null,
         };
         
         const result = await dispatch(createAnnouncementService(payload, token));
         if (result) {
            toast.success("Announcement created successfully!");
            reset();
            navigate("/dashboard/admin-announcement");
         }
      } catch (error) {
         toast.error(error?.message || "Failed to create announcement");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaBullhorn className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Create Announcement</h1>
            </div>
            
            <button
               onClick={() => navigate("/dashboard/admin-announcement")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Form */}
         <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray">
               {/* <div className="mb-6">
                  <h2 className="text-xl font-semibold text-charcoal-gray mb-2">Announcement Details</h2>
                  <p className="text-medium-gray">Create and send announcements to specific user groups</p>
               </div> */}

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Message Field */}
                  <div>
                     <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                        <FaMessage className="text-medium-gray" />
                        Message
                     </label>
                     <textarea
                        {...register("message", { 
                           required: "Message is required",
                           minLength: {
                              value: 10,
                              message: "Message must be at least 10 characters long"
                           }
                        })}
                        placeholder="Enter your announcement message..."
                        className={`w-full px-4 py-3 border rounded-lg text-charcoal-gray placeholder-slate-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 resize-y min-h-[120px] ${
                           errors.message 
                              ? "border-red-400 focus:border-red-400" 
                              : "border-light-gray"
                        }`}
                     />
                     {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.message.message}
                        </p>
                     )}
                  </div>

                  {/* Target Audience Field */}
                  <div>
                     <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                        <FaUsers className="text-medium-gray" />
                        Target Audience
                     </label>
                     <select
                        {...register("target", { required: "Target audience is required" })}
                        className={`w-full px-4 py-3 border rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 bg-white ${
                           errors.target 
                              ? "border-red-400 focus:border-red-400" 
                              : "border-light-gray"
                        }`}
                     >
                        <option value="All">All Users</option>
                        <option value="Students">Students Only</option>
                        <option value="Tutors">Tutors Only</option>
                     </select>
                     {errors.target && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.target.message}
                        </p>
                     )}
                  </div>

                  {/* Standards Field (Conditional) */}
                  {showStandards && (
                     <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                           <FaGraduationCap className="text-medium-gray" />
                           Standard (Optional)
                        </label>
                        <select
                           {...register("standard")}
                           className="w-full px-4 py-3 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 bg-white"
                        >
                           <option value="">All Standards</option>
                           {standards.map((std) => (
                              <option key={std._id} value={std._id}>
                                 {std.standardName}
                              </option>
                           ))}
                        </select>
                        {/* <p className="text-xs text-slate-gray mt-1">
                           Select a specific standard to target, or leave blank for all standards
                        </p> */}
                     </div>
                  )}

                  {/* Subject Field */}
                  <div>
                     <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                        <FaBook className="text-medium-gray" />
                        Subject (Optional)
                     </label>
                     <select
                        {...register("subject")}
                        className="w-full px-4 py-3 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 bg-white"
                     >
                        <option value="">All Subjects</option>
                        {subjects.map((subj) => (
                           <option key={subj._id} value={subj._id}>
                              {subj.name} ({subj.code})
                           </option>
                        ))}
                     </select>
                     {/* <p className="text-xs text-slate-gray mt-1">
                        Select a specific subject to target, or leave blank for all subjects
                     </p> */}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-4 pt-4">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${
                           isSubmitting
                              ? "bg-light-gray text-slate-gray cursor-not-allowed"
                              : "bg-charcoal-gray text-white hover:bg-medium-gray"
                        }`}
                     >
                        <FaBullhorn className="text-sm" />
                        {isSubmitting ? "Creating..." : "Create Announcement"}
                     </button>

                     <button
                        type="button"
                        onClick={() => navigate("/dashboard/admin-announcement")}
                        className="px-6 py-3 bg-light-gray text-charcoal-gray font-medium rounded-lg hover:bg-slate-gray hover:text-white transition-colors duration-200"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default CreateAnnouncement;

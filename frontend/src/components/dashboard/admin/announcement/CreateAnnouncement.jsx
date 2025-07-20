import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createAnnouncementService } from "../../../../services/operations/announcement.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaBullhorn, FaMessage, FaUsers, FaBook } from "react-icons/fa6";
import toast from "react-hot-toast";

function CreateAnnouncement() {
   const { token } = useSelector((state) => state.auth);
   const [subjects, setSubjects] = useState([]);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm();

   useEffect(() => {
      const fetchSubjects = async () => {
         try {
            const result = await dispatch(getAllSubjects(token));
            setSubjects(result || []);
         } catch (error) {
            if (error?.message) {
               toast.error(error.message);
            } else {
               toast.error("Failed to fetch subjects");
            }
         }
      };
      fetchSubjects();
   }, [dispatch, token]);

   const onSubmit = async (data) => {
      try {
         const payload = {
            message: data.message,
            target: data.target,
            subject: data.subject || null,
         };
         const result = await dispatch(
            createAnnouncementService(payload, token)
         );
         if (result) {
            reset();
            navigate("/dashboard/admin-announcement");
         }
      } catch (error) {
         if (error?.message) {
            toast.error(error.message);
         } else {
            toast.error("Failed to create announcement");
         }
      }
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <FaBullhorn className="text-charcoal-gray text-2xl" />
               <h3 className="text-3xl font-semibold text-charcoal-gray">
                  Create Announcement
               </h3>
            </div>
            <button
               onClick={() => navigate(-1)}
               className="flex group items-center gap-2 cursor-pointer text-charcoal-gray px-4 py-2 bg-light-gray hover:bg-gray-800  hover:text-white rounded-xl transition-all duration-200"
            >
               <FaArrowLeftLong className="text-lg " />
               <span className=" ">Back</span>
            </button>
         </div>

         <div className="bg-white border border-light-gray shadow-lg p-8 rounded-2xl w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               {/* Message Field */}
               <div>
                  <label className="flex items-center gap-2 text-charcoal-gray font-medium mb-2">
                     <FaMessage className="text-medium-gray" />
                     Message
                  </label>
                  <textarea
                     {...register("message", { required: true })}
                     placeholder="Enter your announcement message..."
                     className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:outline-none focus:border-charcoal-gray transition-all duration-200 resize-vertical"
                     rows={4}
                     style={{
                        minHeight: "100px",
                        maxHeight: "200px",
                     }}
                  />
                  {errors.message && (
                     <p className="text-red-300 text-sm mt-1 ml-2">
                        Message is required
                     </p>
                  )}
               </div>

               {/* Target Field */}
               <div>
                  <label className="flex items-center gap-2 text-charcoal-gray font-medium mb-2">
                     <FaUsers className="text-medium-gray" />
                     Target Audience
                  </label>
                  <select
                     {...register("target", { required: true })}
                     className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:outline-none focus:border-charcoal-gray transition-all duration-200 bg-white"
                     defaultValue="All"
                  >
                     <option value="All">All Users</option>
                     <option value="Students">Students Only</option>
                     <option value="Tutors">Tutors Only</option>
                  </select>
                  {errors.target && (
                     <p className="text-charcoal-gray text-sm mt-1 ml-2">
                        Target audience is required
                     </p>
                  )}
               </div>

               {/* Subject Field */}
               <div>
                  <label className="flex items-center gap-2 text-charcoal-gray font-medium mb-2">
                     <FaBook className="text-medium-gray" />
                     Subject <span className="text-slate-gray text-sm">(optional)</span>
                  </label>
                  <select
                     {...register("subject")}
                     className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:outline-none focus:border-charcoal-gray transition-all duration-200 bg-white"
                     defaultValue=""
                  >
                     <option value="">No specific subject</option>
                     {subjects.map((subj) => (
                        <option key={subj._id} value={subj._id}>
                           {subj.name}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Submit Button */}
               <div className="flex justify-center pt-4">
                  <button
                     className="flex items-center gap-2 bg-charcoal-gray hover:bg-medium-gray text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                     type="submit"
                  >
                     <FaBullhorn className="text-sm" />
                     Create Announcement
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default CreateAnnouncement;

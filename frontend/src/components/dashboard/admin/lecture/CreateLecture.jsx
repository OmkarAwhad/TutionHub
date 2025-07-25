import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createLecture } from "../../../../services/operations/lecture.service";
import { getAllUsersList } from "../../../../services/operations/users.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { toast } from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CreateLecture() {
   const [loading, setLoading] = useState(false);
   const [standardsList, setStandardsList] = useState(null);
   const [tutors, setTutors] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const dispatch = useDispatch();
   const { token } = useSelector((state) => state.auth);
   const [fromTime, setFromTime] = useState({
      hours: "",
      minutes: "",
      period: "AM",
   });
   const [toTime, setToTime] = useState({
      hours: "",
      minutes: "",
      period: "AM",
   });

   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
   } = useForm();

   useEffect(() => {
      const fetchStandards = async () => {
         try {
            const response = await dispatch(getAllStandards(token));
            if (response) {
               setStandardsList(response);
            }
         } catch (error) {
            console.error("Error fetching standards:", error);
            toast.error("Failed to fetch standards");
         }
      };
      fetchStandards();
   }, [dispatch, token]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            let tutorsData = await dispatch(getAllUsersList(token));
            if (tutorsData) {
               tutorsData = tutorsData.filter((user) => user.role === "Tutor");
               setTutors(tutorsData);
            }
            const subjectsData = await dispatch(getAllSubjects(token));
            setSubjects(subjectsData);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };
      fetchData();
   }, [dispatch, token]);

   const handleTimeChange = (type, field, value) => {
      if (type === "from") {
         setFromTime((prev) => ({ ...prev, [field]: value }));
      } else {
         setToTime((prev) => ({ ...prev, [field]: value }));
      }
   };

   const submitHandler = async (data) => {
      try {
         setLoading(true);
         // Combine time values into a single string
         const timeFrom = `${fromTime.hours}:${fromTime.minutes} ${fromTime.period}`;
         const timeTo = `${toTime.hours}:${toTime.minutes} ${toTime.period}`;
         const timeString = `${timeFrom} to ${timeTo}`;

         const result = await dispatch(
            createLecture({ ...data, time: timeString }, token)
         );
         if (result) {
            toast.success("Lecture created successfully");
            reset();
            setFromTime({ hours: "", minutes: "", period: "AM" });
            setToTime({ hours: "", minutes: "", period: "AM" });
            navigate(-1);
         }
      } catch (error) {
         console.error("Error creating lecture:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full mx-auto flex flex-col gap-y-6 sm:gap-y-10 p-4 sm:p-6">
         <div className="bg-white shadow shadow-slate-gray p-4 sm:p-6 rounded-md w-full max-w-2xl mx-auto animate-slide-in relative">
            <IoChevronBack
               className="absolute top-4 left-4 sm:top-6 sm:left-6 text-medium-gray text-xl sm:text-2xl cursor-pointer hover:text-charcoal-gray transition-colors"
               onClick={() => navigate(-1)}
            />
            <h1 className="pb-4 sm:pb-5 pt-8 sm:pt-5 text-medium-gray logo-text text-center font-extrabold text-2xl sm:text-4xl">
               Create Lecture
            </h1>
            <form
               onSubmit={handleSubmit(submitHandler)}
               className="flex flex-col gap-3 sm:gap-4 w-full"
            >
               <label className="w-full">
                  <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                     Date
                  </p>
                  <input
                     type="date"
                     {...register("date", {
                        required: true,
                     })}
                     className="px-3 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md cursor-pointer text-sm sm:text-base"
                     onClick={(e) => e.target.showPicker()}
                  />
                  {errors.date && (
                     <p className="text-red-500 text-xs sm:text-sm ml-2 mt-1">
                        Date is required
                     </p>
                  )}
               </label>

               <div className="flex flex-col lg:flex-row lg:gap-14 gap-3 sm:gap-4 w-full">
                  <label className="w-full lg:w-1/2">
                     <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                        From
                     </p>
                     <div className="flex gap-2">
                        <input
                           type="number"
                           name="hours"
                           min="1"
                           max="12"
                           placeholder="HH"
                           value={fromTime.hours}
                           onChange={(e) =>
                              handleTimeChange("from", "hours", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        />
                        <input
                           type="number"
                           name="minutes"
                           min="0"
                           max="59"
                           placeholder="MM"
                           value={fromTime.minutes}
                           onChange={(e) =>
                              handleTimeChange("from", "minutes", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        />
                        <select
                           name="period"
                           value={fromTime.period}
                           onChange={(e) =>
                              handleTimeChange("from", "period", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        >
                           <option value="AM">AM</option>
                           <option value="PM">PM</option>
                        </select>
                     </div>
                  </label>

                  <label className="w-full lg:w-1/2">
                     <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                        To
                     </p>
                     <div className="flex gap-2">
                        <input
                           type="number"
                           name="hours"
                           min="1"
                           max="12"
                           placeholder="HH"
                           value={toTime.hours}
                           onChange={(e) =>
                              handleTimeChange("to", "hours", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        />
                        <input
                           type="number"
                           name="minutes"
                           min="0"
                           max="59"
                           placeholder="MM"
                           value={toTime.minutes}
                           onChange={(e) =>
                              handleTimeChange("to", "minutes", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        />
                        <select
                           name="period"
                           value={toTime.period}
                           onChange={(e) =>
                              handleTimeChange("to", "period", e.target.value)
                           }
                           className="px-2 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                        >
                           <option value="AM">AM</option>
                           <option value="PM">PM</option>
                        </select>
                     </div>
                  </label>
               </div>

               <label>
                  <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                     Tutor
                  </p>
                  <select
                     {...register("tutor", { required: true })}
                     className="px-3 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                  >
                     <option value="">Select Tutor</option>
                     {tutors.map((tutor) => (
                        <option key={tutor._id} value={tutor._id}>
                           {tutor.name}
                        </option>
                     ))}
                  </select>
                  {errors.tutor && (
                     <p className="text-red-500 text-xs sm:text-sm ml-2 mt-1">
                        Tutor is required
                     </p>
                  )}
               </label>

               <label>
                  <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                     Subject
                  </p>
                  <select
                     {...register("subject", { required: true })}
                     className="px-3 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                  >
                     <option value="">Select Subject</option>
                     {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                           {subject.name}
                        </option>
                     ))}
                  </select>
                  {errors.subject && (
                     <p className="text-red-500 text-xs sm:text-sm ml-2 mt-1">
                        Subject is required
                     </p>
                  )}
               </label>

               <label>
                  <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                     Standard
                  </p>
                  <select
                     {...register("standardId", { required: true })}
                     className="px-3 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                  >
                     <option value="">Select Standard</option>
                     {standardsList &&
                        standardsList.map((standard) => (
                           <option key={standard._id} value={standard._id}>
                              {standard.standardName}
                           </option>
                        ))}
                  </select>
                  {errors.standardId && (
                     <p className="text-red-500 text-xs sm:text-sm ml-2 mt-1">
                        Standard is required
                     </p>
                  )}
               </label>

               <label>
                  <p className="pl-2 text-sm sm:text-base text-medium-gray pb-1">
                     Description
                  </p>
                  <select
                     {...register("description", {
                        required: true,
                     })}
                     className="px-3 py-2 sm:px-4 sm:py-2 w-full outline-none border-[2px] border-gray-200 rounded-md text-sm sm:text-base"
                  >
                     <option value="">Select type</option>
                     <option value="Lecture">Lecture</option>
                     <option value="Test">Test</option>
                  </select>
                  {errors.description && (
                     <p className="text-red-500 text-xs sm:text-sm ml-2 mt-1">
                        Description is required
                     </p>
                  )}
               </label>

               <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-gray text-white w-full px-4 py-2 sm:px-6 sm:py-3 rounded-md mt-4 hover:bg-medium-gray transition-all transform hover:scale-[102%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
               >
                  {loading ? "Creating..." : "Create Lecture"}
               </button>
            </form>
         </div>
      </div>
   );
}

export default CreateLecture;

import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaUser, FaClock, FaBook } from "react-icons/fa6";
import { FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studsPresentForALec } from "../../../../services/operations/attendance.service";
import { markStudentMarks } from "../../../../services/operations/marks.service";
import {
   setMarkLecture,
   setTotalMarks,
   setStudentMarks,
   clearMarks,
} from "../../../../slices/marks.slice";
import { format } from "date-fns";
import toast from "react-hot-toast";

function PutMarks() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [studentList, setStudentList] = useState([]);
   const [totalMarks, setTotalMarksInput] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const { token } = useSelector((state) => state.auth);
   const { markLecture } = useSelector((state) => state.attendance);
   const { studentMarks } = useSelector((state) => state.marks);

   const fetchStudentsList = async () => {
      try {
         const lectureId = markLecture._id;
         const response = await dispatch(studsPresentForALec(lectureId, token));
         if (response) {
            setStudentList(response);
         }
      } catch (error) {
         console.log("Error in fetching students");
      }
   };

   useEffect(() => {
      fetchStudentsList();
      dispatch(setMarkLecture(markLecture));
      return () => {
         dispatch(clearMarks());
      };
   }, []);

   const handleMarksChange = (studentId, value) => {
      const marksValue = value === "" ? 0 : Number(value);
      dispatch(
         setStudentMarks({
            studentId,
            marks: marksValue,
            description: studentMarks[studentId]?.description || "",
         })
      );
   };

   const handleDescriptionChange = (studentId, value) => {
      dispatch(
         setStudentMarks({
            studentId,
            marks: studentMarks[studentId]?.marks || 0,
            description: value,
         })
      );
   };

   const handleSubmitMarks = async () => {
      setIsSubmitting(true);
      try {
         // Validate marks for each student
         const invalidMarks = studentList.some((item) => {
            const studentId = item?.student?._id;
            const studentMarksValue = studentMarks[studentId]?.marks;
            return (
               studentMarksValue !== null &&
               studentMarksValue !== undefined &&
               studentMarksValue > totalMarks
            );
         });

         if (invalidMarks) {
            toast.error("Marks cannot be greater than total marks");
            setIsSubmitting(false);
            return;
         }

         const results = await Promise.all(
            studentList.map(async (item) => {
               try {
                  const studentId = item?.student?._id;
                  
                  const result = await dispatch(
                     markStudentMarks(
                        studentId,
                        markLecture._id,
                        studentMarks[studentId]?.marks || 0,
                        totalMarks,
                        studentMarks[studentId]?.description || "",
                        token
                     )
                  );
                  return result;
               } catch (error) {
                  console.error(`Error marking marks for student ${item?.student?._id}:`, error);
                  return false;
               }
            })
         );

         const allSuccessful = results.every((result) => result);
         if (allSuccessful) {
            toast.success("Marks marked successfully");
            navigate("/dashboard/admin-marks");
         } else {
            toast.error("Failed to mark some students' marks");
         }
      } catch (error) {
         console.error("Error submitting marks:", error);
         toast.error("Failed to submit marks");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (!markLecture) {
      navigate("/dashboard/admin-marks");
      return null;
   }

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Mark Marks</h1>
            </div>
            
            <button
               onClick={() => navigate("/dashboard/admin-marks")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Lecture Details */}
         {markLecture && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
               <h2 className="text-xl font-semibold text-charcoal-gray mb-4">Test Details</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaBook className="text-charcoal-gray" />
                     <div>
                        <p className="text-xs text-slate-gray">Subject</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {markLecture.subject?.name}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaCalendarAlt className="text-medium-gray" />
                     <div>
                        <p className="text-xs text-slate-gray">Date</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {format(new Date(markLecture.date), "dd MMM yyyy")}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaClock className="text-medium-gray" />
                     <div>
                        <p className="text-xs text-slate-gray">Time</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {markLecture.time}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaUser className="text-charcoal-gray" />
                     <div>
                        <p className="text-xs text-slate-gray">Tutor</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {markLecture.tutor?.name}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Total Marks Input */}
         <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
            <label className="block text-sm font-medium text-charcoal-gray mb-2">
               Total Marks
            </label>
            <input
               type="number"
               value={totalMarks}
               onChange={(e) => {
                  setTotalMarksInput(e.target.value);
                  dispatch(setTotalMarks(e.target.value));
               }}
               className="w-full px-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               placeholder="Enter total marks"
            />
         </div>

         {/* Marks Table */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="p-6">
               <h3 className="text-lg font-semibold text-charcoal-gray mb-4">Student Marks</h3>
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-light-gray">
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Student Name
                           </th>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Marks
                           </th>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Description (Optional)
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {studentList.map((item) => (
                           <tr key={item?.student?._id} className="hover:bg-light-gray/30">
                              <td className="py-3 px-4 text-sm font-medium text-charcoal-gray">
                                 {item?.student?.name}
                              </td>
                              <td className="py-3 px-4">
                                 <input
                                    type="number"
                                    value={studentMarks[item?.student?._id]?.marks || ""}
                                    onChange={(e) =>
                                       handleMarksChange(item?.student?._id, e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
                                    placeholder="Enter marks"
                                 />
                              </td>
                              <td className="py-3 px-4">
                                 <input
                                    type="text"
                                    value={studentMarks[item?.student?._id]?.description || ""}
                                    onChange={(e) =>
                                       handleDescriptionChange(item?.student?._id, e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
                                    placeholder="Enter description"
                                 />
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               <div className="mt-6 flex justify-end">
                  <button
                     onClick={handleSubmitMarks}
                     disabled={isSubmitting}
                     className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isSubmitting
                           ? "bg-light-gray text-slate-gray cursor-not-allowed"
                           : "bg-charcoal-gray text-white hover:bg-medium-gray"
                     }`}
                  >
                     {isSubmitting ? "Submitting..." : "Submit Marks"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default PutMarks;

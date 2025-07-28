import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTutorLecturesByTutorId } from "../../../../services/operations/lecture.service";
import { FaCalendarAlt, FaClock, FaBook, FaGraduationCap, FaFileAlt } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

function TutorLecturesDisplay() {
   const { userId } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { token } = useSelector((state) => state.auth);

   const [lectures, setLectures] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchLectures = async () => {
         try {
            setLoading(true);
            const result = await dispatch(getTutorLecturesByTutorId(userId, token));
            if (result) {
               setLectures(result);
            }
         } catch (error) {
            console.error("Error fetching lectures:", error);
            setLectures([]);
         } finally {
            setLoading(false);
         }
      };

      if (userId && token) {
         fetchLectures();
      }
   }, [userId, token, dispatch]);

   const formatDate = (dateString) => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("en-GB", {
         day: "2-digit",
         month: "short",
         year: "numeric",
      });
   };

   const getTypeColor = (type) => {
      switch (type?.toLowerCase()) {
         case "test":
            return "bg-red-100 text-red-800";
         case "lecture":
            return "bg-blue-100 text-blue-800";
         case "practical":
            return "bg-green-100 text-green-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaBook className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  Tutor's Lectures
               </h1>
            </div>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Lectures Count */}
         <div className="mb-6">
            <p className="text-sm sm:text-base text-medium-gray font-medium">
               Total lectures: <span className="text-charcoal-gray font-semibold">{lectures.length}</span>
            </p>
         </div>

         {lectures.length === 0 ? (
            <div className="text-center py-12">
               <FaBook className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl mb-2">No lectures found</p>
               <p className="text-slate-gray">This tutor hasn't been assigned any lectures yet.</p>
            </div>
         ) : (
            <>
               {/* Desktop Table */}
               <div className="hidden md:block bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
                  <table className="w-full">
                     <thead className="bg-light-gray">
                        <tr>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Date
                           </th>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Time
                           </th>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Subject
                           </th>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Standard
                           </th>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Type
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {lectures.map((lecture) => (
                           <tr key={lecture._id} className="hover:bg-light-gray/30 transition-colors duration-200">
                              <td className="px-4 py-3 text-sm text-charcoal-gray font-medium">
                                 {formatDate(lecture.date)}
                              </td>
                              <td className="px-4 py-3 text-sm text-charcoal-gray">
                                 {lecture.time || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-charcoal-gray">
                                 <div>
                                    <span className="font-medium">{lecture.subject?.name || "-"}</span>
                                    {lecture.subject?.code && (
                                       <div className="text-xs text-slate-gray">
                                          ({lecture.subject.code})
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-charcoal-gray">
                                 {lecture.standard?.standardName || "-"}
                              </td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(lecture.description)}`}>
                                    {lecture.description || "Lecture"}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Mobile Cards */}
               <div className="block md:hidden space-y-4">
                  {lectures.map((lecture, index) => (
                     <div
                        key={lecture._id}
                        className="bg-white p-4 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200"
                        style={{
                           animationDelay: `${index * 0.1}s`,
                        }}
                     >
                        {/* Date and Type Header */}
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-charcoal-gray text-sm flex-shrink-0" />
                              <span className="font-semibold text-charcoal-gray">
                                 {formatDate(lecture.date)}
                              </span>
                           </div>
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(lecture.description)}`}>
                              {lecture.description || "Lecture"}
                           </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 mb-2">
                           <FaClock className="text-medium-gray text-sm flex-shrink-0" />
                           <span className="text-sm text-charcoal-gray font-medium">
                              {lecture.time || "Time not specified"}
                           </span>
                        </div>

                        {/* Subject */}
                        <div className="flex items-center gap-2 mb-2">
                           <FaBook className="text-medium-gray text-sm flex-shrink-0" />
                           <div>
                              <span className="text-sm font-medium text-charcoal-gray">
                                 {lecture.subject?.name || "Subject not specified"}
                              </span>
                              {lecture.subject?.code && (
                                 <span className="text-xs text-slate-gray ml-1">
                                    ({lecture.subject.code})
                                 </span>
                              )}
                           </div>
                        </div>

                        {/* Standard */}
                        <div className="flex items-center gap-2">
                           <FaGraduationCap className="text-medium-gray text-sm flex-shrink-0" />
                           <span className="text-sm text-charcoal-gray">
                              {lecture.standard?.standardName || "Standard not specified"}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </>
         )}
      </div>
   );
}

export default TutorLecturesDisplay;

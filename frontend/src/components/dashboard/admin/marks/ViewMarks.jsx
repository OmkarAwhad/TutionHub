import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMarksDetailsByALec } from "../../../../services/operations/marks.service";
import { FaArrowLeftLong, FaUser, FaClock, FaBook} from "react-icons/fa6";
import { FaChalkboardTeacher, FaCalendarAlt, FaEdit  } from "react-icons/fa";
import { format } from "date-fns";

function ViewMarks() {
   const { lectureId } = useParams();
   const { markLecture } = useSelector((state) => state.attendance);
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [details, setDetails] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchMarksDetails = async () => {
         try {
            setLoading(true);
            if (markLecture?._id) {
               const response = await getMarksDetailsByALec(markLecture._id, token);
               if (response) {
                  setDetails(response);
               }
            }
         } catch (error) {
            console.error("Error fetching marks details:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchMarksDetails();
   }, [markLecture, token]);

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   // Calculate stats
   const totalStudents = details.length;
   const averageMarks = totalStudents > 0 
      ? (details.reduce((sum, item) => sum + item.marks, 0) / totalStudents).toFixed(2)
      : 0;
   const totalMarks = details.length > 0 ? details[0].totalMarks : 0;
   const highestMarks = totalStudents > 0 ? Math.max(...details.map(item => item.marks)) : 0;

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">View Marks</h1>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Edit Button */}
               <button
                  onClick={() => navigate(`/dashboard/admin-marks/edit-marks/${lectureId}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
               >
                  <FaEdit className="text-sm" />
                  <span>Edit Marks</span>
               </button>
               
               {/* Back Button */}
               <button
                  onClick={() => navigate("/dashboard/admin-marks/view-marks")}
                  className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
               >
                  <FaArrowLeftLong className="text-sm" />
                  <span>Back</span>
               </button>
            </div>
         </div>

         {/* Test Details */}
         {markLecture && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
               <h2 className="text-xl font-semibold text-charcoal-gray mb-4">Test Information</h2>
               
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

         {/* Marks Statistics */}
         <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Total Students</p>
               <p className="text-lg font-bold text-charcoal-gray">{totalStudents}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Total Marks</p>
               <p className="text-lg font-bold text-charcoal-gray">{totalMarks}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Average Marks</p>
               <p className="text-lg font-bold text-charcoal-gray">{averageMarks}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Highest Marks</p>
               <p className="text-lg font-bold text-charcoal-gray">{highestMarks}</p>
            </div>
         </div>

         {/* Marks Table */}
         {details.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
               <div className="p-4 border-b border-light-gray">
                  <h3 className="text-lg font-semibold text-charcoal-gray">Student Marks List</h3>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-light-gray">
                        <tr>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Student Name
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Marks Obtained
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Percentage
                           </th>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Description
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {details.map((item) => (
                           <tr key={item?.student?._id} className="hover:bg-light-gray/30">
                              <td className="py-3 px-4 text-sm font-medium text-charcoal-gray">
                                 {item?.student?.name}
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <span className="text-sm font-semibold text-charcoal-gray">
                                    {item?.marks} / {item?.totalMarks}
                                 </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    ((item?.marks / item?.totalMarks) * 100) >= 75 
                                       ? "bg-charcoal-gray text-white"
                                       : ((item?.marks / item?.totalMarks) * 100) >= 50
                                       ? "bg-medium-gray text-white"
                                       : "bg-slate-gray text-white"
                                 }`}>
                                    {((item?.marks / item?.totalMarks) * 100).toFixed(1)}%
                                 </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-charcoal-gray">
                                 {item?.description || "-"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ) : (
            <div className="text-center py-12">
               <FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl">No marks records found</p>
            </div>
         )}
      </div>
   );
}

export default ViewMarks;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { viewStudAttendanceForLec } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong, FaUser, FaClock, FaBook } from "react-icons/fa6";
import { FaChalkboardTeacher, FaCalendarAlt, FaSearch, FaEdit } from "react-icons/fa";
import { clearmarkLecture } from "../../../../slices/attendance.slice";
import { FiFileText } from "react-icons/fi";

function ViewingLecAttendance() {
   const { lectureId } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { token } = useSelector((state) => state.auth);
   const { markLecture } = useSelector((state) => state.attendance);
   const [attendanceList, setAttendanceList] = useState([]);
   const [filteredAttendance, setFilteredAttendance] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchAttendance = async () => {
         try {
            setLoading(true);
            const response = await dispatch(viewStudAttendanceForLec(lectureId, token));
            if (response) {
               setAttendanceList(response);
               setFilteredAttendance(response);
            }
         } catch (error) {
            console.error("Error fetching attendance:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchAttendance();
   }, [lectureId, dispatch, token]);

   // Search functionality
   useEffect(() => {
      if (!searchTerm.trim()) {
         setFilteredAttendance(attendanceList);
      } else {
         const filtered = attendanceList.filter((attendance) =>
            attendance.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendance.status?.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredAttendance(filtered);
      }
   }, [searchTerm, attendanceList]);

   // Cleanup function to clear the lecture data when component unmounts
   useEffect(() => {
      return () => {
         dispatch(clearmarkLecture());
      };
   }, []);

   // Helper function to safely format date
   const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd MMM yyyy") : "Invalid Date";
   };

   // Show loading state
   if (loading && !markLecture) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   // Calculate attendance stats for filtered results
   const presentCount = filteredAttendance.filter((att) => att.status === "Present").length;
   const absentCount = filteredAttendance.filter((att) => att.status === "Absent").length;
   const totalStudents = filteredAttendance.length;

   return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  Attendance Details
               </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
               {/* Edit Button */}
               <button
                  onClick={() => navigate(`/dashboard/admin-attendance/edit-attendance/${lectureId}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200 text-sm sm:text-base"
               >
                  <FaEdit className="text-sm" />
                  <span>Edit Attendance</span>
               </button>
               
               {/* Back Button */}
               <button
                  onClick={() => navigate("/dashboard/admin-attendance/view-attendance")}
                  className="w-full sm:w-auto flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
               >
                  <FaArrowLeftLong className="text-sm" />
                  <span>Back</span>
               </button>
            </div>
         </div>

         {/* Lecture Details - Responsive Grid */}
         {markLecture && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
               <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-3 sm:mb-4">
                  Lecture Information
               </h2>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Subject */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaBook className="text-charcoal-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Subject</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.subject?.name || "N/A"}
                        </p>
                     </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaCalendarAlt className="text-medium-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Date</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {formatDate(markLecture.date)}
                        </p>
                     </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaClock className="text-medium-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Time</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {markLecture.time || "N/A"}
                        </p>
                     </div>
                  </div>

                  {/* Tutor */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaUser className="text-charcoal-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Tutor</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.tutor?.name || "N/A"}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Description */}
               {markLecture.description && (
                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FiFileText className="text-charcoal-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray mb-1">Description</p>
                        <p className="text-sm font-medium text-charcoal-gray">
                           {markLecture.description}
                        </p>
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* Search Bar */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
               <input
                  type="text"
                  placeholder="Search by student name or attendance status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               />
            </div>
            {searchTerm && (
               <div className="mt-2">
                  <p className="text-sm text-medium-gray">
                     Found {filteredAttendance.length} of {attendanceList.length} students
                  </p>
               </div>
            )}
         </div>

         {/* Attendance Stats - Responsive Grid */}
         <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : "Total"} Students
               </p>
               <p className="text-base sm:text-lg font-bold text-charcoal-gray">
                  {totalStudents}
               </p>
            </div>
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : ""} Present
               </p>
               <p className="text-base sm:text-lg font-bold text-charcoal-gray">
                  {presentCount}
               </p>
            </div>
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : ""} Absent
               </p>
               <p className="text-base sm:text-lg font-bold text-medium-gray">
                  {absentCount}
               </p>
            </div>
         </div>

         {/* Attendance Section */}
         {filteredAttendance.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
               {/* Mobile Cards View */}
               <div className="block sm:hidden p-4">
                  <h3 className="text-lg font-semibold text-charcoal-gray mb-4">
                     Student Attendance List
                     {searchTerm && (
                        <span className="text-sm font-normal text-medium-gray ml-2">
                           ({filteredAttendance.length} results)
                        </span>
                     )}
                  </h3>
                  <div className="space-y-3">
                     {filteredAttendance.map((attendance) => (
                        <div key={attendance._id} className="bg-light-gray p-3 rounded-lg">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-charcoal-gray">
                                 {attendance.student?.name || "Unknown Student"}
                              </span>
                              <span
                                 className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    attendance.status === "Present"
                                       ? "bg-charcoal-gray text-white"
                                       : "border border-charcoal-gray text-charcoal-gray"
                                 }`}
                              >
                                 {attendance.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Desktop Table View */}
               <div className="hidden sm:block overflow-x-auto">
                  <div className="p-4 sm:p-6 border-b border-light-gray">
                     <h3 className="text-lg font-semibold text-charcoal-gray">
                        Student Attendance List
                        {searchTerm && (
                           <span className="text-sm font-normal text-medium-gray ml-2">
                              ({filteredAttendance.length} results)
                           </span>
                        )}
                     </h3>
                  </div>
                  <table className="w-full">
                     <thead className="bg-light-gray">
                        <tr>
                           <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-gray">
                              Student Name
                           </th>
                           <th className="px-6 py-3 text-center text-sm font-semibold text-charcoal-gray">
                              Status
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {filteredAttendance.map((attendance) => (
                           <tr key={attendance._id} className="hover:bg-light-gray/30">
                              <td className="px-6 py-4 text-sm font-medium text-charcoal-gray">
                                 {attendance.student?.name || "Unknown Student"}
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                       attendance.status === "Present"
                                          ? "bg-charcoal-gray text-white"
                                          : "border border-charcoal-gray text-charcoal-gray"
                                    }`}
                                 >
                                    {attendance.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaSearch className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2 px-4">
                  {searchTerm 
                     ? "No students found matching your search"
                     : attendanceList.length > 0 
                     ? "No attendance records found"
                     : "No attendance records found"
                  }
               </p>
               <p className="text-slate-gray text-sm sm:text-base px-4">
                  {searchTerm 
                     ? "Try adjusting your search terms"
                     : "Attendance records will appear here once marked"
                  }
               </p>
               {searchTerm && (
                  <button
                     onClick={() => setSearchTerm("")}
                     className="mt-4 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
                  >
                     Clear Search
                  </button>
               )}
            </div>
         )}
      </div>
   );
}

export default ViewingLecAttendance;

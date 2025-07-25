import React, { useEffect, useState } from "react";
import { getMyStudentsListByLec } from "../../../../services/operations/users.service";
import { markAttendance } from "../../../../services/operations/attendance.service";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { clearmarkLecture } from "../../../../slices/attendance.slice";
import { FaArrowLeftLong, FaUser, FaClock, FaBook} from "react-icons/fa6";
import { FaChalkboardTeacher, FaSearch  } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function MainMarking() {
   const { token } = useSelector((state) => state.auth);
   const { markLecture } = useSelector((state) => state.attendance);
   const { lectureId } = useParams();
   const [studentsList, setStudentsList] = useState([]);
   const [filteredStudents, setFilteredStudents] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectAll, setSelectAll] = useState(true);
   const [attendanceStatus, setAttendanceStatus] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const getStudentsList = async () => {
      try {
         const response = await dispatch(getMyStudentsListByLec(lectureId, token));
         if (response) {
            setStudentsList(response);
            setFilteredStudents(response);
            // Initialize attendance status for all students as present
            const initialStatus = {};
            response.forEach((student) => {
               initialStatus[student._id] = true;
            });
            setAttendanceStatus(initialStatus);
         }
      } catch (error) {
         console.error("Error fetching students list:", error);
      }
   };

   useEffect(() => {
      if (lectureId) {
         getStudentsList();
      }
   }, [lectureId]);

   // Search functionality
   useEffect(() => {
      if (!searchTerm.trim()) {
         setFilteredStudents(studentsList);
      } else {
         const filtered = studentsList.filter((student) =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredStudents(filtered);
      }
   }, [searchTerm, studentsList]);

   // Cleanup function to clear the lecture data when component unmounts
   useEffect(() => {
      return () => {
         dispatch(clearmarkLecture());
      };
   }, []);

   const handleSelectAll = () => {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      const newStatus = {};
      filteredStudents.forEach((student) => {
         newStatus[student._id] = newSelectAll;
      });
      setAttendanceStatus(prev => ({ ...prev, ...newStatus }));
   };

   const handleStudentAttendance = (studentId) => {
      setAttendanceStatus((prev) => ({
         ...prev,
         [studentId]: !prev[studentId],
      }));
   };

   const handleSubmitAttendance = async () => {
      setIsSubmitting(true);
      try {
         const data = studentsList.map((student) =>
            dispatch(
               markAttendance(
                  lectureId,
                  student._id,
                  attendanceStatus[student._id] ? "Present" : "Absent",
                  token
               )
            )
         );

         const results = await Promise.all(data);
         const allSuccessful = results.every((result) => result);

         if (allSuccessful) {
            toast.success("Attendance marked successfully");
            navigate("/dashboard/admin-attendance/mark-attendance");
         }
      } catch (error) {
         console.error("Error submitting attendance:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   // If no lecture data is available, redirect back
   if (!markLecture) {
      navigate("/dashboard/admin-attendance/mark-attendance");
      return null;
   }

   const presentCount = Object.values(attendanceStatus).filter(Boolean).length;
   const absentCount = studentsList.length - presentCount;

   return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Mark Attendance</h1>
            </div>

            <button
               onClick={() => navigate("/dashboard/admin-attendance/mark-attendance")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Lecture Details Card - Responsive Grid */}
         {markLecture && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
               <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-3 sm:mb-4">Lecture Details</h2>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Subject */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaBook className="text-charcoal-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Subject</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.subject?.name}
                        </p>
                     </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaCalendarAlt className="text-medium-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Date</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {format(new Date(markLecture.date), "dd MMM yyyy")}
                        </p>
                     </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaClock className="text-medium-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Time</p>
                        <p className="text-sm font-semibold text-charcoal-gray">
                           {markLecture.time}
                        </p>
                     </div>
                  </div>

                  {/* Tutor */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
                     <FaUser className="text-charcoal-gray text-sm flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-gray">Tutor</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.tutor?.name}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Search Bar */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
               <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               />
            </div>
            {searchTerm && (
               <div className="mt-2">
                  <p className="text-sm text-medium-gray">
                     Showing {filteredStudents.length} of {studentsList.length} students
                  </p>
               </div>
            )}
         </div>

         {/* Attendance Section */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="p-4 sm:p-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray">
                     Student Attendance
                     {searchTerm && (
                        <span className="text-sm font-normal text-medium-gray ml-2">
                           ({filteredStudents.length} results)
                        </span>
                     )}
                  </h3>
                  <div className="flex items-center gap-2">
                     <label className="text-xs sm:text-sm text-medium-gray">Select All Present:</label>
                     <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
                     />
                  </div>
               </div>

               {filteredStudents.length > 0 ? (
                  <>
                     {/* Mobile Cards View */}
                     <div className="block sm:hidden space-y-3 mb-4">
                        {filteredStudents.map((student) => (
                           <div key={student._id} className="bg-light-gray p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium text-charcoal-gray">{student.name}</span>
                                 <label className="flex items-center gap-2">
                                    <input
                                       type="checkbox"
                                       checked={attendanceStatus[student._id]}
                                       onChange={() => handleStudentAttendance(student._id)}
                                       className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
                                    />
                                    <span className="text-xs text-medium-gray">Present</span>
                                 </label>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Desktop Table View */}
                     <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                           <thead>
                              <tr className="bg-light-gray">
                                 <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                                    Student Name
                                 </th>
                                 <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                                    Present
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-light-gray">
                              {filteredStudents.map((student) => (
                                 <tr key={student._id} className="hover:bg-light-gray/30">
                                    <td className="py-3 px-4 text-sm text-charcoal-gray font-medium">
                                       {student.name}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                       <input
                                          type="checkbox"
                                          checked={attendanceStatus[student._id]}
                                          onChange={() => handleStudentAttendance(student._id)}
                                          className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
                                       />
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </>
               ) : (
                  <div className="text-center py-8">
                     <FaSearch className="mx-auto h-12 w-12 text-slate-gray mb-4" />
                     <p className="text-medium-gray text-lg mb-2">
                        {searchTerm ? "No students found matching your search" : "No students found"}
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

               {/* Submit Button */}
               <div className="mt-4 sm:mt-6 flex justify-end">
                  <button
                     onClick={handleSubmitAttendance}
                     disabled={isSubmitting}
                     className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                        isSubmitting
                           ? "bg-light-gray text-slate-gray cursor-not-allowed"
                           : "bg-charcoal-gray text-white hover:bg-medium-gray"
                     }`}
                  >
                     {isSubmitting ? "Submitting..." : "Submit Attendance"}
                  </button>
               </div>

               {/* Attendance Stats - Responsive Grid */}
               <div className="grid grid-cols-3 mt-6 sm:mt-10 gap-3 sm:gap-4">
                  <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
                     <p className="text-xs text-slate-gray">
                        {searchTerm ? "Filtered" : "Total"} Students
                     </p>
                     <p className="text-base sm:text-lg font-bold text-charcoal-gray">
                        {searchTerm ? filteredStudents.length : studentsList.length}
                     </p>
                  </div>
                  <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
                     <p className="text-xs text-slate-gray">Present</p>
                     <p className="text-base sm:text-lg font-bold text-charcoal-gray">
                        {presentCount}
                     </p>
                  </div>
                  <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
                     <p className="text-xs text-slate-gray">Absent</p>
                     <p className="text-base sm:text-lg font-bold text-medium-gray">
                        {absentCount}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default MainMarking;

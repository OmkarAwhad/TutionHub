// EditAttendance.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getAttendanceForEdit, updateAttendance, deleteAttendanceForLecture } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong, FaUser, FaClock, FaBook,  FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function EditAttendance() {
   const { lectureId } = useParams();
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   
   const [lectureData, setLectureData] = useState(null);
   const [studentsData, setStudentsData] = useState([]);
   const [attendanceStatus, setAttendanceStatus] = useState({});
   const [loading, setLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [selectAll, setSelectAll] = useState(false);

   useEffect(() => {
      const fetchAttendanceData = async () => {
         try {
            setLoading(true);
            const response = await dispatch(getAttendanceForEdit(lectureId, token));
            if (response) {
               setLectureData(response.lecture);
               setStudentsData(response.studentsWithAttendance);
               
               // Initialize attendance status
               const initialStatus = {};
               response.studentsWithAttendance.forEach(student => {
                  if (student.status) {
                     initialStatus[student._id] = student.status === "Present";
                  }
               });
               setAttendanceStatus(initialStatus);
            }
         } catch (error) {
            console.error("Error fetching attendance data:", error);
         } finally {
            setLoading(false);
         }
      };

      if (lectureId) {
         fetchAttendanceData();
      }
   }, [lectureId, dispatch, token]);

   const handleSelectAll = () => {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);
      const newStatus = {};
      studentsData.forEach((student) => {
         newStatus[student._id] = newSelectAll;
      });
      setAttendanceStatus(newStatus);
   };

   const handleStudentAttendance = (studentId) => {
      setAttendanceStatus((prev) => ({
         ...prev,
         [studentId]: !prev[studentId],
      }));
   };

   const handleUpdateAttendance = async () => {
      setIsSubmitting(true);
      try {
         const attendanceData = studentsData.map(student => ({
            studentId: student._id,
            status: attendanceStatus[student._id] ? "Present" : 
                  attendanceStatus[student._id] === false ? "Absent" : null
         })).filter(data => data.status !== null); // Only send marked attendance

         const success = await dispatch(updateAttendance(lectureId, attendanceData, token));
         
         if (success) {
            navigate("/dashboard/admin-attendance/view-attendance");
         }
      } catch (error) {
         console.error("Error updating attendance:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteAttendance = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete all attendance for this lecture? This action cannot be undone.");
      
      if (confirmDelete) {
         const success = await dispatch(deleteAttendanceForLecture(lectureId, token));
         if (success) {
            navigate("/dashboard/admin-attendance/view-attendance");
         }
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   if (!lectureData) {
      navigate("/dashboard/admin-attendance/view-attendance");
      return null;
   }

   const presentCount = Object.values(attendanceStatus).filter(Boolean).length;
   const absentCount = Object.values(attendanceStatus).filter(status => status === false).length;
   const unmarkedCount = studentsData.length - presentCount - absentCount;

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaEdit className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Edit Attendance</h1>
            </div>
            
            <button
               onClick={() => navigate("/dashboard/admin-attendance/view-attendance")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Lecture Details */}
         <div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
            <h2 className="text-xl font-semibold text-charcoal-gray mb-4">Lecture Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <FaBook className="text-charcoal-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Subject</p>
                     <p className="text-sm font-semibold text-charcoal-gray">
                        {lectureData.subject?.name}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <FaCalendarAlt className="text-medium-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Date</p>
                     <p className="text-sm font-semibold text-charcoal-gray">
                        {format(new Date(lectureData.date), "dd MMM yyyy")}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <FaClock className="text-medium-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Time</p>
                     <p className="text-sm font-semibold text-charcoal-gray">
                        {lectureData.time}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <FaUser className="text-charcoal-gray" />
                  <div>
                     <p className="text-xs text-slate-gray">Tutor</p>
                     <p className="text-sm font-semibold text-charcoal-gray">
                        {lectureData.tutor?.name}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Attendance Stats */}
         <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Total Students</p>
               <p className="text-lg font-bold text-charcoal-gray">{studentsData.length}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Present</p>
               <p className="text-lg font-bold text-charcoal-gray">{presentCount}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Absent</p>
               <p className="text-lg font-bold text-medium-gray">{absentCount}</p>
            </div>
            <div className="bg-light-gray p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Unmarked</p>
               <p className="text-lg font-bold text-slate-gray">{unmarkedCount}</p>
            </div>
         </div>

         {/* Attendance Table */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-charcoal-gray">Student Attendance</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <label className="text-sm text-medium-gray">Select All Present:</label>
                        <input
                           type="checkbox"
                           checked={selectAll}
                           onChange={handleSelectAll}
                           className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
                        />
                     </div>
                     <button
                        onClick={handleDeleteAttendance}
                        className="flex items-center gap-2 px-3 py-2 bg-medium-gray text-white rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
                     >
                        <FaTrash className="text-sm" />
                        <span className="text-sm">Delete All</span>
                     </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-light-gray">
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Student Name
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Present
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Absent
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Unmarked
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {studentsData.map((student) => (
                           <tr key={student._id} className="hover:bg-light-gray/30">
                              <td className="py-3 px-4 text-sm text-charcoal-gray font-medium">
                                 {student.name}
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <input
                                    type="radio"
                                    name={`attendance_${student._id}`}
                                    checked={attendanceStatus[student._id] === true}
                                    onChange={() => setAttendanceStatus(prev => ({
                                       ...prev,
                                       [student._id]: true
                                    }))}
                                    className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
                                 />
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <input
                                    type="radio"
                                    name={`attendance_${student._id}`}
                                    checked={attendanceStatus[student._id] === false}
                                    onChange={() => setAttendanceStatus(prev => ({
                                       ...prev,
                                       [student._id]: false
                                    }))}
                                    className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
                                 />
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <input
                                    type="radio"
                                    name={`attendance_${student._id}`}
                                    checked={attendanceStatus[student._id] === undefined}
                                    onChange={() => setAttendanceStatus(prev => {
                                       const newState = { ...prev };
                                       delete newState[student._id];
                                       return newState;
                                    })}
                                    className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
                                 />
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Update Button */}
               <div className="mt-6 flex justify-end">
                  <button
                     onClick={handleUpdateAttendance}
                     disabled={isSubmitting}
                     className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        isSubmitting
                           ? "bg-light-gray text-slate-gray cursor-not-allowed"
                           : "bg-charcoal-gray text-white hover:bg-medium-gray"
                     }`}
                  >
                     {isSubmitting ? "Updating..." : "Update Attendance"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default EditAttendance;

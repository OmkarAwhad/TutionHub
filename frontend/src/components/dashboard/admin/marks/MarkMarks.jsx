import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getLecturesWithAttendanceMarked, getLecturesWithoutAttendance } from "../../../../services/operations/attendance.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import PastDateCard from "../attendance/PastDateCard";
import { FaArrowLeftLong, FaCalendarCheck, FaGraduationCap } from "react-icons/fa6";
import { FaChalkboardTeacher, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MarkMarks() {
   const [testLectures, setTestLectures] = useState([]);
   const [filteredLectures, setFilteredLectures] = useState([]);
   const [unMarkedAttendanceLectures, setUnMarkedAttendanceLectures] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [standards, setStandards] = useState([]);
   const [selectedSubject, setSelectedSubject] = useState("all");
   const [selectedStandard, setSelectedStandard] = useState("All");
   const [loading, setLoading] = useState(true);
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const fetchTestLec = async () => {
      try {
         setLoading(true);
         
         const [allLecturesResponse, lecturesWithAttendance, subjectsResponse, standardsResponse] = await Promise.all([
            dispatch(getAllLectures(token)),
            dispatch(getLecturesWithAttendanceMarked(token)),
            dispatch(getAllSubjects(token)),
            dispatch(getAllStandards(token))
         ]);
         
         if (subjectsResponse) {
            setSubjects(subjectsResponse);
         }
         
         if (standardsResponse) {
            setStandards(standardsResponse);
         }
         
         if (allLecturesResponse) {
            const testLectures = allLecturesResponse.filter((lect) => lect.description === "Test");
            const attendanceMarkedIds = new Set(lecturesWithAttendance.map(lecture => lecture._id));
            
            const availableForMarks = testLectures.filter(
               (lect) => attendanceMarkedIds.has(lect._id) && lect.marksMarked === false
            );
            
            const needAttendanceFirst = testLectures.filter(
               (lect) => !attendanceMarkedIds.has(lect._id) && lect.marksMarked === false
            );
            
            setTestLectures(availableForMarks);
            setFilteredLectures(availableForMarks);
            setUnMarkedAttendanceLectures(needAttendanceFirst);
         }
      } catch (error) {
         console.error("Error fetching lectures:", error);
      } finally {
         setLoading(false);
      }
   };

   const applyFilters = () => {
      let filtered = [...testLectures];
      
      if (selectedSubject !== "all") {
         filtered = filtered.filter(lecture => lecture.subject?._id === selectedSubject);
      }
      
      if (selectedStandard !== "All") {
         filtered = filtered.filter(lecture => 
            lecture.standard === selectedStandard ||
            lecture.standard?._id === selectedStandard
         );
      }
      
      setFilteredLectures(filtered);
   };

   useEffect(() => {
      fetchTestLec();
   }, []);

   useEffect(() => {
      applyFilters();
   }, [testLectures, selectedSubject, selectedStandard]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-3 sm:p-4 lg:p-6">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Add Marks</h1>
            </div>

            <button
               onClick={() => navigate("/dashboard/admin-marks")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Filters - Responsive Layout */}
         <div className="mb-6">
            {/* Standards Filter - Responsive Grid */}
            <div className="mb-4">
               <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
                  {/* All Standards Button */}
                  <button
                     onClick={() => setSelectedStandard("All")}
                     className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg ${
                        selectedStandard === "All"
                           ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                           : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                     }`}
                  >
                     <div className="flex items-center justify-center gap-2">
                        <FaGraduationCap className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">All Standards</span>
                        <span className="sm:hidden">All</span>
                     </div>
                  </button>

                  {/* Dynamic Standards Buttons */}
                  {standards &&
                     standards.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => setSelectedStandard(standard._id)}
                           className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg ${
                              selectedStandard === standard._id
                                 ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                                 : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                           }`}
                        >
                           <div className="flex items-center justify-center gap-2">
                              <FaGraduationCap className="text-xs sm:text-sm" />
                              <span className="truncate">{standard.standardName}</span>
                           </div>
                        </button>
                     ))}
               </div>
            </div>

            {/* Subject Filter - Responsive */}
            <div className="flex justify-end">
               <div className="w-full sm:w-auto">
                  <label className="block text-xs text-slate-gray mb-1">
                     Subject
                  </label>
                  <select
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                     className="w-full sm:min-w-[140px] px-4 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200"
                  >
                     <option value="all">All Subjects</option>
                     {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                           {subject.name}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
         </div>

         {/* Warning Section - Responsive */}
         {unMarkedAttendanceLectures.length > 0 && (
            <div className="mb-6">
               <div className="bg-light-gray/50 border border-light-gray rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                     <FaExclamationTriangle className="text-charcoal-gray text-lg mt-0.5 flex-shrink-0" />
                     <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-charcoal-gray mb-2">
                           Attendance Required First
                        </h3>
                        <p className="text-sm text-medium-gray mb-3">
                           The following test lectures need attendance to be marked before you can add marks:
                        </p>
                        <div className="space-y-2">
                           {unMarkedAttendanceLectures.map((lecture) => (
                              <div key={lecture._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-light-gray gap-3">
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-charcoal-gray truncate">
                                       {lecture.subject?.name} ({lecture.subject?.code})
                                    </p>
                                    <p className="text-xs text-medium-gray">
                                       {new Date(lecture.date).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                       })} • {lecture.time} • {lecture.standard?.standardName}
                                    </p>
                                    <p className="text-xs text-slate-gray truncate">
                                       Tutor: {lecture.tutor?.name}
                                    </p>
                                 </div>
                                 <button
                                    onClick={() => navigate("/dashboard/admin-attendance/mark-attendance")}
                                    className="w-full sm:w-auto px-3 py-1 bg-charcoal-gray text-white text-xs font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200 flex-shrink-0"
                                 >
                                    Mark Attendance
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Results Count */}
         <div className="mb-6">
            <p className="text-medium-gray font-medium text-sm sm:text-base">
               Showing: <span className="text-charcoal-gray font-semibold">{filteredLectures.length}</span> of <span className="text-charcoal-gray font-semibold">{testLectures.length}</span> test lectures ready for marking
            </p>
         </div>

         {/* Lectures Grid - Responsive */}
         {filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
               {filteredLectures.map((item) => (
                  <PastDateCard
                     key={item._id}
                     lecture={item}
                     mode={"marks"}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2 px-4">
                  {testLectures.length > 0 
                     ? "No test lectures found for the selected filters"
                     : "No test lectures ready for marking"
                  }
               </p>
               <p className="text-slate-gray text-sm sm:text-base px-4">
                  {testLectures.length > 0
                     ? "Try changing your filters to see more results"
                     : unMarkedAttendanceLectures.length > 0 
                     ? "Please mark attendance for the test lectures above first"
                     : "Test lectures will appear here once attendance is marked"
                  }
               </p>
            </div>
         )}
      </div>
   );
}

export default MarkMarks;

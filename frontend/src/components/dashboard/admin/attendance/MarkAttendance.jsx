import React, { useEffect, useState } from "react";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getLecturesWithoutAttendance } from "../../../../services/operations/attendance.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { useDispatch, useSelector } from "react-redux";
import PastDateCard from "./PastDateCard";
import { FaArrowLeftLong, FaFilter, FaGraduationCap } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MarkAttendance() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [allLectures, setAllLectures] = useState([]);
   const [filteredLectures, setFilteredLectures] = useState([]);
   const [standards, setStandards] = useState([]);
   const [selectedFilter, setSelectedFilter] = useState("All"); // All, Lecture, Test
   const [selectedStandard, setSelectedStandard] = useState("All");
   const [loading, setLoading] = useState(true);

   const refreshLectures = async () => {
      setLoading(true);
      try {
         const [lecturesResponse, standardsResponse] = await Promise.all([
            dispatch(getLecturesWithoutAttendance(token)),
            dispatch(getAllStandards(token))
         ]);

         if (lecturesResponse) {
            setAllLectures(lecturesResponse);
         }

         if (standardsResponse) {
            setStandards(standardsResponse);
         }
      } catch (error) {
         console.error("Failed to fetch data:", error);
      } finally {
         setLoading(false);
      }
   };

   // Filter lectures based on selected filters
   const applyFilters = () => {
      let filtered = [...allLectures];

      // Filter by type (Lecture/Test)
      if (selectedFilter !== "All") {
         filtered = filtered.filter(lecture => lecture.description === selectedFilter);
      }

      // Filter by standard
      if (selectedStandard !== "All") {
         filtered = filtered.filter(lecture =>
            lecture.standard === selectedStandard ||
            lecture.standard?._id === selectedStandard
         );
      }

      setFilteredLectures(filtered);
   };

   const handleFilterChange = (filterType) => {
      setSelectedFilter(filterType);
   };

   const handleStandardChange = (standardId) => {
      setSelectedStandard(standardId);
   };

   useEffect(() => {
      refreshLectures();
   }, []);

   // Apply filters when any filter changes
   useEffect(() => {
      applyFilters();
   }, [allLectures, selectedFilter, selectedStandard]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   // Count lectures by type
   const lectureCount = allLectures.filter(lecture => lecture.description === "Lecture").length;
   const testCount = allLectures.filter(lecture => lecture.description === "Test").length;

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Mark Attendance</h1>
            </div>

            <button
               onClick={() => navigate("/dashboard/admin-attendance")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Type Filter */}
         <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
               <div className="flex gap-4 flex-wrap">
                  {/* All Standards Button */}
                  <button
                     onClick={() => handleStandardChange("All")}
                     className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard === "All"
                           ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                           : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                        }`}
                  >
                     <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-sm" />
                        All Standards
                     </div>
                  </button>

                  {/* Dynamic Standards Buttons */}
                  {standards &&
                     standards.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => handleStandardChange(standard._id)}
                           className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard === standard._id
                                 ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                                 : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                              }`}
                        >
                           <div className="flex items-center gap-2">
                              <FaGraduationCap className="text-sm" />
                              {standard.standardName}
                           </div>
                        </button>
                     ))}
               </div>
            </div>

            {/* Type Filter Dropdown */}
            <div className="flex items-center gap-2">
               <label className="block text-xs text-slate-gray mb-1">Type</label>
               <select
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-4 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[120px]"
               >
                  <option value="All">All</option>
                  <option value="Lecture">Lectures</option>
                  <option value="Test">Tests</option>
               </select>

            </div>
         </div>



         {/* Content */}
         {filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredLectures.map((lecture) => (
                  <PastDateCard
                     key={lecture._id}
                     lecture={lecture}
                     onAttendanceMarked={refreshLectures}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-12">
               <FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               {allLectures.length > 0 ? (
                  <>
                     <p className="text-medium-gray text-xl mb-2">
                        No results found for the selected filters
                     </p>
                     <p className="text-slate-gray">
                        Try changing the filters or check back later
                     </p>
                  </>
               ) : (
                  <>
                     <p className="text-medium-gray text-xl mb-2">
                        No lectures available for attendance marking
                     </p>
                     <p className="text-slate-gray">
                        Lectures and tests will appear here when they need attendance marking
                     </p>
                  </>
               )}
            </div>
         )}
      </div>
   );
}

export default MarkAttendance;

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
   const [selectedFilter, setSelectedFilter] = useState("All");
   const [selectedStandard, setSelectedStandard] = useState("All");
   const [loading, setLoading] = useState(true);
   const [showMobileFilters, setShowMobileFilters] = useState(false);

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

   const toggleMobileFilters = () => {
      setShowMobileFilters(!showMobileFilters);
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
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Mark Attendance</h1>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => navigate("/dashboard/admin-attendance")}
                  className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
               >
                  <FaArrowLeftLong className="text-sm" />
                  <span>Back</span>
               </button>

               {/* Mobile Filter Toggle */}
               <button
                  onClick={toggleMobileFilters}
                  className="sm:hidden flex items-center gap-2 px-3 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
               >
                  <FaFilter className="text-sm" />
                  <span className="text-sm">Filters</span>
               </button>
            </div>
         </div>

         {/* Mobile Filters Dropdown */}
         {showMobileFilters && (
            <div className="sm:hidden mb-6 p-4 bg-white rounded-lg shadow-md border border-light-gray">
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-charcoal-gray mb-2">Type</label>
                     <select
                        value={selectedFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200"
                     >
                        <option value="All">All</option>
                        <option value="Lecture">Lectures</option>
                        <option value="Test">Tests</option>
                     </select>
                  </div>
               </div>
            </div>
         )}

         {/* Standards Filter Section */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
            <div className="flex-1">
               <div className="flex flex-wrap gap-2 sm:gap-4">
                  {/* All Standards Button */}
                  <button
                     onClick={() => handleStandardChange("All")}
                     className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base ${
                        selectedStandard === "All"
                           ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                           : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                     }`}
                  >
                     <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-xs sm:text-sm" />
                        All Standards
                     </div>
                  </button>

                  {/* Dynamic Standards Buttons */}
                  {standards &&
                     standards.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => handleStandardChange(standard._id)}
                           className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base ${
                              selectedStandard === standard._id
                                 ? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
                                 : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                           }`}
                        >
                           <div className="flex items-center gap-2">
                              <FaGraduationCap className="text-xs sm:text-sm" />
                              <span className="truncate">{standard.standardName}</span>
                           </div>
                        </button>
                     ))}
               </div>
            </div>

            {/* Desktop Type Filter */}
            <div className="hidden sm:flex items-center gap-2">
               <label className="block text-xs text-slate-gray mb-1">Type</label>
               <select
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-2 lg:px-4 lg:py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[120px] text-sm lg:text-base"
               >
                  <option value="All">All</option>
                  <option value="Lecture">Lectures</option>
                  <option value="Test">Tests</option>
               </select>
            </div>
         </div>

         {/* Content */}
         {filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               {filteredLectures.map((lecture) => (
                  <PastDateCard
                     key={lecture._id}
                     lecture={lecture}
                     onAttendanceMarked={refreshLectures}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               {allLectures.length > 0 ? (
                  <>
                     <p className="text-medium-gray text-lg sm:text-xl mb-2">
                        No results found for the selected filters
                     </p>
                     <p className="text-slate-gray text-sm sm:text-base">
                        Try changing the filters or check back later
                     </p>
                  </>
               ) : (
                  <>
                     <p className="text-medium-gray text-lg sm:text-xl mb-2">
                        No lectures available for attendance marking
                     </p>
                     <p className="text-slate-gray text-sm sm:text-base">
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

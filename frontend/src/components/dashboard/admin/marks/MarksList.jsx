import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { FaArrowLeftLong, FaGraduationCap } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import PastDateCard from "../attendance/PastDateCard";

function MarksList() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [lecturesList, setLecturesList] = useState([]);
   const [filteredLectures, setFilteredLectures] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [standards, setStandards] = useState([]);
   const [selectedSubject, setSelectedSubject] = useState("all");
   const [selectedStandard, setSelectedStandard] = useState("All");
   const [loading, setLoading] = useState(true);

   const fetchMarkedLecs = async () => {
      try {
         setLoading(true);
         
         // Fetch all data in parallel
         const [lecturesResponse, subjectsResponse, standardsResponse] = await Promise.all([
            dispatch(getAllLectures(token)),
            dispatch(getAllSubjects(token)),
            dispatch(getAllStandards(token))
         ]);
         
         if (lecturesResponse) {
            const markedLectures = lecturesResponse.filter(
               (lec) => lec.description !== "Lecture" && lec.marksMarked === true
            );
            setLecturesList(markedLectures);
            setFilteredLectures(markedLectures);
         }
         
         if (subjectsResponse) {
            setSubjects(subjectsResponse);
         }
         
         if (standardsResponse) {
            setStandards(standardsResponse);
         }
      } catch (error) {
         console.error("Error fetching lectures:", error);
      } finally {
         setLoading(false);
      }
   };

   // Filter function
   const applyFilters = () => {
      let filtered = [...lecturesList];
      
      // Filter by subject
      if (selectedSubject !== "all") {
         filtered = filtered.filter(lecture => lecture.subject?._id === selectedSubject);
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

   useEffect(() => {
      fetchMarkedLecs();
   }, []);

   // Apply filters when filters change
   useEffect(() => {
      applyFilters();
   }, [lecturesList, selectedSubject, selectedStandard]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">View Marks</h1>
            </div>
            
            <button
               onClick={() => navigate("/dashboard/admin-marks")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Filters */}
         <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
               <div className="flex gap-4 flex-wrap">
                  {/* All Standards Button */}
                  <button
                     onClick={() => setSelectedStandard("All")}
                     className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                        selectedStandard === "All"
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
                           onClick={() => setSelectedStandard(standard._id)}
                           className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                              selectedStandard === standard._id
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
            <div className="flex items-center gap-4">
               {/* Subject Filter */}
               <div>
                  <label className="block text-xs text-slate-gray mb-1">
                     Subject
                  </label>
                  <select
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                     className="px-4 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px]"
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

         {/* Results Count */}
         {/* <div className="mb-6">
            <p className="text-medium-gray font-medium">
               Showing: <span className="text-charcoal-gray font-semibold">{filteredLectures.length}</span> of <span className="text-charcoal-gray font-semibold">{lecturesList.length}</span> marked lectures
            </p>
         </div> */}

         {/* Lectures Grid */}
         {filteredLectures && filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredLectures.map((lect) => (
                  <PastDateCard
                     key={lect._id}
                     lecture={lect}
                     mode={"view-marks"}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-12">
               <FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl mb-2">
                  {lecturesList.length > 0 
                     ? "No marked lectures found for the selected filters"
                     : "No marked lectures available"
                  }
               </p>
               <p className="text-slate-gray">
                  {lecturesList.length > 0
                     ? "Try changing your filters to see more results"
                     : "Marks will appear here once you mark them for test lectures"
                  }
               </p>
            </div>
         )}
      </div>
   );
}

export default MarksList;

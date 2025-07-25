import React, { useEffect, useState } from "react";
import {
   getAllLectures,
   deleteLecture,
} from "../../../../services/operations/lecture.service";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import Modal from "../../extras/Modal";
import LectureCard from "./LectureCard";
import { toast } from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { FaGraduationCap, FaBook, FaClipboardList, FaFilter } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LectureList() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const [lectures, setLectures] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [standards, setStandards] = useState([]);
   const [allLectures, setAllLectures] = useState([]);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedLecture, setSelectedLecture] = useState(null);
   const [showMobileFilters, setShowMobileFilters] = useState(false);

   const [selectedSubject, setSelectedSubject] = useState("all");
   const [selectedDesc, setSelectedDesc] = useState("Lecture");
   const [selectedStandard, setSelectedStandard] = useState("All");

   const navigate = useNavigate();

   const getAllLecturesData = async () => {
      try {
         const response = await dispatch(getAllLectures(token));
         if (response) {
            setAllLectures(response);
            setLectures(response);
         }
      } catch (error) {
         console.error("Error fetching lectures:", error);
      }
   };

   const getSubjects = async () => {
      try {
         const response = await dispatch(getAllSubjects(token));
         if (response) {
            setSubjects(response);
         }
      } catch (error) {
         console.error("Error fetching subjects:", error);
      }
   };

   const getStandards = async () => {
      try {
         const response = await dispatch(getAllStandards(token));
         if (response) {
            setStandards(response.standards || response);
         }
      } catch (error) {
         console.error("Error fetching standards:", error);
      }
   };

   const filterLectures = () => {
      let filteredLectures = [...allLectures];

      // Filter by description
      if (selectedDesc) {
         filteredLectures = filteredLectures.filter(
            (lecture) => lecture.description === selectedDesc
         );
      }

      // Filter by subject
      if (selectedSubject !== "all") {
         filteredLectures = filteredLectures.filter(
            (lecture) => lecture.subject?._id === selectedSubject
         );
      }

      // Filter by standard
      if (selectedStandard !== "All") {
         filteredLectures = filteredLectures.filter(
            (lecture) => lecture.standard._id === selectedStandard
         );
      }

      setLectures(filteredLectures);
   };

   useEffect(() => {
      filterLectures();
   }, [selectedSubject, selectedDesc, selectedStandard]);

   useEffect(() => {
      getSubjects();
      getStandards();
      getAllLecturesData();
   }, []);

   const isPastDate = (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(date) < today;
   };

   const handleDeleteClick = (lecture) => {
      setSelectedLecture(lecture);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!selectedLecture?._id) {
         toast.error("No lecture selected for deletion");
         setShowDeleteModal(false);
         return;
      }

      try {
         await dispatch(deleteLecture(selectedLecture._id, token));
         await getAllLecturesData();
         setShowDeleteModal(false);
         setSelectedLecture(null);
      } catch (error) {
         console.error("Error deleting lecture:", error);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setSelectedLecture(null);
   };

   const toggleMobileFilters = () => {
      setShowMobileFilters(!showMobileFilters);
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
               <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-light-gray text-charcoal-gray hover:bg-medium-gray hover:text-white rounded-xl transition-all duration-200"
               >
                  <IoChevronBack className="text-lg sm:text-xl" />
               </button>
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">All Lectures</h1>
            </div>

            {/* Desktop Dropdowns */}
            <div className="hidden sm:flex gap-3 lg:gap-4">
               {/* Subject Dropdown */}
               <select
                  name="Subject"
                  value={selectedSubject || ""}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 lg:py-2.5 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px] lg:min-w-[160px] appearance-none cursor-pointer text-sm lg:text-base"
               >
                  <option value="all">All Subjects</option>
                  {subjects.map((item) => (
                     <option key={item._id} value={item._id}>
                        {item.name}
                     </option>
                  ))}
               </select>
               
               <select
                  name="Desc"
                  value={selectedDesc}
                  onChange={(e) => setSelectedDesc(e.target.value)}
                  className="px-3 py-2 lg:py-2.5 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[120px] lg:min-w-[140px] appearance-none cursor-pointer text-sm lg:text-base"
               >
                  <option value="Lecture">Lecture</option>
                  <option value="Test">Test</option>
               </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
               onClick={toggleMobileFilters}
               className="sm:hidden flex items-center gap-2 px-3 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
            >
               <FaFilter className="text-sm" />
               <span className="text-sm">Filters</span>
            </button>
         </div>

         {/* Mobile Filters Dropdown */}
         {showMobileFilters && (
            <div className="sm:hidden mb-6 p-4 bg-white rounded-lg shadow-md border border-light-gray">
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-charcoal-gray mb-2">
                        Subject
                     </label>
                     <select
                        name="Subject"
                        value={selectedSubject || ""}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200"
                     >
                        <option value="all">All Subjects</option>
                        {subjects.map((item) => (
                           <option key={item._id} value={item._id}>
                              {item.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-charcoal-gray mb-2">
                        Type
                     </label>
                     <select
                        name="Desc"
                        value={selectedDesc}
                        onChange={(e) => setSelectedDesc(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200"
                     >
                        <option value="Lecture">Lecture</option>
                        <option value="Test">Test</option>
                     </select>
                  </div>
               </div>
            </div>
         )}

         {/* Standards Filter Section */}
         <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <FaGraduationCap className="text-charcoal-gray text-lg sm:text-xl" />
                  <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray">
                     Filter by Standard
                  </h2>
               </div>
               <div className="flex gap-2 sm:gap-4 flex-wrap">
                  {/* All Standards Button */}
                  <button
                     onClick={() => setSelectedStandard("All")}
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
                           onClick={() => setSelectedStandard(standard._id)}
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

            {/* Info Card */}
            <div className="flex-shrink-0">
               <div className="bg-light-gray/50 p-3 sm:p-4 rounded-xl shadow-lg border border-light-gray min-w-[140px] sm:min-w-[160px]">
                  <h3 className="text-xs sm:text-sm font-semibold text-charcoal-gray mb-1">
                     {selectedDesc} Count
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{lectures?.length || 0}</p>
                  <p className="text-xs text-slate-gray truncate">
                     {selectedStandard === "All"
                        ? "All Standards"
                        : standards.find(s => s._id === selectedStandard)?.standardName || "Standard"}
                  </p>
               </div>
            </div>
         </div>

         {/* Lectures Grid */}
         {lectures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               {lectures.map((lecture) => (
                  <div
                     key={lecture._id}
                     className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-gray hover:border-charcoal-gray/20 hover:-translate-y-1"
                  >
                     <LectureCard
                        lecture={lecture}
                        isPastDate={isPastDate}
                        handleDeleteClick={handleDeleteClick}
                     />
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <div className="bg-light-gray/30 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                  <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
                  <p className="text-medium-gray text-lg sm:text-xl mb-2">
                     No {selectedDesc.toLowerCase()}s found
                  </p>
                  <p className="text-slate-gray text-sm sm:text-base">
                     Try adjusting your filters or create a new {selectedDesc.toLowerCase()}
                  </p>
               </div>
            </div>
         )}

         {showDeleteModal && (
            <Modal
               title="Delete Lecture"
               description={`Are you sure you want to delete the lecture for ${
                  selectedLecture?.subject?.name
               } on ${format(new Date(selectedLecture?.date), "PPP")}?`}
               btn1={{
                  text: "Delete",
                  onClick: handleDeleteConfirm,
               }}
               btn2={{
                  text: "Cancel",
                  onClick: handleDeleteCancel,
               }}
            />
         )}
      </div>
   );
}

export default LectureList;

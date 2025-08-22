import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowLeftLong, FaBook, FaCode } from "react-icons/fa6";
import {
   deleteSubject,
   getAllSubjects,
} from "../../../../../services/operations/subject.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../../extras/Modal";
import { setEditingSubject } from "../../../../../slices/subject.slice";

function GetAllSubjects() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [subjects, setSubjects] = useState([]);
   const [filteredSubjects, setFilteredSubjects] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedSubject, setSelectedSubject] = useState(null);

   const getAllSubjectsData = async () => {
      try {
         const result = await dispatch(getAllSubjects(token));
         if (result) {
            setSubjects(result);
            setFilteredSubjects(result);
         }
      } catch (error) {
         console.error("Error fetching subjects:", error);
         toast.error("Failed to fetch subjects");
      }
   };

   useEffect(() => {
      getAllSubjectsData();
   }, []);

   // Search functionality
   // useEffect(() => {
   //    if (!searchTerm.trim()) {
   //       setFilteredSubjects(subjects);
   //    } else {
   //       const filtered = subjects.filter((subject) =>
   //          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   //          subject.code.toLowerCase().includes(searchTerm.toLowerCase())
   //       );
   //       setFilteredSubjects(filtered);
   //    }
   // }, [searchTerm, subjects]);

   const handleEdit = (subject) => {
      dispatch(setEditingSubject(subject));
      navigate("/dashboard/assigns/subjects/create-subject");
   };

   const handleDeleteClick = (subject) => {
      setSelectedSubject(subject);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      if (!selectedSubject?._id) {
         toast.error("No subject selected for deletion");
         setShowDeleteModal(false);
         return;
      }

      try {
         const result = await dispatch(
            deleteSubject(selectedSubject._id, token)
         );
         if (result) {
            toast.success("Subject deleted successfully");
         }
         await getAllSubjectsData();
         setShowDeleteModal(false);
         setSelectedSubject(null);
      } catch (error) {
         console.error("Error deleting subject:", error);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setSelectedSubject(null);
   };

   return (
      <div className="p-3 sm:p-4 lg:p-6">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaBook className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  All Subjects
               </h1>
            </div>
            <button
               onClick={() => navigate("/dashboard/assigns")}
               className="flex items-center gap-2 px-3 py-2 bg-light-gray text-charcoal-gray rounded-lg hover:bg-slate-200 hover:text-white transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Search Bar */}
         {/* <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
               <input
                  type="text"
                  placeholder="Search by subject name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               />
            </div>
            {searchTerm && (
               <div className="mt-2">
                  <p className="text-sm text-medium-gray">
                     Found {filteredSubjects.length} of {subjects.length} subjects
                  </p>
               </div>
            )}
         </div> */}

         {/* Subjects Count */}
         <div className="mb-6">
            <p className="text-medium-gray font-medium">
               Total Subjects: <span className="text-charcoal-gray font-semibold">{subjects.length}</span>
               {searchTerm && (
                  <span className="ml-2">
                     | Showing: <span className="text-charcoal-gray font-semibold">{filteredSubjects.length}</span>
                  </span>
               )}
            </p>
         </div>

         {/* Subjects Grid - Responsive */}
         {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               {filteredSubjects.map((subject) => (
                  <div
                     key={subject._id}
                     className="bg-white border border-light-gray p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                     {/* Subject Header */}
                     <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-charcoal-gray/10 rounded-lg flex-shrink-0">
                           <FaBook className="text-charcoal-gray text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-charcoal-gray text-lg sm:text-xl font-semibold mb-1 truncate">
                              {subject.name}
                           </h3>
                           <div className="flex items-center gap-2 text-medium-gray">
                              <FaCode className="text-sm flex-shrink-0" />
                              <span className="text-sm font-medium truncate">Code: {subject.code}</span>
                           </div>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex gap-3 justify-end pt-4 border-t border-light-gray">
                        <button
                           onClick={() => handleEdit(subject)}
                           className="p-2 sm:p-3 bg-charcoal-gray rounded-xl text-white cursor-pointer hover:bg-medium-gray transition-all duration-200 group-hover:scale-105"
                           title="Edit Subject"
                        >
                           <FaEdit className="text-sm" />
                        </button>
                        <button
                           onClick={() => handleDeleteClick(subject)}
                           className="p-2 sm:p-3 bg-light-gray text-slate-gray rounded-xl cursor-pointer hover:bg-charcoal-gray hover:text-white transition-all duration-200 group-hover:scale-105"
                           title="Delete Subject"
                        >
                           <RiDeleteBin6Line className="text-sm" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaSearch className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2 px-4">
                  {searchTerm 
                     ? `No subjects found matching "${searchTerm}"`
                     : "No subjects found"
                  }
               </p>
               <p className="text-slate-gray text-sm sm:text-base px-4">
                  {searchTerm
                     ? "Try adjusting your search terms"
                     : "Create your first subject to get started"
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

         {/* Delete Modal */}
         {showDeleteModal && (
            <Modal
               title="Delete Subject"
               description={`Are you sure you want to delete "${selectedSubject?.name}"?`}
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

export default GetAllSubjects;

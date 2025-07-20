import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaArrowLeftLong, FaBook, FaCode } from "react-icons/fa6";
import {
   deleteSubject,
   getAllSubjects,
} from "../../../../services/operations/subject.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../extras/Modal";
import { setEditingSubject } from "../../../../slices/subject.slice";

function GetAllSubjects() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [subjects, setSubjects] = useState([]);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedSubject, setSelectedSubject] = useState(null);

   const getAllSubjectsData = async () => {
      try {
         const result = await dispatch(getAllSubjects(token));
         if (result) {
            setSubjects(result);
         }
      } catch (error) {
         console.error("Error fetching subjects:", error);
         toast.error("Failed to fetch subjects");
      }
   };

   useEffect(() => {
      getAllSubjectsData();
   }, []);

   const handleEdit = (subject) => {
      dispatch(setEditingSubject(subject));
      navigate("/dashboard/admin-subjects/create-subject");
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
      <div className="p-6">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <FaBook className="text-charcoal-gray text-2xl" />
               <h3 className="text-3xl font-semibold text-charcoal-gray">
                  All Subjects
               </h3>
            </div>
            <button
               onClick={() => navigate("/dashboard/admin-subjects")}
               className="flex items-center gap-2 cursor-pointer text-charcoal-gray px-4 py-2  hover:bg-slate-200 hover:text-white rounded-xl transition-all bg-light-gray duration-200"
            >
               <FaArrowLeftLong className="text-lg" />
               <span>Back</span>
            </button>
         </div>

         {/* Subjects Count */}
         <div className="mb-6">
            <p className="text-medium-gray font-medium">
               Total Subjects: <span className="text-charcoal-gray font-semibold">{subjects.length}</span>
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
               <div
                  key={subject._id}
                  className="bg-white border border-light-gray p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
               >
                  {/* Subject Header */}
                  <div className="flex items-start gap-3 mb-4">
                     <div className="p-2 bg-charcoal-gray/10 rounded-lg">
                        <FaBook className="text-charcoal-gray text-lg" />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-charcoal-gray text-xl font-semibold mb-1">
                           {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 text-medium-gray">
                           <FaCode className="text-sm" />
                           <span className="text-sm font-medium">Code: {subject.code}</span>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-light-gray">
                     <button
                        onClick={() => handleEdit(subject)}
                        className="p-3 bg-charcoal-gray rounded-xl text-white cursor-pointer hover:bg-medium-gray transition-all duration-200 group-hover:scale-105"
                        title="Edit Subject"
                     >
                        <FaEdit className="text-sm" />
                     </button>
                     <button
                        onClick={() => handleDeleteClick(subject)}
                        className="p-3 bg-light-gray text-slate-gray rounded-xl cursor-pointer hover:bg-charcoal-gray hover:text-white transition-all duration-200 group-hover:scale-105"
                        title="Delete Subject"
                     >
                        <RiDeleteBin6Line className="text-sm" />
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {/* Empty State */}
         {subjects.length === 0 && (
            <div className="text-center py-12">
               <FaBook className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl">No subjects found</p>
               <p className="text-slate-gray">Create your first subject to get started</p>
            </div>
         )}

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

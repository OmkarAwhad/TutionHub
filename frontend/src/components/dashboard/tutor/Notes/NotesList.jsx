import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyDetails } from "../../../../services/operations/users.service";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";
import TutorNotesCard from "./TutorNotesCard";
import Modal from "../../extras/Modal";
import { deleteNote } from "../../../../services/operations/notes.service";
import { getAllStandards } from "../../../../services/operations/standard.service";

function NotesList() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [allNotes, setAllNotes] = useState(null);
   const [myNotes, setMyNotes] = useState(null);
   const [selectedNote, setSelectedNote] = useState(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [standardsList, setStandardsList] = useState([]);
   const [selectedStandard, setSelectedStandard] = useState("All");

   useEffect(() => {
      const fetchStandards = async () => {
         try {
            const response = await dispatch(getAllStandards(token));
            if (response) {
               setStandardsList(response.standards || response);
            }
         } catch (error) {
            console.error("Error in fetching standards:", error);
            toast.error("Error in fetching standards");
         }
      };
      fetchStandards();
   }, [dispatch, token]);

   const handleDeleteClick = (note) => {
      setSelectedNote(note);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      try {
         if (!selectedNote?._id) {
            toast.error("No note selected for deletion");
            setShowDeleteModal(false);
            return;
         }
         await dispatch(deleteNote(selectedNote._id, token));
         await fetchMyNotes();
         setShowDeleteModal(false);
         setSelectedNote(null);
      } catch (error) {
         console.error("Error deleting note:", error);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setSelectedNote(null);
   };

   const fetchMyNotes = async () => {
      try {
         let response = await dispatch(getMyDetails(token));
         if (response) {
            setAllNotes(response?.notes);
         }
      } catch (error) {
         console.log("Error in fetching my notes", error);
         toast.error("Error in fetching my notes");
      }
   };

   useEffect(() => {
      fetchMyNotes();
   }, [dispatch, token]);

   useEffect(() => {
      if (allNotes) {
         if (selectedStandard !== "All") {
            const filtered = allNotes.filter(
               (note) => note.standard._id === selectedStandard
            );
            setMyNotes(filtered);
         } else {
            setMyNotes(allNotes);
         }
      }
   }, [allNotes, selectedStandard]);

   const handleStandardClick = (standardId) => {
      setSelectedStandard(standardId);
   };

   return (
      <div className="p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">My Notes</h1>
            <div
               onClick={() => navigate(-1)}
               className="flex cursor-pointer gap-2 text-charcoal-gray items-center self-start sm:self-auto"
            >
               <IoMdArrowRoundBack />
               Back
            </div>
         </div>

         {/* Standards Filter Section */}
         <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <FaGraduationCap className="text-charcoal-gray text-lg sm:text-xl" />
                  <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray">
                     Filter by Standard
                  </h2>
               </div>
               
               {/* Filter Buttons */}
               <div className="flex flex-wrap gap-2 sm:gap-4">
                  {/* All Standards Button */}
                  <button
                     onClick={() => handleStandardClick("All")}
                     className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base ${
                        selectedStandard === "All"
                           ? "bg-medium-gray text-white shadow-xl shadow-charcoal-gray/30"
                           : "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
                     }`}
                  >
                     <div className="flex items-center gap-2">
                        <FaGraduationCap className="text-xs sm:text-sm" />
                        All Standards
                     </div>
                  </button>

                  {/* Dynamic Standards Buttons */}
                  {standardsList &&
                     standardsList.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => handleStandardClick(standard._id)}
                           className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base ${
                              selectedStandard === standard._id
                                 ? "bg-medium-gray text-white shadow-xl shadow-charcoal-gray/30"
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
               <div className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow-lg min-w-[140px] sm:min-w-[160px]">
                  <h3 className="text-xs sm:text-sm font-semibold text-charcoal-gray mb-1">
                     Notes Count
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">
                     {myNotes?.length || 0}
                  </p>
                  <p className="text-xs text-charcoal-gray truncate">
                     {selectedStandard === "All"
                        ? "All Standards"
                        : standardsList.find((s) => s._id === selectedStandard)?.standardName || "Standard"}
                  </p>
               </div>
            </div>
         </div>

         {/* Notes Grid */}
         <div className="py-2">
            {myNotes && myNotes.length === 0 ? (
               <div className="text-center py-8 sm:py-12">
                  <FaGraduationCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg sm:text-xl mb-2">
                     No notes available for{" "}
                     {selectedStandard === "All"
                        ? "any standard"
                        : standardsList.find((s) => s._id === selectedStandard)?.standardName || "this standard"}
                  </p>
                  <p className="text-gray-400 text-sm sm:text-base">
                     Try selecting a different standard or upload new notes
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {myNotes &&
                     myNotes.map((note) => (
                        <TutorNotesCard
                           key={note._id}
                           note={note}
                           handleDeleteClick={handleDeleteClick}
                        />
                     ))}
               </div>
            )}
         </div>

         {showDeleteModal && (
            <Modal
               title="Delete Note"
               description={`Are you sure you want to delete this note?`}
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

export default NotesList;

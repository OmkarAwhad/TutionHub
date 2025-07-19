import React, { useEffect, useState } from "react";
import { getMyDetails } from "../../../../services/operations/users.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";
import Modal from "../../extras/Modal";
import TutorHomeworkCard from "./TutorHomeworkCard";
import { deleteHomework } from "../../../../services/operations/homework.service";
import { getAllStandards } from "../../../../services/operations/standard.service";

function HomeworkList() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [allHomeworks, setAllHomeworks] = useState(null);
   const [myHomework, setMyHomework] = useState([]);
   const [selectedHomework, setSelectedHomework] = useState(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [standardsList, setStandardsList] = useState([]);
   const [selectedStandard, setSelectedStandard] = useState("All");

   const fetchMyDetails = async () => {
      try {
         const response = await dispatch(getMyDetails(token));
         if (response) {
            setAllHomeworks(response.homework);
         }
      } catch (error) {
         toast.error("Error in fetching your details");
      }
   };

   useEffect(() => {
      fetchMyDetails();
   }, [dispatch, token]);

   useEffect(() => {
      if (allHomeworks) {
         if (selectedStandard !== "All") {
            const filtered = allHomeworks.filter(
               (hw) => hw.standard._id === selectedStandard
            );
            setMyHomework(filtered);
         } else {
            setMyHomework(allHomeworks);
         }
      }
   }, [allHomeworks, selectedStandard]);

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

   const handleDeleteClick = (hw) => {
      setSelectedHomework(hw);
      setShowDeleteModal(true);
   };

   const handleDeleteConfirm = async () => {
      try {
         if (!selectedHomework?._id) {
            toast.error("No homework selected for deletion");
            setShowDeleteModal(false);
            return;
         }
         await dispatch(deleteHomework(selectedHomework._id, token));
         await fetchMyDetails();
         setShowDeleteModal(false);
         setSelectedHomework(null);
      } catch (error) {
         console.error("Error deleting homework:", error);
      }
   };

   const handleDeleteCancel = () => {
      setShowDeleteModal(false);
      setSelectedHomework(null);
   };

   const handleStandardClick = (standardId) => {
      setSelectedStandard(standardId);
   };

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal-gray">My Homeworks</h1>
            <button
               onClick={() => navigate(-1)}
               className="flex cursor-pointer gap-2 text-charcoal-gray items-center px-4 py-2 bg-light-gray hover:bg-medium-gray hover:text-white rounded-xl transition-all duration-200"
            >
               <IoMdArrowRoundBack />
               <span>Back</span>
            </button>
         </div>

         {/* Standards Filter Buttons */}
         <div className="mb-4 flex gap-6">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-4">
                  <FaGraduationCap className="text-charcoal-gray text-xl" />
                  <h2 className="text-xl font-semibold text-charcoal-gray">
                     Filter by Standard
                  </h2>
               </div>
               <div className="flex gap-4">
                  {/* All Standards Button */}
                  <button
                     onClick={() => handleStandardClick("All")}
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
                  {standardsList &&
                     standardsList.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => handleStandardClick(standard._id)}
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

            {/* Info Card */}
            <div className="flex-shrink-0">
               <div className="bg-light-gray/50 p-4 rounded-xl shadow-lg border border-light-gray min-w-[160px]">
                  <h3 className="text-sm font-semibold text-charcoal-gray mb-1">Homework Count</h3>
                  <p className="text-2xl font-bold text-charcoal-gray">{myHomework?.length || 0}</p>
                  <p className="text-xs text-slate-gray">
                     {selectedStandard === "All"
                        ? "All Standards"
                        : standardsList.find(s => s._id === selectedStandard)?.standardName || "Standard"}
                  </p>
               </div>
            </div>
         </div>

         <div className="py-2">
            {myHomework && myHomework.length === 0 ? (
               <div className="text-center py-12">
                  <FaGraduationCap className="mx-auto h-16 w-16 text-slate-gray mb-4" />
                  <p className="text-medium-gray text-xl mb-2">
                     No homework available for {
                        selectedStandard === "All"
                           ? "any standard"
                           : standardsList.find(s => s._id === selectedStandard)?.standardName || "this standard"
                     }
                  </p>
                  <p className="text-slate-gray">
                     Try selecting a different standard or create new homework
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myHomework &&
                     myHomework.map((homework) => (
                        <TutorHomeworkCard
                           key={homework._id}
                           homework={homework}
                           handleDeleteClick={handleDeleteClick}
                        />
                     ))}
               </div>
            )}
         </div>
         {showDeleteModal && (
            <Modal
               title="Delete Homework"
               description={`Are you sure you want to delete "${selectedHomework?.title}"?`}
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

export default HomeworkList;

import React, { useEffect, useState } from "react";
import { getMyDetails } from "../../../../services/operations/users.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGraduationCap, FaBook, FaClock } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { setSelectHomework } from "../../../../slices/homework.slice";
import { getAllStandards } from "../../../../services/operations/standard.service";

function ViewSubmissions() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [allHomeworks, setAllHomeworks] = useState(null);
   const [myHomework, setMyHomework] = useState([]);
   const [standardsList, setStandardsList] = useState([]);
   const [selectedStandard, setSelectedStandard] = useState("All");

   useEffect(() => {
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

   const handleStandardClick = (standardId) => {
      setSelectedStandard(standardId);
   };

   return (
      <div className="p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">View Submissions</h1>
            <button
               onClick={() => navigate(-1)}
               className="flex cursor-pointer gap-2 text-charcoal-gray items-center px-3 py-2 sm:px-4 sm:py-2 bg-light-gray hover:bg-medium-gray hover:text-white rounded-xl transition-all duration-200 self-start sm:self-auto"
            >
               <IoMdArrowRoundBack />
               <span>Back</span>
            </button>
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
               
               <div className="flex flex-wrap gap-2 sm:gap-4">
                  {/* All Standards Button */}
                  <button
                     onClick={() => handleStandardClick("All")}
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
                  {standardsList &&
                     standardsList.map((standard) => (
                        <button
                           key={standard._id}
                           onClick={() => handleStandardClick(standard._id)}
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
                  <h3 className="text-xs sm:text-sm font-semibold text-charcoal-gray mb-1">Homework Count</h3>
                  <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{myHomework?.length || 0}</p>
                  <p className="text-xs text-slate-gray truncate">
                     {selectedStandard === "All"
                        ? "All Standards"
                        : standardsList.find(s => s._id === selectedStandard)?.standardName || "Standard"}
                  </p>
               </div>
            </div>
         </div>

         <div className="py-2">
            {myHomework && myHomework.length === 0 ? (
               <div className="text-center py-8 sm:py-12">
                  <FaGraduationCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
                  <p className="text-medium-gray text-lg sm:text-xl mb-2">
                     No homework available for {
                        selectedStandard === "All"
                           ? "any standard"
                           : standardsList.find(s => s._id === selectedStandard)?.standardName || "this standard"
                     }
                  </p>
                  <p className="text-slate-gray text-sm sm:text-base">
                     Try selecting a different standard or create new homework
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {myHomework &&
                     myHomework.map((homework) => (
                        <div
                           key={homework._id}
                           onClick={() => {
                              dispatch(setSelectHomework(homework));
                              navigate(
                                 `/dashboard/tutor-homework/view-submissions/${homework._id}`
                              );
                           }}
                           className="group relative bg-white p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-gray hover:border-charcoal-gray/20 hover:-translate-y-1 cursor-pointer"
                        >
                           {/* Header */}
                           <div className="mb-3 sm:mb-4">
                              <h3 className="text-lg sm:text-xl font-bold text-charcoal-gray mb-2 line-clamp-2">
                                 {homework.title}
                              </h3>
                              <div className="flex items-center gap-2 text-medium-gray">
                                 <FaBook className="text-sm flex-shrink-0" />
                                 <span className="text-xs sm:text-sm font-medium truncate">
                                    {homework.subject.name} ({homework.subject.code})
                                 </span>
                              </div>
                           </div>

                           {/* Info Grid */}
                           <div className="space-y-1 mb-3 sm:mb-4">
                              {/* Standard */}
                              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray/50 rounded-xl">
                                 <FaGraduationCap className="text-charcoal-gray text-sm flex-shrink-0" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-gray font-medium">Standard</p>
                                    <p className="text-xs sm:text-sm text-charcoal-gray font-semibold truncate">
                                       {homework.standard.standardName}
                                    </p>
                                 </div>
                              </div>

                              {/* Upload Date */}
                              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray/30 rounded-xl">
                                 <FaCalendarAlt className="text-medium-gray text-sm flex-shrink-0" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-gray font-medium">Uploaded</p>
                                    <p className="text-xs sm:text-sm text-charcoal-gray font-semibold">
                                       {new Date(homework.createdAt).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                       })}
                                    </p>
                                 </div>
                              </div>

                              {/* Due Date */}
                              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray/30 rounded-xl">
                                 <FaClock className="text-medium-gray text-sm flex-shrink-0" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-gray font-medium">Due Date</p>
                                    <p className="text-xs sm:text-sm text-charcoal-gray font-semibold">
                                       {new Date(homework.dueDate).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                       })}
                                    </p>
                                 </div>
                                 {/* Status Badge */}
                                 <div className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                                    new Date(homework.dueDate) < new Date()
                                       ? "bg-charcoal-gray text-white"
                                       : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                                       ? "bg-medium-gray text-white"
                                       : "bg-slate-gray text-white"
                                 }`}>
                                    <span className="hidden sm:inline">
                                       {new Date(homework.dueDate) < new Date()
                                          ? "Overdue"
                                          : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                                          ? "Due Soon"
                                          : "Active"}
                                    </span>
                                    <span className="sm:hidden">
                                       {new Date(homework.dueDate) < new Date()
                                          ? "Late"
                                          : new Date(homework.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                                          ? "Soon"
                                          : "OK"}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {/* Click Indicator */}
                           <div className="text-center pt-2 sm:pt-3 border-t border-light-gray">
                              <p className="text-xs text-slate-gray group-hover:text-charcoal-gray transition-colors">
                                 Click to view submissions
                              </p>
                           </div>

                           {/* Hover Effect */}
                           <div className="absolute inset-0 rounded-2xl bg-light-gray/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                     ))}
               </div>
            )}
         </div>
      </div>
   );
}

export default ViewSubmissions;

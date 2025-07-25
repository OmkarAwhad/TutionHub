import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStudentsAllNotes } from "../../../../services/operations/notes.service";
import NotesCard from "./NotesCard";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { FaBook, FaStickyNote } from "react-icons/fa";
import toast from "react-hot-toast";

function Notes() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [allNotes, setAllNotes] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [selectedSub, setSelectedSub] = useState("all");

   useEffect(() => {
      const fetchAllSubjects = async () => {
         try {
            const response = await dispatch(getAllSubjects(token));
            if (response) {
               setSubjects(response);
            }
         } catch (error) {
            console.error("Failed to fetch subjects:", error);
            toast.error("Failed to fetch subjects. Please try again later.");
         }
      };
      fetchAllSubjects();
   }, [dispatch, token]);

   useEffect(() => {
      const fetchAllNotes = async () => {
         try {
            let result = await dispatch(getStudentsAllNotes(token));
            if (result) {
               if (selectedSub !== "all") {
                  result = result.filter(
                     (item) => item.subject._id === selectedSub
                  );
               }
               setAllNotes(result);
            }
         } catch (error) {
            console.error("Failed to fetch notes:", error);
            toast.error("Failed to fetch notes. Please try again later.");
         }
      };

      fetchAllNotes();
   }, [dispatch, token, selectedSub]);

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaStickyNote className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Notes</h1>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-3">
               <div className="relative">
                  <select
                     className="w-full sm:w-auto pl-3 pr-8 py-2 sm:pl-10 sm:pr-4 sm:py-3 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px] sm:min-w-[160px] appearance-none cursor-pointer text-sm sm:text-base"
                     name="subjects"
                     id="subjects"
                     onChange={(e) => setSelectedSub(e.target.value)}
                  >
                     <option value="all">All Subjects</option>
                     {subjects &&
                        subjects.map((sub) => (
                           <option key={sub._id} value={sub._id}>
                              {sub.name}
                           </option>
                        ))}
                  </select>
                  {/* Icon for mobile */}
                  <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray text-sm sm:hidden" />
               </div>
            </div>
         </div>

         {/* Notes Count */}
         <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-medium-gray font-medium">
               Total Notes: <span className="text-charcoal-gray font-semibold">{allNotes.length}</span>
            </p>
         </div>

         {/* Notes Grid */}
         {allNotes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
               <FaStickyNote className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2">No notes available</p>
               <p className="text-slate-gray text-sm sm:text-base">
                  {selectedSub !== "all" 
                     ? "Try selecting a different subject or check back later"
                     : "Check back later for new study materials"}
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
               {allNotes.map((note) => (
                  <NotesCard key={note._id} note={note} />
               ))}
            </div>
         )}
      </div>
   );
}

export default Notes;

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
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaStickyNote className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Notes</h1>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-3">
               <div className="relative">
                  <select
                     className="pl-10 pr-4 py-3 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[160px] appearance-none cursor-pointer"
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
               </div>
            </div>
         </div>

         {/* Notes Count */}
         <div className="mb-6">
            <p className="text-medium-gray font-medium">
               Total Notes: <span className="text-charcoal-gray font-semibold">{allNotes.length}</span>
            </p>
         </div>

         {/* Notes Grid */}
         {allNotes.length === 0 ? (
            <div className="text-center py-12">
               <FaStickyNote className="mx-auto h-16 w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-xl mb-2">No notes available</p>
               <p className="text-slate-gray">
                  {selectedSub !== "all" 
                     ? "Try selecting a different subject or check back later"
                     : "Check back later for new study materials"}
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {allNotes.map((note) => (
                  <NotesCard key={note._id} note={note} />
               ))}
            </div>
         )}
      </div>
   );
}

export default Notes;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { toast } from "react-hot-toast";
import LectureTable from "./LectureTable";
import { getMyLecturesByDate } from "../../../../services/operations/lecture.service";

function Lecture() {
   const { token } = useSelector((state) => state.auth);
   const [lectList, setLectList] = useState({});
   const [weekStart, setWeekStart] = useState("");
   const [weekEnd, setWeekEnd] = useState("");
   const [loading, setLoading] = useState(false);
   const [currentDate, setCurrentDate] = useState(new Date());

   useEffect(() => {
      fetchLecturesOfWeek();
   }, []);

   const fetchLecturesOfWeek = async () => {
      setLoading(true);
      try {
         const formattedDate = currentDate.toISOString().split('T')[0];
         const response = await getMyLecturesByDate(token, formattedDate, true);

         if (response) {
            setLectList(response.lectures || {});
            setWeekStart(response.weekStart || "");
            setWeekEnd(response.weekEnd || "");
         }
      } catch (error) {
         console.error("Failed to fetch lectures of the week:", error);
         toast.error("Failed to load weekly lectures");
      } finally {
         setLoading(false);
      }
   };

   const handleWeekShift = (direction) => {
      setLoading(true);
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (direction * 7));
      setCurrentDate(newDate);

      const formattedDate = newDate.toISOString().split('T')[0];
      getMyLecturesByDate(token, formattedDate, true)
         .then(response => {
            if (response) {
               setLectList(response.lectures || {});
               setWeekStart(response.weekStart || "");
               setWeekEnd(response.weekEnd || "");
            }
         })
         .catch(error => {
            console.error("Failed to fetch lectures by date:", error);
            toast.error("Failed to load lectures for the selected week");
         })
         .finally(() => {
            setLoading(false);
         });
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Weekly Schedule</h1>
            </div>

            {/* Week Navigation Controls (Desktop & Mobile Week Navigation) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
               <div className="flex items-center gap-2 text-medium-gray">
                  <FaCalendarWeek className="text-base sm:text-lg" />
                  <span className="text-xs sm:text-sm font-medium">Navigate Weeks</span>
               </div>
               <div className="flex gap-2">
                  <button
                     onClick={() => handleWeekShift(-1)}
                     className="p-2 sm:p-3 bg-slate-gray text-white rounded-xl cursor-pointer hover:bg-medium-gray transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={loading}
                     aria-label="Previous week"
                  >
                     <IoIosArrowBack className="text-base sm:text-lg" />
                  </button>
                  <button
                     onClick={() => handleWeekShift(1)}
                     className="p-2 sm:p-3 bg-slate-gray text-white rounded-xl cursor-pointer hover:bg-medium-gray transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={loading}
                     aria-label="Next week"
                  >
                     <IoIosArrowForward className="text-base sm:text-lg" />
                  </button>
               </div>
            </div>
         </div>

         {/* Loading State */}
         {loading && (
            <div className="text-center py-6 sm:py-8">
               <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray mx-auto mb-4"></div>
               <p className="text-medium-gray text-sm sm:text-base">Loading lectures...</p>
            </div>
         )}

         {/* Lecture Table */}
         {!loading && (
            <LectureTable
               weekStart={weekStart}
               weekEnd={weekEnd}
               lectList={lectList}
            />
         )}
      </div>
   );
}

export default Lecture;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import { viewMyAttendance } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong, FaChartPie, FaCalendarCheck } from "react-icons/fa6";
import AttendChart from "./AttendChart";
import AttendForSub from "./AttendForSub";

function Attendance() {
   const { token } = useSelector((s) => s.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { userId } = useParams(); // Get userId from URL params

   const [subjects, setSubjects] = useState([]);
   const [studAttendStats, setStudAttendStats] = useState(null);

   useEffect(() => {
      (async () => {
         try {
            let resp;
            if (userId) {
               // Admin viewing specific student's attendance
               resp = await dispatch(viewMyAttendance(userId, token));
            } else {
               // Student viewing their own attendance
               resp = await dispatch(viewMyAttendance(null, token));
            }
            if (resp) setStudAttendStats(resp.statistics);
         } catch (e) {
            console.error(e);
         }
      })();
   }, [dispatch, token, userId]);

   useEffect(() => {
      (async () => {
         try {
            let result;
            if (userId) {
               // Admin viewing specific student's subjects
               result = await dispatch(subjectsOfAUser(userId, token));
            } else {
               // Student/Tutor viewing their own subjects
               result = await dispatch(subjectsOfAUser(null, token));
            }
            if (result) setSubjects(result);
         } catch (e) {
            console.error(e);
         }
      })();
   }, [dispatch, token, userId]); // Add userId to dependencies

   return (
      <div className="p-4 sm:p-6 space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
               <FaCalendarCheck className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  {userId ? "Student " : ""}Attendance
               </h1>
            </div>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               Back
            </button>
         </div>

         {/* Subject-wise */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <AttendForSub subjects={subjects} userId={userId} />
         </div>

         {/* Overall */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="p-4 border-b border-light-gray">
               <div className="flex items-center gap-2">
                  <FaChartPie className="text-charcoal-gray" />
                  <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray">
                     Overall Statistics
                  </h2>
               </div>
            </div>
            <AttendChart studAttendStats={studAttendStats} />
         </div>
      </div>
   );
}

export default Attendance;

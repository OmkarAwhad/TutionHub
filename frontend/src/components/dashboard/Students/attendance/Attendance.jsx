import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import { viewAttendanceOfAStud } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong, FaChartPie, FaCalendarCheck } from "react-icons/fa6";
import AttendChart from "./AttendChart";
import AttendForSub from "./AttendForSub";

function Attendance() {
   const { token } = useSelector((state) => state.auth);
   const [subjects, setSubjects] = useState(null);
   const [studAttendLec, setStudAttendLec] = useState(null);
   const [studAttendStats, setStudAttendStats] = useState(null);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const fetchStudentAttend = async () => {
         try {
            const response = await dispatch(viewAttendanceOfAStud(token));
            if (response) {
               setStudAttendLec(response.attendanceDetails);
               setStudAttendStats(response.statistics);
            }
         } catch (error) {
            console.error("Error fetching attendance:", error);
         }
      };
      fetchStudentAttend();
   }, [dispatch, token]);

   useEffect(() => {
      const fetchSubjects = async () => {
         try {
            const result = await dispatch(subjectsOfAUser(token));
            if (result) {
               setSubjects(result);
            }
         } catch (error) {
            console.error("Error fetching subjects:", error);
         }
      };
      fetchSubjects();
   }, [dispatch, token]);

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaCalendarCheck className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Attendance</h1>
            </div>

            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Subject-wise Attendance Table */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray mb-6 overflow-hidden">
            {/* <div className="p-4 border-b border-light-gray">
               <h2 className="text-lg font-semibold text-charcoal-gray">Subject-wise Attendance</h2>
            </div> */}
            <AttendForSub subjects={subjects} />
         </div>

         {/* Overall Statistics */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="p-4 border-b border-light-gray">
               <div className="flex items-center gap-2">
                  <FaChartPie className="text-charcoal-gray" />
                  <h2 className="text-lg font-semibold text-charcoal-gray">Overall Statistics</h2>
               </div>
            </div>
            <AttendChart studAttendStats={studAttendStats} />
         </div>
      </div>
   );
}

export default Attendance;

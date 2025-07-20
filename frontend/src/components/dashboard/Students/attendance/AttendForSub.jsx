import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attendAccToSub } from "../../../../services/operations/attendance.service";

function AttendForSub({ subjects }) {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const [attendanceData, setAttendanceData] = useState({});
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchAttendance = async () => {
         if (!subjects || !token) return;

         setLoading(true);
         const data = {};
         for (const subject of subjects) {
            try {
               const result = await dispatch(attendAccToSub(subject._id, token));
               if (result) {
                  data[subject._id] = result;
               }
            } catch (error) {
               console.error(`Error fetching attendance for subject ${subject.name}:`, error);
            }
         }
         setAttendanceData(data);
         setLoading(false);
      };

      fetchAttendance();
   }, [subjects, token, dispatch]);

   if (loading) {
      return (
         <div className="p-6 text-center">
            <p className="text-medium-gray">Loading attendance data...</p>
         </div>
      );
   }

   if (!subjects || subjects.length === 0) {
      return (
         <div className="p-6 text-center">
            <p className="text-medium-gray">No subjects available</p>
         </div>
      );
   }

   return (
      <div className="overflow-x-auto">
         <table className="w-full">
            <thead className="bg-light-gray">
               <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">Subject Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Total Lectures</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Marked Lectures</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Present</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Absent</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Percentage</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
               {subjects.map((subject) => {
                  const stats = attendanceData[subject._id]?.statistics;
                  return (
                     <tr key={subject._id} className="hover:bg-light-gray/30">
                        <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                           {subject.name}
                           <div className="text-xs text-slate-gray">({subject.code})</div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                           {stats?.totalLectures ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                           {stats?.markedLectures ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                           {stats?.present ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                           {stats?.absent ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                           {stats?.percentage && !isNaN(parseFloat(stats.percentage)) 
                              ? stats.percentage 
                              : "0.00%"
                           }
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
}

export default AttendForSub;

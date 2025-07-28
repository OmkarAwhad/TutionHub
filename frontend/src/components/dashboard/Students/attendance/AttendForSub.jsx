import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { attendAccToSub } from "../../../../services/operations/attendance.service";

function AttendForSub({ subjects }) {
   const { token } = useSelector((s) => s.auth);
   const { userId } = useParams(); // Get userId from URL params
   const dispatch = useDispatch();
   const [attendanceData, setAttendanceData] = useState({});
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!subjects?.length || !token) return;
      let cancelled = false;
      (async () => {
         setLoading(true);
         const data = {};
         for (let sub of subjects) {
				// console.log("SUBJECT :",sub)
            try {
               let res;
               if (userId) {
                  // Admin viewing specific student's attendance
                  res = await dispatch(attendAccToSub(sub._id, userId, token));
               } else {
                  // Student viewing their own attendance
                  res = await dispatch(attendAccToSub(sub._id, null, token));
               }
               if (!cancelled && res) data[sub._id] = res;
            } catch (e) {
               console.error(`Error loading ${sub.name}`, e);
            }
         }
         if (!cancelled) setAttendanceData(data);
         setLoading(false);
      })();
      return () => {
         cancelled = true;
      };
   }, [subjects, token, dispatch, userId]); // Add userId to dependencies

   if (loading)
      return (
         <div className="p-6 text-center text-medium-gray">
            Loading attendance data…
         </div>
      );
   if (!subjects?.length)
      return (
         <div className="p-6 text-center text-medium-gray">
            No subjects available
         </div>
      );

   return (
      <div className="space-y-4">
         {/* Mobile cards */}
         <div className="block md:hidden px-4 space-y-4">
            {subjects.map((sub) => {
               const stats = attendanceData[sub._id]?.statistics || {};
               return (
                  <div
                     key={sub._id}
                     className="bg-white p-4 rounded-lg shadow border border-light-gray"
                  >
                     <h3 className="text-base font-semibold text-charcoal-gray mb-3">
                        {sub.name}
                     </h3>
                     <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-medium-gray">Total Lectures</div>
                        <div className="font-medium text-charcoal-gray">
                           {stats.totalLectures ?? "-"}
                        </div>
                        <div className="text-medium-gray">Marked</div>
                        <div className="font-medium text-charcoal-gray">
                           {stats.markedLectures ?? "-"}
                        </div>
                        <div className="text-medium-gray">Present</div>
                        <div className="font-medium text-charcoal-gray">
                           {stats.present ?? "-"}
                        </div>
                        <div className="text-medium-gray">Absent</div>
                        <div className="font-medium text-charcoal-gray">
                           {stats.absent ?? "-"}
                        </div>
                        <div className="text-medium-gray">Percentage</div>
                        <div className="font-semibold text-charcoal-gray">
                           {stats.percentage &&
                           !isNaN(parseFloat(stats.percentage))
                              ? stats.percentage
                              : "0.00%"}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Desktop table */}
         <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white table-fixed">
               <thead className="bg-light-gray">
                  <tr>
                     <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
                        Subject
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                        Total
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                        Marked
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                        Present
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                        Absent
                     </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                        %
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-light-gray">
                  {subjects.map((sub) => {
                     const stats = attendanceData[sub._id]?.statistics || {};
                     return (
                        <tr key={sub._id} className="hover:bg-light-gray/30">
                           <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                              {sub.name}{" "}
                              <div className="text-xs text-slate-gray">
                                 ({sub.code})
                              </div>
                           </td>
                           <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                              {stats.totalLectures ?? "-"}
                           </td>
                           <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                              {stats.markedLectures ?? "-"}
                           </td>
                           <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                              {stats.present ?? "-"}
                           </td>
                           <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                              {stats.absent ?? "-"}
                           </td>
                           <td className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">
                              {stats.percentage &&
                              !isNaN(parseFloat(stats.percentage))
                                 ? stats.percentage
                                 : "0.00%"}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default AttendForSub;

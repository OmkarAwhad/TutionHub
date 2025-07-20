import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendChart({ studAttendStats }) {
   return (
      <div className="p-6">
         {studAttendStats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
               {/* Statistics Table */}
               <div className="w-full">
                  <h3 className="text-xl font-semibold text-charcoal-gray mb-4">Statistics Overview</h3>
                  <div className="overflow-hidden rounded-lg border border-light-gray">
                     <table className="w-full">
                        <thead className="bg-light-gray">
                           <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">Metric</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">Value</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray">
                           <tr className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm text-medium-gray">Total Lectures</td>
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                                 {studAttendStats.totalLectures}
                              </td>
                           </tr>
                           <tr className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm text-medium-gray">Marked Lectures</td>
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                                 {studAttendStats.markedLectures}
                              </td>
                           </tr>
                           <tr className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm text-medium-gray">Present</td>
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                                 {studAttendStats.present}
                              </td>
                           </tr>
                           <tr className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm text-medium-gray">Absent</td>
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                                 {studAttendStats.absent}
                              </td>
                           </tr>
                           <tr className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm text-medium-gray">Attendance Percentage</td>
                              <td className="px-4 py-3 text-sm font-bold text-charcoal-gray">
                                 {studAttendStats.percentage}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Pie Chart */}
               <div className="w-full max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-charcoal-gray mb-4 text-center">Attendance Distribution</h3>
                  <div className="bg-light-gray/20 p-4 rounded-lg">
                     <Pie
                        data={{
                           labels: ["Present", "Absent"],
                           datasets: [{
                              data: [studAttendStats.present, studAttendStats.absent],
                              backgroundColor: ["#323232", "#656565"],
                              hoverBackgroundColor: ["#4b4b4b", "#323232"],
                              borderWidth: 2,
                              borderColor: "#ffffff"
                           }],
                        }}
                        options={{
                           responsive: true,
                           maintainAspectRatio: true,
                           plugins: {
                              legend: {
                                 position: "bottom",
                                 labels: {
                                    padding: 20,
                                    font: { size: 12 }
                                 }
                              },
                              tooltip: {
                                 callbacks: {
                                    label: function(context) {
                                       const total = studAttendStats.present + studAttendStats.absent;
                                       const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                                       return `${context.label}: ${context.raw} (${percentage}%)`;
                                    }
                                 }
                              }
                           }
                        }}
                     />
                  </div>
               </div>
            </div>
         ) : (
            <div className="text-center py-12">
               <p className="text-medium-gray text-lg">No attendance data available</p>
            </div>
         )}
      </div>
   );
}

export default AttendChart;

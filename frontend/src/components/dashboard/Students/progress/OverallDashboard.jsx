import React from "react";
import { FaTrophy, FaChartBar, FaGraduationCap, FaCalendarCheck } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Doughnut, Line } from "react-chartjs-2";
import {
   Chart as ChartJS,
   ArcElement,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";

ChartJS.register(
   ArcElement,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

function OverallDashboard({ analyticsData, subjects }) {
   if (!analyticsData) {
      return (
         <div className="text-center py-8 sm:py-12">
            <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
            <p className="text-medium-gray text-lg sm:text-xl">No progress data available</p>
         </div>
      );
   }

   const { overallStats, subjectWiseData, recentTests } = analyticsData;

   // Prepare data for charts
   const subjectNames = Object.values(subjectWiseData).map(subject => subject.subjectName);
   const subjectPercentages = Object.values(subjectWiseData).map(subject => parseFloat(subject.average));
   
   const gradeDistribution = {};
   Object.values(subjectWiseData).forEach(subject => {
      gradeDistribution[subject.grade] = (gradeDistribution[subject.grade] || 0) + 1;
   });

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Stats Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-xs sm:text-sm text-slate-gray">Overall Grade</p>
                     <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{overallStats.overallGrade}</p>
                     <p className="text-xs sm:text-sm text-medium-gray">{overallStats.overallPercentage}%</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-charcoal-gray rounded-full">
                     <FaTrophy className="text-white text-lg sm:text-xl" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-xs sm:text-sm text-slate-gray">Total Tests</p>
                     <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{overallStats.totalTests}</p>
                     <p className="text-xs sm:text-sm text-medium-gray">Completed</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-medium-gray rounded-full">
                     <FaCalendarCheck className="text-white text-lg sm:text-xl" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-xs sm:text-sm text-slate-gray">Subjects</p>
                     <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{overallStats.totalSubjects}</p>
                     <p className="text-xs sm:text-sm text-medium-gray">Enrolled</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-slate-gray rounded-full">
                     <FaChalkboardTeacher className="text-white text-lg sm:text-xl" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-xs sm:text-sm text-slate-gray">Total Marks</p>
                     <p className="text-xl sm:text-2xl font-bold text-charcoal-gray">{overallStats.totalMarksObtained}</p>
                     <p className="text-xs sm:text-sm text-medium-gray">of {overallStats.totalMarksPossible}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-charcoal-gray rounded-full">
                     <FaChartBar className="text-white text-lg sm:text-xl" />
                  </div>
               </div>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Subject Performance Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-4">Subject Performance</h3>
               <div className="h-48 sm:h-64">
                  <Doughnut
                     data={{
                        labels: subjectNames,
                        datasets: [{
                           data: subjectPercentages,
                           backgroundColor: [
                              '#323232', '#4b4b4b', '#656565', '#808080', '#999999'
                           ],
                           borderWidth: 2,
                           borderColor: '#ffffff'
                        }]
                     }}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                           legend: { 
                              position: 'bottom',
                              labels: {
                                 font: {
                                    size: window.innerWidth < 640 ? 10 : 12
                                 }
                              }
                           },
                           tooltip: {
                              callbacks: {
                                 label: function(context) {
                                    return `${context.label}: ${context.raw}%`;
                                 }
                              }
                           }
                        }
                     }}
                  />
               </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-4">Grade Distribution</h3>
               <div className="space-y-2 sm:space-y-3">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                     <div key={grade} className="flex items-center justify-between p-2 sm:p-3 bg-light-gray rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                           <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold ${
                              grade === 'A+' || grade === 'A' ? 'bg-charcoal-gray' :
                              grade === 'B+' || grade === 'B' ? 'bg-medium-gray' : 'bg-slate-gray'
                           }`}>
                              {grade}
                           </div>
                           <span className="text-xs sm:text-sm text-charcoal-gray font-medium">Grade {grade}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-medium-gray font-semibold">{count} subject{count !== 1 ? 's' : ''}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Recent Tests */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
            <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-4">Recent Test Performance</h3>
            
            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-3">
               {recentTests.slice(0, 5).map((test, index) => {
                  const percentage = ((test.marks / test.totalMarks) * 100).toFixed(1);
                  let grade = '';
                  if (percentage >= 90) grade = 'A+';
                  else if (percentage >= 80) grade = 'A';
                  else if (percentage >= 70) grade = 'B+';
                  else if (percentage >= 60) grade = 'B';
                  else if (percentage >= 50) grade = 'C';
                  else grade = 'D';

                  return (
                     <div key={test._id} className="bg-light-gray p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-medium text-charcoal-gray text-sm">{test.lecture?.subject?.name}</h4>
                           <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              grade === 'A+' || grade === 'A' ? 'bg-charcoal-gray text-white' :
                              grade === 'B+' || grade === 'B' ? 'bg-medium-gray text-white' : 'bg-slate-gray text-white'
                           }`}>
                              {grade}
                           </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                           <div>
                              <span className="text-slate-gray">Marks:</span>
                              <span className="ml-1 font-medium">{test.marks}/{test.totalMarks}</span>
                           </div>
                           <div>
                              <span className="text-slate-gray">Percentage:</span>
                              <span className="ml-1 font-medium">{percentage}%</span>
                           </div>
                        </div>
                        {test.description && (
                           <p className="text-xs text-charcoal-gray mt-2">{test.description}</p>
                        )}
                     </div>
                  );
               })}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-light-gray">
                     <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">Subject</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Marks</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Percentage</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-charcoal-gray">Grade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">Feedback</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-light-gray">
                     {recentTests.slice(0, 5).map((test, index) => {
                        const percentage = ((test.marks / test.totalMarks) * 100).toFixed(1);
                        let grade = '';
                        if (percentage >= 90) grade = 'A+';
                        else if (percentage >= 80) grade = 'A';
                        else if (percentage >= 70) grade = 'B+';
                        else if (percentage >= 60) grade = 'B';
                        else if (percentage >= 50) grade = 'C';
                        else grade = 'D';

                        return (
                           <tr key={test._id} className="hover:bg-light-gray/30">
                              <td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
                                 {test.lecture?.subject?.name}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-charcoal-gray">
                                 {test.marks}/{test.totalMarks}
                              </td>
                              <td className="px-4 py-3 text-center">
                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    percentage >= 75 ? 'bg-charcoal-gray text-white' :
                                    percentage >= 50 ? 'bg-medium-gray text-white' : 'bg-slate-gray text-white'
                                 }`}>
                                    {percentage}%
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                 <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                    grade === 'A+' || grade === 'A' ? 'bg-charcoal-gray text-white' :
                                    grade === 'B+' || grade === 'B' ? 'bg-medium-gray text-white' : 'bg-slate-gray text-white'
                                 }`}>
                                    {grade}
                                 </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-charcoal-gray">
                                 {test.description || 'No feedback'}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default OverallDashboard;

import React from "react";
import { FaChartLine, FaArrowTrendUp ,FaArrowTrendDown, FaMinus } from "react-icons/fa6";
// import {  FaTrendDown } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";

function SubjectCards({ analyticsData, subjects }) {
   if (!analyticsData) {
      return (
         <div className="text-center py-12">
            <FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
            <p className="text-medium-gray text-xl">No subject data available</p>
         </div>
      );
   }

   const { subjectWiseData } = analyticsData;

   const getTrendIcon = (improvement) => {
      const improvementNum = parseFloat(improvement);
      if (improvementNum > 0) return <FaArrowTrendUp  className="text-green-500" />;
      if (improvementNum < 0) return <FaArrowTrendDown className="text-red-500" />;
      return <FaMinus className="text-slate-gray" />;
   };

   const getTrendColor = (improvement) => {
      const improvementNum = parseFloat(improvement);
      if (improvementNum > 0) return 'text-green-600';
      if (improvementNum < 0) return 'text-red-600';
      return 'text-slate-gray';
   };

   return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(subjectWiseData).map(([subjectId, subject]) => (
               <div key={subjectId} className="bg-white p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <h3 className="text-lg font-semibold text-charcoal-gray">{subject.subjectName}</h3>
                        <p className="text-sm text-slate-gray">{subject.subjectCode}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'bg-charcoal-gray' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'bg-medium-gray' : 'bg-slate-gray'
                     }`}>
                        {subject.grade}
                     </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="flex items-center justify-center mb-4">
                     <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                           <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#e6e6e6"
                              strokeWidth="8"
                              fill="none"
                           />
                           <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#323232"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${(parseFloat(subject.average) / 100) * 251.2} 251.2`}
                              strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-lg font-bold text-charcoal-gray">{subject.average}%</span>
                        </div>
                     </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                        <span className="text-sm text-slate-gray">Tests Taken</span>
                        <span className="text-sm font-semibold text-charcoal-gray">{subject.tests.length}</span>
                     </div>
                     
                     <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                        <span className="text-sm text-slate-gray">Total Marks</span>
                        <span className="text-sm font-semibold text-charcoal-gray">
                           {subject.totalObtained}/{subject.totalPossible}
                        </span>
                     </div>

                     {subject.improvement !== 0 && (
                        <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                           <span className="text-sm text-slate-gray">Improvement</span>
                           <div className="flex items-center gap-1">
                              {getTrendIcon(subject.improvement)}
                              <span className={`text-sm font-semibold ${getTrendColor(subject.improvement)}`}>
                                 {Math.abs(parseFloat(subject.improvement))}%
                              </span>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Recent Tests */}
                  <div className="mt-4 pt-4 border-t border-light-gray">
                     <h4 className="text-sm font-medium text-charcoal-gray mb-2">Recent Tests</h4>
                     <div className="space-y-1">
                        {subject.tests.slice(0, 3).map((test, index) => (
                           <div key={test.testId} className="flex justify-between items-center text-xs">
                              <span className="text-slate-gray">Test {index + 1}</span>
                              <span className="text-charcoal-gray font-medium">{test.percentage}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default SubjectCards;

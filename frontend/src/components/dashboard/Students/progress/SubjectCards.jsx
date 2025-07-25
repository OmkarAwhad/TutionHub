import React from "react";
import { FaChartLine, FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";

function SubjectCards({ analyticsData, subjects }) {
   if (!analyticsData) {
      return (
         <div className="text-center py-8 sm:py-12">
            <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
            <p className="text-medium-gray text-lg sm:text-xl">No subject data available</p>
         </div>
      );
   }

   const { subjectWiseData } = analyticsData;

   const getTrendIcon = (improvement) => {
      const improvementNum = parseFloat(improvement);
      if (improvementNum > 0) return <FaArrowTrendUp className="text-green-500 text-xs sm:text-sm" />;
      if (improvementNum < 0) return <FaArrowTrendDown className="text-red-500 text-xs sm:text-sm" />;
      return <FaMinus className="text-slate-gray text-xs sm:text-sm" />;
   };

   const getTrendColor = (improvement) => {
      const improvementNum = parseFloat(improvement);
      if (improvementNum > 0) return 'text-green-600';
      if (improvementNum < 0) return 'text-red-600';
      return 'text-slate-gray';
   };

   return (
      <div className="space-y-4 sm:space-y-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(subjectWiseData).map(([subjectId, subject]) => (
               <div key={subjectId} className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                     <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray truncate">{subject.subjectName}</h3>
                        <p className="text-xs sm:text-sm text-slate-gray">{subject.subjectCode}</p>
                     </div>
                     <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold text-white flex-shrink-0 ml-2 ${
                        subject.grade === 'A+' || subject.grade === 'A' ? 'bg-charcoal-gray' :
                        subject.grade === 'B+' || subject.grade === 'B' ? 'bg-medium-gray' : 'bg-slate-gray'
                     }`}>
                        {subject.grade}
                     </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                     <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                           <span className="text-base sm:text-lg font-bold text-charcoal-gray">{subject.average}%</span>
                        </div>
                     </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 sm:space-y-3">
                     <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                        <span className="text-xs sm:text-sm text-slate-gray">Tests Taken</span>
                        <span className="text-xs sm:text-sm font-semibold text-charcoal-gray">{subject.tests.length}</span>
                     </div>
                     
                     <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                        <span className="text-xs sm:text-sm text-slate-gray">Total Marks</span>
                        <span className="text-xs sm:text-sm font-semibold text-charcoal-gray">
                           {subject.totalObtained}/{subject.totalPossible}
                        </span>
                     </div>

                     {subject.improvement !== 0 && (
                        <div className="flex justify-between items-center p-2 bg-light-gray rounded-lg">
                           <span className="text-xs sm:text-sm text-slate-gray">Improvement</span>
                           <div className="flex items-center gap-1">
                              {getTrendIcon(subject.improvement)}
                              <span className={`text-xs sm:text-sm font-semibold ${getTrendColor(subject.improvement)}`}>
                                 {Math.abs(parseFloat(subject.improvement))}%
                              </span>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Recent Tests */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-light-gray">
                     <h4 className="text-xs sm:text-sm font-medium text-charcoal-gray mb-2">Recent Tests</h4>
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

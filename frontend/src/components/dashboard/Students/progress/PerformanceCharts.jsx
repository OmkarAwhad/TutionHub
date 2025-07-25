import React, { useState } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   RadialLinearScale,
   Title,
   Tooltip,
   Legend,
} from "chart.js";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   RadialLinearScale,
   Title,
   Tooltip,
   Legend
);

function PerformanceCharts({ analyticsData, subjects }) {
   const [selectedChart, setSelectedChart] = useState('line');

   if (!analyticsData) {
      return (
         <div className="text-center py-8 sm:py-12">
            <p className="text-medium-gray text-lg sm:text-xl">No performance data available</p>
         </div>
      );
   }

   const { subjectWiseData } = analyticsData;

   // Prepare data for different chart types
   const subjectNames = Object.values(subjectWiseData).map(subject => subject.subjectName);
   const averages = Object.values(subjectWiseData).map(subject => parseFloat(subject.average));
   
   // For line chart - show test progression over time
   const getProgressionData = () => {
      const progressionData = {};
      Object.values(subjectWiseData).forEach(subject => {
         progressionData[subject.subjectName] = subject.tests.map(test => parseFloat(test.percentage));
      });
      return progressionData;
   };

   const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: { 
            position: 'top',
            labels: {
               font: {
                  size: window.innerWidth < 640 ? 10 : 12
               }
            }
         },
         tooltip: {
            callbacks: {
               label: function(context) {
                  return `${context.dataset.label}: ${context.raw}%`;
               }
            }
         }
      },
      scales: {
         y: {
           beginAtZero: true,
           max: 100,
           ticks: {
              font: {
                 size: window.innerWidth < 640 ? 10 : 12
              }
           }
         },
         x: {
            ticks: {
               font: {
                  size: window.innerWidth < 640 ? 10 : 12
               }
            }
         }
      }
   };

   const lineChartData = {
      labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
      datasets: Object.entries(getProgressionData()).map(([subject, scores], index) => ({
         label: subject,
         data: scores,
         borderColor: ['#323232', '#4b4b4b', '#656565', '#808080', '#999999'][index % 5],
         backgroundColor: ['#323232', '#4b4b4b', '#656565', '#808080', '#999999'][index % 5] + '20',
         tension: 0.4
      }))
   };

   const barChartData = {
      labels: subjectNames,
      datasets: [{
         label: 'Average Score',
         data: averages,
         backgroundColor: '#323232',
         borderColor: '#323232',
         borderWidth: 1
      }]
   };

   const radarChartData = {
      labels: subjectNames,
      datasets: [{
         label: 'Performance',
         data: averages,
         backgroundColor: 'rgba(50, 50, 50, 0.2)',
         borderColor: '#323232',
         borderWidth: 2
      }]
   };

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Chart Type Selector */}
         <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-light-gray">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
               <span className="text-xs sm:text-sm font-medium text-charcoal-gray">Chart Type:</span>
               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {[
                     { id: 'line', label: 'Progress Trend' },
                     { id: 'bar', label: 'Subject Comparison' },
                     { id: 'radar', label: 'Performance Radar' }
                  ].map(({ id, label }) => (
                     <button
                        key={id}
                        onClick={() => setSelectedChart(id)}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                           selectedChart === id
                              ? 'bg-charcoal-gray text-white'
                              : 'bg-light-gray text-charcoal-gray hover:bg-slate-gray hover:text-white'
                        }`}
                     >
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">
                           {id === 'line' ? 'Trend' : id === 'bar' ? 'Compare' : 'Radar'}
                        </span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Chart Display */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
            <div className="h-64 sm:h-96">
               {selectedChart === 'line' && (
                  <Line data={lineChartData} options={chartOptions} />
               )}
               {selectedChart === 'bar' && (
                  <Bar data={barChartData} options={chartOptions} />
               )}
               {selectedChart === 'radar' && (
                  <Radar 
                     data={radarChartData} 
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                           r: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                 font: {
                                    size: window.innerWidth < 640 ? 8 : 10
                                 }
                              }
                           }
                        }
                     }} 
                  />
               )}
            </div>
         </div>

         {/* Performance Insights */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-3">Best Performing Subject</h3>
               {(() => {
                  const bestSubject = Object.values(subjectWiseData).reduce((best, current) => 
                     parseFloat(current.average) > parseFloat(best.average) ? current : best
                  );
                  return (
                     <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{bestSubject.subjectName}</p>
                        <p className="text-xs sm:text-sm text-medium-gray">{bestSubject.average}% average</p>
                        <div className="mt-2 px-2 py-1 bg-charcoal-gray text-white rounded-full text-xs font-bold inline-block">
                           Grade {bestSubject.grade}
                        </div>
                     </div>
                  );
               })()}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-3">Most Improved</h3>
               {(() => {
                  const mostImproved = Object.values(subjectWiseData)
                     .filter(subject => parseFloat(subject.improvement) > 0)
                     .reduce((best, current) => 
                        parseFloat(current.improvement) > parseFloat(best?.improvement || 0) ? current : best
                     , null);
                  
                  return mostImproved ? (
                     <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{mostImproved.subjectName}</p>
                        <p className="text-xs sm:text-sm text-green-600">+{mostImproved.improvement}% improvement</p>
                        <div className="mt-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold inline-block">
                           Trending Up
                        </div>
                     </div>
                  ) : (
                     <div className="text-center">
                        <p className="text-medium-gray text-sm">No improvement data</p>
                     </div>
                  );
               })()}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray sm:col-span-2 lg:col-span-1">
               <h3 className="text-base sm:text-lg font-semibold text-charcoal-gray mb-3">Focus Area</h3>
               {(() => {
                  const focusSubject = Object.values(subjectWiseData).reduce((lowest, current) => 
                     parseFloat(current.average) < parseFloat(lowest.average) ? current : lowest
                  );
                  return (
                     <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{focusSubject.subjectName}</p>
                        <p className="text-xs sm:text-sm text-medium-gray">{focusSubject.average}% average</p>
                        <div className="mt-2 px-2 py-1 bg-slate-gray text-white rounded-full text-xs font-bold inline-block">
                           Needs Attention
                        </div>
                     </div>
                  );
               })()}
            </div>
         </div>
      </div>
   );
}

export default PerformanceCharts;

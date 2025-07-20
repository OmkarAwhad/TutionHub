import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaTrophy, FaChartLine, FaGraduationCap } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import { getStudentAnalytics } from "../../../../services/operations/marks.service";
import OverallDashboard from "./OverallDashboard";
import SubjectCards from "./SubjectCards";
import PerformanceCharts from "./PerformanceCharts";
// import RecentTests from "./RecentTests";

function Progress() {
   const { token } = useSelector((state) => state.auth);
   const [subjects, setSubjects] = useState([]);
   const [analyticsData, setAnalyticsData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [selectedView, setSelectedView] = useState('overview');

   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            const [subjectsResult, analyticsResult] = await Promise.all([
               dispatch(subjectsOfAUser(token)),
               getStudentAnalytics(token)
            ]);
            
            if (subjectsResult) setSubjects(subjectsResult);
            if (analyticsResult) setAnalyticsData(analyticsResult);
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [dispatch, token]);

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-6">
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <FaTrophy className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">Academic Progress</h1>
            </div>
            
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Navigation Tabs */}
         <div className="flex items-center gap-4 mb-6 bg-white p-2 rounded-lg shadow-md border border-light-gray">
            {[
               { id: 'overview', label: 'Overview', icon: FaChartLine },
               { id: 'subjects', label: 'Subjects', icon: FaChalkboardTeacher },
               { id: 'performance', label: 'Performance', icon: FaGraduationCap }
            ].map(({ id, label, icon: Icon }) => (
               <button
                  key={id}
                  onClick={() => setSelectedView(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                     selectedView === id
                        ? 'bg-charcoal-gray text-white'
                        : 'text-charcoal-gray hover:bg-light-gray'
                  }`}
               >
                  <Icon className="text-sm" />
                  {label}
               </button>
            ))}
         </div>

         {/* Content */}
         {selectedView === 'overview' && (
            <OverallDashboard 
               analyticsData={analyticsData} 
               subjects={subjects}
            />
         )}
         
         {selectedView === 'subjects' && (
            <SubjectCards 
               analyticsData={analyticsData} 
               subjects={subjects}
            />
         )}
         
         {selectedView === 'performance' && (
            <PerformanceCharts 
               analyticsData={analyticsData} 
               subjects={subjects}
            />
         )}
      </div>
   );
}

export default Progress;

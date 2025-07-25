import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMarksDetailsByALec } from "../../../../services/operations/marks.service";
import { FaArrowLeftLong, FaUser, FaClock, FaBook} from "react-icons/fa6";
import { FaChalkboardTeacher, FaCalendarAlt, FaEdit, FaSearch  } from "react-icons/fa";
import { format } from "date-fns";

function ViewMarks() {
   const { lectureId } = useParams();
   const { markLecture } = useSelector((state) => state.attendance);
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [details, setDetails] = useState([]);
   const [filteredDetails, setFilteredDetails] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchMarksDetails = async () => {
         try {
            setLoading(true);
            if (markLecture?._id) {
               const response = await getMarksDetailsByALec(markLecture._id, token);
               if (response) {
                  setDetails(response);
                  setFilteredDetails(response);
               }
            }
         } catch (error) {
            console.error("Error fetching marks details:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchMarksDetails();
   }, [markLecture, token]);

   // Search functionality
   useEffect(() => {
      if (!searchTerm.trim()) {
         setFilteredDetails(details);
      } else {
         const filtered = details.filter((item) =>
            item?.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.marks?.toString().includes(searchTerm)
         );
         setFilteredDetails(filtered);
      }
   }, [searchTerm, details]);

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   // Calculate stats for filtered results
   const totalStudents = filteredDetails.length;
   const averageMarks = totalStudents > 0 
      ? (filteredDetails.reduce((sum, item) => sum + item.marks, 0) / totalStudents).toFixed(2)
      : 0;
   const totalMarks = details.length > 0 ? details[0].totalMarks : 0;
   const highestMarks = totalStudents > 0 ? Math.max(...filteredDetails.map(item => item.marks)) : 0;

   return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-3">
               <FaChalkboardTeacher className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">View Marks</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
               {/* Edit Button */}
               <button
                  onClick={() => navigate(`/dashboard/admin-marks/edit-marks/${lectureId}`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
               >
                  <FaEdit className="text-sm" />
                  <span>Edit Marks</span>
               </button>
               
               {/* Back Button */}
               <button
                  onClick={() => navigate("/dashboard/admin-marks/view-marks")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
               >
                  <FaArrowLeftLong className="text-sm" />
                  <span>Back</span>
               </button>
            </div>
         </div>

         {/* Test Details - Responsive Grid */}
         {markLecture && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
               <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4">Test Information</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaBook className="text-charcoal-gray flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs text-slate-gray">Subject</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.subject?.name}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaCalendarAlt className="text-medium-gray flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs text-slate-gray">Date</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {format(new Date(markLecture.date), "dd MMM yyyy")}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaClock className="text-medium-gray flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs text-slate-gray">Time</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.time}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                     <FaUser className="text-charcoal-gray flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs text-slate-gray">Tutor</p>
                        <p className="text-sm font-semibold text-charcoal-gray truncate">
                           {markLecture.tutor?.name}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Search Bar */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
               <input
                  type="text"
                  placeholder="Search by student name, marks, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               />
            </div>
            {searchTerm && (
               <div className="mt-2">
                  <p className="text-sm text-medium-gray">
                     Found {filteredDetails.length} of {details.length} students
                  </p>
               </div>
            )}
         </div>

         {/* Marks Statistics - Responsive Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : "Total"} Students
               </p>
               <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{totalStudents}</p>
            </div>
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">Total Marks</p>
               <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{totalMarks}</p>
            </div>
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : ""} Average
               </p>
               <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{averageMarks}</p>
            </div>
            <div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
               <p className="text-xs text-slate-gray">
                  {searchTerm ? "Filtered" : ""} Highest
               </p>
               <p className="text-lg sm:text-xl font-bold text-charcoal-gray">{highestMarks}</p>
            </div>
         </div>

         {/* Marks Table - Responsive */}
         {filteredDetails.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
               <div className="p-4 border-b border-light-gray">
                  <h3 className="text-lg font-semibold text-charcoal-gray">
                     Student Marks List
                     {searchTerm && (
                        <span className="text-sm font-normal text-medium-gray ml-2">
                           ({filteredDetails.length} results)
                        </span>
                     )}
                  </h3>
               </div>
               
               {/* Mobile Card View */}
               <div className="block sm:hidden">
                  <div className="p-4 space-y-4">
                     {filteredDetails.map((item) => (
                        <div key={item?.student?._id} className="bg-light-gray/30 p-4 rounded-lg border border-light-gray">
                           <div className="space-y-3">
                              <div>
                                 <h4 className="font-medium text-charcoal-gray mb-1">
                                    {item?.student?.name}
                                 </h4>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <p className="text-xs text-slate-gray">Marks Obtained</p>
                                    <p className="text-sm font-semibold text-charcoal-gray">
                                       {item?.marks} / {item?.totalMarks}
                                    </p>
                                 </div>
                                 <div>
                                    <p className="text-xs text-slate-gray">Percentage</p>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                       ((item?.marks / item?.totalMarks) * 100) >= 75 
                                          ? "bg-charcoal-gray text-white"
                                          : ((item?.marks / item?.totalMarks) * 100) >= 50
                                          ? "bg-medium-gray text-white"
                                          : "bg-slate-gray text-white"
                                    }`}>
                                       {((item?.marks / item?.totalMarks) * 100).toFixed(1)}%
                                    </span>
                                 </div>
                              </div>
                              
                              {item?.description && (
                                 <div>
                                    <p className="text-xs text-slate-gray">Description</p>
                                    <p className="text-sm text-charcoal-gray">{item?.description}</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Desktop Table View */}
               <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-light-gray">
                        <tr>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Student Name
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Marks Obtained
                           </th>
                           <th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
                              Percentage
                           </th>
                           <th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
                              Description
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-light-gray">
                        {filteredDetails.map((item) => (
                           <tr key={item?.student?._id} className="hover:bg-light-gray/30">
                              <td className="py-3 px-4 text-sm font-medium text-charcoal-gray">
                                 {item?.student?.name}
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <span className="text-sm font-semibold text-charcoal-gray">
                                    {item?.marks} / {item?.totalMarks}
                                 </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    ((item?.marks / item?.totalMarks) * 100) >= 75 
                                       ? "bg-charcoal-gray text-white"
                                       : ((item?.marks / item?.totalMarks) * 100) >= 50
                                       ? "bg-medium-gray text-white"
                                       : "bg-slate-gray text-white"
                                 }`}>
                                    {((item?.marks / item?.totalMarks) * 100).toFixed(1)}%
                                 </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-charcoal-gray">
                                 {item?.description || "-"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12">
               <FaChalkboardTeacher className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl px-4">
                  {searchTerm ? "No students found matching your search" : "No marks records found"}
               </p>
               {searchTerm && (
                  <button
                     onClick={() => setSearchTerm("")}
                     className="mt-4 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
                  >
                     Clear Search
                  </button>
               )}
            </div>
         )}
      </div>
   );
}

export default ViewMarks;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersList } from "../../../../services/operations/users.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { assignStandardToStudent } from "../../../../services/operations/standard.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong, FaGraduationCap } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AssignStandard() {
   const [students, setStudents] = useState([]);
   const [standards, setStandards] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { token } = useSelector((state) => state.auth);

   useEffect(() => {
      fetchStudents();
      fetchStandards();
   }, []);

   const fetchStudents = async () => {
      try {
         let result = await dispatch(getAllUsersList(token));
         if (result) {
            result = result.filter((user) => user.role === "Student");
            setStudents(result);
         }
      } catch (error) {
         console.error("Error fetching students:", error);
      }
   };

   const fetchStandards = async () => {
      try {
         const result = await dispatch(getAllStandards(token));
         if (result) {
            setStandards(result.standards || result);
         }
      } catch (error) {
         console.error("Error fetching standards:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleStandardChange = async (studentId, standardId) => {
      try {
         const result = await dispatch(
            assignStandardToStudent(studentId, standardId, token)
         );
         if (result) {
            toast.success("Standard assigned successfully");
            fetchStudents();
         }
      } catch (error) {
         console.error("Error assigning standard:", error);
         toast.error("Failed to assign standard");
      }
   };

   const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

   if (loading) {
      return (
         <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-3 sm:p-4 lg:p-6">
         {/* Header - Responsive */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaGraduationCap className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  Assign Standards to Students
               </h1>
            </div>
            <button
               onClick={() => navigate("/dashboard/admin-subjects")}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Search Bar */}
         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
               />
            </div>
            {searchTerm && (
               <div className="mt-2">
                  <p className="text-sm text-medium-gray">
                     Showing {filteredStudents.length} of {students.length} students
                  </p>
               </div>
            )}
         </div>

         {/* Table Container - Responsive */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            {filteredStudents.length > 0 ? (
               <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden p-4">
                     <h3 className="text-lg font-semibold text-charcoal-gray mb-4">
                        Students and Standards
                        {searchTerm && (
                           <span className="text-sm font-normal text-medium-gray ml-2">
                              ({filteredStudents.length} results)
                           </span>
                        )}
                     </h3>
                     <div className="space-y-4">
                        {filteredStudents.map((student) => (
                           <div key={student._id} className="bg-light-gray p-4 rounded-lg">
                              <div className="mb-3">
                                 <h4 className="font-medium text-charcoal-gray">{student.name}</h4>
                                 <p className="text-sm text-medium-gray">{student.email}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-sm font-medium text-charcoal-gray">Select Standard:</p>
                                 <div className="grid grid-cols-1 gap-2">
                                    {standards.map((standard) => (
                                       <label key={standard._id} className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-light-gray/50">
                                          <input
                                             type="radio"
                                             name={`student-${student._id}`}
                                             checked={student.profile?.standard === standard._id}
                                             onChange={() => handleStandardChange(student._id, standard._id)}
                                             className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
                                          />
                                          <span className="text-sm text-charcoal-gray">{standard.standardName}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Desktop Table View - Fixed Alignment */}
                  <div className="hidden lg:block">
                     <div className="p-4 border-b border-light-gray">
                        <h3 className="text-lg font-semibold text-charcoal-gray">
                           Students and Standards
                           {searchTerm && (
                              <span className="text-sm font-normal text-medium-gray ml-2">
                                 ({filteredStudents.length} results)
                              </span>
                           )}
                        </h3>
                     </div>
                     
                     {/* Single Table with Fixed Layout */}
                     <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                           <thead>
                              <tr className="bg-light-gray">
                                 <th className="sticky left-0 z-10 bg-light-gray px-6 py-4 text-left text-xs font-semibold text-charcoal-gray uppercase tracking-wider w-[200px] border-r border-gray-200">
                                    Student
                                 </th>
                                 <th className="sticky left-[200px] z-10 bg-light-gray px-6 py-4 text-left text-xs font-semibold text-charcoal-gray uppercase tracking-wider w-[250px] border-r border-gray-200">
                                    Email
                                 </th>
                                 {standards.map((standard) => (
                                    <th
                                       key={standard._id}
                                       className="px-6 py-4 text-center text-xs font-semibold text-charcoal-gray uppercase tracking-wider w-[150px]"
                                    >
                                       {standard.standardName}
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-light-gray">
                              {filteredStudents.map((student, index) => (
                                 <tr 
                                    key={student._id} 
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50 transition-colors duration-200`}
                                 >
                                    <td className="sticky left-0 z-10 bg-inherit px-6 py-4 text-sm font-medium text-charcoal-gray border-r border-gray-200">
                                       <div className="truncate pr-2" title={student.name}>
                                          {student.name}
                                       </div>
                                    </td>
                                    <td className="sticky left-[200px] z-10 bg-inherit px-6 py-4 text-sm text-medium-gray border-r border-gray-200">
                                       <div className="truncate pr-2" title={student.email}>
                                          {student.email}
                                       </div>
                                    </td>
                                    {standards.map((standard) => (
                                       <td key={standard._id} className="px-6 py-4 text-center">
                                          <div className="flex justify-center">
                                             <input
                                                type="radio"
                                                name={`student-${student._id}`}
                                                checked={student.profile?.standard === standard._id}
                                                onChange={() => handleStandardChange(student._id, standard._id)}
                                                className="h-4 w-4 text-charcoal-gray focus:ring-2 focus:ring-charcoal-gray focus:ring-offset-2 cursor-pointer"
                                             />
                                          </div>
                                       </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </>
            ) : (
               <div className="text-center py-12">
                  <FaSearch className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
                  <p className="text-medium-gray text-lg sm:text-xl mb-2">
                     {searchTerm ? `No students found matching "${searchTerm}"` : "No students found"}
                  </p>
                  <p className="text-slate-gray text-sm sm:text-base">
                     {searchTerm ? "Try adjusting your search terms" : "Students will appear here once added"}
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
      </div>
   );
}

export default AssignStandard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersList } from "../../../../services/operations/users.service";
import { assignSubjectToStudent } from "../../../../services/operations/subject.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong, FaUserGraduate } from "react-icons/fa6";
import {  FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AssignSubStudents() {
   const [students, setStudents] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { token } = useSelector((state) => state.auth);

   useEffect(() => {
      fetchStudents();
      fetchSubjects();
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

   const fetchSubjects = async () => {
      try {
         const result = await dispatch(getAllSubjects(token));
         if (result) {
            setSubjects(result);
            toast.success("Students list fetched successfully");
         }
      } catch (error) {
         console.error("Error fetching subjects:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleSubjectChange = async (studentId, subjectId, isChecked) => {
      try {
         const result = await dispatch(
            assignSubjectToStudent(studentId, subjectId, isChecked, token)
         );
         if (result) {
            fetchStudents();
         }
      } catch (error) {
         console.error("Error assigning subject:", error);
      }
   };

   const filteredStudents = students.filter(
      (student) =>
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
               <FaUserGraduate className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
                  Assign Subjects to Students
               </h1>
            </div>
            <button
               onClick={() => navigate("/dashboard/admin-subjects/assign-subjects")}
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
                        Students and Subjects
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
                                 <p className="text-sm font-medium text-charcoal-gray">Subjects:</p>
                                 <div className="grid grid-cols-1 gap-2">
                                    {subjects.map((subject) => (
                                       <label key={subject._id} className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-light-gray/50">
                                          <input
                                             type="checkbox"
                                             checked={student.subjects?.some(s => s._id === subject._id)}
                                             onChange={(e) => handleSubjectChange(student._id, subject._id, e.target.checked)}
                                             className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
                                          />
                                          <span className="text-sm text-charcoal-gray">{subject.name}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                     <div className="p-4 border-b border-light-gray">
                        <h3 className="text-lg font-semibold text-charcoal-gray">
                           Students and Subjects
                           {searchTerm && (
                              <span className="text-sm font-normal text-medium-gray ml-2">
                                 ({filteredStudents.length} results)
                              </span>
                           )}
                        </h3>
                     </div>
                     <div className="relative">
                        <div className="border-b border-gray-200 overflow-hidden">
                           {/* Fixed Left Column */}
                           <div className="absolute left-0 top-0 w-[400px] bg-white border-r border-gray-200">
                              <table className="w-full">
                                 <thead>
                                    <tr>
                                       <th className="px-6 py-4 bg-light-gray text-left text-xs font-semibold text-charcoal-gray uppercase tracking-wider w-[180px]">
                                          Student
                                       </th>
                                       <th className="px-6 py-4 bg-light-gray text-left text-xs font-semibold text-charcoal-gray uppercase tracking-wider">
                                          Email
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {filteredStudents.map((student) => (
                                       <tr key={student._id} className="hover:bg-light-gray/30">
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal-gray">
                                             {student.name}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-gray">
                                             {student.email}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           {/* Scrollable Right Section */}
                           <div className="ml-[400px] overflow-x-auto">
                              <table className="w-full">
                                 <thead>
                                    <tr>
                                       {subjects.map((subject) => (
                                          <th
                                             key={subject._id}
                                             className="px-6 py-4 bg-light-gray text-center text-xs font-semibold text-charcoal-gray uppercase tracking-wider min-w-[150px]"
                                          >
                                             {subject.name}
                                          </th>
                                       ))}
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {filteredStudents.map((student) => (
                                       <tr key={student._id} className="hover:bg-light-gray/30">
                                          {subjects.map((subject) => (
                                             <td
                                                key={subject._id}
                                                className="px-6 py-4 whitespace-nowrap text-center"
                                             >
                                                <input
                                                   type="checkbox"
                                                   checked={student.subjects?.some(s => s._id === subject._id)}
                                                   onChange={(e) => handleSubjectChange(student._id, subject._id, e.target.checked)}
                                                   className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray cursor-pointer"
                                                />
                                             </td>
                                          ))}
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
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

export default AssignSubStudents;

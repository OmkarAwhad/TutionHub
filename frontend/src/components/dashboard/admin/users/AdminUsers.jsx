import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUsersList } from "../../../../services/operations/users.service";
import toast from "react-hot-toast";
import { getAllSubjects } from "../../../../services/operations/subject.service";

function AdminUsers() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { token } = useSelector((state) => state.auth);

   const [userLists, setUserLists] = useState(null);
   const [subjects, setSubjects] = useState([]);
   const [selectedRole, setSelectedRole] = useState("Student");
   const [selectedSubject, setSelectedSubject] = useState("All");

   const fetchUsers = async () => {
      try {
         let response = await dispatch(getAllUsersList(token));
         if (response) {
            response = response.filter(
               (user) => user.role === selectedRole
            );
            if (selectedSubject !== "All") {
               response = response.filter((user) =>
                  Array.isArray(user.subjects)
                     ? user.subjects.some(
                        (sub) =>
                           (typeof sub === "object" &&
                              sub !== null
                              ? sub._id
                              : String(sub)) ===
                           String(selectedSubject)
                     )
                     : false
               );
            }
            console.log(response);
            setUserLists(response);
         }
      } catch (error) {
         toast.error("Error in fetching students list");
         console.log("Error in fetching students list");
      }
   };

   const fetchSubjects = async () => {
      try {
         const response = await dispatch(getAllSubjects(token));
         if (response) {
            setSubjects(response);
         }
      } catch (error) {
         toast.error("Error in fetching subjects");
         console.log("Error in fetching subjects", error);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, [dispatch, token, selectedRole, selectedSubject]);

   useEffect(() => {
      fetchSubjects();
   }, [dispatch, token]);

   return (
      <div>
         <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-richblack-5">
               Users
            </h1>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 text-richblack-200 cursor-pointer hover:text-richblack-5 transition-all duration-200"
            >
               <IoArrowBack className="text-lg" />
               Back
            </button>
         </div>
         <div className="flex justify-end gap-5 mb-8">
            <select
               value={selectedRole}
               onChange={(e) => setSelectedRole(e.target.value)}
               className="border w-[13%] rounded-md px-2 py-1"
            >
               <option value="Student">Student</option>
               <option value="Tutor">Tutor</option>
            </select>
            <select
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               className="border w-[13%] rounded-md px-2 py-1"
            >
               <option value="All">All</option>
               {subjects &&
                  subjects.map((sub) => (
                     <option key={sub._id} value={sub._id}>
                        {sub.name}
                     </option>
                  ))}
            </select>
         </div>
         <div>
            {userLists && userLists.length > 0 ? (
               <div className="space-y-4">
                  {/* Header */}
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-richblack-800 rounded-lg">
                     <div className="text-left text-richblack-100 font-semibold">
                        Name
                     </div>
                     <div className="text-left text-richblack-100 font-semibold">
                        Subjects
                     </div>
                  </div>

                  {/* User Rows */}
                  {userLists.map((user) => (
                     <div
                        key={user._id}
                        className="grid grid-cols-2 gap-4 py-5 px-4 bg-gray-200 rounded-lg cursor-pointer hover:text-[17px] hover:bg-gray-300 hover:scale-101 hover:shadow-md transition-all duration-200"
                        onClick={() => navigate(`/dashboard/admin-users/${user._id}`)}
                     >
                        <div className="text-richblack-900 font-medium">
                           {user.name}
                        </div>
                        <div className="text-richblack-700">
                           {Array.isArray(user.subjects)
                              ? user.subjects
                                 .map((sub) =>
                                    typeof sub === "object" &&
                                       sub !== null
                                       ? sub.name
                                       : subjects.find(
                                          (s) => s._id === sub
                                       )?.name || ""
                                 )
                                 .filter(Boolean)
                                 .join(", ")
                              : "No subjects assigned"}
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-richblack-200 py-8 text-center">
                  No users found.
               </div>
            )}
         </div>
      </div>
   );
}

export default AdminUsers;

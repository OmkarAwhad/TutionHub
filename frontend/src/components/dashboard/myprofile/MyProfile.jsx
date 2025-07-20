import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";
import { ACCOUNT_TYPE } from "../../../utils/constants.utils";
import { RiEdit2Fill } from "react-icons/ri";
import { MdLogout, MdDeleteForever } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { FaUser, FaPhone, FaGraduationCap, FaCalendarAlt, FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/operations/profile.service";
import { getMyDetails } from "../../../services/operations/users.service";
import Modal from "../extras/Modal";
import {
   logout,
   deleteMyAccount,
} from "../../../services/operations/auth.service";
import {
   getAllStandards,
   getMyStandard,
} from "../../../services/operations/standard.service";

function MyProfile() {
   const { user } = useSelector((state) => state.profile);
   const { token } = useSelector((state) => state.auth);

   const [isEditing, setIsEditing] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [standards, setStandards] = useState([]);
   const [userDetails, setUserDetails] = useState(null);
   const [loading, setLoading] = useState(false);

   const [formData, setFormData] = useState({
      name: user?.name || "",
      phoneNumber: user?.profile?.phoneNumber || "",
      gender: user?.profile?.gender || "",
   });

   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const fetchStandards = async () => {
         try {
            const response = await dispatch(getAllStandards(token));
            if (response) {
               setStandards(response);
            }
         } catch (error) {
            console.error("Error fetching standards:", error);
         }
      };
      fetchStandards();
   }, [dispatch, token]);

   useEffect(() => {
      const fetchUserDetails = async () => {
         try {
            setLoading(true);
            const response = await dispatch(getMyDetails(token));
            if (response) {
               setUserDetails(response);
            }
         } catch (error) {
            console.error("Error fetching user details:", error);
         } finally {
            setLoading(false);
         }
      };
      if (token) {
         fetchUserDetails();
      }
   }, [dispatch, token]);

   useEffect(() => {
      if (user) {
         setFormData({
            name: user.name,
            phoneNumber: user?.profile?.phoneNumber || "",
            gender: user?.profile?.gender || "",
         });
      }
   }, [user]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleFormSubmit = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         await dispatch(updateProfile(formData, token));
         setIsEditing(false);
      } catch (error) {
         console.error("Error updating profile:", error);
         alert("Failed to update profile");
      } finally {
         setLoading(false);
      }
   };

   const handleLogoutClick = () => {
      setShowLogoutModal(true);
   };

   const handleLogoutConfirm = async () => {
      try {
         dispatch(logout(navigate));
         setShowLogoutModal(false);
      } catch (error) {
         console.error("Error logging out:", error);
      }
   };

   const handleLogoutCancel = () => {
      setShowLogoutModal(false);
   };

   const handleDeleteAccountClick = () => {
      setShowDeleteModal(true);
   };

   const handleDeleteAccountConfirm = async () => {
      try {
         await dispatch(deleteMyAccount(token, navigate));
      } catch (error) {
         console.error("Error deleting account:", error);
         alert("Failed to delete account. Please try again.");
      }
      setShowDeleteModal(false);
   };

   const handleDeleteAccountCancel = () => {
      setShowDeleteModal(false);
   };

   // Helper function to get role icon
   const getRoleIcon = () => {
      switch (user.role) {
         case ACCOUNT_TYPE.STUDENT:
            return <PiStudentFill className="text-4xl" />;
         case ACCOUNT_TYPE.TUTOR:
            return <GiTeacher className="text-4xl" />;
         case ACCOUNT_TYPE.ADMIN:
            return <RiAdminLine className="text-4xl" />;
         default:
            return <FaUser className="text-4xl" />;
      }
   };

   // Helper function to get role badge color
   const getRoleBadgeColor = () => {
      switch (user.role) {
         case ACCOUNT_TYPE.STUDENT:
            return "bg-green-100 text-green-700";
         case ACCOUNT_TYPE.TUTOR:
            return "bg-blue-100 text-blue-700";
         case ACCOUNT_TYPE.ADMIN:
            return "bg-purple-100 text-purple-700";
         default:
            return "bg-gray-100 text-gray-700";
      }
   };

   if (loading && !userDetails) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-6">
         <div className="max-w-7xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-3 mb-8">
               <FaUser className="text-charcoal-gray text-2xl" />
               <h1 className="text-3xl font-bold text-charcoal-gray">My Profile</h1>
            </div>

            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
               {isEditing ? (
                  /* Edit Form */
                  <div className="p-8">
                     <div className="flex items-center gap-3 mb-6">
                        <RiEdit2Fill className="text-charcoal-gray text-xl" />
                        <h2 className="text-xl font-semibold text-charcoal-gray">Edit Profile</h2>
                     </div>
                     
                     <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Name Field */}
                           <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                                 <FaUser className="text-xs" />
                                 Name
                              </label>
                              <input
                                 type="text"
                                 name="name"
                                 value={formData.name}
                                 onChange={handleInputChange}
                                 placeholder="Enter your name"
                                 className="w-full px-4 py-3 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
                              />
                           </div>

                           {/* Phone Field */}
                           <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                                 <FaPhone className="text-xs" />
                                 Phone Number
                              </label>
                              <input
                                 type="tel"
                                 name="phoneNumber"
                                 value={formData.phoneNumber}
                                 onChange={handleInputChange}
                                 placeholder="Enter your phone number"
                                 className="w-full px-4 py-3 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
                              />
                           </div>

                           {/* Gender Field */}
                           <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
                                 <FaUser className="text-xs" />
                                 Gender
                              </label>
                              <select
                                 name="gender"
                                 value={formData.gender}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-3 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
                              >
                                 <option value="" disabled>Select Gender</option>
                                 <option value="Male">Male</option>
                                 <option value="Female">Female</option>
                                 <option value="Other">Other</option>
                              </select>
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-6">
                           <button
                              type="submit"
                              disabled={loading}
                              className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${
                                 loading
                                    ? "bg-light-gray text-slate-gray cursor-not-allowed"
                                    : "bg-charcoal-gray text-white hover:bg-medium-gray"
                              }`}
                           >
                              <FaCheck className="text-sm" />
                              {loading ? "Saving..." : "Save Changes"}
                           </button>

                           <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="flex items-center gap-2 px-6 py-3 bg-light-gray text-charcoal-gray font-medium rounded-lg hover:bg-slate-gray hover:text-white transition-colors duration-200"
                           >
                              <FaTimes className="text-sm" />
                              Cancel
                           </button>
                        </div>
                     </form>
                  </div>
               ) : (
                  /* Profile Display */
                  <div className="p-8">
                     <div className="flex items-start gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                           <div className="w-24 h-24 rounded-full bg-charcoal-gray flex items-center justify-center text-white shadow-lg">
                              {getRoleIcon()}
                           </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                           <div className="flex items-start justify-between">
                              <div>
                                 <h2 className="text-3xl font-bold text-charcoal-gray mb-2">
                                    {user.name}
                                 </h2>
                                 <div className="flex items-center gap-2 mb-4">
                                    <FaEnvelope className="text-slate-gray text-sm" />
                                    <span className="text-medium-gray">{user.email}</span>
                                 </div>
                                 <div className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor()}`}>
                                    {user.role}
                                 </div>
                              </div>
                              
                              <div className="flex gap-3">
                                 <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
                                 >
                                    <RiEdit2Fill className="text-sm" />
                                    Edit Profile
                                 </button>
                                 <button
                                    onClick={handleLogoutClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-medium-gray text-white font-medium rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
                                 >
                                    <MdLogout className="text-sm" />
                                    Logout
                                 </button>
                              </div>
                           </div>

                           {/* Profile Details Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                              {/* Phone */}
                              <div className="p-4 bg-light-gray rounded-lg">
                                 <div className="flex items-center gap-2 mb-2">
                                    <FaPhone className="text-medium-gray text-sm" />
                                    <span className="text-sm font-medium text-slate-gray">Phone Number</span>
                                 </div>
                                 <p className="text-charcoal-gray font-semibold pl-6">
                                    {user?.profile?.phoneNumber || (
                                       <span className="text-slate-gray text-sm italic">Not provided</span>
                                    )}
                                 </p>
                              </div>

                              {/* Gender */}
                              <div className="p-4 bg-light-gray rounded-lg">
                                 <div className="flex items-center gap-2 mb-2">
                                    <FaUser className="text-medium-gray text-sm" />
                                    <span className="text-sm font-medium text-slate-gray">Gender</span>
                                 </div>
                                 <p className="text-charcoal-gray font-semibold pl-6">
                                    {user?.profile?.gender || (
                                       <span className="text-slate-gray text-sm italic">Not specified</span>
                                    )}
                                 </p>
                              </div>

                              {/* Standard (for students only) */}
                              {user?.role === "Student" && (
                                 <div className="p-4 bg-light-gray rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                       <FaGraduationCap className="text-medium-gray text-sm" />
                                       <span className="text-sm font-medium text-slate-gray">Standard</span>
                                    </div>
                                    <p className="text-charcoal-gray font-semibold pl-6">
                                       {userDetails?.profile?.standard?.standardName || (
                                          <span className="text-slate-gray text-sm italic">Not assigned</span>
                                       )}
                                    </p>
                                 </div>
                              )}

                              {/* Admission Date */}
                              {user.admissionDate && (
                                 <div className="p-4 bg-light-gray rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                       <FaCalendarAlt className="text-medium-gray text-sm" />
                                       <span className="text-sm font-medium text-slate-gray">Admission Date</span>
                                    </div>
                                    <p className="text-charcoal-gray font-semibold pl-6">
                                       {new Date(user.admissionDate).toLocaleDateString()}
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Student Navigation */}
            {user && user.role === ACCOUNT_TYPE.STUDENT && (
               <div className="bg-white rounded-lg shadow-md border border-light-gray p-8">
                  {/* <h3 className="text-xl font-semibold text-charcoal-gray mb-6">Quick Actions</h3> */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <NavLink
                        to={"/dashboard/my-profile/attendance"}
                        className="p-6 bg-charcoal-gray text-white text-center font-semibold text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg"
                     >
                        View Attendance
                     </NavLink>
                     <NavLink
                        to={"/dashboard/my-profile/progress"}
                        className="p-6 bg-charcoal-gray text-white text-center font-semibold text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg"
                     >
                        Academic Progress
                     </NavLink>
                     <NavLink
                        to={"/dashboard/my-profile/remarks"}
                        className="p-6 bg-charcoal-gray text-white text-center font-semibold text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg"
                     >
                        View Remarks
                     </NavLink>
                  </div>
               </div>
            )}

            {/* Outlet for nested routes */}
            <Outlet />

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-md border border-red-200 p-8">
               <div className="flex items-center gap-3 mb-6">
                  <FiAlertTriangle className="text-red-500 text-2xl" />
                  <h3 className="text-xl font-bold text-charcoal-gray">Danger Zone</h3>
               </div>
               <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center justify-between">
                     <div>
                        <h4 className="text-lg font-semibold text-charcoal-gray mb-2">
                           Delete Account
                        </h4>
                        <p className="text-slate-gray text-sm mb-1">
                           Permanently delete your account and all associated data.
                        </p>
                        <p className="text-red-600 text-xs font-medium">
                           ⚠️ This action cannot be undone.
                        </p>
                     </div>
                     <button
                        onClick={handleDeleteAccountClick}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                     >
                        <MdDeleteForever className="text-lg" />
                        <span>Delete Account</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Logout Modal */}
         {showLogoutModal && (
            <Modal
               title="Log out"
               description="Are you sure you want to logout?"
               btn1={{
                  text: "Log Out",
                  onClick: handleLogoutConfirm,
               }}
               btn2={{
                  text: "Cancel",
                  onClick: handleLogoutCancel,
               }}
            />
         )}

         {/* Delete Account Modal */}
         {showDeleteModal && (
            <Modal
               title="Delete Account"
               description="Are you absolutely sure you want to delete your account? This action will permanently remove all your data and cannot be undone."
               btn1={{
                  text: "Delete Forever",
                  onClick: handleDeleteAccountConfirm,
                  className: "bg-red-600 hover:bg-red-700",
               }}
               btn2={{
                  text: "Cancel",
                  onClick: handleDeleteAccountCancel,
               }}
            />
         )}
      </div>
   );
}

export default MyProfile;

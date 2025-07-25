import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong, FaBullhorn } from 'react-icons/fa6';
import { FaCalendarAlt, FaUsers, FaBook } from 'react-icons/fa';
import { getMyDetails } from '../../../services/operations/users.service';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function MyAnnouncement() {
   const { token } = useSelector((state) => state.auth);
   const [announcementList, setAnnouncementList] = useState([]);
   const [loading, setLoading] = useState(true);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMyNotifications = async () => {
         try {
            setLoading(true);
            const response = await dispatch(getMyDetails(token));
            if (response) {
               setAnnouncementList(response.announcement || []);
            }
         } catch (error) {
            toast.error("Error in fetching notifications");
            console.log(error);
         } finally {
            setLoading(false);
         }
      };
      fetchMyNotifications();
   }, [dispatch, token]);

   // Helper function to get target audience with proper styling
   const getTargetAudience = (target) => {
      if (target === "All") {
         return (
            <div className="flex items-center gap-2">
               <FaUsers className="text-charcoal-gray text-sm" />
               <span className="text-charcoal-gray font-medium">Everyone</span>
            </div>
         );
      }
      return (
         <div className="flex items-center gap-2">
            <FaUsers className="text-medium-gray text-sm" />
            <span className="text-charcoal-gray font-medium capitalize">{target.toLowerCase()}</span>
         </div>
      );
   };

   // Helper function to get priority badge color
   const getPriorityColor = (target) => {
      if (target === "All") return "bg-charcoal-gray";
      if (target === "Admin") return "bg-red-500";
      if (target === "Tutor") return "bg-blue-500";
      if (target === "Student") return "bg-green-500";
      return "bg-medium-gray";
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
         </div>
      );
   }

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaBullhorn className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">My Announcements</h1>
            </div>
            
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-sm" />
               <span>Back</span>
            </button>
         </div>

         {/* Announcement Count */}
         <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-medium-gray font-medium">
               Total announcements: <span className="text-charcoal-gray font-semibold">{announcementList.length}</span>
            </p>
         </div>

         {/* Announcements List */}
         {announcementList.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
               <FaBullhorn className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
               <p className="text-medium-gray text-lg sm:text-xl mb-2">No announcements yet</p>
               <p className="text-slate-gray text-sm sm:text-base">New announcements will appear here</p>
            </div>
         ) : (
            <div className="space-y-3 sm:space-y-4">
               {announcementList.map((item, index) => (
                  <div
                     key={item._id}
                     className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200"
                     style={{
                        animationDelay: `${index * 0.1}s`,
                     }}
                  >
                     {/* Announcement Header */}
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2">
                              <FaBullhorn className="text-charcoal-gray text-base sm:text-lg" />
                              <span className="text-base sm:text-lg font-semibold text-charcoal-gray">Announcement</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-gray">
                           <FaCalendarAlt className="text-xs" />
                           <span>
                              {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </span>
                        </div>
                     </div>

                     {/* Message */}
                     <div className="mb-4 p-3 sm:p-4 bg-light-gray rounded-lg">
                        <p className="text-charcoal-gray leading-relaxed text-sm sm:text-base">
                           {item.message}
                        </p>
                     </div>

                     {/* Announcement Details */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Target Audience */}
                        <div className="p-3 bg-light-gray rounded-lg">
                           <p className="text-xs text-slate-gray mb-1">Target Audience</p>
                           {getTargetAudience(item.target)}
                        </div>

                        {/* Subject */}
                        <div className="p-3 bg-light-gray rounded-lg">
                           <p className="text-xs text-slate-gray mb-1">Subject</p>
                           <div className="flex items-center gap-2">
                              <FaBook className="text-medium-gray text-sm" />
                              <span className="text-charcoal-gray font-medium text-sm sm:text-base">
                                 {item.subject?.name || "All Subjects"}
                              </span>
                           </div>
                        </div>

                        {/* Date */}
                        <div className="p-3 bg-light-gray rounded-lg sm:col-span-2 lg:col-span-1">
                           <p className="text-xs text-slate-gray mb-1">Posted On</p>
                           <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-medium-gray text-sm" />
                              <span className="text-charcoal-gray font-medium text-sm sm:text-base">
                                 {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                 })}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default MyAnnouncement;

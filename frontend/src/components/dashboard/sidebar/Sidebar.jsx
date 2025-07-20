import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logos/noBg_white.png";
import { sidbarLinks as sidebarLinks } from "../../../data/sidebarLinks";
import { useDispatch, useSelector } from "react-redux";
import SidebarLinks from "./SidebarLinks";
import { FaBell, FaUser, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyDetails } from "../../../services/operations/users.service";

function Sidebar() {
   const { user } = useSelector((state) => state.profile);
   const { token } = useSelector((state) => state.auth);
   const [announcementCount, setAnnouncementCount] = useState(0);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMyNotifications = async () => {
         try {
            const response = await dispatch(getMyDetails(token));
            if (response) {
               setAnnouncementCount(response.announcement.length);
            }
         } catch (error) {
            toast.error("Error in fetching notifications");
         }
      };
      fetchMyNotifications();
   }, [dispatch, token]);

   return (
      <div className="fixed h-screen bg-medium-gray text-white w-80 flex flex-col shadow-xl">
         {/* Header with subtle border */}
         <div className="px-6 py-8 border-b border-white/10">
            <img src={Logo} className="h-12 mx-[21%] filter drop-shadow-sm" alt="Logo" />
         </div>

         {/* Navigation with better spacing */}
         <nav className="flex-1 py-6 px-2 overflow-y-auto">
            <div className="space-y-1">
               <SidebarLinks item={sidebarLinks[0]} />
               
               {user && sidebarLinks.map((item) => {
                  if (user.role === item.type) {
                     return <SidebarLinks key={item.id} item={item} />;
                  }
                  return null;
               })}
            </div>
         </nav>

         {/* Notifications with better design */}
         {user.role !== "Admin" && (
            <div className="px-4 pb-4">
               <button
                  onClick={() => navigate("/dashboard/my-announcement")}
                  className="w-full group cursor-pointer flex items-center justify-between p-4 bg-charcoal-gray/50 hover:bg-charcoal-gray rounded-xl transition-all duration-300 border border-white/5"
               >
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <FaBell className="text-lg text-white/80 group-hover:text-white transition-colors" />
                        {announcementCount > 0 && (
                           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                              {announcementCount > 9 ? "9+" : announcementCount}
                           </span>
                        )}
                     </div>
                     <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        Announcements
                     </span>
                  </div>
                  <FaChevronRight className="text-xs text-white/40 group-hover:text-white/60 transition-colors" />
               </button>
            </div>
         )}

         {/* User Profile with better styling */}
         <div className="border-t border-white/10">
            <button
               onClick={() => navigate("/dashboard/my-profile")}
               className="w-full group flex items-center cursor-pointer gap-4 p-6 hover:bg-charcoal-gray transition-all duration-300"
            >
               <div className="w-10 h-10 bg-charcoal-gray rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                  <span className="text-sm font-bold text-white">
                     {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
               </div>
               <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-white truncate">
                     {user?.name}
                  </p>
                  <p className="text-xs text-white/60 capitalize">
                     {user?.role}
                  </p>
               </div>
               <FaChevronRight className="text-xs text-white/30 group-hover:text-white/50 transition-colors" />
            </button>
         </div>
      </div>
   );
}

export default Sidebar;

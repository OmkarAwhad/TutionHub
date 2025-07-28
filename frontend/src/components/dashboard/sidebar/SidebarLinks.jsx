import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function SidebarLinks({ item, onClose }) {
   const location = useLocation();

   const matchRoute = (route) => {
      // Check if the current path starts with the given route
      return location.pathname.startsWith(route);
   };

   const isActive = matchRoute(item.path);

   // Handle click - close sidebar on mobile only
   const handleClick = () => {
      // Check if we're on mobile (screen width < 768px) and close sidebar
      if (onClose && window.innerWidth < 768) {
         onClose();
      }
   };

   return (
      <NavLink
         to={item.path}
         onClick={handleClick}
         className={`relative block mx-2 mb-2 rounded-lg font-medium transition-all duration-300 group ${
            isActive
               ? "bg-charcoal-gray text-white shadow-lg" 
               : "text-light-gray hover:bg-charcoal-gray/50 hover:text-white"
         }`}
      >
         {/* Active indicator bar */}
         <span
            className={`absolute left-0 top-0 h-full w-1 bg-white rounded-r-lg transition-all duration-300 ${
               isActive ? "opacity-100" : "opacity-0"
            }`}
         ></span>

         {/* Link content */}
         <div className="flex items-center gap-x-3 px-6 py-4">
            {/* Icon */}
            {/* {item.icon && (
               <span className={`text-xl transition-all duration-300 ${
                  isActive ? "text-white" : "text-light-gray group-hover:text-white"
               }`}>
                  {item.icon}
               </span>
            )} */}
            
            {/* Text */}
            <span className={`text-base font-medium transition-all duration-300 ${
               isActive ? "text-white" : "text-light-gray group-hover:text-white"
            }`}>
               {item.name}
            </span>
         </div>

         {/* Hover effect overlay */}
         <div className={`absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isActive ? "hidden" : ""
         }`}></div>
      </NavLink>
   );
}

export default SidebarLinks;

import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function SidebarLinks({ item }) {
	const location = useLocation();

	const matchRoute = (route) => {
		// Check if the current path starts with the given route
		return location.pathname.startsWith(route);
	};

	return (
		<NavLink
			to={item.path}
			className={`relative block px-8 py-1 rounded-r-lg text-sm mr-2 font-medium text-white ${
				matchRoute(item.path)
					? "bg-slate-gray" // Active state
					: "bg-transparent hover:bg-[#3a3838] transition-all duration-100" // Inactive state with hover effect
			}`}
		>
			<span
				className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
					matchRoute(item.path) ? "opacity-100" : "opacity-0"
				}`}
			></span>
			<div className="flex items-center gap-x-2 py-3 ">
				<span className="text-lg">{item.name}</span>
			</div>
		</NavLink>
	);
}

export default SidebarLinks;

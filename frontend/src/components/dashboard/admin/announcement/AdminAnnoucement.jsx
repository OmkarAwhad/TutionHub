import React from "react";
import { Link } from "react-router-dom";

function AdminAnnouncement() {
	return (
		<div className="w-full min-h-[70vh] flex items-center justify-center p-3 sm:p-4 lg:p-6">
			{/* button container */}
			<div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-20">
				<Link
					to="/dashboard/admin-announcement/create-announcement"
					className="w-full sm:w-[48%] bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-2xl sm:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
				>
					Create Announcement
				</Link>

				<Link
					to="/dashboard/admin-announcement/list-announcements"
					className="w-full sm:w-[48%] bg-medium-gray px-6 sm:px-10 lg:px-20 py-10 sm:py-12 lg:py-14 text-white font-extrabold text-2xl sm:text-3xl text-center rounded-lg hover:bg-charcoal-gray hover:scale-[102%] transition-all duration-200"
				>
					List Announcements
				</Link>
			</div>
		</div>
	);
}

export default AdminAnnouncement;

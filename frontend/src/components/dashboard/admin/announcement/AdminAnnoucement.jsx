import React from "react";
import { Link } from "react-router-dom";

function AdminAnnoucement() {
	return (
		<div className="w-full mx-auto flex flex-col h-[80vh] items-center justify-center gap-y-10 p-4">
			<div className="w-full h-[40vh] flex items-center flex-wrap justify-center gap-20">
				<Link
					to="/dashboard/admin-announcement/create-announcement"
					className="bg-medium-gray px-20 py-14 lg:w-[45%] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
				>
					Create Announcement
				</Link>
				<Link
					to="/dashboard/admin-announcement/list-announcements"
					className="bg-medium-gray px-20 py-14 lg:w-[45%] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
				>
					List Announcements
				</Link>
			</div>
		</div>
	);
}

export default AdminAnnoucement;

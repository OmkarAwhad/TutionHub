import React from "react";
import { Link } from "react-router-dom";

function AdminAttendance() {
	return (
		<div className=" w-full h-[80vh] flex items-center justify-center gap-20  ">
			<Link
				to={"/dashboard/admin-attendance/mark-attendance"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
			>
				Mark Attendance
			</Link>
			<Link
				to={"/dashboard/admin-attendance/view-attendance"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
			>
				View Attendance
			</Link>
		</div>
	);
}

export default AdminAttendance;

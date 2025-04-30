import React from "react";
import { Link } from "react-router-dom";

function AdminMarks() {
	return (
		<div className="w-full h-[80vh] flex items-center justify-center gap-20">
			<Link
				to={"/dashboard/admin-marks/add-marks"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
			>
				Add Marks
			</Link>
			<Link
				to={"/dashboard/admin-marks/view-marks"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
			>
				Marks List
			</Link>
		</div>
	);
}

export default AdminMarks;

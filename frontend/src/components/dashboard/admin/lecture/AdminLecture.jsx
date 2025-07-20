import React from "react";
import { Link } from "react-router-dom";

function AdminLecture() {
	return (
		<div className=" w-full h-[80vh] flex items-center justify-center gap-20  ">
			<Link
				to={"/dashboard/admin-lecture/create-lecture"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
			>
				Create Lecture
			</Link>
			<Link
				to={"/dashboard/admin-lecture/lectures-list"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
			>
				Lectures List
			</Link>
		</div>
	);
}

export default AdminLecture;

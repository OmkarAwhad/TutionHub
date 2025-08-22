import React from "react";
import { Link } from "react-router-dom";

function AdminAssign() {
	return (
		<div className="w-full min-h-[70vh] flex items-end justify-center p-3 sm:p-4 lg:p-6">
			<div className="w-full flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-20">
				<Link
					to={"/dashboard/assigns/assign-standard"}
					className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
				>
					Assign Standard
				</Link>

				<Link
					to={"/dashboard/assigns/assign-tutor"}
					className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
				>
					Assign Tutor
				</Link>

				<Link
					to={"/dashboard/assigns/subjects"}
					className="w-full max-w-sm sm:max-w-[45%] bg-medium-gray px-6 py-8 sm:px-12 lg:px-20 sm:py-10 lg:py-14 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] text-center"
				>
					Assign Subject
				</Link>
			</div>
		</div>
	);
}

export default AdminAssign;

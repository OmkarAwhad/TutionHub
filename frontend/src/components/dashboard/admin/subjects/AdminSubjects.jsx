import React from "react";
import { Link } from "react-router-dom";

function AdminSubjects() {
	return (
		<div className="w-full mx-auto flex flex-col h-[80vh] items-center justify-center gap-y-10 p-4">
			<div className=" w-full h-[40vh] grid md:grid-cols-2 gap-15  ">
				<Link
					to={"/dashboard/admin-subjects/assign-standard"}
					className="text-center bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Assign Standard
				</Link>
				<Link
					to={"/dashboard/admin-subjects/create-subject"}
					className="text-center bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Create Subject
				</Link>
				<Link
					to={"/dashboard/admin-subjects/subjects-list"}
					className="text-center bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Get All Subjects
				</Link>
				<Link
					to={"/dashboard/admin-subjects/assign-subjects"}
					className="text-center bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Assign Subjects
				</Link>
			</div>
		</div>
	);
}

export default AdminSubjects;

import React from "react";
import { Link } from "react-router-dom";

function TutorHomework() {
	return (
		<div className="w-full h-[80vh] flex items-center flex-wrap justify-center gap-x-20 gap-y-8">
			<Link
				to={"/dashboard/tutor-homework/upload-homework"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
			>
				Upload Homework
			</Link>
			<Link
				to={"/dashboard/tutor-homework/homework-list"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
			>
				View Homeworks
			</Link>
			<Link
				to={"/dashboard/tutor-homework/view-submissions"}
				className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
			>
				View Submissions
			</Link>
		</div>
	);
}

export default TutorHomework;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersList } from "../../../../services/operations/users.service";
import { assignSubjectToStudent } from "../../../../services/operations/subject.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function AssignSubjects() {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-3xl font-semibold text-richblack-5">
					Assign Subject
				</h3>
				<button
					onClick={() => navigate("/dashboard/admin-subjects")}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className=" w-full h-[60vh] flex items-center flex-wrap justify-center gap-20  ">
				<Link
					to={
						"/dashboard/admin-subjects/assign-subjects/students"
					}
					className="bg-medium-gray px-20 py-14 min-w-[20vw] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Students
				</Link>
				<Link
					to={"/dashboard/admin-subjects/assign-subjects/tutors"}
					className="bg-medium-gray px-20 py-14 min-w-[20vw] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Tutors
				</Link>
			</div>
		</>
	);
}

export default AssignSubjects;

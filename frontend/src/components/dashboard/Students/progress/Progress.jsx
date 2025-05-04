import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { subjectsOfAStudent } from "../../../../services/operations/subject.service";
import {
	marksAccToSubject,
	trackStudentProgress,
	trackProgressBySubject,
} from "../../../../services/operations/marks.service";
import MarksForSubject from "./MarksForSubject";
import OverallProgress from "./OverallProgress.jsx";
import SubjectProgress from "./SubjectProgress";

function Progress() {
	const { token } = useSelector((state) => state.auth);
	const [subjects, setSubjects] = useState(null);
	const [selectedSubject, setSelectedSubject] = useState("");
	const [marksDetails, setMarksDetails] = useState(null);
	const [overallProgress, setOverallProgress] = useState(null);
	const [subjectProgress, setSubjectProgress] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Fetch subjects
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const result = await dispatch(subjectsOfAStudent(token));
				if (result) {
					// console.log(result)
					setSubjects(result);
				}
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchSubjects();
	}, [dispatch, token]);

	// Fetch overall progress
	useEffect(() => {
		const fetchOverallProgress = async () => {
			try {
				const result = await trackStudentProgress(token);
				if (result) {
					setOverallProgress(result);
				}
			} catch (error) {
				console.error("Error fetching overall progress:", error);
			}
		};
		fetchOverallProgress();
	}, [dispatch, token]);

	// Fetch marks and progress by subject when selected
	useEffect(() => {
		if (!selectedSubject) {
			// Reset state when no subject is selected
			setMarksDetails(null);
			setSubjectProgress(null);
			return;
		}

		const fetchMarksAndProgress = async () => {
			setLoading(true);
			try {
				const marksResult = await marksAccToSubject(
					selectedSubject,
					token
				);
				const progressResult = await trackProgressBySubject(
					selectedSubject,
					token
				);

				// Reset state if no data is available
				if (!marksResult || marksResult.length === 0) {
					setMarksDetails(null);
				} else {
					setMarksDetails(marksResult);
				}

				if (!progressResult) {
					setSubjectProgress(null);
				} else {
					setSubjectProgress(progressResult);
				}
			} catch (error) {
				console.error("Error fetching marks or progress:", error);
				setMarksDetails(null);
				setSubjectProgress(null);
			}
			setLoading(false);
		};
		fetchMarksAndProgress();
	}, [selectedSubject, dispatch, token]);

	return (
		<div className="p-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					Progress Dashboard
				</h3>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>

			<OverallProgress overallProgress={overallProgress} />

			{/* Subject Selection */}
			<div className="bg-white rounded-xl shadow-xl shadow-medium-gray overflow-hidden p-4 mb-5 transition-all duration-300">
				<h4 className="text-xl font-semibold text-charcoal-gray mb-4">
					Select Subject
				</h4>
				{subjects && subjects.length > 0 ? (
					<select
						value={selectedSubject}
						onChange={(e) =>
							setSelectedSubject(e.target.value)
						}
						className="w-full p-2 border rounded-md text-richblack-900"
					>
						<option value="">Select a subject</option>
						{subjects.map((subject) => (
							<option
								key={subject._id}
								value={subject._id}
							>
								{subject.name}
							</option>
						))}
					</select>
				) : (
					<p className="text-richblack-500">
						No subjects available
					</p>
				)}
			</div>

			{selectedSubject && (
				<MarksForSubject
					marksDetails={marksDetails}
					loading={loading}
					subjectId={selectedSubject}
					subjects={subjects}
				/>
			)}

			{selectedSubject && (
				<SubjectProgress
					subjectProgress={subjectProgress}
					marksDetails={marksDetails}
					loading={loading}
					subjectId={selectedSubject}
					subjects={subjects}
				/>
			)}
		</div>
	);
}

export default Progress;

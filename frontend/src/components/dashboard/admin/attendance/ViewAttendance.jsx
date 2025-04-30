import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getLecturesWithAttendanceMarked } from "../../../../services/operations/attendance.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import PastDateCard from "./PastDateCard";
import { IoArrowBack } from "react-icons/io5";

function ViewAttendance() {
	const [lecturesList, setLecturesList] = useState([]);
	const [filteredLectures, setFilteredLectures] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedDesc, setSelectedDesc] = useState("Lecture");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	const fetchLectures = async () => {
		try {
			const response = await dispatch(
				getLecturesWithAttendanceMarked(token)
			);
			if (response) {
				setLecturesList(response);
				setFilteredLectures(response);
			}
		} catch (error) {
			console.error("Error fetching lectures:", error);
		}
	};

	const fetchSubjects = async () => {
		try {
			const response = await dispatch(getAllSubjects(token));
			if (response) {
				setSubjects(response);
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
		}
	};

	const filterLectures = () => {
		let filtered = [...lecturesList];

		if (selectedSubject !== "all") {
			filtered = filtered.filter(
				(lecture) => lecture.subject?._id === selectedSubject
			);
		}

		if (selectedDesc) {
			filtered = filtered.filter(
				(lecture) => lecture.description === selectedDesc
			);
		}

		setFilteredLectures(filtered);
	};

	useEffect(() => {
		filterLectures();
	}, [selectedSubject, selectedDesc]);

	useEffect(() => {
		fetchLectures();
		fetchSubjects();
	}, []);

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-richblack-5">
					View Attendance
				</h1>
				<button
					onClick={() => navigate("/dashboard/admin-attendance")}
					className="flex items-center gap-2 text-richblack-200 cursor-pointer hover:text-richblack-5 transition-all duration-200"
				>
					<IoArrowBack className="text-lg" />
					Back
				</button>
			</div>

			<div className="flex justify-end gap-5 mb-8">
				<select
					value={selectedSubject}
					onChange={(e) => setSelectedSubject(e.target.value)}
					className="border rounded-md px-2 py-1"
				>
					<option value="all">All Subjects</option>
					{subjects.map((subject) => (
						<option key={subject._id} value={subject._id}>
							{subject.name}
						</option>
					))}
				</select>
				<select
					value={selectedDesc}
					onChange={(e) => setSelectedDesc(e.target.value)}
					className="border rounded-md px-2 py-1"
				>
					<option value="Lecture">Lecture</option>
					<option value="Test">Test</option>
				</select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredLectures.map((lecture) => (
					<PastDateCard
						key={lecture._id}
						lecture={lecture}
						mode="view"
					/>
				))}
			</div>
		</div>
	);
}

export default ViewAttendance;

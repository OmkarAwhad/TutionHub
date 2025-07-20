import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getLecturesWithAttendanceMarked } from "../../../../services/operations/attendance.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import PastDateCard from "./PastDateCard";
import { FaArrowLeftLong, FaGraduationCap } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";

function ViewAttendance() {
	const [lecturesList, setLecturesList] = useState([]);
	const [filteredLectures, setFilteredLectures] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [standards, setStandards] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedDesc, setSelectedDesc] = useState("Lecture");
	const [selectedStandard, setSelectedStandard] = useState("All");
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

	const fetchStandards = async () => {
		try {
			const response = await dispatch(getAllStandards(token));
			if (response) {
				setStandards(response);
			}
		} catch (error) {
			console.error("Error fetching standards:", error);
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

		if (selectedStandard !== "All") {
			filtered = filtered.filter(
				(lecture) =>
					lecture.standard === selectedStandard ||
					lecture.standard?._id === selectedStandard
			);
		}

		setFilteredLectures(filtered);
	};

	useEffect(() => {
		filterLectures();
	}, [selectedSubject, selectedDesc, selectedStandard, lecturesList]);

	useEffect(() => {
		fetchLectures();
		fetchSubjects();
		fetchStandards();
	}, []);

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						View Attendance
					</h1>
				</div>

				<button
					onClick={() => navigate("/dashboard/admin-attendance")}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Subject and Type Filters */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex-1">
					<div className="flex gap-4 flex-wrap">
						{/* All Standards Button */}
						<button
							onClick={() => setSelectedStandard("All")}
							className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
								selectedStandard === "All"
									? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
									: "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
							}`}
						>
							<div className="flex items-center gap-2">
								<FaGraduationCap className="text-sm" />
								All Standards
							</div>
						</button>

						{/* Dynamic Standards Buttons */}
						{standards &&
							standards.map((standard) => (
								<button
									key={standard._id}
									onClick={() =>
										setSelectedStandard(
											standard._id
										)
									}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
										selectedStandard ===
										standard._id
											? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30"
											: "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
									}`}
								>
									<div className="flex items-center gap-2">
										<FaGraduationCap className="text-sm" />
										{standard.standardName}
									</div>
								</button>
							))}
					</div>
				</div>
				<div className="flex items-center gap-4">
					{/* Subject Filter */}
					<div>
						<label className="block text-xs text-slate-gray mb-1">
							Subject
						</label>
						<select
							value={selectedSubject}
							onChange={(e) =>
								setSelectedSubject(e.target.value)
							}
							className="px-4 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px]"
						>
							<option value="all">All Subjects</option>
							{subjects.map((subject) => (
								<option
									key={subject._id}
									value={subject._id}
								>
									{subject.name}
								</option>
							))}
						</select>
					</div>

					{/* Type Filter */}
					<div>
						<label className="block text-xs text-slate-gray mb-1">
							Type
						</label>
						<select
							value={selectedDesc}
							onChange={(e) =>
								setSelectedDesc(e.target.value)
							}
							className="px-4 py-2 border-2 border-light-gray rounded-lg bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[120px]"
						>
							<option value="Lecture">Lecture</option>
							<option value="Test">Test</option>
						</select>
					</div>
				</div>
			</div>

			{/* Lectures Grid */}
			{filteredLectures.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLectures.map((lecture) => (
						<PastDateCard
							key={lecture._id}
							lecture={lecture}
							mode="view"
						/>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
					<p className="text-medium-gray text-xl mb-2">
						No lectures found
					</p>
					<p className="text-slate-gray">
						Try adjusting your filters or check back later
					</p>
				</div>
			)}
		</div>
	);
}

export default ViewAttendance;

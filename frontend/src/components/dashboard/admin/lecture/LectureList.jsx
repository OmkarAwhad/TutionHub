import React, { useEffect, useState } from "react";
import {
	getAllLectures,
	deleteLecture,
} from "../../../../services/operations/lecture.service";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import Modal from "../../extras/Modal";
import LectureCard from "./LectureCard";
import { toast } from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { FaGraduationCap, FaBook, FaClipboardList } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LectureList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [lectures, setLectures] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [standards, setStandards] = useState([]);
	const [allLectures, setAllLectures] = useState([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedLecture, setSelectedLecture] = useState(null);

	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedDesc, setSelectedDesc] = useState("Lecture");
	const [selectedStandard, setSelectedStandard] = useState("All");

	const navigate = useNavigate();

	const getAllLecturesData = async () => {
		try {
			const response = await dispatch(getAllLectures(token));
			if (response) {
				setAllLectures(response);
				setLectures(response);
			}
		} catch (error) {
			console.error("Error fetching lectures:", error);
		}
	};

	const getSubjects = async () => {
		try {
			const response = await dispatch(getAllSubjects(token));
			if (response) {
				setSubjects(response);
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
		}
	};

	const getStandards = async () => {
		try {
			const response = await dispatch(getAllStandards(token));
			if (response) {
				setStandards(response.standards || response);
			}
		} catch (error) {
			console.error("Error fetching standards:", error);
		}
	};

	const filterLectures = () => {
		let filteredLectures = [...allLectures];

		// Filter by description
		if (selectedDesc) {
			filteredLectures = filteredLectures.filter(
				(lecture) => lecture.description === selectedDesc
			);
		}

		// Filter by subject
		if (selectedSubject !== "all") {
			filteredLectures = filteredLectures.filter(
				(lecture) => lecture.subject?._id === selectedSubject
			);
		}

		// Filter by standard
		if (selectedStandard !== "All") {
			filteredLectures = filteredLectures.filter(
				(lecture) => lecture.standard._id === selectedStandard
			);
		}

		setLectures(filteredLectures);
	};

	useEffect(() => {
		filterLectures();
	}, [selectedSubject, selectedDesc, selectedStandard]);

	useEffect(() => {
		getSubjects();
		getStandards();
		getAllLecturesData();
	}, []);

	const isPastDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return new Date(date) < today;
	};

	const handleDeleteClick = (lecture) => {
		setSelectedLecture(lecture);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedLecture?._id) {
			toast.error("No lecture selected for deletion");
			setShowDeleteModal(false);
			return;
		}

		try {
			await dispatch(deleteLecture(selectedLecture._id, token));
			await getAllLecturesData();
			setShowDeleteModal(false);
			setSelectedLecture(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedLecture(null);
	};

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="p-2 bg-light-gray text-charcoal-gray hover:bg-medium-gray hover:text-white rounded-xl transition-all duration-200"
					>
						<IoChevronBack className="text-xl" />
					</button>
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold text-charcoal-gray">All Lectures</h1>
					</div>
				</div>

				{/* Dropdowns */}
				<div className="flex gap-4">
					{/* Subject Dropdown */}
					<select
						name="Subject"
						value={selectedSubject || ""}
						onChange={(e) => setSelectedSubject(e.target.value)}
						className=" py-2.5 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[160px] appearance-none cursor-pointer "
					>
						<option value="all">All Subjects</option>
						{subjects.map((item) => (
							<option key={item._id} value={item._id}>
								{item.name}
							</option>
						))}
					</select>
					<select
						name="Desc"
						value={selectedDesc}
						onChange={(e) => setSelectedDesc(e.target.value)}
						className="pl-10 pr-4 py-2.5 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px] appearance-none cursor-pointer w-full"
					>
						<option value="Lecture">Lecture</option>
						<option value="Test">Test</option>
					</select>
				</div>
			</div>

			{/* Standards Filter Buttons */}
			<div className="mb-8 flex gap-6">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-4">
						<FaGraduationCap className="text-charcoal-gray text-xl" />
						<h2 className="text-xl font-semibold text-charcoal-gray">
							Filter by Standard
						</h2>
					</div>
					<div className="flex gap-4 flex-wrap">
						{/* All Standards Button */}
						<button
							onClick={() => setSelectedStandard("All")}
							className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard === "All"
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
									onClick={() => setSelectedStandard(standard._id)}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard === standard._id
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

				{/* Info Card */}
				<div className="flex-shrink-0">
					<div className="bg-light-gray/50 p-4 rounded-xl shadow-lg border border-light-gray min-w-[160px]">
						<h3 className="text-sm font-semibold text-charcoal-gray mb-1">
							{selectedDesc} Count
						</h3>
						<p className="text-2xl font-bold text-charcoal-gray">{lectures?.length || 0}</p>
						<p className="text-xs text-slate-gray">
							{selectedStandard === "All"
								? "All Standards"
								: standards.find(s => s._id === selectedStandard)?.standardName || "Standard"}
						</p>
					</div>
				</div>
			</div>

			{/* Lectures Grid */}
			{lectures.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{lectures.map((lecture) => (
						<div
							key={lecture._id}
							className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-gray hover:border-charcoal-gray/20 hover:-translate-y-1"
						>
							<LectureCard
								lecture={lecture}
								isPastDate={isPastDate}
								handleDeleteClick={handleDeleteClick}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<div className="bg-light-gray/30 rounded-2xl p-8 max-w-md mx-auto">
						<FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
						<p className="text-medium-gray text-xl mb-2">
							No {selectedDesc.toLowerCase()}s found
						</p>
						<p className="text-slate-gray">
							Try adjusting your filters or create a new {selectedDesc.toLowerCase()}
						</p>
					</div>
				</div>
			)}

			{showDeleteModal && (
				<Modal
					title="Delete Lecture"
					description={`Are you sure you want to delete the lecture for ${selectedLecture?.subject?.name
						} on ${format(
							new Date(selectedLecture?.date),
							"PPP"
						)}?`}
					btn1={{
						text: "Delete",
						onClick: handleDeleteConfirm,
					}}
					btn2={{
						text: "Cancel",
						onClick: handleDeleteCancel,
					}}
				/>
			)}
		</div>
	);
}

export default LectureList;

import React, { useEffect, useState } from "react";
import {
	getAllLectures,
	// getLectByDesc,
	// getLectureBySub,
	deleteLecture,
} from "../../../../services/operations/lecture.service";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import Modal from "../../extras/Modal";
import LectureCard from "./LectureCard";
import { toast } from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function LectureList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [lectures, setLectures] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [allLectures, setAllLectures] = useState([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedLecture, setSelectedLecture] = useState(null);

	const [selectedSubject, setSelectedSubject] = useState("all");
	const [selectedDesc, setSelectedDesc] = useState("Lecture");

   const navigate = useNavigate()

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

		setLectures(filteredLectures);
	};

	useEffect(() => {
		filterLectures();
	}, [selectedSubject, selectedDesc]);

	useEffect(() => {
		getSubjects();
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
			// Refresh the lecture list after successful deletion
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
		<div className="p-8 relative ">
         <IoChevronBack
            className="absolute text-medium-gray -top-2  "
            onClick={() => navigate(-1)}
         />
			<h1 className="text-3xl font-bold mb-8 text-richblack-5">
				All Lectures
			</h1>
			<div className="absolute right-14 top-10 flex flex-row gap-5 ">
				<select
					name="Subject"
					className="border rounded-md px-2 py-1"
					id=""
					value={selectedSubject || ""}
					onChange={(e) => setSelectedSubject(e.target.value)}
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
					id=""
					value={selectedDesc}
					onChange={(e) => setSelectedDesc(e.target.value)}
					className="border rounded-md px-2 py-1"
				>
					<option value="Lecture">Lecture</option>
					<option value="Test">Test</option>
				</select>
			</div>
			{lectures.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{lectures.map((lecture) => (
						<div
							key={lecture._id}
							className=" p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300"
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
					<p className="text-2xl text-richblack-200">
						No {selectedDesc} found
					</p>
				</div>
			)}

			{showDeleteModal && (
				<Modal
					title="Delete Lecture"
					description={`Are you sure you want to delete the lecture for ${
						selectedLecture?.subject?.name
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

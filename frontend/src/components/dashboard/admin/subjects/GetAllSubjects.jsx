import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
	deleteSubject,
	getAllSubjects,
} from "../../../../services/operations/subject.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Modal from "../../extras/Modal";
import { setEditingSubject } from "../../../../slices/subject.slice";

function GetAllSubjects() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [subjects, setSubjects] = useState([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState(null);

	const getAllSubjectsData = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
			toast.error("Failed to fetch subjects");
		}
	};

	useEffect(() => {
		getAllSubjectsData();
	}, []);

	const handleEdit = (subject) => {
		dispatch(setEditingSubject(subject));
		navigate("/dashboard/admin-subjects/create-subject");
	};

	const handleDeleteClick = (subject) => {
		setSelectedSubject(subject);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedSubject?._id) {
			toast.error("No subject selected for deletion");
			setShowDeleteModal(false);
			return;
		}

		try {
			const result = await dispatch(
				deleteSubject(selectedSubject._id, token)
			);
			if (result) {
				toast.success("Subject deleted successfully");
			}
			await getAllSubjectsData();
			setShowDeleteModal(false);
			setSelectedSubject(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedSubject(null);
	};

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-3xl font-semibold text-richblack-5">
					Get Subjects
				</h3>
				<button
					onClick={() => navigate('/dashboard/admin-subjects')}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{subjects.map((subject) => (
					<div
						key={subject._id}
						className="bg-white shadow-2xs shadow-slate-gray p-6 rounded-md hover:shadow-lg transition-all transform hover:scale-[1.02] animate-fade-in"
					>
						<h3 className="text-medium-gray text-xl font-semibold mb-2">
							{subject.name}
						</h3>
						<p className="text-gray-500 mb-4">
							Code: {subject.code}
						</p>
						<div className="flex gap-4 justify-end">
							<button
								onClick={() => {
									handleEdit(subject);
								}}
								className="p-2 text-medium-gray hover:text-charcoal-gray transition-all transform hover:scale-110"
							>
								<FaEdit size={20} />
							</button>
							<button
								onClick={() =>
									handleDeleteClick(subject)
								}
								className="p-2 text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
							>
								<FaTrash size={20} />
							</button>
						</div>
					</div>
				))}
			</div>
			{showDeleteModal && (
				<Modal
					title="Delete Lecture"
					description={`Are you sure you want to delete the subject for ${selectedSubject?.name}`}
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
		</>
	);
}

export default GetAllSubjects;

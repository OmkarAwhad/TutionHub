import React, { useEffect, useState } from "react";
import { getMyDetails } from "../../../../services/operations/users.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Modal from "../../extras/Modal";
import TutorNotesCard from "../Notes/TutorNotesCard";
import TutorHomeworkCard from "./TutorHomeworkCard";
import { deleteHomework } from "../../../../services/operations/homework.service";

function HomeworkList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [myHomework, setMyHomework] = useState([]);
	const [selectedHomework, setSelectedHomework] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const fetchMyDetails = async () => {
		try {
			const response = await dispatch(getMyDetails(token));
			if (response) {
				// console.log(response?.homework);
				setMyHomework(response.homework);
			}
		} catch (error) {
			toast.error("Error in fetching your details");
		}
	};

	useEffect(() => {
		fetchMyDetails();
	}, [dispatch, token]);

	const handleDeleteClick = (hw) => {
		setSelectedHomework(hw);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			if (!selectedHomework?._id) {
				toast.error("No note selected for deletion");
				setShowDeleteModal(false);
				return;
			}
			await dispatch(deleteHomework(selectedHomework._id,token));
			await fetchMyDetails();
			setShowDeleteModal(false);
			setSelectedHomework(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedHomework(null);
	};

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">My Notes</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
				</div>
			</div>
         <div className="p-8">
				{myHomework && myHomework.length === 0 ? (
					<div className="w-full flex items-center justify-center ">
						<p className="text-3xl text-medium-gray">
							No homework available
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myHomework &&
							myHomework.map((homework) => (
								<TutorHomeworkCard
									key={homework._id}
									homework={homework}
									handleDeleteClick={
										handleDeleteClick
									}
								/>
							))}
					</div>
				)}
			</div>
			{showDeleteModal && (
				<Modal
					title="Delete Lecture"
					description={`Are you sure you want to delete the Note`}
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

export default HomeworkList;

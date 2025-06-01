import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
	deleteAnnouncement,
	getAllAnnouncements,
} from "../../../../services/operations/announcement.service";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "../../extras/Modal";

function AnnouncementList() {
	const [announcementList, setAnnouncementList] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

	const { token } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchAnnouncements = async () => {
		try {
			const response = await dispatch(getAllAnnouncements(token));
			if (response) {
				// console.log(response);
				setAnnouncementList(response);
			}
		} catch (error) {
			toast.error("Error in fetching announcements");
		}
	};

	useEffect(() => {
		fetchAnnouncements();
	}, [dispatch, token]);

	const handleDeleteClick = (announcement) => {
		setSelectedAnnouncement(announcement);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedAnnouncement?._id) {
			toast.error("No announcement selected for deletion");
			setShowDeleteModal(false);
			return;
		}

		try {
			const result = await dispatch(
				deleteAnnouncement(selectedAnnouncement._id, token)
			);
			if (result) {
				toast.success("Announcement deleted successfully");
			}
			await fetchAnnouncements();
			setShowDeleteModal(false);
			setSelectedAnnouncement(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedAnnouncement(null);
	};

	return (
		<>
			<div>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-semibold text-richblack-5">
						Announcement List
					</h3>
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
					>
						<FaArrowLeftLong className="text-lg" />
						Back
					</button>
				</div>
				<div className="flex flex-col mt-10 gap-y-5">
					{announcementList &&
						announcementList.map((item) => (
							<div
								key={item._id}
								className="bg-white shadow shadow-[#979797] p-6 text-slate-gray flex items-center justify-between rounded-lg w-full max-w-6xl mx-auto animate-slide-in"
							>
								<div>
									<div>
										Message :{" "}
										<span className="text-charcoal-gray">
											{item.message}
										</span>
									</div>
									<div className="">
										<p>
											{item.target === "All" ? (
												<>Attention <span className="text-charcoal-gray">everyone</span>.</>
											) : (
												<>
													For all{" "}
													<span className="text-charcoal-gray">
														{item.target.toLowerCase()}
													</span>
													.
												</>
											)}
										</p>
										<p>
											Subject :{" "}
											<span className="text-charcoal-gray">
												{item.subject
													? item.subject
														.name
													: "All"}
											</span>
										</p>
										<p>
											Date :{" "}
											<span className="text-charcoal-gray">
												{new Date(
													item.createdAt
												).toLocaleDateString(
													"en-GB",
													{
														day: "2-digit",
														month: "2-digit",
														year: "2-digit",
													}
												)}
											</span>
										</p>
									</div>
								</div>
								<div>
									<button
										onClick={() =>
											handleDeleteClick(item)
										}
										className="p-4 bg-medium-gray rounded-full text-white cursor-pointer hover:bg-charcoal-gray transition-all duration-150"
									>
										<RiDeleteBin6Line />
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
			{showDeleteModal && (
				<Modal
					title="Delete Announcement"
					description={`Are you sure you want to delete the announcement?`}
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

export default AnnouncementList;

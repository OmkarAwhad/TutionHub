import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaBullhorn, FaUsers, FaBook, FaMessage } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
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
			console.error("Error deleting announcement:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedAnnouncement(null);
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center gap-3">
					<FaBullhorn className="text-charcoal-gray text-2xl" />
					<h3 className="text-3xl font-semibold text-charcoal-gray">
						Announcements
					</h3>
				</div>
				<button
					onClick={() => navigate(-1)}
					className="flex group items-center gap-2 cursor-pointer text-charcoal-gray px-4 py-2 bg-light-gray hover:text-white rounded-xl transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg " />
					<span>Back</span>
				</button>
			</div>

			{/* Announcements Count */}
			<div className="mb-6">
				<p className="text-medium-gray font-medium">
					Total Announcements: <span className="text-charcoal-gray font-semibold">{announcementList?.length || 0}</span>
				</p>
			</div>

			<div className="space-y-6">
				{announcementList && announcementList.length > 0 ? (
					announcementList.map((item) => (
						<div
							key={item._id}
							className="bg-white border border-light-gray shadow-lg p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
						>
							<div className="flex items-start justify-between">
								{/* Content Section */}
								<div className="flex-1 space-y-4">
									{/* Message */}
									<div className="flex items-start gap-3">
										<FaMessage className="text-charcoal-gray text-base mt-2" />
										<div>
											{/* <p className="text-sm text-medium-gray font-medium mb-1">Message</p> */}
											<p className="text-charcoal-gray font-medium text-lg">
												{item.message}
											</p>
										</div>
									</div>

									{/* Details Grid */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-light-gray">
										{/* Target */}
										<div className="flex items-center gap-3">
											<FaUsers className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">Target</p>
												<p className="text-charcoal-gray font-medium">
													{item.target === "All" ? "Everyone" : item.target}
												</p>
											</div>
										</div>

										{/* Subject */}
										<div className="flex items-center gap-3">
											<FaBook className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">Subject</p>
												<p className="text-charcoal-gray font-medium">
													{item.subject ? item.subject.name : "All Subjects"}
												</p>
											</div>
										</div>

										{/* Date */}
										<div className="flex items-center gap-3">
											<FaCalendarAlt className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">Created</p>
												<p className="text-charcoal-gray font-medium">
													{new Date(item.createdAt).toLocaleDateString("en-GB", {
														day: "2-digit",
														month: "short",
														year: "numeric",
													})}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Delete Button */}
								<div className="flex-shrink-0 ml-6">
									<button
										onClick={() => handleDeleteClick(item)}
										className="p-3 bg-light-gray text-slate-gray rounded-xl cursor-pointer hover:bg-charcoal-gray hover:text-white transition-all duration-200 group-hover:scale-105"
										title="Delete Announcement"
									>
										<RiDeleteBin6Line className="text-lg " />
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					// Empty State
					<div className="text-center py-12">
						<FaBullhorn className="mx-auto h-16 w-16 text-slate-gray mb-4" />
						<p className="text-medium-gray text-xl">No announcements found</p>
						<p className="text-slate-gray">Create your first announcement to get started</p>
					</div>
				)}
			</div>

			{showDeleteModal && (
				<Modal
					title="Delete Announcement"
					description={`Are you sure you want to delete this announcement?`}
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

export default AnnouncementList;

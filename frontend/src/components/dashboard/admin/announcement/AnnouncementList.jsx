import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	FaArrowLeftLong,
	FaBullhorn,
	FaUsers,
	FaBook,
	FaMessage,
} from "react-icons/fa6";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import {
	deleteAnnouncement,
	getAllAnnouncements,
} from "../../../../services/operations/announcement.service";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "../../extras/Modal";

function AnnouncementList() {
	const [announcements, setAnnouncements] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchAnnouncements = async () => {
		try {
			const response = await dispatch(getAllAnnouncements(token));
			if (response) {
				setAnnouncements(response);
				setFiltered(response);
			}
		} catch {
			toast.error("Error fetching announcements");
		}
	};

	useEffect(() => {
		fetchAnnouncements();
	}, [dispatch, token]);

	/* ---------- search ---------- */
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFiltered(announcements);
		} else {
			const t = searchTerm.toLowerCase();
			const f = announcements.filter(
				(a) =>
					a.message.toLowerCase().includes(t) ||
					a.target.toLowerCase().includes(t) ||
					a.subject?.name?.toLowerCase().includes(t)
			);
			setFiltered(f);
		}
	}, [searchTerm, announcements]);

	/* ---------- delete ---------- */
	const handleDeleteClick = (a) => {
		setSelectedAnnouncement(a);
		setShowDeleteModal(true);
	};
	const handleDeleteConfirm = async () => {
		if (!selectedAnnouncement?._id) return;
		try {
			const ok = await dispatch(
				deleteAnnouncement(selectedAnnouncement._id, token)
			);
			if (ok) toast.success("Announcement deleted");
			await fetchAnnouncements();
		} catch {
			toast.error("Delete failed");
		}
		setShowDeleteModal(false);
		setSelectedAnnouncement(null);
	};

	return (
		<div className="p-3 sm:p-4 lg:p-6">
			{/* header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<FaBullhorn className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						Announcements
					</h1>
				</div>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 px-3 py-2 bg-light-gray text-charcoal-gray rounded-lg hover:bg-charcoal-gray hover:text-white transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* search bar */}
			<div className="bg-white p-4 sm:p-6 border border-light-gray rounded-lg mb-6 shadow-sm">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-gray text-sm" />
					<input
						type="text"
						placeholder="Search announcement message, subject or target..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
					/>
				</div>
				{searchTerm && (
					<p className="mt-2 text-sm text-medium-gray">
						Showing {filtered.length} of{" "}
						{announcements.length} announcements
					</p>
				)}
			</div>

			{/* count */}
			<p className="text-medium-gray font-medium mb-4">
				Total Announcements:{" "}
				<span className="text-charcoal-gray font-semibold">
					{announcements.length}
				</span>
			</p>

			{/* list */}
			<div className="space-y-6">
				{filtered.length ? (
					filtered.map((item) => (
						<div
							key={item._id}
							className="bg-white border border-light-gray shadow-md hover:shadow-xl rounded-2xl p-5 sm:p-6 transition-all duration-300"
						>
							<div className="flex items-start justify-between gap-4">
								{/* left section */}
								<div className="flex-1 space-y-4">
									{/* message */}
									<div className="flex items-start gap-2">
										<FaMessage className="text-charcoal-gray mt-1 text-sm" />
										<p className="text-charcoal-gray font-medium text-base sm:text-lg break-words">
											{item.message}
										</p>
									</div>

									{/* meta grid */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-light-gray">
										{/* target */}
										<div className="flex items-center gap-2">
											<FaUsers className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">
													Target
												</p>
												<p className="text-charcoal-gray font-medium">
													{item.target ===
													"All"
														? "Everyone"
														: item.target}
												</p>
											</div>
										</div>
										{/* subject */}
										<div className="flex items-center gap-2">
											<FaBook className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">
													Subject
												</p>
												<p className="text-charcoal-gray font-medium">
													{item.subject
														? item
																.subject
																.name
														: "All Subjects"}
												</p>
											</div>
										</div>
										{/* date */}
										<div className="flex items-center gap-2">
											<FaCalendarAlt className="text-medium-gray text-sm" />
											<div>
												<p className="text-xs text-slate-gray">
													Created
												</p>
												<p className="text-charcoal-gray font-medium">
													{new Date(
														item.createdAt
													).toLocaleDateString(
														"en-GB",
														{
															day: "2-digit",
															month: "short",
															year: "numeric",
														}
													)}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* delete btn */}
								<button
									onClick={() =>
										handleDeleteClick(item)
									}
									className="p-3 bg-light-gray text-slate-gray rounded-xl hover:bg-charcoal-gray hover:text-white transition-all duration-200 flex-shrink-0"
									title="Delete Announcement"
								>
									<RiDeleteBin6Line className="text-lg" />
								</button>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-12">
						<FaBullhorn className="mx-auto h-16 w-16 text-slate-gray mb-4" />
						<p className="text-medium-gray text-xl">
							{searchTerm
								? "No announcements match your search"
								: "No announcements found"}
						</p>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm("")}
								className="mt-4 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
							>
								Clear Search
							</button>
						)}
					</div>
				)}
			</div>

			{/* modal */}
			{showDeleteModal && (
				<Modal
					title="Delete Announcement"
					description="Are you sure you want to delete this announcement?"
					btn1={{ text: "Delete", onClick: handleDeleteConfirm }}
					btn2={{
						text: "Cancel",
						onClick: () => setShowDeleteModal(false),
					}}
				/>
			)}
		</div>
	);
}

export default AnnouncementList;

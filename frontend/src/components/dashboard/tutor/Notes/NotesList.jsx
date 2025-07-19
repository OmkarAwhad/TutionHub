import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyDetails } from "../../../../services/operations/users.service";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";
import TutorNotesCard from "./TutorNotesCard";
import Modal from "../../extras/Modal";
import { deleteNote } from "../../../../services/operations/notes.service";
import { getAllStandards } from "../../../../services/operations/standard.service";

function NotesList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [allNotes, setAllNotes] = useState(null);
	const [myNotes, setMyNotes] = useState(null);
	const [selectedNote, setSelectedNote] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [standardsList, setStandardsList] = useState([]);
	const [selectedStandard, setSelectedStandard] = useState("All");

	useEffect(() => {
		const fetchStandards = async () => {
			try {
				const response = await dispatch(getAllStandards(token));
				if (response) {
					setStandardsList(response.standards || response);
				}
			} catch (error) {
				console.error("Error in fetching standards:", error);
				toast.error("Error in fetching standards");
			}
		};
		fetchStandards();
	}, [dispatch, token]);

	const handleDeleteClick = (note) => {
		setSelectedNote(note);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			if (!selectedNote?._id) {
				toast.error("No note selected for deletion");
				setShowDeleteModal(false);
				return;
			}
			await dispatch(deleteNote(selectedNote._id, token));
			await fetchMyNotes();
			setShowDeleteModal(false);
			setSelectedNote(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedNote(null);
	};

	const fetchMyNotes = async () => {
		try {
			let response = await dispatch(getMyDetails(token));
			if (response) {
				setAllNotes(response?.notes);
			}
		} catch (error) {
			console.log("Error in fetching my notes", error);
			toast.error("Error in fetching my notes");
		}
	};

	useEffect(() => {
		fetchMyNotes();
	}, [dispatch, token]);

	useEffect(() => {
		if (allNotes) {
			if (selectedStandard !== "All") {
				const filtered = allNotes.filter(
					(note) => note.standard._id === selectedStandard
				);
				setMyNotes(filtered);
			} else {
				setMyNotes(allNotes);
			}
		}
	}, [allNotes, selectedStandard]);

	const handleStandardClick = (standardId) => {
		setSelectedStandard(standardId);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl">My Notes</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
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
					<div className="flex gap-4">
						{/* All Standards Button */}
						<button
							onClick={() => handleStandardClick("All")}
							className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard === "All"
									? "bg-medium-gray text-white shadow-xl shadow-charcoal-gray/30"
									: "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
								}`}
						>
							<div className="flex items-center gap-2">
								<FaGraduationCap className="text-sm" />
								All Standards
							</div>
						</button>

						{/* Dynamic Standards Buttons */}
						{standardsList &&
							standardsList.map((standard) => (
								<button
									key={standard._id}
									onClick={() =>
										handleStandardClick(
											standard._id
										)
									}
									className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${selectedStandard ===
											standard._id
											? "bg-medium-gray text-white shadow-xl shadow-charcoal-gray/30"
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
					<div className=" bg-gray-100 p-4 rounded-xl shadow-lg min-w-[160px]">
						<h3 className="text-sm font-semibold text-charcoal-gray mb-1">
							Notes Count
						</h3>
						<p className="text-2xl font-bold text-charcoal-gray">
							{myNotes?.length || 0}
						</p>
						<p className="text-xs text-charcoal-gray">
							{selectedStandard === "All"
								? "All Standards"
								: standardsList.find(
									(s) =>
										s._id ===
										selectedStandard
								)?.standardName || "Standard"}
						</p>
					</div>
				</div>
			</div>

			<div className="py-2">
				{myNotes && myNotes.length === 0 ? (
					<div className="text-center py-12">
						<FaGraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
						<p className="text-gray-500 text-xl mb-2">
							No notes available for{" "}
							{selectedStandard === "All"
								? "any standard"
								: standardsList.find(
									(s) =>
										s._id ===
										selectedStandard
								)?.standardName || "this standard"}
						</p>
						<p className="text-gray-400">
							Try selecting a different standard or upload
							new notes
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myNotes &&
							myNotes.map((note) => (
								<TutorNotesCard
									key={note._id}
									note={note}
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
					title="Delete Note"
					description={`Are you sure you want to delete this note?`}
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

export default NotesList;

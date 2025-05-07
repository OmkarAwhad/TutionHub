import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EnhancedFileUploader from "../../Students/homework/EnhancedFileUploader";
import { uploadNotes } from "../../../../services/operations/notes.service";

function UploadNote() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [subjects, setSubjects] = useState([]);
	const [selectedSub, setSelectedSub] = useState("");
	const [title, setTitle] = useState("");

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await dispatch(getAllSubjects(token));
				if (response) {
					setSubjects(response);
				}
			} catch (error) {
				console.error("Error in fetching subjects:", error);
				toast.error("Error in fetching subjects");
			}
		};
		fetchSubjects();
	}, [dispatch, token]);

	const handleUpload = async (file, trackProgress) => {
		if (!file) {
			toast.error("Please select a file to upload.");
			return;
		}
		if (!title) {
			toast.error("Please enter a title.");
			return;
		}
		if (!selectedSub) {
			toast.error("Please select a subject.");
			return;
		}

		try {
			// Create form data
			const formData = new FormData();
			formData.append("title", title);
			formData.append("subject", selectedSub);
			formData.append("file", file);

			// Debug FormData contents
			// for (const [key, value] of formData.entries()) {
			// 	console.log(`${key}:`, value);
			// }

			const response = await dispatch(
				uploadNotes(formData, token, trackProgress)
			);

			if (response) {
				toast.success("Notes uploaded successfully!");
				navigate(-1); // Navigate back after successful upload
			} else {
				throw new Error("Failed to upload notes");
			}
		} catch (error) {
			console.error("Error during notes upload:", error);
			toast.error(error.message || "An error occurred during upload.");
			throw error;
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">Upload Notes</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
				</div>
			</div>
			<form
				className="w-2/3 mx-auto text-medium-gray mt-10 p-8 rounded-3xl shadow-xl shadow-medium-gray flex flex-col gap-4"
				onSubmit={(e) => e.preventDefault()}
			>
				<label>
					<p className="ml-2 text-lg">Title</p>
					<input
						type="text"
						placeholder="Enter Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="border-2 border-gray-300 outline-none w-full px-3 py-2 rounded-lg"
					/>
				</label>
				<label>
					<p className="ml-2 text-lg">Subject</p>
					<select
						className="border-2 text-gray-500 outline-none border-gray-300 w-full px-3 py-2 rounded-lg"
						value={selectedSub}
						onChange={(e) => setSelectedSub(e.target.value)}
					>
						<option value="" disabled>
							Select Subject
						</option>
						{subjects &&
							subjects.map((item) => (
								<option key={item._id} value={item._id}>
									{item.name}
								</option>
							))}
					</select>
				</label>
				<label>
					<div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
						<p className="text-sm text-gray-600">
							Upload your completed notes here. Accepted
							file types: PDF, DOC, DOCX, JPG, PNG.
						</p>

						<EnhancedFileUploader
							onUpload={handleUpload}
							title="Upload Notes"
							acceptedFileTypes={[
								".pdf",
								".doc",
								".docx",
								".jpg",
								".jpeg",
								".png",
							]}
							maxSizeMB={10}
						/>
					</div>
				</label>
			</form>
		</div>
	);
}

export default UploadNote;

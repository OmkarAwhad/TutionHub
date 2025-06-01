import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createAnnouncementService } from "../../../../services/operations/announcement.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";

function CreateAnnouncement() {
	const { token } = useSelector((state) => state.auth);
	const [subjects, setSubjects] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const result = await dispatch(getAllSubjects(token));
				setSubjects(result || []);
			} catch (error) {
				if (error?.message) {
					toast.error(error.message);
				} else {
					toast.error("Failed to fetch subjects");
				}
			}
		};
		fetchSubjects();
	}, [dispatch, token]);

	const onSubmit = async (data) => {
		try {
			const payload = {
				message: data.message,
				target: data.target,
				subject: data.subject || null,
			};
			const result = await dispatch(
				createAnnouncementService(payload, token)
			);
			if (result) {
				reset();
				navigate("/dashboard/admin-announcement");
			}
		} catch (error) {
			if (error?.message) {
				toast.error(error.message);
			} else {
				toast.error("Failed to create announcement");
			}
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					Create Announcement
				</h3>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className="bg-white shadow-xl shadow-slate-gray p-6 mt-15 rounded-xl w-full max-w-2xl mx-auto animate-slide-in ">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Message
						</p>
						<textarea
							{...register("message", { required: true })}
							placeholder="Enter announcement message"
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
							rows={3}
							style={{
								minHeight: "80px",
								maxHeight: "200px",
							}}
						/>
						{errors.message && (
							<p className="text-red-200 text-sm ml-2">
								Message is required
							</p>
						)}
					</label>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Target
						</p>
						<select
							{...register("target", { required: true })}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
							defaultValue="All"
						>
							<option value="All">All</option>
							<option value="Students">Students</option>
							<option value="Tutors">Tutors</option>
						</select>
						{errors.target && (
							<p className="text-red-200 text-sm ml-2">
								Target is required
							</p>
						)}
					</label>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Subject (optional)
						</p>
						<select
							{...register("subject")}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
							defaultValue=""
						>
							<option value="">None</option>
							{subjects.map((subj) => (
								<option key={subj._id} value={subj._id}>
									{subj.name}
								</option>
							))}
						</select>
					</label>
					<div className="flex gap-4 items-center justify-center">
						{/* <button
							type="button"
							onClick={() => reset()}
							className="bg-gray-300 text-slate-gray cursor-pointer w-fit px-6 py-2 rounded-sm mt-4 hover:text-white hover:bg-gray-400 transition-all transform hover:scale-105"
						>
							Clear
						</button> */}
						<button
							className="bg-medium-gray cursor-pointer hover:bg-charcoal-gray text-white w-fit px-6 py-2 rounded-sm mt-4 hover:bg-slate-700 transition-all transform hover:scale-105"
							type="submit"
						>
							Create Announcement
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateAnnouncement;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createAnnouncementService } from "../../../../services/operations/announcement.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { useNavigate } from "react-router-dom";
import {
	FaArrowLeftLong,
	FaBullhorn,
	FaMessage,
	FaUsers,
	FaBook,
	FaGraduationCap,
} from "react-icons/fa6";
import toast from "react-hot-toast";

function CreateAnnouncement() {
	const { token } = useSelector((state) => state.auth);
	const [subjects, setSubjects] = useState([]);
	const [standards, setStandards] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm({ defaultValues: { target: "All" } });

	const selectedTarget = watch("target");
	const showStandards =
		selectedTarget === "Students" || selectedTarget === "All";

	/* fetch dropdown data */
	useEffect(() => {
		(async () => {
			try {
				const [subs, stds] = await Promise.all([
					dispatch(getAllSubjects(token)),
					dispatch(getAllStandards(token)),
				]);
				setSubjects(subs || []);
				setStandards(stds || []);
			} catch {
				toast.error("Failed to fetch data");
			}
		})();
	}, [dispatch, token]);

	/* submit */
	const onSubmit = async (data) => {
		try {
			setIsSubmitting(true);
			const payload = {
				message: data.message,
				target: data.target,
				subject: data.subject || null,
				standard:
					showStandards && data.standard ? data.standard : null,
			};
			const ok = await dispatch(
				createAnnouncementService(payload, token)
			);
			if (ok) {
				toast.success("Announcement created");
				reset();
				navigate("/dashboard/admin-announcement");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-3 sm:p-4 lg:p-6">
			{/* header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<FaBullhorn className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						Create Announcement
					</h1>
				</div>
				<button
					onClick={() =>
						navigate("/dashboard/admin-announcement")
					}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* form card */}
			<div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-5"
				>
					{/* message */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
							<FaMessage className="text-medium-gray" />{" "}
							Message
						</label>
						<textarea
							{...register("message", {
								required: "Message is required",
								minLength: {
									value: 10,
									message: "Minimum 10 characters",
								},
							})}
							placeholder="Enter your announcement..."
							className={`w-full px-4 py-3 min-h-[120px] rounded-lg resize-y placeholder-slate-gray text-charcoal-gray focus:outline-none transition-colors duration-200 ${
								errors.message
									? "border-red-400 focus:border-red-400"
									: "border border-light-gray focus:border-charcoal-gray"
							}`}
						/>
						{errors.message && (
							<p className="text-red-500 text-sm mt-1">
								{errors.message.message}
							</p>
						)}
					</div>

					{/* target */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
							<FaUsers className="text-medium-gray" />{" "}
							Target Audience
						</label>
						<select
							{...register("target", {
								required: "Target is required",
							})}
							className={`w-full px-4 py-3 rounded-lg bg-white text-charcoal-gray focus:outline-none transition-colors duration-200 ${
								errors.target
									? "border-red-400 focus:border-red-400"
									: "border border-light-gray focus:border-charcoal-gray"
							}`}
						>
							<option value="All">All Users</option>
							<option value="Students">
								Students Only
							</option>
							<option value="Tutors">Tutors Only</option>
						</select>
						{errors.target && (
							<p className="text-red-500 text-sm mt-1">
								{errors.target.message}
							</p>
						)}
					</div>

					{/* standard */}
					{showStandards && (
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
								<FaGraduationCap className="text-medium-gray" />{" "}
								Standard (Optional)
							</label>
							<select
								{...register("standard")}
								className="w-full px-4 py-3 border border-light-gray rounded-lg bg-white text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
							>
								<option value="">All Standards</option>
								{standards.map((s) => (
									<option key={s._id} value={s._id}>
										{s.standardName}
									</option>
								))}
							</select>
						</div>
					)}

					{/* subject */}
					<div>
						<label className="flex items-center gap-2 text-sm font-medium text-charcoal-gray mb-2">
							<FaBook className="text-medium-gray" />{" "}
							Subject (Optional)
						</label>
						<select
							{...register("subject")}
							className="w-full px-4 py-3 border border-light-gray rounded-lg bg-white text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
						>
							<option value="">All Subjects</option>
							{subjects.map((sub) => (
								<option key={sub._id} value={sub._id}>
									{sub.name} ({sub.code})
								</option>
							))}
						</select>
					</div>

					{/* buttons */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
						<button
							type="submit"
							disabled={isSubmitting}
							className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
								isSubmitting
									? "bg-light-gray text-slate-gray cursor-not-allowed"
									: "bg-charcoal-gray text-white hover:bg-medium-gray"
							}`}
						>
							<FaBullhorn className="text-sm" />
							{isSubmitting ? "Creating..." : "Create"}
						</button>
						<button
							type="button"
							onClick={() =>
								navigate(
									"/dashboard/admin-announcement"
								)
							}
							className="w-full sm:w-auto px-6 py-3 bg-light-gray text-charcoal-gray font-medium rounded-lg hover:bg-slate-gray hover:text-white transition-colors duration-200"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateAnnouncement;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	createSubject,
	updateSubject,
} from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaBook, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { clearEditingSubject } from "../../../../slices/subject.slice";

function SubjectForm() {
	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const { editingSubject } = useSelector((state) => state.subject);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		if (editingSubject) {
			setValue("name", editingSubject.name);
			setValue("code", editingSubject.code);
		}
	}, [editingSubject, setValue]);

	const submitHandler = async (data) => {
		try {
			if (editingSubject) {
				const result = await dispatch(
					updateSubject(
						{ ...data, subjectId: editingSubject._id },
						token
					)
				);
				if (result) {
					navigate("/dashboard/admin-subjects/subjects-list");
				}
			} else {
				const result = await dispatch(createSubject(data, token));
				if (result) {
					reset();
					navigate("/dashboard/admin-subjects/subjects-list");
				}
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(error.message || "Failed to process subject");
		}
	};

	useEffect(() => {
		return () => {
			dispatch(clearEditingSubject());
		};
	}, [dispatch]);

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					{editingSubject ? (
						<FaEdit className="text-charcoal-gray text-2xl" />
					) : (
						<FaPlus className="text-charcoal-gray text-2xl" />
					)}
					<h1 className="text-3xl font-bold text-charcoal-gray">
						{editingSubject
							? "Edit Subject"
							: "Create Subject"}
					</h1>
				</div>

				<button
					onClick={() => navigate("/dashboard/admin-subjects")}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Form Card */}
			<div className="max-w-2xl mx-auto">
				<div className="bg-white p-8 rounded-lg shadow-md border border-light-gray">
					<div className="flex items-center gap-3 mb-6">
						<FaBook className="text-charcoal-gray text-xl" />
						<h2 className="text-xl font-semibold text-charcoal-gray">
							Subject Information
						</h2>
					</div>

					<form
						onSubmit={handleSubmit(submitHandler)}
						className="space-y-6"
					>
						{/* Subject Name */}
						<div>
							<label className="block text-sm font-medium text-charcoal-gray mb-2">
								Subject Name
							</label>
							<input
								type="text"
								placeholder="Enter subject name (e.g., Mathematics)"
								{...register("name", {
									required:
										"Subject name is required",
								})}
								className={`w-full px-4 py-3 border rounded-lg text-charcoal-gray placeholder-slate-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 ${
									errors.name
										? "border-red-400 focus:border-red-400"
										: "border-light-gray"
								}`}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Subject Code */}
						<div>
							<label className="block text-sm font-medium text-charcoal-gray mb-2">
								Subject Code
							</label>
							<input
								type="text"
								placeholder="Enter subject code (e.g., MATH101)"
								{...register("code", {
									required:
										"Subject code is required",
								})}
								className={`w-full px-4 py-3 border rounded-lg text-charcoal-gray placeholder-slate-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 ${
									errors.code
										? "border-red-400 focus:border-red-400"
										: "border-light-gray"
								}`}
							/>
							{errors.code && (
								<p className="text-red-500 text-sm mt-1">
									{errors.code.message}
								</p>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-4 pt-4">
							<button
								type="submit"
								className="flex items-center gap-2 px-6 py-3 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
							>
								{editingSubject ? (
									<>
										<FaEdit className="text-sm" />
										Update Subject
									</>
								) : (
									<>
										<FaPlus className="text-sm" />
										Create Subject
									</>
								)}
							</button>

							<button
								type="button"
								onClick={() => {
									reset();
									dispatch(clearEditingSubject());
									navigate(
										"/dashboard/admin-subjects/subjects-list"
									);
								}}
								className="px-6 py-3 bg-light-gray text-charcoal-gray font-medium rounded-lg hover:bg-slate-gray hover:text-white transition-colors duration-200"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>

				{/* Help Text */}
				<div className="mt-6 p-4 bg-light-gray rounded-lg">
					<h3 className="text-sm font-medium text-charcoal-gray mb-2">
						Tips:
					</h3>
					<ul className="text-sm text-slate-gray space-y-1">
						<li>
							• Subject name should be descriptive (e.g.,
							Advanced Mathematics, English Literature)
						</li>
						<li>
							• Subject code should be unique and follow
							your institution's format
						</li>
						<li>
							• Both fields are required and cannot be
							empty
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default SubjectForm;

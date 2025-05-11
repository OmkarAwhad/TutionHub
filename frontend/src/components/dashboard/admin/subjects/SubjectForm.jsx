import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	createSubject,
	updateSubject,
} from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
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
		console.log(editingSubject);
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
					// toast.success("Subject updated successfully");
					navigate("/dashboard/admin-subjects/subjects-list");
					setEditingSubject(null);
				}
			} else {
				const result = await dispatch(createSubject(data, token));
				if (result) {
					// toast.success("Subject created successfully");
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
	}, []);

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-3xl font-semibold text-richblack-5">
					{editingSubject ? "Edit Subject" : "Create Subject"}
				</h3>
				<button
					onClick={() => navigate("/dashboard/admin-subjects")}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className="bg-white shadow shadow-slate-gray p-6 mt-15 rounded-lg w-full max-w-2xl mx-auto animate-slide-in">
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="flex flex-col p-5 gap-4"
				>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Subject Name
						</p>
						<input
							type="text"
							placeholder="Enter subject name"
							{...register("name", {
								required: true,
							})}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
						/>
						{errors.name && (
							<p className="text-red-200 text-sm ml-2">
								Subject name is required
							</p>
						)}
					</label>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Subject Code
						</p>
						<input
							type="text"
							placeholder="Enter subject code"
							{...register("code", {
								required: true,
							})}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
						/>
						{errors.code && (
							<p className="text-red-200 text-sm ml-2">
								Subject code is required
							</p>
						)}
					</label>
					<div className="flex gap-4">
						<button
							className="bg-slate-gray text-white w-fit px-6 py-2 rounded-sm mt-4 hover:bg-slate-700 transition-all transform hover:scale-105"
							type="submit"
						>
							{editingSubject
								? "Update Subject"
								: "Create Subject"}
						</button>
						<button
							onClick={() => {
								reset();
								// setEditingSubject(null);
								dispatch(clearEditingSubject());
								navigate(
									"/dashboard/admin-subjects/subjects-list"
								);
							}}
							className="bg-gray-300 text-slate-gray w-fit px-6 py-2 rounded-sm mt-4 hover:bg-gray-400 transition-all transform hover:scale-105"
							type="button"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default SubjectForm;

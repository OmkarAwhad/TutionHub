import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
	createSubject,
	updateSubject,
} from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";

function SubjectForm({
	setClickButton,
	getAllSubjectsData,
	editingSubject,
	setEditingSubject,
}) {
	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const dispatch = useDispatch();
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
					// toast.success("Subject updated successfully");
					getAllSubjectsData();
					setClickButton("getSubjects");
					setEditingSubject(null);
				}
			} else {
				const result = await dispatch(createSubject(data, token));
				if (result) {
					// toast.success("Subject created successfully");
					reset();
					getAllSubjectsData();
					setClickButton("getSubjects");
				}
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(error.message || "Failed to process subject");
		}
	};

	return (
		<div className="bg-white shadow shadow-slate-gray p-6 rounded-md w-full max-w-2xl mx-auto animate-slide-in">
			<h1 className="pb-5 pt-5 text-medium-gray logo-text text-center font-extrabold text-4xl">
				{editingSubject ? "Edit Subject" : "Create Subject"}
			</h1>
			<form
				onSubmit={handleSubmit(submitHandler)}
				className="flex flex-col gap-4"
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
							setEditingSubject(null);
							setClickButton("getSubjects");
						}}
						className="bg-gray-300 text-slate-gray w-fit px-6 py-2 rounded-sm mt-4 hover:bg-gray-400 transition-all transform hover:scale-105"
						type="button"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default SubjectForm;

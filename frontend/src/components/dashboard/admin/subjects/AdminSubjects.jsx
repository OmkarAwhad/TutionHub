import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	createSubject,
	getAllSubjects,
} from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";

function AdminSubjects() {
	const [clickButton, setClickButton] = useState(null);
	const [editingSubject, setEditingSubject] = useState(null);
	const [subjects, setSubjects] = useState([]);

	const getAllSubjectsData = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
			toast.error("Failed to fetch subjects");
		}
	};
	useEffect(() => {
		getAllSubjectsData();
	}, []);

	const handleClickedButton = (view) => {
		setClickButton(view);
		setEditingSubject(null);
	};

	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);

	const submitHandler = async (data) => {
		try {
			if (editingSubject) {
				// TODO: Update subject API call
				console.log("Updating subject:", data);
			} else {
				await dispatch(createSubject(data, token));
				reset();
				setEditingSubject(null);
				getAllSubjectsData()
				setClickButton("getSubjects");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(error.message || "Failed to create subject");
		}
	};

	const handleEdit = (subject) => {
		setEditingSubject(subject);
		setValue("name", subject.name);
		setValue("code", subject.code);
		setClickButton("createSubject");
	};

	const handleDelete = (subjectId) => {
		// TODO: Delete subject API call
		console.log("Deleting subject:", subjectId);
	};

	return (
		<div className="w-full mx-auto flex flex-col gap-y-10 p-4">
			{/* First section */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-slate-gray flex flex-row items-center justify-evenly min-h-[15vh] text-2xl ">
				<div
					onClick={() => handleClickedButton("createSubject")}
					className={`px-5 py-2 bg-medium-gray rounded-md cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "createSubject"
							? "bg-charcoal-gray "
							: ""
					} `}
				>
					Create Subject
				</div>
				<div
					onClick={() => handleClickedButton("getSubjects")}
					className={`px-5 py-2 bg-medium-gray rounded-md cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "getSubjects"
							? "bg-charcoal-gray "
							: ""
					} `}
				>
					Get All Subjects
				</div>
				<div
					onClick={() => handleClickedButton("assignSubjects")}
					className={`px-5 py-2 bg-medium-gray rounded-md cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "assignSubjects"
							? "bg-charcoal-gray "
							: ""
					} `}
				>
					Assign Subjects
				</div>
			</div>

			{/* Second section */}
			{clickButton === "createSubject" ? (
				<div className="bg-white shadow shadow-slate-gray p-6 rounded-md w-full max-w-2xl mx-auto animate-slide-in">
					<h1 className="pb-5 pt-5 text-medium-gray logo-text text-center font-extrabold text-4xl">
						{editingSubject
							? "Edit Subject"
							: "Create Subject"}
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
			) : clickButton === "getSubjects" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{subjects.map((subject) => (
						<div
							key={subject._id}
							className="bg-white shadow shadow-slate-gray p-6 rounded-md hover:shadow-lg transition-all transform hover:scale-[1.02] animate-fade-in"
						>
							<h3 className="text-medium-gray text-xl font-semibold mb-2">
								{subject.name}
							</h3>
							<p className="text-gray-500 mb-4">
								Code: {subject.code}
							</p>
							<div className="flex gap-4 justify-end">
								<button
									onClick={() => handleEdit(subject)}
									className="p-2 text-medium-gray hover:text-charcoal-gray transition-all transform hover:scale-110"
								>
									<FaEdit size={20} />
								</button>
								<button
									onClick={() =>
										handleDelete(subject._id)
									}
									className="p-2 text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
								>
									<FaTrash size={20} />
								</button>
							</div>
						</div>
					))}
				</div>
			) : clickButton === "assignSubjects" ? (
				<div>ef</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default AdminSubjects;

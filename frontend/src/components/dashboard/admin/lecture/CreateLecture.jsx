import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createLecture } from "../../../../services/operations/lecture.service";
import { getTutors } from "../../../../services/operations/users.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CreateLecture() {
	const [loading, setLoading] = useState(false);
	const [tutors, setTutors] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [fromTime, setFromTime] = useState({
		hours: "",
		minutes: "",
		period: "AM",
	});
	const [toTime, setToTime] = useState({
		hours: "",
		minutes: "",
		period: "AM",
	});

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const tutorsData = await dispatch(getTutors(token));
				const subjectsData = await dispatch(getAllSubjects(token));
				setTutors(tutorsData);
				setSubjects(subjectsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [dispatch, token]);

	const handleTimeChange = (type, field, value) => {
		if (type === "from") {
			setFromTime((prev) => ({ ...prev, [field]: value }));
		} else {
			setToTime((prev) => ({ ...prev, [field]: value }));
		}
	};

	const submitHandler = async (data) => {
		try {
			setLoading(true);
			// Combine time values into a single string
			const timeFrom = `${fromTime.hours}:${fromTime.minutes} ${fromTime.period}`;
			const timeTo = `${toTime.hours}:${toTime.minutes} ${toTime.period}`;
			const timeString = `${timeFrom} to ${timeTo}`;

			const result = await dispatch(
				createLecture({ ...data, time: timeString }, token)
			);
			if (result) {
				toast.success("Lecture created successfully");
				reset();
				setFromTime({ hours: "", minutes: "", period: "AM" });
				setToTime({ hours: "", minutes: "", period: "AM" });
			}
		} catch (error) {
			console.error("Error creating lecture:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full mx-auto flex flex-col gap-y-10 p-4">
			<div className="bg-white shadow shadow-slate-gray p-6 rounded-md w-full max-w-2xl mx-auto animate-slide-in relative">
				<IoChevronBack
					className="absolute text-medium-gray "
					onClick={() => navigate(-1)}
				/>
				<h1 className="pb-5 pt-5 text-medium-gray logo-text text-center font-extrabold text-4xl">
					Create Lecture
				</h1>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="flex flex-col gap-4 w-full "
				>
					<label className="w-full ">
						<p className="pl-2 text-base text-medium-gray pb-1">
							Date
						</p>
						<input
							type="date"
							{...register("date", {
								required: true,
							})}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md cursor-pointer"
							onClick={(e) => e.target.showPicker()}
						/>
						{errors.date && (
							<p className="text-red-200 text-sm ml-2">
								Date is required
							</p>
						)}
					</label>
					<div className="flex flex-col md:flex-row md:gap-14 gap-4 w-full relative">
						<label className="w-full md:w-1/2">
							<p className="pl-2 text-base text-medium-gray pb-1">
								From
							</p>
							<div className="flex gap-2">
								<input
									type="number"
									name="hours"
									min="1"
									max="12"
									placeholder="HH"
									value={fromTime.hours}
									onChange={(e) =>
										handleTimeChange(
											"from",
											"hours",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								/>
								<input
									type="number"
									name="minutes"
									min="0"
									max="59"
									placeholder="MM"
									value={fromTime.minutes}
									onChange={(e) =>
										handleTimeChange(
											"from",
											"minutes",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								/>
								<select
									name="period"
									value={fromTime.period}
									onChange={(e) =>
										handleTimeChange(
											"from",
											"period",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								>
									<option value="AM">AM</option>
									<option value="PM">PM</option>
								</select>
							</div>
						</label>

						<label className="w-full md:w-1/2">
							<p className="pl-2 text-base text-medium-gray pb-1">
								To
							</p>
							<div className="flex gap-2">
								<input
									type="number"
									name="hours"
									min="1"
									max="12"
									placeholder="HH"
									value={toTime.hours}
									onChange={(e) =>
										handleTimeChange(
											"to",
											"hours",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								/>
								<input
									type="number"
									name="minutes"
									min="0"
									max="59"
									placeholder="MM"
									value={toTime.minutes}
									onChange={(e) =>
										handleTimeChange(
											"to",
											"minutes",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								/>
								<select
									name="period"
									value={toTime.period}
									onChange={(e) =>
										handleTimeChange(
											"to",
											"period",
											e.target.value
										)
									}
									className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
								>
									<option value="AM">AM</option>
									<option value="PM">PM</option>
								</select>
							</div>
						</label>
					</div>

					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Tutor
						</p>
						<select
							{...register("tutor", { required: true })}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
						>
							<option value="">Select Tutor</option>
							{tutors.map((tutor) => (
								<option
									key={tutor._id}
									value={tutor._id}
								>
									{tutor.name}
								</option>
							))}
						</select>
						{errors.tutor && (
							<p className="text-red-200 text-sm ml-2">
								Tutor is required
							</p>
						)}
					</label>

					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Subject
						</p>
						<select
							{...register("subject", { required: true })}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
						>
							<option value="">Select Subject</option>
							{subjects.map((subject) => (
								<option
									key={subject._id}
									value={subject._id}
								>
									{subject.name}
								</option>
							))}
						</select>
						{errors.subject && (
							<p className="text-red-200 text-sm ml-2">
								Subject is required
							</p>
						)}
					</label>

					<label>
						<p className="pl-2 text-base text-medium-gray pb-1">
							Description
						</p>
						<select
							{...register("description", {
								required: true,
							})}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-200 rounded-md"
						>
							<option value="">Select type</option>
							<option value="Lecture">Lecture</option>
							<option value="Test">Test</option>
						</select>
						{errors.description && (
							<p className="text-red-200 text-sm ml-2">
								Description is required
							</p>
						)}
					</label>

					<button
						type="submit"
						disabled={loading}
						className="bg-slate-gray text-white w-fit px-6 py-2 rounded-sm mt-4 ml-[38%] hover:bg-slate-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Creating..." : "Create Lecture"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default CreateLecture;

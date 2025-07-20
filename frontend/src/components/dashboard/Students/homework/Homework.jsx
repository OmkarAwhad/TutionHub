import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { FaBook } from "react-icons/fa";
import {
	FaChalkboardTeacher,
	FaCheckCircle,
	FaTimesCircle,
	FaClipboardList,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
	getStudentsAllHomework,
	HWSubmittedByStud,
} from "../../../../services/operations/homework.service";
import HomeworkCard from "./HomeworkCard";

function Homework() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [allHomework, setAllHomework] = useState([]);
	const [filteredHomework, setFilteredHomework] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [submissions, setSubmissions] = useState([]);
	const [selectedSub, setSelectedSub] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await dispatch(getAllSubjects(token));
				if (response) {
					setSubjects(response);
				}
			} catch (error) {
				console.error("Failed to fetch subjects:", error);
				toast.error(
					"Failed to fetch subjects. Please try again later."
				);
			}
		};

		fetchSubjects();
	}, [dispatch, token]);

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const response = await dispatch(HWSubmittedByStud(token));
				const submissionsList = response?.homework || [];
				setSubmissions(submissionsList);
			} catch (error) {
				console.error("Failed to fetch submissions:", error);
			}
		};

		fetchSubmissions();
	}, [dispatch, token]);

	useEffect(() => {
		const fetchAllHomework = async () => {
			try {
				const response = await dispatch(
					getStudentsAllHomework(token)
				);
				if (response) {
					setAllHomework(response);
				}
			} catch (error) {
				console.error("Failed to fetch homework:", error);
				toast.error(
					"Failed to fetch homework. Please try again later."
				);
			}
		};
		fetchAllHomework();
	}, [dispatch, token]);

	// Filter homework based on subject and submission status
	useEffect(() => {
		let filtered = allHomework;

		// Filter by subject
		if (selectedSub !== "all") {
			filtered = filtered.filter(
				(item) => item.subject._id === selectedSub
			);
		}

		// Filter by submission status
		if (selectedStatus !== "all") {
			filtered = filtered.filter((item) => {
				const isSubmitted = submissions.some(
					(sub) => sub._id === item._id
				);
				return selectedStatus === "submitted"
					? isSubmitted
					: !isSubmitted;
			});
		}

		setFilteredHomework(filtered);
	}, [allHomework, selectedSub, selectedStatus, submissions]);

	// Calculate submission stats
	const totalHomework = allHomework.length;
	const submittedCount = allHomework.filter((item) =>
		submissions.some((sub) => sub._id === item._id)
	).length;
	const notSubmittedCount = totalHomework - submittedCount;

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						Homework
					</h1>
				</div>

				{/* Filters */}
				<div className="flex items-center gap-4">
					{/* Subject Filter */}
					<div className="relative">
						<select
							className="pl-4 pr-4 py-3 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[160px] appearance-none cursor-pointer"
							name="subjects"
							id="subjects"
							value={selectedSub}
							onChange={(e) =>
								setSelectedSub(e.target.value)
							}
						>
							<option value="all">All Subjects</option>
							{subjects &&
								subjects.map((sub) => (
									<option
										key={sub._id}
										value={sub._id}
									>
										{sub.name}
									</option>
								))}
						</select>
					</div>

					{/* Status Filter */}
					<div className="relative">
						<select
							className="pl-4 pr-4 py-3 border-2 border-light-gray rounded-xl bg-white text-charcoal-gray font-medium focus:outline-none focus:border-charcoal-gray transition-all duration-200 min-w-[140px] appearance-none cursor-pointer"
							name="status"
							id="status"
							value={selectedStatus}
							onChange={(e) =>
								setSelectedStatus(e.target.value)
							}
						>
							<option value="all">All Status</option>
							<option value="submitted">Submitted</option>
							<option value="not-submitted">
								Not Submitted
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* Homework Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{/* Total Homework */}
				<div className="bg-white p-6 rounded-xl shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-slate-gray font-medium mb-1">
								Total Homeworks
							</p>
							<p className="text-2xl font-bold text-charcoal-gray">
								{totalHomework}
							</p>
						</div>
						<div className="p-3 bg-light-gray rounded-full">
							<FaClipboardList className="text-charcoal-gray text-xl" />
						</div>
					</div>
				</div>

				{/* Submitted */}
				<div className="bg-white p-6 rounded-xl shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-slate-gray font-medium mb-1">
								Submitted
							</p>
							<p className="text-2xl font-bold text-charcoal-gray">
								{submittedCount}
							</p>
						</div>
						<div className="p-3 bg-charcoal-gray rounded-full">
							<FaCheckCircle className="text-white text-xl" />
						</div>
					</div>
				</div>

				{/* Not Submitted */}
				<div className="bg-white p-6 rounded-xl shadow-md border border-light-gray hover:shadow-lg transition-shadow duration-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-slate-gray font-medium mb-1">
								Not Submitted
							</p>
							<p className="text-2xl font-bold text-medium-gray">
								{notSubmittedCount}
							</p>
						</div>
						<div className="p-3 bg-medium-gray rounded-full">
							<FaTimesCircle className="text-white text-xl" />
						</div>
					</div>
				</div>
			</div>

			{/* Current Filter Display */}
			<div className="mb-6">
				<p className="text-medium-gray font-medium">
					Showing:{" "}
					<span className="text-charcoal-gray font-semibold">
						{filteredHomework.length}
					</span>{" "}
					of{" "}
					<span className="text-charcoal-gray font-semibold">
						{totalHomework}
					</span>{" "}
					homework
					{selectedSub !== "all" && (
						<span className="text-slate-gray">
							{" "}
							•{" "}
							{
								subjects.find(
									(s) => s._id === selectedSub
								)?.name
							}
						</span>
					)}
					{selectedStatus !== "all" && (
						<span className="text-slate-gray">
							{" "}
							•{" "}
							{selectedStatus === "submitted"
								? "Submitted"
								: "Not Submitted"}
						</span>
					)}
				</p>
			</div>

			{/* Homework Grid */}
			{filteredHomework.length === 0 ? (
				<div className="text-center py-12">
					<FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
					<p className="text-medium-gray text-xl mb-2">
						No homework found
					</p>
					<p className="text-slate-gray">
						{totalHomework === 0
							? "No homework assigned yet"
							: "Try adjusting your filters or check back later"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredHomework.map((item) => (
						<HomeworkCard key={item._id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

export default Homework;

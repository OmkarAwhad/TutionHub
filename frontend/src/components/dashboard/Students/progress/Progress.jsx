import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	FaArrowLeftLong,
	FaTrophy,
	FaChartLine,
	FaGraduationCap,
} from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import { getStudentAnalytics } from "../../../../services/operations/marks.service";
import OverallDashboard from "./OverallDashboard";
import SubjectCards from "./SubjectCards";
import PerformanceCharts from "./PerformanceCharts";

function Progress() {
	const { token } = useSelector((state) => state.auth);
	const { userId } = useParams(); // Get userId from URL params
	const [subjects, setSubjects] = useState([]);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedView, setSelectedView] = useState("overview");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				let analyticsResult;

				if (userId) {
					// Admin viewing specific student's progress
					analyticsResult = await getStudentAnalytics(
						userId,
						token
					);
				} else {
					// Student viewing their own progress
					analyticsResult = await getStudentAnalytics(
						null,
						token
					);
				}

				const subjectsResult = await dispatch(
					subjectsOfAUser(token)
				);

				if (subjectsResult) setSubjects(subjectsResult);
				if (analyticsResult) setAnalyticsData(analyticsResult);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [dispatch, token, userId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<FaTrophy className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						{userId ? "Student " : ""}Academic Progress
					</h1>
				</div>

				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Navigation Tabs */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-2 rounded-lg shadow-md border border-light-gray">
				{[
					{
						id: "overview",
						label: "Overview",
						icon: FaChartLine,
					},
					{
						id: "subjects",
						label: "Subjects",
						icon: FaChalkboardTeacher,
					},
					{
						id: "performance",
						label: "Performance",
						icon: FaGraduationCap,
					},
				].map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						onClick={() => setSelectedView(id)}
						className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
							selectedView === id
								? "bg-charcoal-gray text-white"
								: "text-charcoal-gray hover:bg-light-gray"
						}`}
					>
						<Icon className="text-sm" />
						<span>{label}</span>
					</button>
				))}
			</div>

			{/* Content */}
			{selectedView === "overview" && (
				<OverallDashboard
					analyticsData={analyticsData}
					subjects={subjects}
				/>
			)}

			{selectedView === "subjects" && (
				<SubjectCards
					analyticsData={analyticsData}
					subjects={subjects}
				/>
			)}

			{selectedView === "performance" && (
				<PerformanceCharts
					analyticsData={analyticsData}
					subjects={subjects}
				/>
			)}
		</div>
	);
}

export default Progress;

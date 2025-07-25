import React, { useState } from "react";
import { format } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function LectureTable({ weekStart, weekEnd, lectList = {} }) {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Mobile pagination state
	const [currentMobilePage, setCurrentMobilePage] = useState(0);

	// Group days for mobile view (2 days per page, except Sunday alone)
	const mobileDayGroups = [
		["Sunday"],
		["Monday", "Tuesday"],
		["Wednesday", "Thursday"],
		["Friday", "Saturday"],
	];

	const totalMobilePages = mobileDayGroups.length;

	const handleMobileNavigation = (direction) => {
		setCurrentMobilePage((prev) => {
			if (direction === 1) {
				return prev === totalMobilePages - 1 ? 0 : prev + 1;
			} else {
				return prev === 0 ? totalMobilePages - 1 : prev - 1;
			}
		});
	};

	const getCurrentMobileDays = () => {
		return mobileDayGroups[currentMobilePage];
	};

	// Function to get date for a specific day of the week
	const getDateForDay = (dayName) => {
		if (!weekStart) return null;

		const startDate = new Date(weekStart);
		const dayIndex = days.indexOf(dayName);
		const targetDate = new Date(startDate);
		targetDate.setDate(startDate.getDate() + dayIndex);

		return targetDate;
	};

	// Function to format date for display
	const formatDateForDay = (dayName) => {
		const date = getDateForDay(dayName);
		if (!date) return "";

		return format(date, "MMM d");
	};

	// Check if we have actual data for the week
	const hasLectures = Object.values(lectList).some(
		(day) => day && day.length > 0
	);

	const renderLectureCard = (lecture, isToday) => (
		<div
			key={lecture._id}
			className={`${
				isToday ? "border-2 border-gray-400" : ""
			} text-center bg-white shadow p-2 sm:p-3 min-h-[120px] sm:min-h-[140px] rounded-lg flex flex-col justify-between`}
		>
			<p className="text-richblack-5 text-sm sm:text-lg font-medium">
				{lecture.description || "N/A"}
			</p>
			<p className="text-richblack-200 text-xs sm:text-[13px]">
				{lecture.time
					? lecture.time.split(" to ").map((time, idx) => (
							<span key={idx}>
								{time}
								{idx === 0 && " - "}
							</span>
               ))
					: "Time N/A"}
			</p>
			<p className="text-richblack-200 bg-gray-200 py-1 rounded-md text-xs sm:text-sm">
				{lecture.subject?.name || "Subject N/A"}
			</p>
			<p className="text-richblack-300 text-xs mt-1">
				{lecture.tutor?.name || "Unknown Tutor"}
			</p>
		</div>
	);

	const renderEmptyDay = () => (
		<div className="bg-white text-slate-gray text-center p-2 sm:p-3 min-h-[120px] sm:min-h-[140px] rounded-lg flex flex-col justify-center items-center">
			<p className="text-richblack-400 text-xs sm:text-sm">
				No lectures scheduled
			</p>
		</div>
	);

	return (
		<div className="space-y-4">
			{/* Week Display */}
			{weekStart && weekEnd && (
				<p className="text-richblack-200 mt-2 mb-4 text-sm sm:text-base">
					Week of {format(new Date(weekStart), "MMM d")} -{" "}
					{format(new Date(weekEnd), "MMM d, yyyy")}
				</p>
			)}

			{/* Mobile View */}
			<div className="block md:hidden">
				{/* Mobile Navigation */}
				<div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-md">
					<button
						onClick={() => handleMobileNavigation(-1)}
						className="p-2 bg-slate-gray text-white rounded-lg hover:bg-medium-gray transition-all duration-200"
						aria-label="Previous days"
					>
						<IoIosArrowBack className="text-base" />
					</button>

					<div className="text-center">
						<p className="text-sm font-medium text-charcoal-gray">
							{getCurrentMobileDays().join(" & ")}
						</p>
						<p className="text-xs text-slate-gray">
							{currentMobilePage + 1} of {totalMobilePages}
						</p>
					</div>

					<button
						onClick={() => handleMobileNavigation(1)}
						className="p-2 bg-slate-gray text-white rounded-lg hover:bg-medium-gray transition-all duration-200"
						aria-label="Next days"
					>
						<IoIosArrowForward className="text-base" />
					</button>
				</div>

				{/* Mobile Days Display */}
				<div className="bg-richblack-800 rounded-xl p-4">
					<div
						className={`grid ${
							getCurrentMobileDays().length === 1
								? "grid-cols-1"
								: "grid-cols-2"
						} gap-4`}
					>
						{getCurrentMobileDays().map((day) => {
							const lectures = lectList[day] || [];
							const dayDate = formatDateForDay(day);

							return (
								<div key={day} className="space-y-3">
									{/* Day Header with Date */}
									<div className="bg-slate-gray text-white text-center py-2 rounded-lg">
										<h3 className="font-semibold text-sm">
											{day}
										</h3>
										{dayDate && (
											<p className="text-xs text-gray-300 mt-1">
												{dayDate}
											</p>
										)}
									</div>

									{/* Day Content */}
									<div className="space-y-2">
										{lectures.length > 0
											? lectures.map(
													(lecture) => {
														const lectureDate =
															new Date(
																lecture.date
															);
														const today =
															new Date();
														const isToday =
															lectureDate.getDate() ===
																today.getDate() &&
															lectureDate.getMonth() ===
																today.getMonth() &&
															lectureDate.getFullYear() ===
																today.getFullYear();

														return renderLectureCard(
															lecture,
															isToday
														);
													}
											  )
											: renderEmptyDay()}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Desktop View (Original Table) */}
			<div className="hidden md:block">
				<div className="bg-richblack-800 rounded-xl py-6">
					<div className="overflow-x-auto">
						<table className="w-full table-fixed bg-gray-200 rounded-2xl min-h-[480px]">
							<thead>
								<tr>
									{days.map((day) => {
										const dayDate =
											formatDateForDay(day);

										return (
											<th
												key={day}
												className={`py-3 px-2 lg:px-4 w-[14.28%] border-4 rounded-xl text-center text-richblack-200 bg-slate-gray text-white text-sm lg:text-base ${
													day ===
													"Sunday"
														? "border-l-0"
														: ""
												} ${
													day ===
													"Saturday"
														? "border-r-0"
														: ""
												}`}
											>
												<div>
													<span className="hidden lg:inline block">
														{day}
													</span>
													<span className="lg:hidden block">
														{day.slice(
															0,
															3
														)}
													</span>
													{dayDate && (
														<div className="text-xs text-gray-300 mt-1">
															{
																dayDate
															}
														</div>
													)}
												</div>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								<tr>
									{days.map((day) => {
										const lectures =
											lectList[day] || [];
										return (
											<td
												key={day}
												className={`py-3 px-1 align-top w-[14.28%] min-h-[300px] ${
													day ===
													"Sunday"
														? "pl-2"
														: ""
												} ${
													day ===
													"Saturday"
														? "pr-2"
														: ""
												}`}
											>
												{lectures.length >
												0 ? (
													<div className="flex flex-col gap-2 lg:gap-3">
														{lectures.map(
															(
																lecture
															) => {
																const lectureDate =
																	new Date(
																		lecture.date
																	);
																const today =
																	new Date();
																const isToday =
																	lectureDate.getDate() ===
																		today.getDate() &&
																	lectureDate.getMonth() ===
																		today.getMonth() &&
																	lectureDate.getFullYear() ===
																		today.getFullYear();

																return renderLectureCard(
																	lecture,
																	isToday
																);
															}
														)}
													</div>
												) : (
													renderEmptyDay()
												)}
											</td>
										);
									})}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* No Lectures Message */}
			{/* {!hasLectures && (
            <div className="text-center mt-4 p-8 bg-white rounded-lg">
               <p className="text-richblack-400 text-lg">
                  No lectures found for this week.
               </p>
            </div>
         )} */}
		</div>
	);
}

export default LectureTable;

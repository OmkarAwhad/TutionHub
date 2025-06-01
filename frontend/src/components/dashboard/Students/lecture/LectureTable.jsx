import React from "react";
import { format } from "date-fns";

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

	// Check if we have actual data for the week
	const hasLectures = Object.values(lectList).some(
		(day) => day && day.length > 0
	);

	return (
		<div>
			{weekStart && weekEnd && (
				<p className="text-richblack-200 mt-2 mb-4">
					Week of {format(new Date(weekStart), "MMM d")} -{" "}
					{format(new Date(weekEnd), "MMM d, yyyy")}
				</p>
			)}

			<div className="bg-richblack-800 rounded-xl py-6">
				<table className="w-full table-fixed bg-gray-200 rounded-2xl min-h-[480px]">
					<thead>
						<tr>
							{days.map((day) => (
								<th
									key={day}
									className={`py-3 px-4 w-[14.28%] border-4 rounded-xl text-center text-richblack-200 bg-slate-gray text-white ${
										day === "Sunday"
											? "border-l-0"
											: ""
									} ${
										day === "Saturday"
											? "border-r-0"
											: ""
									}`}
								>
									{day}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							{days.map((day) => {
								const lectures = lectList[day] || [];
								return (
									<td
										key={day}
										className={`py-3 px-1 align-top w-[14.28%] min-h-[300px] ${
											day === "Sunday"
												? "pl-2"
												: ""
										} ${
											day === "Saturday"
												? "pr-2"
												: ""
										}`}
									>
										{lectures.length > 0 ? (
											<div className="flex flex-col gap-3">
												{lectures.map(
													(lecture) => {
														// Check if the lecture date is today
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

														return (
															<div
																key={
																	lecture._id
																}
																className={`${
																	isToday
																		? " border-2 border-green-300"
																		: ""
																} text-center bg-white p-3 min-h-[140px] rounded-lg flex flex-col justify-between`}
															>
																<p className="text-richblack-5 text-lg font-medium">
																	{lecture.description ||
																		"N/A"}
																</p>
																<p className="text-richblack-200 text-[13px]">
																	{lecture.time
																		? lecture.time
																				.split(
																					" to "
																				)
																				.map(
																					(
																						time,
																						idx
																					) => (
																						<span
																							key={
																								idx
																							}
																						>
																							{
																								time
																							}
																							{idx ===
																								0 &&
																								" - "}
																						</span>
																					)
																				)
																		: "Time N/A"}
																</p>
																<p className="text-richblack-200 bg-gray-200 py-1 rounded-md text-sm">
																	{lecture
																		.subject
																		?.name ||
																		"Subject N/A"}
																</p>
																<p className="text-richblack-300 text-xs mt-1">
																	{lecture
																		.tutor
																		?.name ||
																		"Unknown Tutor"}
																</p>
																{/* {lecture.marksMarked && (
																	<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
																		Marks
																		Updated
																	</span>
																)} */}
															</div>
														);
													}
												)}
											</div>
										) : (
											<div className="bg-white text-slate-gray text-center p-3 min-h-[140px] rounded-lg flex flex-col justify-center items-center">
												<p className="text-richblack-400 text-sm">
													No lectures
													scheduled
												</p>
											</div>
										)}
									</td>
								);
							})}
						</tr>
					</tbody>
				</table>

				{/* {!hasLectures && (
					<div className="text-center mt-4 text-richblack-200">
						No lectures found for this week.
					</div>
				)} */}
			</div>
		</div>
	);
}

export default LectureTable;

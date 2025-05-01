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
   
	return (
		<div>
			{weekStart && weekEnd && (
				<p className="text-richblack-200 mt-2">
					Week of {format(new Date(weekStart), "MMM d")} -{" "}
					{format(new Date(weekEnd), "MMM d, yyyy")}
				</p>
			)}

			<div className="bg-richblack-800 rounded-xl py-6  ">
				<table className="w-full table-fixed bg-gray-200 rounded-2xl min-h-[480px] ">
					<thead>
						<tr className="space-x-1">
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
									} `}
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
								const maxLectures = Math.max(
									...Object.values(lectList).map(
										(lects) => (lects || []).length || 0
									)
								);

								return (
									<td
										key={day}
										className={`py-3 px-1 align-top w-[14.28%] h-[300px] ${
											day === "Sunday"
												? "pl-2"
												: ""
										} ${
											day === "Saturday"
												? "pr-2"
												: ""
										} `}
									>
										{lectures.length > 0 ? (
											<div
												className={`grid gap-3  `}
												style={{
													gridTemplateRows: `repeat(${maxLectures}, 1fr)`,
												}}
											>
												{lectures.map(
													(lecture) => (
														<div
															key={
																lecture._id
															}
															className="bg-white text-center p-3 h-[140px] rounded-lg flex flex-col justify-between  "
														>
															<p className="text-richblack-5 text-lg font-medium">
																{
																	lecture.description
																}
															</p>
															<p className="text-richblack-200 text-[13px]">
																<span>
																	{
																		lecture.time.split(
																			"to"
																		)[0]
																	}
																</span>
																<span>
																	-
																</span>
																<span>
																	{
																		lecture.time.split(
																			"to"
																		)[1]
																	}
																</span>
															</p>
															<p className="text-richblack-200 bg-gray-200 py-1 rounded-md text-sm">
																{
																	lecture
																		.tutor
																		?.name
																}
															</p>
														</div>
													)
												)}
											</div>
										) : (
											<div className="bg-white text-slate-gray text-center p-3 h-[140px] rounded-lg flex flex-col justify-center items-center">
												<p className="text-richblack-400  text-sm">
													No lectures yet
												</p>
											</div>
										)}
									</td>
								);
							})}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default LectureTable;

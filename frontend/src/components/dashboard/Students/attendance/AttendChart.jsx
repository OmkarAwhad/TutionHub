import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AttendChart({ studAttendStats }) {
	return (
		<div className="flex justify-center lg:justify-between flex-wrap lg:flex-nowrap gap-10 items-center">
			{/* Attendance Statistics Table */}
			{studAttendStats && (
				<div className="w-full">
					<h4 className="text-2xl font-semibold text-center text-charcoal-gray mb-4">
						Attendance Statistics
					</h4>
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-200 text-richblack-900">
								<th className="p-3 border-b">Metric</th>
								<th className="p-3 border-b">Value</th>
							</tr>
						</thead>
						<tbody>
							<tr className="hover:bg-richblack-50">
								<td className="p-3 border-b">
									Total Lectures
								</td>
								<td className="p-3 border-b">
									{studAttendStats.totalLectures}
								</td>
							</tr>
							<tr className="hover:bg-richblack-50">
								<td className="p-3 border-b">
									Marked Lectures
								</td>
								<td className="p-3 border-b">
									{studAttendStats.markedLectures}
								</td>
							</tr>
							<tr className="hover:bg-richblack-50">
								<td className="p-3 border-b">
									Present
								</td>
								<td className="p-3 border-b">
									{studAttendStats.present}
								</td>
							</tr>
							<tr className="hover:bg-richblack-50">
								<td className="p-3 border-b">Absent</td>
								<td className="p-3 border-b">
									{studAttendStats.absent}
								</td>
							</tr>
							<tr className="hover:bg-richblack-50">
								<td className="p-3 border-b">
									Percentage
								</td>
								<td className="p-3 border-b">
									{studAttendStats.percentage}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}

			{/* Pie Chart */}
			{studAttendStats && (
				<div className="lg:w-1/3 mt-6">
					<h4 className="text-2xl font-semibold text-center text-charcoal-gray mb-4">
						Attendance Distribution
					</h4>
					<Pie
						data={{
							labels: ["Present", "Absent"],
							datasets: [
								{
									data: [
										studAttendStats.present,
										studAttendStats.absent,
									],
									backgroundColor: [
										"#323232",
										"#656565",
									],
									hoverBackgroundColor: [
										"#000000",
										"#000000",
									],
								},
							],
						}}
						options={{
							responsive: true,
							plugins: {
								legend: {
									position: "bottom",
								},
							},
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default AttendChart;

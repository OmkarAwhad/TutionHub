import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function AttendChart({ studAttendStats }) {
	if (!studAttendStats) {
		return (
			<div className="text-center py-6 text-medium-gray">
				No attendance data available
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Table */}
				<div>
					<h3 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4">
						Statistics Overview
					</h3>
					<div className="overflow-hidden rounded-lg border border-light-gray">
						<table className="w-full">
							<thead className="bg-light-gray">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
										Metric
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-gray">
										Value
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-light-gray">
								{[
									"totalLectures",
									"markedLectures",
									"present",
									"absent",
								].map((key) => (
									<tr
										key={key}
										className="hover:bg-light-gray/30"
									>
										<td className="px-4 py-3 text-sm text-medium-gray">
											{key
												.replace(
													/([A-Z])/g,
													" $1"
												)
												.replace(
													/^./,
													(str) =>
														str.toUpperCase()
												)}
										</td>
										<td className="px-4 py-3 text-sm font-medium text-charcoal-gray">
											{studAttendStats[key]}
										</td>
									</tr>
								))}
								<tr className="hover:bg-light-gray/30">
									<td className="px-4 py-3 text-sm text-medium-gray">
										Attendance %
									</td>
									<td className="px-4 py-3 text-sm font-bold text-charcoal-gray">
										{studAttendStats.percentage}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				{/* Pie */}
				<div className="max-w-md mx-auto">
					<h3 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4 text-center">
						Attendance Distribution
					</h3>
					<div className="bg-light-gray/20 p-4 rounded-lg">
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
											"#4b4b4b",
											"#323232",
										],
										borderColor: "#fff",
										borderWidth: 2,
									},
								],
							}}
							options={{
								responsive: true,
								maintainAspectRatio: true,
								plugins: {
									legend: {
										position: "bottom",
										labels: {
											padding: 16,
											font: { size: 12 },
										},
									},
									tooltip: {
										callbacks: {
											label: (ctx) => {
												const total =
													studAttendStats.present +
													studAttendStats.absent;
												const pct =
													total > 0
														? (
																(ctx.raw /
																	total) *
																100
														  ).toFixed(
																1
														  )
														: 0;
												return `${ctx.label}: ${ctx.raw} (${pct}%)`;
											},
										},
									},
								},
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AttendChart;

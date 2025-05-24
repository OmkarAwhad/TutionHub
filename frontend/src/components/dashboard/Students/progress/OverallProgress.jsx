import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

function OverallProgress({ overallProgress }) {
	const totalMarksObtained =
		overallProgress?.marksDetails?.reduce(
			(sum, mark) => sum + mark.marks,
			0
		) || 0;
	const totalMarksPossible =
		overallProgress?.marksDetails?.reduce(
			(sum, mark) => sum + mark.totalMarks,
			0
		) || 0;

	const normalizedMarksDetails =
		overallProgress?.marksDetails?.map((mark) => {
			const factor =
				mark.totalMarks < 100
					? 5
					: mark.totalMarks > 100
					? mark.totalMarks / 100
					: 1;
			return {
				subject: mark.lecture.subject?.name,
				marks: mark.marks * factor,
				totalMarks: mark.totalMarks * factor,
			};
		}) || [];

	return (
		<div className="bg-white rounded-xl shadow-xl shadow-medium-gray overflow-hidden p-4 mb-5 transition-all duration-300">
			<h4 className="text-xl font-semibold text-charcoal-gray mb-4">
				Overall Progress
			</h4>
			{overallProgress ? (
				<div className="flex justify-center lg:justify-between flex-wrap lg:flex-nowrap gap-10 items-center">
					<div className="flex justify-center items-center lg:w-1/2 mt-6">
						{/* <h4 className="text-xl font-semibold text-center text-charcoal-gray mb-4">
                     Marks Distribution
                  </h4> */}
						<Bar
							data={{
								labels: normalizedMarksDetails.map(
									(mark) => mark.subject
								),
								datasets: [
									{
										label: "Marks Obtained",
										data: normalizedMarksDetails.map(
											(mark) => mark.marks
										),
										backgroundColor: "#323232",
									},
									{
										label: "Total Marks",
										data: normalizedMarksDetails.map(
											(mark) => mark.totalMarks
										),
										backgroundColor: "#656565",
									},
								],
							}}
							options={{
								responsive: true,
								plugins: {
									legend: { position: "bottom" },
								},
								scales: {
									x: {
										title: {
											display: true,
											text: "Subjects",
										},
									},
									y: {
										title: {
											display: true,
											text: "Marks",
										},
										beginAtZero: true,
										max: 100,
									},
								},
							}}
						/>
					</div>
				</div>
			) : (
				<p className="text-richblack-500">
					No overall progress data available
				</p>
			)}
		</div>
	);
}

export default OverallProgress;

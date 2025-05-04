import React from "react";

function MarksForSubject({ marksDetails, loading, subjectId, subjects }) {
	const getSubjectName = (subjectId) => {
		const subject = subjects?.find((sub) => sub._id === subjectId);
		return subject ? subject.name : "-";
	};

	return (
		<div className="bg-white rounded-xl shadow-xl shadow-medium-gray overflow-hidden p-4 mb-5 transition-all duration-300">
			<h4 className="text-xl font-semibold text-charcoal-gray mb-4">
				Marks for {getSubjectName(subjectId)}
			</h4>
			{loading ? (
				<p className="text-richblack-500">Loading marks data...</p>
			) : marksDetails === null ? (
				<p className="text-richblack-500 text-2xl text-center ">
					No data for this subject
				</p>
			) : marksDetails.length > 0 ? (
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-200 text-center">
							<th className="p-3 border-b">
								Lecture Description
							</th>
							<th className="p-3 border-b">Subject</th>
							<th className="p-3 border-b">
								Marks Obtained
							</th>
							<th className="p-3 border-b">Total Marks</th>
							<th className="p-3 border-b">Feedback</th>
						</tr>
					</thead>
					<tbody>
						{marksDetails.map((mark) => (
							<tr
								key={mark._id}
								className="hover:bg-richblack-50 text-center"
							>
								<td className="p-3 border-b">
									{mark.lecture?.description || "-"}
								</td>
								<td className="p-3 border-b">
									{mark.lecture?.subject?.name ||
										"-"}
								</td>
								<td className="p-3 border-b">
									{mark.marks}
								</td>
								<td className="p-3 border-b">
									{mark.totalMarks}
								</td>
								<td className="p-3 border-b">
									{mark.description || "No feedback"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p className="text-richblack-500">
					No marks data available for this subject
				</p>
			)}
		</div>
	);
}

export default MarksForSubject;

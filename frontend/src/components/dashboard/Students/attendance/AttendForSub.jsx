import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attendAccToSub } from "../../../../services/operations/attendance.service";

function AttendForSub({ subjects }) {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [attendanceData, setAttendanceData] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAttendance = async () => {
			if (!subjects || !token) return;

			setLoading(true);
			const data = {};
			for (const subject of subjects) {
				try {
					const result = await dispatch(
						attendAccToSub(subject._id, token)
					);
					// console.log(
					// 	`Attendance data for ${subject.name}:`,
					// 	result
					// );
					if (result) {
						data[subject._id] = result;
					}
				} catch (error) {
					console.error(
						`Error fetching attendance for subject ${subject.name}:`,
						error
					);
				}
			}
			setAttendanceData(data);
			setLoading(false);
		};

		fetchAttendance();
	}, [subjects, token, dispatch]);

	return (
		<div className="p-4">
			{loading ? (
				<p className="text-richblack-500">
					Loading attendance data...
				</p>
			) : subjects && subjects.length > 0 ? (
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-200 text-richblack-900 text-center">
							<th className="p-3 border-b">
								Subject Name
							</th>
							<th className="p-3 border-b">
								Total Lectures
							</th>
							<th className="p-3 border-b">
								Marked Lectures
							</th>
							<th className="p-3 border-b">Present</th>
							<th className="p-3 border-b">Absent</th>
							<th className="p-3 border-b">Percentage</th>
						</tr>
					</thead>
					<tbody>
						{subjects.map((subject) => (
							<tr
								key={subject._id}
								className="hover:bg-richblack-50 text-center  "
							>
								<td className="p-3 border-b">
									{subject.name}
								</td>
								<td className="p-3 border-b">
									{attendanceData[subject._id]
										?.statistics?.totalLectures ??
										"-"}
								</td>
								<td className="p-3 border-b">
									{attendanceData[subject._id]
										?.statistics
										?.markedLectures ?? "-"}
								</td>
								<td className="p-3 border-b">
									{attendanceData[subject._id]
										?.statistics?.present ?? "-"}
								</td>
								<td className="p-3 border-b">
									{attendanceData[subject._id]
										?.statistics?.absent ?? "-"}
								</td>
								<td className="p-3 border-b">
									{attendanceData[subject._id]
										?.statistics?.percentage &&
									!isNaN(
										parseFloat(
											attendanceData[
												subject._id
											]?.statistics?.percentage
										)
									)
										? attendanceData[subject._id]
												?.statistics
												?.percentage
										: "0.00%"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p className="text-richblack-500">No subjects available</p>
			)}
		</div>
	);
}

export default AttendForSub;

import { apiConnector } from "../apiConnector.service";
import { attendanceApi } from "../apis.service";
import toast from "react-hot-toast";

export function viewAttendanceOfAStud(token) {
	return async () => {
		try {
			// Parse the token if it's a string
			const parsedToken = typeof token === 'string' ? JSON.parse(token) : token;
			
			const result = await apiConnector(
				"GET",
				attendanceApi.GET_STUDENT_ATTENDANCE,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${parsedToken}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				console.log(result.data.message);
				return [];
			}
			return result.data.data;
		} catch (error) {
			toast.error("Error in fetching student subjects");
			console.log("Error in fetching student subjects", error);
			return [];
		}
	};
}

export function markAttendance(lectureId, studentId, status, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Marking attendance...");
		try {
			const result = await apiConnector(
				"POST",
				attendanceApi.MARK_ATTENDANCE,
				{
					lectureId,
					studentId,
					status,
				},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return false;
			}

			return true;
		} catch (error) {
			toast.error("Failed to mark attendance");
			console.error("Error in marking attendance:", error);
			return false;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function checkLectureAttendance(lectureId, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"GET",
				`${attendanceApi.CHECK_LECTURE_ATTENDANCE}/${lectureId}`,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				console.log(result.data.message);
				return false;
			}
			return result.data.data.attendanceMarked;
		} catch (error) {
			console.error("Error checking lecture attendance:", error);
			return false;
		}
	};
}

export function getLecturesWithAttendanceMarked(token) {
	return async () => {
		try {
			const result = await apiConnector(
				"GET",
				attendanceApi.GET_LECTURES_WITH_ATTENDANCE_MARKED,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return [];
			}
			// console.log(result.data.data)
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching lectures with attendance marked");
			console.error("Error fetching lectures with attendance marked:", error);
			return [];
		}
	};
}

export function viewStudAttendanceForLec(lectureId, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"GET",
				`${attendanceApi.VIEW_STUD_ATTENDANCE_FOR_LEC}?lectureId=${lectureId}`,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return [];
			}
			// console.log(result.data.data)
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching attendance for lecture");
			console.error("Error fetching attendance for lecture:", error);
			return [];
		}
	};
}

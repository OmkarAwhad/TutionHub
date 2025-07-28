import { apiConnector } from "../apiConnector.service";
import { attendanceApi } from "../apis.service";
import toast from "react-hot-toast";

export function viewMyAttendance(userId = null, token) {
	return async () => {
		try {
			const url = userId
				? `${attendanceApi.GET_STUDENT_ATTENDANCE}/${userId}`
				: attendanceApi.GET_STUDENT_ATTENDANCE;

			const result = await apiConnector(
				"GET",
				url,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				console.log(result.data.message);
				return [];
			}
			return result.data.data;
		} catch (error) {
			toast.error("Error in fetching student attendance");
			console.log("Error in fetching student attendance", error);
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
			console.error(
				"Error fetching lectures with attendance marked:",
				error
			);
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

export function studsPresentForALec(lectureId, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"GET",
				`${attendanceApi.STUDS_PRESENT_FOR_LEC}?lectureId=${lectureId}`,
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
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching present students for lecture");
			console.error(
				"Error fetching present students for lecture:",
				error
			);
			return [];
		}
	};
}

export function getLecturesWithoutAttendance(token) {
	return async () => {
		try {
			const result = await apiConnector(
				"GET",
				attendanceApi.GET_LECTURES_WITHOUT_ATTENDANCE,
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
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching lectures without attendance");
			console.error(
				"Error fetching lectures without attendance:",
				error
			);
			return [];
		}
	};
}

export function attendAccToSub(subjectId, userId = null, token) {
   return async (dispatch) => {
      try {
         // URL with userId as parameter if provided
         const url = userId
            ? `${attendanceApi.GET_SUBJECT_ATTENDANCE}/${userId}`
            : attendanceApi.GET_SUBJECT_ATTENDANCE;

         // Request body with subjectId
         const requestBody = { subjectId };

         const result = await apiConnector(
            "POST", // Changed to POST since we're sending body data
            url,
            requestBody, // subjectId in body
            {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            }
         );
         
         if (!result.data.success) {
            toast.error(result.data.message);
            return null;
         }
         return result.data.data;
      } catch (error) {
         toast.error("Error fetching attendance for subject");
         console.error("Error fetching attendance for subject:", error);
         return null;
      }
   };
}

export function StudAttendAccToSubForTutor(studentId, subjectId, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"POST",
				attendanceApi.GET_SUBJECT_ATTENDANCE_BY_TUTOR,
				{ studentId, subjectId },
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				return null;
			}
			// console.log(result.data.data);
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching attendance for subject");
			console.error("Error fetching attendance for subject:", error);
			return null;
		}
	};
}

// Get attendance data for editing
export function getAttendanceForEdit(lectureId, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"GET",
				`${attendanceApi.GET_ATTENDANCE_FOR_EDIT}/${lectureId}`,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return null;
			}
			return result.data.data;
		} catch (error) {
			toast.error("Error fetching attendance data for editing");
			console.error("Error fetching attendance for edit:", error);
			return null;
		}
	};
}

// Update attendance
export function updateAttendance(lectureId, attendanceData, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Updating attendance...");
		try {
			const result = await apiConnector(
				"PUT",
				`${attendanceApi.UPDATE_ATTENDANCE}/${lectureId}`,
				{ attendanceData },
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return false;
			}

			toast.success("Attendance updated successfully");
			return true;
		} catch (error) {
			toast.error("Failed to update attendance");
			console.error("Error updating attendance:", error);
			return false;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

// Delete attendance for lecture
export function deleteAttendanceForLecture(lectureId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Deleting attendance...");
		try {
			const result = await apiConnector(
				"DELETE",
				`${attendanceApi.DELETE_ATTENDANCE}/${lectureId}`,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				return false;
			}

			toast.success("Attendance deleted successfully");
			return true;
		} catch (error) {
			toast.error("Failed to delete attendance");
			console.error("Error deleting attendance:", error);
			return false;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

import { apiConnector } from "../apiConnector.service";
import { marksApi } from "../apis.service";
import toast from "react-hot-toast";

export const getMarksDetailsByALec = async (lectureId, token) => {
	try {
		const response = await apiConnector(
			"GET",
			`${marksApi.GET_MARKS_DETAILS_BY_LEC}/${lectureId}`,
			null,
			{
				Authorization: `Bearer ${token}`,
			}
		);

		if (!response.data.success) {
			throw new Error(response.data.message);
		}

		return response.data.data;
	} catch (error) {
		console.error("Error fetching marks:", error);
		throw error;
	}
};

export function markStudentMarks(
	studentId,
	lectureId,
	marks,
	totalMarks,
	description,
	token
) {
	return async (dispatch) => {
		const toastId = toast.loading("Marking student marks...");
		try {
			const result = await apiConnector(
				"POST",
				marksApi.MARK_STUDENT_MARKS,
				{
					studentId,
					lectureId,
					marks,
					totalMarks,
					description,
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
			console.error("Error in marking student marks:", error);
			return false;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export const editMarks = async (
	lectureId,
	studentId,
	marks,
	totalMarks,
	description,
	token
) => {
	try {
		const response = await apiConnector(
			"POST",
			marksApi.EDIT_MARKS,
			{
				lectureId,
				studentId,
				marks: Number(marks),
				totalMarks: Number(totalMarks),
				description: description || "",
			},
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);

		if (!response.data.success) {
			throw new Error(response.data.message);
		}

		return response.data.data;
	} catch (error) {
		console.error("Error editing marks:", error);
		throw error;
	}
};

// Fetch marks for a specific subject
export const marksAccToSubject = async (subjectId, token) => {
	try {
		// console.log(`${marksApi.GET_SUBJECT_MARKS}/${subjectId}`)
		const response = await apiConnector(
			"GET",
			`${marksApi.GET_SUBJECT_MARKS}/${subjectId}`,
			null,
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);
		if (!response?.data?.success) {
			throw new Error(
				response?.data?.message || "Failed to fetch marks"
			);
		}
		return response.data.data;
	} catch (error) {
		console.error("Error in marksAccToSubject:", error);
		throw error;
	}
};

// Fetch overall student progress
export const trackStudentProgress = async (token) => {
	try {
		const response = await apiConnector(
			"GET",
			marksApi.GET_STUDENT_PROGRESS,
			null,
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);
		if (!response?.data?.success) {
			throw new Error(
				response?.data?.message || "Failed to track progress"
			);
		}
		// console.log(response.data.data)
		return response.data.data;
	} catch (error) {
		console.error("Error in trackStudentProgress:", error);
		throw error;
	}
};

// Fetch progress for a specific subject
export const trackProgressBySubject = async (subjectId, token) => {
	try {
		const response = await apiConnector(
			"GET",
			`${marksApi.GET_SUBJECT_PROGRESS}/${subjectId}`,
			null,
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);
		if (!response?.data?.success) {
			throw new Error(
				response?.data?.message ||
					"Failed to track progress by subject"
			);
		}
		// console.log(response.data.data);
		return response.data.data;
	} catch (error) {
		console.error("Error in trackProgressBySubject:", error);
		throw error;
	}
};

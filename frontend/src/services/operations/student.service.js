import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { studentApi, subjectApi } from "../apis.service";

export function getMyStudentsList(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching students list...");
		try {
			const result = await apiConnector(
				"GET",
				studentApi.GET_MY_STUDENTS_LIST,
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
			toast.error("Failed to fetch students list");
			console.log("Error in fetching students list", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function assignSubjectToStudent(studentId, subjectId, isChecked, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Assigning subject to student...");
		try {
			const result = await apiConnector(
				"POST",
				subjectApi.ASSIGN_SUBJECT_TO_STUDENT,
				{ studentId, subjectId, isChecked },
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				console.log(result.data.message);
				return null;
			}
			toast.success("Subject assigned successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to assign subject to student");
			console.log("Error in assigning subject to student", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getAllStudentsList(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const result = await apiConnector(
				"GET",
				studentApi.GET_ALL_STUDENTS_LIST,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				console.log(result.data.message);
				return null;
			}
			return result.data.data;
		} catch (error) {
			toast.error("Failed to fetch all students list ");
			console.log("Failed to fetch all students list ", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

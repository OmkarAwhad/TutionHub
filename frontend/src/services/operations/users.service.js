import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { usersApi, subjectApi } from "../apis.service";

export function getMyStudentsList(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching students list...");
		try {
			const result = await apiConnector(
				"GET",
				usersApi.GET_MY_STUDENTS_LIST,
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

export function getAllStudentsList(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const result = await apiConnector(
				"GET",
				usersApi.GET_ALL_STUDENTS_LIST,
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

export function getTutors(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const result = await apiConnector(
				"GET",
				usersApi.GET_TUTORS,
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
			toast.error("Failed to fetch tutors");
			console.log("Failed to fetch tutors", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getMyStudentsListByLec(lectureId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading students for lecture...");
		try {
			const result = await apiConnector(
				"GET",
				`${usersApi.GET_STUDENTS_BY_LEC}/${lectureId}`,
				null,
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
			toast.error("Failed to fetch students for lecture");
			console.log("Error in fetching students for lecture", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getMyDetails(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const result = await apiConnector(
				"GET",
				usersApi.GET_MY_DETAILS,
				null,
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
			toast.error("Failed to fetch tutors");
			console.log("Failed to fetch tutors", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

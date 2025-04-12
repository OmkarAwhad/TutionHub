import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { subjectApi } from "../apis.service";

export function subjectsOfAStudent(token) {
	return async () => {
		try {
			const result = await apiConnector(
				"GET",
				subjectApi.SUBJECT_OF_STUDENT,
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
			toast.error("Error in fetching student subjects");
			console.log("Error in fetching student subjects", error);
			return [];
		}
	};
}

export function createSubject(data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Creating subject...");
		try {
			const result = await apiConnector(
				"POST",
				subjectApi.CREATE_SUBJECT,
				data,
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
			toast.success("Subject created successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to create subject");
			console.log("Error in creating subject", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getAllSubjects(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching all subjects...");
		try {
			const result = await apiConnector(
				"GET",
				subjectApi.GET_ALL_SUBJECTS,
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
			// toast.success("Subjects fetched successfully");
			// console.log(result.data.data);
			return result.data.data;
		} catch (error) {
			toast.error("Failed to fetch subjects");
			console.log("Error in fetching subjects", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function updateSubject(data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Updating subject...");
		try {
			const result = await apiConnector(
				"POST",
				subjectApi.UPDATE_SUBJECT,
				data,
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
			toast.success("Subject updated successfully");
			return result.data.data;
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update subject"
			);
			console.log("Error in updating subject", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function deleteSubject(subjectId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Deleting subject...");
		try {
			const result = await apiConnector(
				"DELETE",
				subjectApi.DELETE_SUBJECT,
				{ subjectId },
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
			toast.error(
				error.response?.data?.message || "Failed to delete subject"
			);
			console.log("Error in deleting subject", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { homeworkApi } from "../apis.service";

export function getStudentsAllHomework(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const response = await apiConnector(
				"GET",
				homeworkApi.GET_ALL_HOMEWORK,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				toast.error(response.data.message);
				console.log(response.data.message);
				return [];
			}

			// console.log(response.data.data);
			return response.data.data;
		} catch (error) {
			toast.error("Failed to load homework");
			console.error("Error fetching homework:", error);
		} finally {
			toast.remove(toastId);
		}
	};
}

export function submitHomework(formData, token) {
	return async (dispatch) => {
		try {
			const response = await apiConnector(
				"POST",
				homeworkApi.SUBMIT_HOMEWORK,
				formData,
				{
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				throw new Error(
					response.data.message || "Submission failed"
				);
			}

			// console.log(response.data.data)
			return response.data.data; // Return the entire response data
		} catch (error) {
			console.error("Error submitting homework:", error);
			throw error; // Rethrow the error for the caller to handle
		}
	};
}

export function HWSubmittedByStud(token) {
	return async (dispatch) => {
		try {
			const response = await apiConnector(
				"GET",
				homeworkApi.STUDENT_SUBMISSIONS,
				null,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!response.data.success) {
				toast.error(response.data.message);
				console.log(response.data.message);
				return [];
			}

			return response.data.data; // Return the list of submitted homework
		} catch (error) {
			toast.error("Failed to fetch submissions");
			console.error("Error fetching submissions:", error);
			return [];
		}
	};
}

export function uploadHomework(formData, token) {
	return async (dispatch) => {
		try {
			const response = await apiConnector(
				"POST",
				homeworkApi.UPLOAD_HOMEWORK,
				formData,
				{
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				throw new Error(
					response.data.message || "Submission failed"
				);
			}

			// console.log(response.data.data)
			return response.data.data; // Return the entire response data
		} catch (error) {
			console.error("Error submitting homework:", error);
			throw error; // Rethrow the error for the caller to handle
		}
	};
}

export function deleteHomework(homeworkId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const response = await apiConnector(
				"DELETE",
				`${homeworkApi.DELETE_HOMEWORK}/${homeworkId}`,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				toast.error(response.data.message);
				console.log(response.data.message);
				return [];
			}

			// console.log(response.data.data);
			return response.data.data;
		} catch (error) {
			toast.error("Failed to load homework");
			console.error("Error fetching homework:", error);
		} finally {
			toast.remove(toastId);
		}
	};
}

export function getSubmissions(homeworkId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const response = await apiConnector(
				"GET",
				`${homeworkApi.GET_SUBMISSIONS}/${homeworkId}`,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				toast.error(response.data.message);
				console.log(response.data.message);
				return [];
			}

			// console.log(response.data.data);
			return response.data.data;
		} catch (error) {
			toast.error("Failed to load homework");
			console.error("Error fetching homework:", error);
		} finally {
			toast.remove(toastId);
		}
	};
}

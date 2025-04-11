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
			console.log(result.data.data);
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

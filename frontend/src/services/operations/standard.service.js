import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { standardApi } from "../apis.service";

export function getAllStandards(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching standards...");
		try {
			const result = await apiConnector(
				"GET",
				standardApi.GET_ALL_STANDARDS,
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
			// console.log(result.data.data.standards)
			return result.data.data?.standards;
		} catch (error) {
			toast.error("Failed to fetch standards");
			console.log("Error in fetching standards", error);
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function assignStandardToStudent(studentId, standardId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Assigning standard...");
		try {
			const result = await apiConnector(
				"POST",
				standardApi.ASSIGN_STANDARD_TO_STUDENT,
				{ studentId, standardId },
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
			toast.error("Failed to assign standard");
			console.log("Error in assigning standard", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getStandardById(standardId, token) {
	// 👈 Fixed: Changed parameter name
	return async (dispatch) => {
		const toastId = toast.loading("Loading standard...");
		try {
			const result = await apiConnector(
				"GET",
				`${standardApi.GET_STANDARD_BY_ID}/${standardId}`, // 👈 Fixed: Using standardId
				null,
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
			toast.error("Failed to fetch standard");
			console.log("Error in fetching standard", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function createStandard(standardData, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Creating standard...");
		try {
			const result = await apiConnector(
				"POST",
				standardApi.CREATE_STANDARD,
				standardData,
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
			toast.success("Standard created successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to create standard");
			console.log("Error in creating standard", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getMyStandard(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching your standard...");
		try {
			const result = await apiConnector(
				"GET",
				standardApi.GET_MY_STANDARD,
				null,
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
			return result.data.data?.standard;
		} catch (error) {
			toast.error("Failed to fetch your standard");
			console.log("Error in fetching my standard", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}
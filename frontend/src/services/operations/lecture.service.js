import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { lectureApi } from "../apis.service";

export function createLecture(data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Creating lecture...");
		try {
			const response = await apiConnector(
				"POST",
				lectureApi.CREATE_LECTURE,
				data,
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
			console.log(response.data.data);
			toast.success("Lecture created successfully");
			return response.data.data;
		} catch (error) {
			toast.error("Failed to create lecture");
			console.log("Error in creating lecture", error);
			throw error;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export const getLecturesOfWeek = async (token) => {
	const toastId = toast.loading("Fetching lectures...");
	try {
		const response = await apiConnector(
			"GET",
			lectureApi.GET_WEEK_LECTURES,
			null,
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);

		if (!response.data.success) {
			toast.error(response.data.message);
			throw new Error(response.data.message);
		}

		return response.data.data;
	} catch (error) {
		toast.error("Failed to fetch lectures");
		console.log("Error in fetching lectures", error);
		throw error;
	} finally {
		toast.dismiss(toastId);
	}
};

export const getTestDays = async (token) => {
	const toastId = toast.loading("Fetching test days...");
	try {
		const response = await apiConnector(
			"POST",
			lectureApi.GET_TEST_DAYS,
			{ description: "Test" },
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);

		if (!response.data.success) {
			toast.error(response.data.message);
			throw new Error(response.data.message);
		}

		return response.data.data;
	} catch (error) {
		toast.error("Failed to fetch test days");
		console.log("Error in fetching test days", error);
		throw error;
	} finally {
		toast.dismiss(toastId);
	}
};

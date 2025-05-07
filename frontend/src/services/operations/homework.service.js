import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { homeworkApi } from "../apis.service";

export function getAllHomework(token) {
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

export async function submitHomework(formData) {
	try {
		const response = await apiConnector(
			"POST",
			homeworkApi.SUBMIT_HOMEWORK,
			formData,
			{
				Authorization: `Bearer ${formData.get("token")}`,
			}
		);

		if (!response.data.success) {
			console.error(response.data.message);
			return { success: false, message: response.data.message };
		}

		return { success: true, data: response.data.data };
	} catch (error) {
		console.error("Error submitting homework:", error);
		return { success: false, message: "Error submitting homework" };
	}
}

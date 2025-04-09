import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { feedbackApi } from "../apis.service";

export function makeAFeedback(data, token) {
	return async (dispatch) => {
		try {
			const response = await apiConnector(
				"POST",
				feedbackApi.MAKE_A_FEEDBACK,
				data,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				throw new Error(
					response.data.message || "Failed to submit feedback"
				);
			}

			toast.success("Feedback submitted successfully");
			return response.data;
		} catch (error) {
			console.error("Error in making feedback:", error);
			toast.error(error.message || "Failed to submit feedback");
			throw error;
		}
	};
}

export function myFeedbacks(token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"GET",
				feedbackApi.MY_ALL_FEEDBACKS,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				throw new Error(
					result.data.message || "Failed to fetch your feedback"
				);
			}

			toast.success("Fetched your feedback successfully");
         // console.log(result.data.data)
			return result.data.data;
		} catch (error) {
			console.error("Error in getting all your feedback:", error);
			toast.error(
				error.message || "Error in getting all your feedback"
			);
			throw error;
		}
	};
}

import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { notesApi } from "../apis.service";

export function getAllNotes(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		try {
			const response = await apiConnector(
				"GET",
				notesApi.GET_ALL_NOTES,
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
			console.error("GET_ALL_NOTES API Error:", error);
			toast.error("Failed to load notes. Please try again.");
		} finally {
			toast.remove(toastId);
		}
	};
}

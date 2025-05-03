import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { remarksApi } from "../apis.service";

export const viewRemarks = async (token) => {
	const toastId = toast.loading("Fetching remarks...");
	try {
		const response = await apiConnector(
			"GET",
			remarksApi.GET_STUDENT_REMARKS,
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

		toast.success("Remarks fetched successfully");
		return response.data.data;
	} catch (error) {
		toast.error("Failed to fetch remarks");
		console.log("Error in fetching remarks", error);
		throw error;
	} finally {
		toast.dismiss(toastId);
	}
};

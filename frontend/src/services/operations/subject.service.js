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

import { apiConnector } from "../apiConnector.service";
import { attendanceApi } from "../apis.service";

export function viewAttendanceOfAStud(token) {
	return async () => {
		try {
			// Parse the token if it's a string
			const parsedToken = typeof token === 'string' ? JSON.parse(token) : token;
			
			const result = await apiConnector(
				"GET",
				attendanceApi.GET_STUDENT_ATTENDANCE,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${parsedToken}`,
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

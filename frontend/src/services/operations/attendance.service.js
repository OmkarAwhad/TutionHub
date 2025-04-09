import { apiConnector } from "../apiConnector.service";
import { attendanceApi } from "../apis.service";

export function viewAttendanceOfAStud(token) {
	return async () => {
		try {
			const result = await apiConnector(
				"GET",
				attendanceApi.GET_STUDENT_ATTENDANCE,
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
         // console.log(result.data.data)
			// not completed
		} catch (error) {
			toast.error("Error in fetching student subjects");
			console.log("Error in fetching student subjects", error);
			return [];
		}
	};
}

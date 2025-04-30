import { apiConnector } from "../apiConnector.service";
import { marksApi } from "../apis.service";
import toast from "react-hot-toast";

export const getMarks = async (token) => {
    try {
        const response = await apiConnector(
            "GET",
            marksApi.GET_MARKS,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data.data;
    } catch (error) {
        console.error("Error fetching marks:", error);
        throw error;
    }
};

export function markStudentMarks(studentId, lectureId, marks, totalMarks, description, token) {
    return async (dispatch) => {
        const toastId = toast.loading("Marking student marks...");
        try {
            const result = await apiConnector(
                "POST",
                marksApi.MARK_STUDENT_MARKS,
                {
                    studentId,
                    lectureId,
                    marks,
                    totalMarks,
                    description
                },
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!result.data.success) {
                toast.error(result.data.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error in marking student marks:", error);
            return false;
        } finally {
            toast.dismiss(toastId);
        }
    };
}

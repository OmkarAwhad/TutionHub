import { apiConnector } from "../apiConnector.service";
import { marksApi } from "../apis.service";
import toast from "react-hot-toast";

export const getMarksDetailsByALec = async (lectureId, token) => {
	try {
		const response = await apiConnector(
			"GET",
			`${marksApi.GET_MARKS_DETAILS_BY_LEC}/${lectureId}`,
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

export function markStudentMarks(
	studentId,
	lectureId,
	marks,
	totalMarks,
	description,
	token
) {
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
					description,
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

export function getMarksForEdit(lectureId, token) {
   return async (dispatch) => {
      try {
         const result = await apiConnector(
            "GET",
            `${marksApi.GET_MARKS_FOR_EDIT}/${lectureId}`,
            null,
            {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            }
         );

         if (!result.data.success) {
            toast.error(result.data.message);
            return null;
         }
         return result.data.data;
      } catch (error) {
         toast.error("Error fetching marks data for editing");
         console.error("Error fetching marks for edit:", error);
         return null;
      }
   };
}

export function updateMarksInBulk(lectureId, marksData, totalMarks, token) {
   return async (dispatch) => {
      const toastId = toast.loading("Updating marks...");
      try {
         const result = await apiConnector(
            "PUT",
            `${marksApi.UPDATE_MARKS_BULK}/${lectureId}`,
            { marksData, totalMarks },
            {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            }
         );

         if (!result.data.success) {
            toast.error(result.data.message);
            return false;
         }

         toast.success("Marks updated successfully");
         return true;
      } catch (error) {
         toast.error("Failed to update marks");
         console.error("Error updating marks:", error);
         return false;
      } finally {
         toast.dismiss(toastId);
      }
   };
}

export function deleteMarksForLecture(lectureId, token) {
   return async (dispatch) => {
      const toastId = toast.loading("Deleting marks...");
      try {
         const result = await apiConnector(
            "DELETE",
            `${marksApi.DELETE_MARKS}/${lectureId}`,
            null,
            {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            }
         );

         if (!result.data.success) {
            toast.error(result.data.message);
            return false;
         }

         toast.success("Marks deleted successfully");
         return true;
      } catch (error) {
         toast.error("Failed to delete marks");
         console.error("Error deleting marks:", error);
         return false;
      } finally {
         toast.dismiss(toastId);
      }
   };
}

export const getStudentAnalytics = async (userId = null, token) => {
   try {
      const url = userId
         ? `${marksApi.GET_STUDENT_ANALYTICS}/${userId}`
         : marksApi.GET_STUDENT_ANALYTICS;

      const response = await apiConnector(
         "GET",
         url,
         null,
         {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         }
      );
      
      if (!response?.data?.success) {
         throw new Error(response?.data?.message || "Failed to fetch analytics");
      }
      return response.data.data;
   } catch (error) {
      console.error("Error in getStudentAnalytics:", error);
      throw error;
   }
};

export const getPerformanceComparison = async (subjectId, token) => {
   try {
      const response = await apiConnector(
         "GET",
         `${marksApi.GET_PERFORMANCE_COMPARISON}/${subjectId}`,
         null,
         {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         }
      );
      if (!response?.data?.success) {
         throw new Error(response?.data?.message || "Failed to fetch comparison");
      }
      return response.data.data;
   } catch (error) {
      console.error("Error in getPerformanceComparison:", error);
      throw error;
   }
};


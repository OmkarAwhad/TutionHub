import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { remarksApi } from "../apis.service";

export const viewRemarks = async (userId, token) => {
   const toastId = toast.loading("Fetching remarks...");
   try {
      const url = userId
         ? `${remarksApi.GET_STUDENT_REMARKS}/${userId}`
         : remarksApi.GET_STUDENT_REMARKS;

      const response = await apiConnector(
         "GET",
         url,
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


export const addARemark = async ({ studentId, subjectId, remark, token }) => {
	const toastId = toast.loading("Submitting remark...");
	try {
		const response = await apiConnector(
			"POST",
			remarksApi.ADD_A_REMARK,
			{ studentId, subjectId, remark },
			{
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		);

		if (!response.data.success) {
			toast.error(response.data.message);
			throw new Error(response.data.message);
		}

		toast.success("Remark added successfully");
		return response.data.data;
	} catch (error) {
		toast.error("Failed to add remark");
		console.log("Error in adding remark", error);
		throw error;
	} finally {
		toast.dismiss(toastId);
	}
};

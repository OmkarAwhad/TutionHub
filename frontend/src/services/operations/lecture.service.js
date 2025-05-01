import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { lectureApi } from "../apis.service";

export function createLecture(data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Creating lecture...");
		try {
			const result = await apiConnector(
				"POST",
				lectureApi.CREATE_LECTURE,
				data,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				console.log(result.data.message);
				return null;
			}
			toast.success("Lecture created successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to create lecture");
			console.log("Error in creating lecture", error);
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export const getLecturesOfWeek = async (token) => {
	const toastId = toast.loading("Fetching lectures...");
	try {
		const response = await apiConnector(
			"GET",
			lectureApi.GET_WEEK_LECTURES,
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

		return response.data.data;
	} catch (error) {
		toast.error("Failed to fetch lectures");
		console.log("Error in fetching lectures", error);
		throw error;
	} finally {
		toast.dismiss(toastId);
	}
};

export function getAllLectures(token) {
	return async () => {
		const toastId = toast.loading("loading...");
		try {
			const response = await apiConnector(
				"GET",
				lectureApi.GET_ALL_LECTURES,
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
			// console.log(response.data.d	ata)
			return response.data.data;
		} catch (error) {
			toast.error("Failed to fetch all lectures");
			console.log("Error in fetching all lectures", error);
			throw error;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function deleteLecture(lectureId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Deleting lecture...");
		try {
			const response = await apiConnector(
				"DELETE",
				lectureApi.DELETE_LECTURE,
				{ lectureId },
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				toast.error(response.data.message);
				throw new Error(response.data.message);
			}

			toast.success("Lecture deleted successfully");
			return response.data.data;
		} catch (error) {
			toast.error("Failed to delete lecture");
			console.log("Error in deleting lecture", error);
			throw error;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function updateLecture(lectureId, data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Updating lecture...");
		try {
			const response = await apiConnector(
				"PUT",
				`${lectureApi.UPDATE_LECTURE}/${lectureId}`,
				data,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!response.data.success) {
				toast.error(response.data.message);
				throw new Error(response.data.message);
			}

			// toast.success("Lecture updated successfully");
			return response.data.data;
		} catch (error) {
			toast.error("Failed to update lecture");
			console.log("Error in updating lecture", error);
			throw error;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

// export const getLectByDesc = async (description, token) => {
// 	const toastId = toast.loading("Fetching test days...");
// 	try {
// 		const response = await apiConnector(
// 				"GET", // Use GET method
// 				`${lectureApi.GET_TEST_DAYS}?description=${description}`, // Pass description as query parameter
// 				null,
// 				{
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				}
// 			);

// 		if (!response.data.success) {
// 			toast.error(response.data.message);
// 			throw new Error(response.data.message);
// 		}

// 		return response.data.data;
// 	} catch (error) {
// 		toast.error("Failed to fetch test days");
// 		console.log("Error in fetching test days", error);
// 		throw error;
// 	} finally {
// 		toast.dismiss(toastId);
// 	}
// };

// export function getLectureBySub(subjectId, token) {
// 	return async (dispatch) => {
// 		try {
// 			const response = await apiConnector(
// 				"GET",
// 				`${lectureApi.GET_LECTURES_BY_SUBJECT}?subjectId=${subjectId}`,
// 				null,
// 				{
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				}
// 			);
// 			if (!response.data.success) {
// 				toast.error(response.data.message);
// 				console.log(response.data.message);
// 				return [];
// 			}
// 			toast.success("Lectures fetched successfully");
// 			return response.data.data;
// 		} catch (error) {
// 			toast.error("Failed to fetch lectures by subject");
// 			console.log("Error in fetching lectures by subject", error);
// 			throw error;
// 		}
// 	};
// }

const { GET_LECTURES_OF_WEEK, GET_LECTURES_BY_DATE } = lectureApi;

export const getLecturesByDate = async (token, date) => {
	try {
		const response = await apiConnector("GET", GET_LECTURES_BY_DATE, null, {
			Authorization: `Bearer ${token}`,
		}, {
			date: date
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

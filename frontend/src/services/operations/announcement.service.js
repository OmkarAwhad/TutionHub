import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { announcementApi } from "../apis.service";

export function createAnnouncementService(data, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Creating announcement...");
		try {
			const result = await apiConnector(
				"POST",
				announcementApi.CREATE_ANNOUNCEMENT,
				data,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				return null;
			}
			toast.success("Announcement created successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to create announcement");
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

// export function getMyAnnouncements(token) {
// 	return async (dispatch) => {
// 		const toastId = toast.loading("Fetching announcements...");
// 		try {
// 			const result = await apiConnector(
// 				"GET",
// 				announcementApi.GET_MY_ANNOUNCEMENTS,
// 				{},
// 				{
// 					"Content-Type": "application/json",
// 					Authorization: `Bearer ${token}`,
// 				}
// 			);
// 			if (!result.data.success) {
// 				toast.error(result.data.message);
// 				return [];
// 			}
// 			return result.data.data;
// 		} catch (error) {
// 			toast.error("Failed to fetch announcements");
// 			return [];
// 		} finally {
// 			toast.dismiss(toastId);
// 		}
// 	};
// }

export function deleteAnnouncement(announcementId, token) {
	return async (dispatch) => {
		const toastId = toast.loading("Deleting announcement...");
		try {
			const result = await apiConnector(
				"DELETE",
				announcementApi.DELETE_ANNOUNCEMENT,
				{ announcementId },
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				return null;
			}
			toast.success("Announcement deleted successfully");
			return result.data.data;
		} catch (error) {
			toast.error("Failed to delete announcement");
			return null;
		} finally {
			toast.dismiss(toastId);
		}
	};
}

export function getAllAnnouncements(token) {
	return async (dispatch) => {
		const toastId = toast.loading("Fetching all announcements...");
		try {
			const result = await apiConnector(
				"GET",
				announcementApi.GET_ANNOUNCEMENTS,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				return [];
			}
			// console.log(result.data.data)
			return result.data.data;
		} catch (error) {
			toast.error("Failed to fetch announcements");
			return [];
		} finally {
			toast.dismiss(toastId);
		}
	};
}

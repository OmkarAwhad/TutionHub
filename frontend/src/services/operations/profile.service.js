import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.service";
import { profileApi } from "../apis.service";
import { setUser } from "../../slices/profile.slice";

export function updateProfile(data, token) {
	return async (dispatch) => {
		try {
			const result = await apiConnector(
				"POST",
				profileApi.UPDATE_PROFILE,
				data,
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);

			if (!result.data.success) {
				toast.error(result.data.message);
				throw new Error(result.data.message);
			}

			const updatedUser = result.data.data.User;
			dispatch(setUser(updatedUser));
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error("Error in updating profile");
			console.log("Error in updating profile", error);
		}
	};
}

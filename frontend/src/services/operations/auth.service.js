import toast from "react-hot-toast";
import { setLoading, setToken } from "../../slices/auth.slice";
import { apiConnector } from "../apiConnector.service";
import { authApi } from "../apis.service";
import { setUser } from "../../slices/profile.slice";

export function signUp(data, navigate) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading...");
		dispatch(setLoading(true));
		try {
			const result = await apiConnector(
				"POST",
				authApi.SIGNUP_API,
				data
			);
			// console.log(result);
			if (!result.data.success) {
				toast.error(result.data.message);
				throw new Error(result.data.message);
			}
			toast.success("Registered successfully");
			navigate("/login");
		} catch (error) {
			console.log("Registration failed");
			toast.error("Registration failed");
			navigate("/signup");
		}
		dispatch(setLoading(false));
		toast.remove(toastId);
	};
}

export function login(data, navigate) {
	return async (dispatch) => {
		const toastId = toast.loading("Loading ...");
		dispatch(setLoading(true));
		try {
			const result = await apiConnector(
				"POST",
				authApi.LOGIN_API,
				data
			);
			// console.log(result.data.data);
			if (!result.data.success) {
				toast.error(result.data.message);
				throw new Error(result.data.message);
			} else {
				toast.success("Login successful");
				dispatch(setToken(result.data.data.token));
				localStorage.setItem(
					"token",
					JSON.stringify(result.data.data.token)
				);
				localStorage.setItem(
					"user",
					JSON.stringify(result.data.data.User)
				);

				dispatch(setUser(result.data.data.User));
				navigate("/dashboard/my-profile");
			}
		} catch (error) {
			console.log("Error in login");
			toast.error("Login failed");
		}
		dispatch(setLoading(false));
		toast.remove(toastId);
	};
}

export function logout(navigate) {
	return (dispatch) => {
		dispatch(setToken(null));
		dispatch(setUser(null));
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		toast.success("Logged Out");
		navigate("/login");
	};
}

export function deleteMyAccount(token, navigate) {
	return async (dispatch) => {
		const toastId = toast.loading("Deleting account...");
		dispatch(setLoading(true));
		try {
			const result = await apiConnector(
				"DELETE",
				authApi.DELETE_MY_ACCOUNT,
				{},
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			);
			if (!result.data.success) {
				toast.error(result.data.message);
				throw new Error(result.data.message);
			}
			toast.success("Account deleted successfully");
			dispatch(setToken(null));
			dispatch(setUser(null));
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			navigate("/signup");
		} catch (error) {
			console.log("Error deleting account");
			toast.error("Failed to delete account");
		}
		dispatch(setLoading(false));
		toast.remove(toastId);
	};
}

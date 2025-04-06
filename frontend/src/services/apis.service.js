const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = {
	SIGNUP_API: BASE_URL + "/auth/signUp",
	LOGIN_API: BASE_URL + "/auth/login",
};

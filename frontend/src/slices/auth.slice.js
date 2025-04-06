import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	loading: false,
	signUpData: null, // User info
	token: localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token"))
		: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setLoading(state, value) {
			state.loading = value.payload;
		},
		setSignUpData(state, value) {
			state.signUpData = value.payload;
		},
		setToken(state, value) {
			state.token = value.payload;
		},
	},
});

export const { setLoading, setSignUpData ,setToken} = authSlice.actions;
export default authSlice.reducer;

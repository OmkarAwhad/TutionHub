import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	markLecture: localStorage.getItem("markLecture")
		? JSON.parse(localStorage.getItem("markLecture"))
		: null,
};

const attendanceSlice = createSlice({
	name: "attendance",
	initialState,
	reducers: {
		setMarkLecture(state, action) {
			state.markLecture = action.payload;
			localStorage.setItem(
				"markLecture",
				JSON.stringify(action.payload)
			);
		},
		clearmarkLecture(state) {
			state.markLecture = null;
			localStorage.removeItem("markLecture");
		},
	},
});

export const { setMarkLecture, clearmarkLecture } =
	attendanceSlice.actions;

export default attendanceSlice.reducer;

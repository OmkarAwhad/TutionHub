import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	markAttendanceLecture: localStorage.getItem("markAttendanceLecture")
		? JSON.parse(localStorage.getItem("markAttendanceLecture"))
		: null,
};

const attendanceSlice = createSlice({
	name: "attendance",
	initialState,
	reducers: {
		setMarkAttendanceLecture(state, action) {
			state.markAttendanceLecture = action.payload;
			localStorage.setItem(
				"markAttendanceLecture",
				JSON.stringify(action.payload)
			);
		},
		clearMarkAttendanceLecture(state) {
			state.markAttendanceLecture = null;
			localStorage.removeItem("markAttendanceLecture");
		},
	},
});

export const { setMarkAttendanceLecture, clearMarkAttendanceLecture } =
	attendanceSlice.actions;

export default attendanceSlice.reducer;

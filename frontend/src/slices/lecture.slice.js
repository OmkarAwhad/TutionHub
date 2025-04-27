import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	editLecture: null,
};

const lectureSlice = createSlice({
	name: "lecture",
	initialState: initialState,
	reducers: {
		setEditLecture(state, action) {
			state.editLecture = action.payload; // Fix: Assign to editLecture
		},
	},
});

export const { setEditLecture } = lectureSlice.actions;
export default lectureSlice.reducer;

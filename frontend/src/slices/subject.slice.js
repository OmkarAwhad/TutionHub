import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	editingSubject: localStorage.getItem("editingSubject")
		? JSON.parse(localStorage.getItem("editingSubject"))
		: null,
};

const subjectSlice = createSlice({
	name: "subject",
	initialState: initialState,
	reducers: {
		setEditingSubject(state, value) {
			state.editingSubject = value.payload;
			localStorage.setItem(
				"editingSubject",
				JSON.stringify(value.payload)
			);
		},
		clearEditingSubject(state) {
			state.editingSubject = null;
			localStorage.removeItem("editingSubject");
		},
	},
});

export const { setEditingSubject, clearEditingSubject } = subjectSlice.actions;
export default subjectSlice.reducer;

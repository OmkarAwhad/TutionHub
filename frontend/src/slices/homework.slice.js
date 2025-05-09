import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectHomework: localStorage.getItem("selectHomework")
		? JSON.parse(localStorage.getItem("selectHomework"))
		: null,
};

const homeworkSlice = createSlice({
	name: "homework",
	initialState,
	reducers: {
		setSelectHomework(state, action) {
			state.selectHomework = action.payload;
			localStorage.setItem(
				"selectHomework",
				JSON.stringify(action.payload)
			);
		},
		clearSelectHomework(state) {
			state.selectHomework = null;
			localStorage.removeItem("selectHomework");
		},
	},
});

export const { setSelectHomework, clearSelectHomework } =
	homeworkSlice.actions;

export default homeworkSlice.reducer;

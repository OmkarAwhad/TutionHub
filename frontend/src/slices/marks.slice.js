import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    markLecture: null,
    totalMarks: 0,
    studentMarks: {},
};

const marksSlice = createSlice({
    name: "marks",
    initialState,
    reducers: {
        setMarkLecture: (state, action) => {
            state.markLecture = action.payload;
        },
        setTotalMarks: (state, action) => {
            state.totalMarks = action.payload;
        },
        setStudentMarks: (state, action) => {
            const { studentId, marks, description } = action.payload;
            console.log("Setting marks for student:", studentId, marks, description);
            
            if (!state.studentMarks[studentId]) {
                state.studentMarks[studentId] = {};
            }
            
            // Ensure marks is a number and not undefined
            const marksValue = marks !== undefined ? Number(marks) : 0;
            state.studentMarks[studentId].marks = marksValue;
            state.studentMarks[studentId].description = description || "";
            
            console.log("Updated state:", state.studentMarks[studentId]);
        },
        clearMarks: (state) => {
            state.markLecture = null;
            state.totalMarks = 0;
            state.studentMarks = {};
        },
    },
});

export const { setMarkLecture, setTotalMarks, setStudentMarks, clearMarks } = marksSlice.actions;
export default marksSlice.reducer; 
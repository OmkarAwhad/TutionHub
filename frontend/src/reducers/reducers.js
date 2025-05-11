import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice";
import profileReducer from "../slices/profile.slice";
import lectureReducer from "../slices/lecture.slice";
import attendanceReducer from "../slices/attendance.slice";
import marksReducer from "../slices/marks.slice";
import homeworkReducer from "../slices/homework.slice";
import subjectReducer from "../slices/subject.slice";

const rootReducer = combineReducers({
	auth: authReducer,
	profile: profileReducer,
	lecture: lectureReducer,
	attendance: attendanceReducer,
	subject: subjectReducer,
	homework: homeworkReducer,
	marks: marksReducer,
});

export default rootReducer;

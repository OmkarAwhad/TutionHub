import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice";
import profileReducer from "../slices/profile.slice";
import lectureReducer from "../slices/lecture.slice";

const rootReducer = combineReducers({
	auth: authReducer,
	profile: profileReducer,
	lecture: lectureReducer,
});

export default rootReducer;

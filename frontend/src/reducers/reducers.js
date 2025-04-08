import { combineReducers } from "redux";
import authReducer from "../slices/auth.slice";
import profileReducer from "../slices/profile.slice";

const rootReducer = combineReducers({
	auth: authReducer,
	profile: profileReducer,
});

export default rootReducer;

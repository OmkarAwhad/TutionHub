import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import profileReducer from "../slices/profile.slice";

const rootReducers = combineReducers({
	auth: authReducer,
	profile: profileReducer,
});

export default rootReducers;

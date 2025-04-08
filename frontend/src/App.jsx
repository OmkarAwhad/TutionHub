import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OpenRoute from "./components/auth/OpenRoute.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import MyProfile from "./components/dashboard/myprofile/MyProfile.jsx";
import Lecture from "./components/dashboard/Students/lecture/Lecture.jsx";
import Homework from "./components/dashboard/Students/homework/Homework.jsx";
import Feedback from "./components/dashboard/Students/feedback/Feedback.jsx";
import Notes from "./components/dashboard/Students/notes/Notes.jsx";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants.utils.js";

function App() {
	const { user } = useSelector((state) => state.profile);
	return (
		<div className="logo-text">
			<Routes>
				<Route
					path="/login"
					element={
						<OpenRoute>
							<LoginPage />
						</OpenRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<OpenRoute>
							<SignUpPage />
						</OpenRoute>
					}
				/>
				<Route
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				>
					<Route
						path="/dashboard/my-profile"
						element={<MyProfile />}
					/>
					{user?.role === ACCOUNT_TYPE.STUDENT && (
						<>
							<Route
								path="/dashboard/lecture"
								element={<Lecture />}
							/>
							<Route
								path="/dashboard/get-homework"
								element={<Homework />}
							/>
							<Route
								path="/dashboard/get-notes"
								element={<Notes />}
							/>
							<Route
								path="/dashboard/feedback"
								element={<Feedback />}
							/>
						</>
					)}
				</Route>
			</Routes>
		</div>
	);
}

export default App;

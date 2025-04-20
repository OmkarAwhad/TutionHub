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
import Attendance from "./components/dashboard/Students/attendance/Attendance.jsx";
import Progress from "./components/dashboard/Students/progress/Progress.jsx";
import Remarks from "./components/dashboard/Students/remarks/Remarks.jsx";
import AdminUsers from "./components/dashboard/admin/users/AdminUsers.jsx";
import AdminLecture from "./components/dashboard/admin/lecture/AdminLecture.jsx";
import CreateLecture from "./components/dashboard/admin/lecture/CreateLecture.jsx";
import LectureList from "./components/dashboard/admin/lecture/LectureList.jsx";
import AdminSubjects from "./components/dashboard/admin/subjects/AdminSubjects.jsx";
import AdminMarks from "./components/dashboard/admin/marks/AdminMarks.jsx";
import AdminAttendance from "./components/dashboard/admin/attendance/AdminAttendance.jsx";

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
							<Route
								path="/dashboard/my-profile/attendance"
								element={<Attendance />}
							/>
							<Route
								path="/dashboard/my-profile/progress"
								element={<Progress />}
							/>
							<Route
								path="/dashboard/my-profile/remarks"
								element={<Remarks />}
							/>
						</>
					)}

					{user?.role === ACCOUNT_TYPE.ADMIN && (
						<>
							<Route
								path="/dashboard/admin-users"
								element={<AdminUsers />}
							/>
							<Route
								path="/dashboard/admin-lecture"
								element={<AdminLecture />}
							/>
							<Route
								path="/dashboard/admin-lecture/create-lecture"
								element={<CreateLecture />}
							/>
							<Route
								path="/dashboard/admin-lecture/lectures-list"
								element={<LectureList />}
							/>
							<Route
								path="/dashboard/admin-subjects"
								element={<AdminSubjects />}
							/>
							<Route
								path="/dashboard/admin-marks"
								element={<AdminMarks />}
							/>
							<Route
								path="/dashboard/admin-attendance"
								element={<AdminAttendance />}
							/>
						</>
					)}
				</Route>
			</Routes>
		</div>
	);
}

export default App;

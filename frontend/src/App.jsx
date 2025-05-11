import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants.utils.js";
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
import Attendance from "./components/dashboard/Students/attendance/Attendance.jsx";
import Progress from "./components/dashboard/Students/progress/Progress.jsx";
import Remarks from "./components/dashboard/Students/remarks/Remarks.jsx";
import AdminUsers from "./components/dashboard/admin/users/AdminUsers.jsx";
import AdminLecture from "./components/dashboard/admin/lecture/AdminLecture.jsx";
import CreateLecture from "./components/dashboard/admin/lecture/CreateLecture.jsx";
import EditLecture from "./components/dashboard/admin/lecture/EditLecture.jsx";
import LectureList from "./components/dashboard/admin/lecture/LectureList.jsx";
import AdminSubjects from "./components/dashboard/admin/subjects/AdminSubjects.jsx";
import AdminMarks from "./components/dashboard/admin/marks/AdminMarks.jsx";
import PutMarks from "./components/dashboard/admin/marks/PutMarks.jsx";
import AdminAttendance from "./components/dashboard/admin/attendance/AdminAttendance.jsx";
import MarkAttendance from "./components/dashboard/admin/attendance/MarkAttendance.jsx";
import ViewAttendance from "./components/dashboard/admin/attendance/ViewAttendance.jsx";
import ViewingLecAttendance from "./components/dashboard/admin/attendance/ViewingLecAttendance.jsx";
import MainMarking from "./components/dashboard/admin/attendance/MainMarking.jsx";
import MarkMarks from "./components/dashboard/admin/marks/MarkMarks.jsx";
import MarksList from "./components/dashboard/admin/marks/MarksList.jsx";
import ViewMarks from "./components/dashboard/admin/marks/ViewMarks.jsx";
import ViewHomework from "./components/dashboard/Students/homework/ViewHomework.jsx";
import TutorNotes from "./components/dashboard/tutor/Notes/TutorNotes.jsx";
import UploadNote from "./components/dashboard/tutor/Notes/UploadNote.jsx";
import NotesList from "./components/dashboard/tutor/Notes/NotesList.jsx";
import TutorHomework from "./components/dashboard/tutor/Homework/TutorHomework.jsx";
import StudentData from "./components/dashboard/tutor/StudentData/StudentData.jsx";
import Metrics from "./components/dashboard/tutor/Metrics/Metrics.jsx";
import Content from "./components/dashboard/tutor/Content/Content.jsx";
import UploadHomework from "./components/dashboard/tutor/Homework/UploadHomework.jsx";
import HomeworkList from "./components/dashboard/tutor/Homework/HomeworkList.jsx";
import ViewSubmissions from "./components/dashboard/tutor/Homework/ViewSubmissions.jsx";
import SubmissionsOfAHW from "./components/dashboard/tutor/Homework/SubmissionsOfAHW.jsx";
import SubjectForm from "./components/dashboard/admin/subjects/SubjectForm.jsx";
import GetAllSubjects from "./components/dashboard/admin/subjects/GetAllSubjects.jsx";
import AssignSubjects from "./components/dashboard/admin/subjects/AssignSubjects.jsx";
import AssignSubStudents from "./components/dashboard/admin/subjects/AssignSubStudents.jsx";
import AssignSubTutors from "./components/dashboard/admin/subjects/AssignSubTutors.jsx";

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
								path="/dashboard/get-homework/view-homework"
								element={<ViewHomework />}
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
								path="/dashboard/admin-lecture/edit-lecture"
								element={<EditLecture />}
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
								path="/dashboard/admin-subjects/create-subject"
								element={<SubjectForm />}
							/>
							<Route
								path="/dashboard/admin-subjects/subjects-list"
								element={<GetAllSubjects />}
							/>
							<Route
								path="/dashboard/admin-subjects/assign-subjects"
								element={<AssignSubjects />}
							/>
							<Route
								path="/dashboard/admin-subjects/assign-subjects/students"
								element={<AssignSubStudents />}
							/>
							<Route
								path="/dashboard/admin-subjects/assign-subjects/tutors"
								element={<AssignSubTutors />}
							/>
							<Route
								path="/dashboard/admin-marks"
								element={<AdminMarks />}
							/>
							<Route
								path="/dashboard/admin-marks/add-marks"
								element={<MarkMarks />}
							/>
							<Route
								path="/dashboard/admin-marks/add-marks/:lectureId"
								element={<PutMarks />}
							/>
							<Route
								path="/dashboard/admin-marks/view-marks"
								element={<MarksList />}
							/>
							<Route
								path="/dashboard/admin-marks/view-marks/:lectureId"
								element={<ViewMarks />}
							/>
							<Route
								path="/dashboard/admin-attendance"
								element={<AdminAttendance />}
							/>
							<Route
								path="/dashboard/admin-attendance/mark-attendance"
								element={<MarkAttendance />}
							/>
							<Route
								path="/dashboard/admin-attendance/view-attendance"
								element={<ViewAttendance />}
							/>
							<Route
								path="/dashboard/admin-attendance/view-attendance/:lectureId"
								element={<ViewingLecAttendance />}
							/>
							<Route
								path="/dashboard/admin-attendance/mark-attendance/:lectureId"
								element={<MainMarking />}
							/>
						</>
					)}

					{user?.role === ACCOUNT_TYPE.TUTOR && (
						<>
							<Route
								path="/dashboard/tutor-notes"
								element={<TutorNotes />}
							/>
							<Route
								path="/dashboard/tutor-notes/upload-note"
								element={<UploadNote />}
							/>
							<Route
								path="/dashboard/tutor-notes/notes-list"
								element={<NotesList />}
							/>
							<Route
								path="/dashboard/tutor-homework"
								element={<TutorHomework />}
							/>
							<Route
								path="/dashboard/tutor-homework/upload-homework"
								element={<UploadHomework />}
							/>
							<Route
								path="/dashboard/tutor-homework/homework-list"
								element={<HomeworkList />}
							/>
							<Route
								path="/dashboard/tutor-homework/view-submissions"
								element={<ViewSubmissions />}
							/>
							<Route
								path="/dashboard/tutor-homework/view-submissions/:homeworkId"
								element={<SubmissionsOfAHW />}
							/>
							<Route
								path="/dashboard/student-data"
								element={<StudentData />}
							/>
							<Route
								path="/dashboard/tutor-metrics"
								element={<Metrics />}
							/>
							<Route
								path="/dashboard/content"
								element={<Content />}
							/>
						</>
					)}
				</Route>
			</Routes>
		</div>
	);
}

export default App;

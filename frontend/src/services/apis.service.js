const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = {
	SIGNUP_API: BASE_URL + "/auth/signUp",
	LOGIN_API: BASE_URL + "/auth/login",
};

export const profileApi = {
	UPDATE_PROFILE: BASE_URL + "/profile/updateProfile",
};

export const attendanceApi = {
	GET_STUDENT_ATTENDANCE: BASE_URL + "/attendance/viewAttendanceOfAStud",
	GET_SUBJECT_ATTENDANCE: BASE_URL + "/attendance/attendAccToSub",
	MARK_ATTENDANCE: BASE_URL + "/attendance/markAttendance",
	CHECK_LECTURE_ATTENDANCE: BASE_URL + "/attendance/checkLectureAttendance",
};

export const marksApi = {
	GET_SUBJECT_MARKS: BASE_URL + "/marks/marksAccToSubject",
	GET_STUDENT_PROGRESS: BASE_URL + "/marks/trackStudentProgress",
	GET_SUBJECT_PROGRESS: BASE_URL + "/marks/trackProgressBySubject",
};

export const remarksApi = {
	GET_STUDENT_REMARKS: BASE_URL + "/remarks/viewRemarks",
};

export const subjectApi = {
	SUBJECT_OF_STUDENT: BASE_URL + "/subject/subsOfThatStud",
	CREATE_SUBJECT: BASE_URL + "/subject/createSubject",
	UPDATE_SUBJECT: BASE_URL + "/subject/updateSubject",
	DELETE_SUBJECT: BASE_URL + "/subject/deleteSubject",
	GET_ALL_SUBJECTS: BASE_URL + "/subject/getAllSubjects",
	ASSIGN_SUBJECT_TO_STUDENT: BASE_URL + "/subject/assignSubject",
};

export const lectureApi = {
	CREATE_LECTURE: BASE_URL + "/lecture/createLecture",
	GET_WEEK_LECTURES: BASE_URL + "/lecture/getLecturesOfWeek",
	GET_TEST_DAYS: BASE_URL + "/lecture/getLectByDesc",
	GET_ALL_LECTURES: BASE_URL + "/lecture/getAllLectures",
	GET_LECTURES_BY_SUBJECT: BASE_URL + "/lecture/getLectureBySub",
	DELETE_LECTURE: BASE_URL + "/lecture/deleteLecture",
	UPDATE_LECTURE: BASE_URL + "/lecture/updateLecture",
};

export const usersApi = {
	GET_MY_STUDENTS_LIST: BASE_URL + "/users/getMyStudentsList",
	GET_ALL_STUDENTS_LIST: BASE_URL + "/users/getAllStudentsList",
	GET_TUTORS: BASE_URL + "/users/getTutors",
	GET_STUDENTS_BY_LEC: BASE_URL + "/users/getMyStudentsListByLec",
};

export const feedbackApi = {
	MAKE_A_FEEDBACK: BASE_URL + "/feedback/makeAFeedback",
	MY_ALL_FEEDBACKS: BASE_URL + "/feedback/myFeedbacks",
};

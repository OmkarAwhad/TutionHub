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

export const studentApi = {
	GET_MY_STUDENTS_LIST: BASE_URL + "/student/getMyStudentsList",
	GET_ALL_STUDENTS_LIST: BASE_URL + "/student/getAllStudentsList",
};

export const feedbackApi = {
	MAKE_A_FEEDBACK: BASE_URL + "/feedback/makeAFeedback",
	MY_ALL_FEEDBACKS: BASE_URL + "/feedback/myFeedbacks",
};

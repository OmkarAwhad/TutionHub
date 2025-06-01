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
	GET_SUBJECT_ATTENDANCE_BY_TUTOR: BASE_URL + "/attendance/StudAttendAccToSubForTutor",
	MARK_ATTENDANCE: BASE_URL + "/attendance/markAttendance",
	CHECK_LECTURE_ATTENDANCE: BASE_URL + "/attendance/checkLectureAttendance",
	GET_LECTURES_WITH_ATTENDANCE_MARKED:
		BASE_URL + "/attendance/getLecturesWithAttendanceMarked",
	VIEW_STUD_ATTENDANCE_FOR_LEC:
		BASE_URL + "/attendance/viewStudAttendanceForLec",
	STUDS_PRESENT_FOR_LEC: BASE_URL + "/attendance/studsPresentForALec",
	GET_ATTENDANCE_BY_SUBJECT: BASE_URL + "/attendance/attendAccToSub",
	GET_LECTURES_WITHOUT_ATTENDANCE:
		BASE_URL + "/attendance/getLecturesWithoutAttendance",
};

export const marksApi = {
	GET_SUBJECT_MARKS: BASE_URL + "/marks/marksAccToSubject",
	GET_STUDENT_PROGRESS: BASE_URL + "/marks/trackStudentProgress",
	GET_SUBJECT_PROGRESS: BASE_URL + "/marks/trackProgressBySubject",
	MARK_STUDENT_MARKS: BASE_URL + "/marks/markStudentMarks",
	GET_MARKS_DETAILS_BY_LEC: BASE_URL + "/marks/getMarksDetailsByALec",
	EDIT_MARKS: BASE_URL + "/marks/editMarks",
};

export const remarksApi = {
	GET_STUDENT_REMARKS: BASE_URL + "/remarks/viewRemarks",
	ADD_A_REMARK: BASE_URL + "/remarks/addARemark",
};

export const subjectApi = {
	SUBJECT_OF_USER: BASE_URL + "/subject/subsOfThatUser",
	CREATE_SUBJECT: BASE_URL + "/subject/createSubject",
	UPDATE_SUBJECT: BASE_URL + "/subject/updateSubject",
	DELETE_SUBJECT: BASE_URL + "/subject/deleteSubject",
	GET_ALL_SUBJECTS: BASE_URL + "/subject/getAllSubjects",
	ASSIGN_SUBJECT_TO_STUDENT: BASE_URL + "/subject/assignSubject",
};

export const lectureApi = {
	CREATE_LECTURE: BASE_URL + "/lecture/createLecture",
	GET_WEEK_LECTURES: BASE_URL + "/lecture/getLecturesOfWeek",
	GET_WEEK_LECTURES_BY_DATE: BASE_URL + "/lecture/getLecturesByDate",
	GET_TEST_DAYS: BASE_URL + "/lecture/getLectByDesc",
	GET_ALL_LECTURES: BASE_URL + "/lecture/getAllLectures",
	GET_LECTURES_BY_SUBJECT: BASE_URL + "/lecture/getLectureBySub",
	DELETE_LECTURE: BASE_URL + "/lecture/deleteLecture",
	UPDATE_LECTURE: BASE_URL + "/lecture/updateLecture",
	GET_TUTOR_LECTURES_BY_DATE: BASE_URL + "/lecture/getTutorLecturesByDate",
};

export const usersApi = {
	GET_MY_STUDENTS_LIST: BASE_URL + "/users/getMyStudentsList",
	GET_ALL_STUDENTS_LIST: BASE_URL + "/users/getAllStudentsList",
	GET_TUTORS: BASE_URL + "/users/getTutors",
	GET_STUDENTS_BY_LEC: BASE_URL + "/users/getMyStudentsListByLec",
	GET_MY_DETAILS: BASE_URL + "/users/getMyDetails",
};

export const feedbackApi = {
	MAKE_A_FEEDBACK: BASE_URL + "/feedback/makeAFeedback",
	MY_ALL_FEEDBACKS: BASE_URL + "/feedback/myFeedbacks",
};

export const notesApi = {
	UPLOAD_NOTES: BASE_URL + "/notes/uploadNotes",
	DELETE_NOTE: BASE_URL + "/notes/deleteNote",
	GET_ALL_NOTES: BASE_URL + "/notes/getAllNotes",
	GET_NOTES_BY_SUB: BASE_URL + "/notes/getNotesBySubject",
};

export const homeworkApi = {
	UPLOAD_HOMEWORK: BASE_URL + "/homework/uploadHomework",
	DELETE_HOMEWORK: BASE_URL + "/homework/deleteHomework",
	GET_HOMEWORK_BY_SUB: BASE_URL + "/homework/getHomeworkBySubject",
	GET_ALL_HOMEWORK: BASE_URL + "/homework/getAllHomework",
	SUBMIT_HOMEWORK: BASE_URL + "/homework/submitHomework",
	GET_SUBMISSIONS: BASE_URL + "/homework/getSubmissions",
	STUDENT_SUBMISSIONS: BASE_URL + "/homework/HWSubmittedByStud",
};

export const announcementApi = {
	CREATE_ANNOUNCEMENT: BASE_URL + "/announcement/createAnnouncement",
	GET_MY_ANNOUNCEMENTS: BASE_URL + "/announcement/getMyAnnouncements",
	GET_ANNOUNCEMENTS: BASE_URL + "/announcement/getAllAnnouncements",
	DELETE_ANNOUNCEMENT: BASE_URL + "/announcement/deleteAnnouncement",
};

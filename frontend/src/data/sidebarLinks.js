import { ACCOUNT_TYPE } from "../utils/constants.utils";

export const sidbarLinks = [
	{
		id: 1,
		name: "My Profile",
		path: "/dashboard/my-profile",
	},
	{
		id: 2,
		name: "Lecture",
		path: "/dashboard/lecture",
		type: ACCOUNT_TYPE.STUDENT,
	},
	{
		id: 3,
		name: "Homework",
		path: "/dashboard/get-homework",
		type: ACCOUNT_TYPE.STUDENT,
	},
	{
		id: 4,
		name: "Notes",
		path: "/dashboard/get-notes",
		type: ACCOUNT_TYPE.STUDENT,
	},
	{
		id: 5,
		name: "Feedback",
		path: "/dashboard/feedback",
		type: ACCOUNT_TYPE.STUDENT,
	},
	{
		id: 6,
		name: "Upload Notes",
		path: "/dashboard/upload-notes",
		type: ACCOUNT_TYPE.TUTOR,
	},
	{
		id: 7,
		name: "Upload Homework",
		path: "/dashboard/upload-homework",
		type: ACCOUNT_TYPE.TUTOR,
	},
	{
		id: 8,
		name: "Student Data",
		path: "/dashboard/student-data",
		type: ACCOUNT_TYPE.TUTOR,
	},
	{
		id: 9,
		name: "Users",
		path: "/dashboard/users",
		type: ACCOUNT_TYPE.ADMIN,
	},
	{
		id: 10,
		name: "Create Lecture",
		path: "/dashboard/create-lecture",
		type: ACCOUNT_TYPE.ADMIN,
	},
	{
		id: 11,
		name: "Mark Attendance",
		path: "/dashboard/mark-attendance",
		type: ACCOUNT_TYPE.ADMIN,
	},
	{
		id: 12,
		name: "Marks",
		path: "/dashboard/mark-marks",
		type: ACCOUNT_TYPE.ADMIN,
	},
	{
		id: 13,
		name: "Subjects",
		path: "/dashboard/subjects",
		type: ACCOUNT_TYPE.ADMIN,
	},
	{
		id: 13,
		name: "Tutor metrics",
		path: "/dashboard/tutor-metrics",
		type: ACCOUNT_TYPE.TUTOR,
	},
	{
		id: 14,
		name: "Content",
		path: "/dashboard/content",
		type: ACCOUNT_TYPE.TUTOR,
	},
];

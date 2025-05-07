import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import toast from "react-hot-toast";
import { getAllHomework } from "../../../../services/operations/homework.service";
import HomeworkCard from "./HomeworkCard";

function Homework() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [allHomework, setAllHomework] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedSub, setSelectedSub] = useState("all");

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await dispatch(getAllSubjects(token));
				if (response) {
					// console.log(response)
					setSubjects(response);
				}
			} catch (error) {
				console.error("Failed to fetch subjects:", error);
				toast.error(
					"Failed to fetch subjects. Please try again later."
				);
			}
		};

		fetchSubjects();
	}, [dispatch, token]);

	useEffect(() => {
		const fetchAllHomework = async () => {
			try {
				let response = await dispatch(getAllHomework(token));
				if (response) {
					if (selectedSub !== "all") {
						response = response.filter(
							(item) => item.subject._id === selectedSub
						);
					}
					// console.log(response);
					setAllHomework(response);
				}
			} catch (error) {
				console.error("Failed to fetch homework:", error);
				toast.error(
					"Failed to fetch homework. Please try again later."
				);
			}
		};
		fetchAllHomework();
	}, [dispatch, token, selectedSub]);

	return (
		<div>
			<div className="flex w-full justify-between pb-7 ">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Homework
				</h1>
				<select
					className="border h-fit mt-5 px-2 py-1 rounded-md border-slate-gray"
					name="subjects"
					id="subjects"
					onChange={(e) => setSelectedSub(e.target.value)}
				>
					<option value="all">All Subjects</option>
					{subjects &&
						subjects.map((sub) => (
							<option key={sub._id} value={sub._id}>
								{sub.name}
							</option>
						))}
				</select>
			</div>
			{allHomework.length === 0 ? (
				<div className="w-full flex items-center justify-center ">
					<p className="text-3xl text-medium-gray">
						No homework available
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{allHomework.map((item) => (
						<HomeworkCard key={item._id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

export default Homework;

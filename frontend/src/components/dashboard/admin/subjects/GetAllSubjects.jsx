import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function GetAllSubjects({ subjects, handleDelete, handleEdit }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{subjects.map((subject) => (
				<div
					key={subject._id}
					className="bg-white shadow shadow-slate-gray p-6 rounded-md hover:shadow-lg transition-all transform hover:scale-[1.02] animate-fade-in"
				>
					<h3 className="text-medium-gray text-xl font-semibold mb-2">
						{subject.name}
					</h3>
					<p className="text-gray-500 mb-4">
						Code: {subject.code}
					</p>
					<div className="flex gap-4 justify-end">
						<button
							onClick={() => handleEdit(subject)}
							className="p-2 text-medium-gray hover:text-charcoal-gray transition-all transform hover:scale-110"
						>
							<FaEdit size={20} />
						</button>
						<button
							onClick={() => handleDelete(subject._id)}
							className="p-2 text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
						>
							<FaTrash size={20} />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

export default GetAllSubjects;

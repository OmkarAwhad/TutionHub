import React, { useEffect, useState } from "react";
import { viewRemarks } from "../../../../services/operations/remarks.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Remarks() {
	const [remarks, setRemarks] = useState([]);
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRemarks = async () => {
			try {
				const data = await viewRemarks(token);
				setRemarks(data);
			} catch (error) {
				console.error("Error fetching remarks:", error);
			}
		};

		fetchRemarks();
	}, [token]);

	return (
		<div className="w-full p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-medium-gray logo-text font-extrabold text-4xl">
					Remarks
				</h2>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className="space-y-4">
				{remarks.length > 0 ? (
					remarks.map((remark, index) => (
						<div
							key={remark._id}
							className="shadow-xl shadow-medium-gray rounded-md p-4 hover:shadow-md transition-all duration-150 transform hover:scale-[101%] "
							style={{
								animationDelay: `${index * 0.1}s`,
							}}
						>
							<p className="text-medium-gray mb-2">
								<strong>Subject:</strong>{" "}
								<span className="text-charcoal-gray">
									{remark.subject.name}
								</span>
							</p>
							<p className="text-medium-gray mb-2">
								<strong>Remark:</strong>{" "}
								<span className="text-charcoal-gray">
									{remark.remark}
								</span>
							</p>
							<p className="text-medium-gray">
								<strong>Tutor:</strong>{" "}
								<span className="text-charcoal-gray">
									{remark.tutor.name}
								</span>
							</p>
							<div className="text-sm text-gray-500 mt-2">
								<span>
									{new Date(
										remark.createdAt
									).toLocaleDateString()}
								</span>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-medium-gray text-lg">
						No remarks available.
					</p>
				)}
			</div>
		</div>
	);
}

export default Remarks;

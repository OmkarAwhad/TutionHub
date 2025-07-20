import React from "react";
import { useNavigate } from "react-router-dom";

function Feedback() {
	const navigate = useNavigate();

	return (
		<div className="w-full p-6">
			<div className=" w-full h-[80vh] flex items-center justify-center gap-20">
				<button
					onClick={() =>
						navigate("/dashboard/feedback/submit-feedback")
					}
					className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
				>
					Submit a Feedback
				</button>
				<button
					onClick={() =>
						navigate("/dashboard/feedback/feedback-list")
					}
					className="bg-medium-gray px-20 py-14 text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%]"
				>
					View all Feedbacks
				</button>
			</div>
		</div>
	);
}

export default Feedback;

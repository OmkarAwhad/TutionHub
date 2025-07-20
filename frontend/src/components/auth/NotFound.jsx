import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center bg-light-gray">
			<div className="text-center p-8">
				<div className="mb-8">
					<h1 className="text-9xl font-bold text-charcoal-gray mb-4">
						404
					</h1>
					<h2 className="text-3xl font-semibold text-medium-gray mb-4">
						Page Not Found
					</h2>
					<p className="text-slate-gray text-lg mb-8">
						The page you're looking for doesn't exist or has
						been moved.
					</p>
				</div>

				<div className="flex gap-4 justify-center">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 px-6 py-3 bg-medium-gray text-white font-medium rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
					>
						<FaArrowLeft className="text-sm" />
						Go Back
					</button>

					<button
						onClick={() => navigate("/dashboard/my-profile")}
						className="flex items-center gap-2 px-6 py-3 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
					>
						<FaHome className="text-sm" />
						Go Home
					</button>
				</div>
			</div>
		</div>
	);
}

export default NotFound;

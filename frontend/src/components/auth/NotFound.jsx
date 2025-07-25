import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center bg-light-gray px-4">
			<div className="text-center p-4 sm:p-8">
				<div className="mb-8">
					<h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-charcoal-gray mb-4">
						404
					</h1>
					<h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-medium-gray mb-4">
						Page Not Found
					</h2>
					<p className="text-base sm:text-lg text-slate-gray mb-8">
						The page you're looking for doesn't exist or has
						been moved.
					</p>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row justify-center">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-medium-gray text-white font-medium rounded-lg hover:bg-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
						aria-label="Go Back"
					>
						<FaArrowLeft className="text-base" />
						Go Back
					</button>
					<button
						onClick={() => navigate("/dashboard/my-profile")}
						className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200 text-sm sm:text-base"
						aria-label="Go Home"
					>
						<FaHome className="text-base" />
						Go Home
					</button>
				</div>
			</div>
		</div>
	);
}

export default NotFound;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaEnvelope } from "react-icons/fa6";
import LogoNoBgBlack from "../../assets/logos/noBg_white.png";
import { forgetPassword } from "../../services/operations/auth.service";

function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		setLoading(true);
		try {
			const success = await dispatch(forgetPassword(data.email));
			if (success) {
				localStorage.setItem("resetEmail", data.email);
				navigate("/verify-otp");
			}
		} catch (error) {
			console.error("Error sending OTP:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-medium-gray flex logo-text text-slate-gray justify-center items-center px-4 py-8 relative">
			{/* Logo - Responsive positioning */}
			<img
				src={LogoNoBgBlack}
				className="h-12 sm:h-14 md:h-16 absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5"
				alt="Logo"
			/>

			{/* Main Container - Responsive width and padding */}
			<div className="bg-white shadow-xl shadow-slate-gray rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
				<Link
					to="/login"
					className="flex items-center gap-2 text-sm sm:text-base text-medium-gray hover:text-charcoal-gray transition-colors duration-200 mb-4 sm:mb-6"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back to Login</span>
				</Link>

				<h1 className="text-2xl font-extrabold text-medium-gray logo-text text-center mb-3 sm:mb-4 md:mb-6">
					Forgot Password
				</h1>

				{/* Form */}
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="space-y-4 sm:space-y-6"
				>
					{/* Email Input */}
					<div>
						<label className="block">
							<p className="flex items-center gap-2 text-sm sm:text-base text-medium-gray mb-2 px-1">
								Email Address
							</p>
							<input
								type="email"
								placeholder="Enter your email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								})}
								className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base outline-none border-2 border-gray-300 rounded-md focus:border-medium-gray transition-colors disabled:bg-gray-50"
								disabled={loading}
							/>
							{errors.email && (
								<p className="text-red-500 text-xs sm:text-sm mt-1 px-1">
									{errors.email.message}
								</p>
							)}
						</label>
					</div>

					{/* Submit Button */}
					<button
						className="w-full bg-medium-gray hover:bg-charcoal-gray transition-all duration-150 cursor-pointer text-white px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
								Sending OTP...
							</>
						) : (
							"Send OTP"
						)}
					</button>
				</form>

				{/* Footer Link */}
				<div className="text-center mt-4 sm:mt-6">
					<p className="text-xs sm:text-sm font-medium text-medium-gray">
						Remember your password?{" "}
						<Link
							to="/login"
							className="text-blue-500 hover:underline"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;

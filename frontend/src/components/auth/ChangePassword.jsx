import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import LogoNoBgBlack from "../../assets/logos/noBg_white.png";
import { changePassword } from "../../services/operations/auth.service";

function ChangePassword() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const resetToken = localStorage.getItem("resetToken");
	const password = watch("password");

	useEffect(() => {
		if (!resetToken) {
			toast.error(
				"Invalid access. Please start from forgot password."
			);
			navigate("/forgot-password");
		}
	}, []);

	const submitHandler = async (data) => {
		if (data.password !== data.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		setIsUpdating(true);

		try {
			const success = await dispatch(
				changePassword(resetToken, data.password)
			);
			if (success) {
				localStorage.removeItem("resetToken");
				toast.success(
					"Password changed successfully! Please login with your new password."
				);
				setTimeout(() => {
					navigate("/login");
				}, 100);
			}
		} catch (error) {
			console.error("Error changing password:", error);
			setIsUpdating(false);
		} finally {
			setLoading(false);
		}
	};

	// Password strength checker
	const getPasswordStrength = (password) => {
		if (!password) return { strength: 0, text: "", color: "" };

		let strength = 0;
		const checks = [
			password.length >= 8,
			/[a-z]/.test(password),
			/[A-Z]/.test(password),
			/[0-9]/.test(password),
			/[^A-Za-z0-9]/.test(password),
		];

		strength = checks.filter(Boolean).length;

		if (strength < 2)
			return { strength, text: "Weak", color: "text-red-500" };
		if (strength < 4)
			return { strength, text: "Medium", color: "text-yellow-500" };
		return { strength, text: "Strong", color: "text-green-500" };
	};

	const passwordStrength = getPasswordStrength(password);

	if (!resetToken && !isUpdating) {
		return null;
	}

	return (
		<div className="min-h-screen w-full bg-medium-gray flex logo-text text-slate-gray justify-center items-center px-4 py-8 relative">
			{/* Logo - Responsive */}
			<img
				src={LogoNoBgBlack}
				className="h-12 sm:h-14 md:h-16 absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5"
				alt="Logo"
			/>

			{/* Main Container */}
			<div className="bg-white shadow-xl shadow-slate-gray rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
				{/* Back Button */}
				<Link
					to="/verify-otp"
					className="flex items-center gap-2 text-sm sm:text-base text-medium-gray hover:text-charcoal-gray transition-colors duration-200 mb-4 sm:mb-6"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</Link>

				{/* Title */}
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-medium-gray logo-text text-center mb-4 sm:mb-6">
					Reset Password
				</h1>

				{/* Icon and Instructions */}
				<div className="text-center mb-6 sm:mb-8">
					<FaLock className="mx-auto text-3xl sm:text-4xl md:text-5xl text-medium-gray mb-3" />
					<p className="text-medium-gray text-xs sm:text-sm px-2">
						Create a new strong password for your account
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="space-y-4 sm:space-y-6"
				>
					{/* New Password */}
					<div>
						<label className="block">
							<p className="flex items-center gap-2 text-sm sm:text-base text-medium-gray mb-2 px-1">
								<FaLock className="text-xs sm:text-sm" />
								New Password
							</p>
							<div className="relative border-2 border-gray-300 rounded-md focus-within:border-medium-gray transition-colors">
								<input
									type={
										showPassword
											? "text"
											: "password"
									}
									placeholder="Enter new password"
									{...register("password", {
										required:
											"Password is required",
										minLength: {
											value: 8,
											message: "Password must be at least 8 characters",
										},
									})}
									className="w-full pr-12 pl-3 sm:pl-4 py-2 sm:py-3 text-sm sm:text-base outline-none rounded-md disabled:bg-gray-50"
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium-gray hover:text-charcoal-gray transition-colors"
								>
									{showPassword ? (
										<FaEyeSlash className="text-lg" />
									) : (
										<FaEye className="text-lg" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-red-500 text-xs sm:text-sm mt-1 px-1">
									{errors.password.message}
								</p>
							)}

							{/* Password Strength Indicator */}
							{password && (
								<div className="mt-2 px-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-xs text-medium-gray">
											Strength:
										</span>
										<span
											className={`text-xs font-medium ${passwordStrength.color}`}
										>
											{passwordStrength.text}
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
										<div
											className={`h-full rounded-full transition-all duration-300 ${
												passwordStrength.strength <
												2
													? "bg-red-500"
													: passwordStrength.strength <
													  4
													? "bg-yellow-500"
													: "bg-green-500"
											}`}
											style={{
												width: `${
													(passwordStrength.strength /
														5) *
													100
												}%`,
											}}
										></div>
									</div>
								</div>
							)}
						</label>
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block">
							<p className="flex items-center gap-2 text-sm sm:text-base text-medium-gray mb-2 px-1">
								<FaLock className="text-xs sm:text-sm" />
								Confirm Password
							</p>
							<div className="relative border-2 border-gray-300 rounded-md focus-within:border-medium-gray transition-colors">
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									placeholder="Confirm new password"
									{...register("confirmPassword", {
										required:
											"Please confirm your password",
										validate: (value) =>
											value === password ||
											"Passwords do not match",
									})}
									className="w-full pr-12 pl-3 sm:pl-4 py-2 sm:py-3 text-sm sm:text-base outline-none rounded-md disabled:bg-gray-50"
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium-gray hover:text-charcoal-gray transition-colors"
								>
									{showConfirmPassword ? (
										<FaEyeSlash className="text-lg" />
									) : (
										<FaEye className="text-lg" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-red-500 text-xs sm:text-sm mt-1 px-1">
									{errors.confirmPassword.message}
								</p>
							)}
						</label>
					</div>

					{/* Submit Button */}
					<button
						className="w-full bg-medium-gray hover:bg-charcoal-gray transition-all duration-150 cursor-pointer text-white px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 sm:mt-8"
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
								Updating Password...
							</>
						) : (
							"Update Password"
						)}
					</button>
				</form>

				{/* Footer Link */}
				<div className="text-center mt-6 sm:mt-8">
					<p className="text-xs sm:text-sm font-medium text-medium-gray">
						Remember your password?{" "}
						<Link
							to="/login"
							className="text-blue-500 hover:underline"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default ChangePassword;

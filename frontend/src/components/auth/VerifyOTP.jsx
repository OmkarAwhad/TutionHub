import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaShield } from "react-icons/fa6";
import LogoNoBgBlack from "../../assets/logos/noBg_white.png";
import {
	verifyOTP,
	forgetPassword,
} from "../../services/operations/auth.service";

function VerifyOTP() {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const inputRefs = useRef([]);

	const email = localStorage.getItem("resetEmail");

	useEffect(() => {
		if (!email) {
			toast.error("Please enter your email first");
			navigate("/forgot-password");
		}
	}, []);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer(timer - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	const handleChange = (element, index) => {
		if (isNaN(element.value)) return false;

		const newOtp = [...otp];
		newOtp[index] = element.value;
		setOtp(newOtp);

		if (element.nextSibling && element.value) {
			element.nextSibling.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			if (!otp[index] && index > 0) {
				inputRefs.current[index - 1].focus();
			}
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData("text");
		const pasteArray = pasteData.slice(0, 6).split("");

		const newOtp = [...otp];
		pasteArray.forEach((char, index) => {
			if (index < 6 && !isNaN(char)) {
				newOtp[index] = char;
			}
		});
		setOtp(newOtp);

		const nextEmptyIndex = newOtp.findIndex((val) => val === "");
		if (nextEmptyIndex !== -1) {
			inputRefs.current[nextEmptyIndex].focus();
		} else {
			inputRefs.current[5].focus();
		}
	};

	const submitHandler = async () => {
		const otpString = otp.join("");

		if (otpString.length !== 6) {
			toast.error("Please enter complete OTP");
			return;
		}

		setLoading(true);
		setIsVerifying(true);

		try {
			const resetToken = await dispatch(verifyOTP(email, otpString));
			if (resetToken) {
				localStorage.setItem("resetToken", resetToken);
				localStorage.removeItem("resetEmail");
				setTimeout(() => {
					navigate("/change-passsword");
				}, 100);
			}
		} catch (error) {
			console.error("Error verifying OTP:", error);
			setIsVerifying(false);
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		setResending(true);
		try {
			const success = await dispatch(forgetPassword(email));
			if (success) {
				setOtp(["", "", "", "", "", ""]);
				setTimer(60);
				setCanResend(false);
				inputRefs.current[0]?.focus();
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
		} finally {
			setResending(false);
		}
	};

	if (!email && !isVerifying) {
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
					to="/forgot-password"
					className="flex items-center gap-2 text-sm sm:text-base text-medium-gray hover:text-charcoal-gray transition-colors duration-200 mb-4 sm:mb-6"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</Link>

				{/* Title */}
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-medium-gray logo-text text-center mb-4 sm:mb-6">
					Verify OTP
				</h1>

				{/* Icon and Instructions */}
				<div className="text-center mb-6 sm:mb-8">
					<FaShield className="mx-auto text-3xl sm:text-4xl md:text-5xl text-medium-gray mb-3" />
					<p className="text-medium-gray text-xs sm:text-sm mb-2 px-2">
						Enter the 6-digit code sent to:
					</p>
					<p className="text-charcoal-gray font-semibold text-sm sm:text-base break-all px-2">
						{email || "your email"}
					</p>
				</div>

				<div className="space-y-6 sm:space-y-8">
					{/* OTP Input - Responsive grid */}
					<div className="flex justify-center gap-1 sm:gap-2 md:gap-3">
						{otp.map((data, index) => (
							<input
								key={index}
								ref={(el) =>
									(inputRefs.current[index] = el)
								}
								type="text"
								name="otp"
								maxLength="1"
								value={data}
								onChange={(e) =>
									handleChange(e.target, index)
								}
								onKeyDown={(e) =>
									handleKeyDown(e, index)
								}
								onPaste={
									index === 0
										? handlePaste
										: undefined
								}
								className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-md outline-none focus:border-medium-gray transition-colors disabled:bg-gray-50"
								disabled={loading}
							/>
						))}
					</div>

					{/* Verify Button */}
					<button
						onClick={submitHandler}
						className="w-full bg-medium-gray hover:bg-charcoal-gray transition-all duration-150 cursor-pointer text-white px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						disabled={loading || otp.join("").length !== 6}
					>
						{loading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
								Verifying...
							</>
						) : (
							"Verify OTP"
						)}
					</button>

					{/* Resend OTP */}
					<div className="text-center">
						{canResend ? (
							<button
								onClick={handleResendOTP}
								className="text-blue-500 hover:underline text-sm sm:text-base disabled:text-gray-400 disabled:no-underline transition-colors"
								disabled={resending}
							>
								{resending
									? "Resending..."
									: "Resend OTP"}
							</button>
						) : (
							<p className="text-medium-gray text-sm sm:text-base">
								Resend OTP in{" "}
								<span className="font-medium">
									{timer}s
								</span>
							</p>
						)}
					</div>
				</div>

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

export default VerifyOTP;

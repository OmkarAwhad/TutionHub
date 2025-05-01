import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import LogoNoBgBlack from "../assets/logos/noBg_white.png";
import { ACCOUNT_TYPE } from "../utils/constants.utils";
import Tab from "../components/auth/Tab";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setLoading } from "../slices/auth.slice";
import { login } from "../services/operations/auth.service";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
	} = useForm();

	const [passwordVisible, setPasswordVisible] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		dispatch(login(data, navigate));
	};

	return (
		<div className="w-full h-screen bg-medium-gray flex logo-text text-slate-gray justify-center items-center relative ">
			<img
				src={LogoNoBgBlack}
				className="h-16 absolute top-5 left-5 "
				alt=""
			/>
			<div className="bg-white pb-10 shadow-xl shadow-slate-gray p-4 rounded-md w-[90%] md:w-[30%] ">
				<h1 className="pb-5 pt-5 text-medium-gray logo-text text-center font-extrabold text-4xl ">
					Log in
				</h1>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="flex flex-col gap-4   "
				>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1  ">
							Email
						</p>
						<input
							type="email"
							placeholder="Enter email"
							{...register("email", { required: true })}
							className="px-4 py-2 w-full outline-none border-[2px] border-gray-300 rounded-md "
						/>
						{errors.email && (
							<p className="text-red-200 text-sm ml-2 ">
								Email is required
							</p>
						)}
					</label>
					<label>
						<p className="pl-2 text-base text-medium-gray pb-1  ">
							Password
						</p>
						<div className=" border-[2px] border-gray-300 rounded-md flex justify-between items-center ">
							<input
								type={
									passwordVisible
										? "text"
										: "password"
								}
								placeholder="******"
								{...register("password", {
									required: true,
								})}
								className="w-[90%] outline-none px-4 py-2 "
							/>
							<div
								onClick={() =>
									setPasswordVisible(
										!passwordVisible
									)
								}
								className="pr-4"
							>
								{passwordVisible ? (
									<FaEyeSlash />
								) : (
									<FaEye />
								)}
							</div>
						</div>
						{errors.password && (
							<p className="text-red-200 text-sm ml-2 ">
								Password is required
							</p>
						)}
					</label>
					<button
						className=" bg-medium-gray hover:bg-charcoal-gray transition-all duration-150 cursor-pointer text-white w-fit mx-auto px-4 py-2 rounded-sm"
						type="submit"
					>
						Log in
					</button>
				</form>
				<p className="font-sans text-xs font-medium text-center pt-3 ">
					Don't have an account?{" "}
					<Link to={"/signup"} className="text-blue-500">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}

export default LoginPage;

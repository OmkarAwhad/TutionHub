import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";
import { ACCOUNT_TYPE } from "../../../utils/constants.utils";
import { RiEdit2Fill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/operations/profile.service";

function MyProfile() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		phoneNumber: user?.profile?.phoneNumber || "",
		gender: user?.profile?.gender || "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name,
				phoneNumber: user?.profile?.phoneNumber || "",
				gender: user?.profile?.gender || "",
			});
		}
	}, [user]);

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(updateProfile(formData, token));
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile");
		}
	};

	// useEffect(() => {
	//    console.log("Current user state:", user);
	//    if (user && user.profile) {
	//       console.log("Profile data:", user.profile);
	//    }
	// }, [user]);

	return (
		<div className="w-full mx-auto flex flex-col gap-y-10 p-4">
			{/* Profile Details */}
			<div className="bg-white rounded-xl shadow-2xl shadow-medium-gray overflow-hidden transition-all duration-300 hover:shadow-xl ">
				{isEditing ? (
					<form
						onSubmit={handleFormSubmit}
						className="p-6 space-y-4"
					>
						<div className="space-y-2">
							<label className="block text-charcoal-gray text-sm font-medium">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter your name"
								className="w-full px-4 py-2 rounded-lg bg-light-gray text-charcoal-gray border border-slate-gray focus:outline-none focus:ring-2 focus:ring-medium-gray transition-all duration-200"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-charcoal-gray text-sm font-medium">
								Phone Number
							</label>
							<input
								type="number"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleInputChange}
								placeholder="Enter your phone number"
								className="w-full px-4 py-2 rounded-lg bg-light-gray text-charcoal-gray border border-slate-gray focus:outline-none focus:ring-2 focus:ring-medium-gray transition-all duration-200"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-charcoal-gray text-sm font-medium">
								Gender
							</label>
							<select
								name="gender"
								value={formData.gender}
								onChange={handleInputChange}
								className="w-full px-4 py-2 rounded-lg bg-light-gray text-charcoal-gray border border-slate-gray focus:outline-none focus:ring-2 focus:ring-medium-gray transition-all duration-200"
							>
								<option
									value=""
									disabled
									className="bg-light-gray"
								>
									Select Gender
								</option>
								<option
									value="Male"
									className="bg-light-gray"
								>
									Male
								</option>
								<option
									value="Female"
									className="bg-light-gray"
								>
									Female
								</option>
								<option
									value="Other"
									className="bg-light-gray"
								>
									Other
								</option>
							</select>
						</div>
						<div className="flex justify-end space-x-4 pt-4">
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="px-6 py-2 rounded-lg bg-slate-gray text-light-gray hover:bg-medium-gray transition-all duration-200"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2 rounded-lg bg-medium-gray text-light-gray hover:bg-charcoal-gray transition-all duration-200"
							>
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className="p-6">
						<div className="flex items-center space-x-6">
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-full bg-medium-gray flex items-center justify-center text-4xl text-light-gray">
									{user.role ===
										ACCOUNT_TYPE.STUDENT && (
										<PiStudentFill />
									)}
									{user.role ===
										ACCOUNT_TYPE.TUTOR && (
										<GiTeacher />
									)}
									{user.role ===
										ACCOUNT_TYPE.ADMIN && (
										<RiAdminLine />
									)}
								</div>
							</div>
							<div className="flex-grow">
								<div className="flex justify-between items-start">
									<div className="space-y-1">
										<h2 className="text-2xl font-semibold text-charcoal-gray">
											{user.name}
										</h2>
										<p className="text-slate-gray">
											{user.email}
										</p>
									</div>
									<button
										onClick={() =>
											setIsEditing(true)
										}
										className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-medium-gray text-light-gray hover:bg-charcoal-gray transition-all duration-200"
									>
										<span>Edit</span>
										<RiEdit2Fill />
									</button>
								</div>
								<div className="mt-4 grid grid-cols-2 gap-4">
									<div className="space-y-1">
										<p className="text-sm text-slate-gray">
											Phone Number
										</p>
										<p className="text-charcoal-gray">
											{user?.profile
												?.phoneNumber || (
												<span className="text-slate-gray text-sm">
													Not provided
												</span>
											)}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-sm text-slate-gray">
											Gender
										</p>
										<p className="text-charcoal-gray">
											{user?.profile
												?.gender || (
												<span className="text-slate-gray text-sm">
													Not specified
												</span>
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{user && user.role === ACCOUNT_TYPE.STUDENT && (
				<>
					<div className="bg-white rounded-xl py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-10 overflow-hidden transition-all duration-300  ">
						<NavLink
							to={"/dashboard/my-profile/attendance"}
							className=" bg-medium-gray min-w-[29%] px-20 py-14 text-white text-center font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
						>
							Attendance
						</NavLink>
						<NavLink
							to={"/dashboard/my-profile/progress"}
							className=" bg-medium-gray min-w-[29%] px-20 py-14 text-white text-center font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
						>
							Progress
						</NavLink>
						<NavLink
							to={"/dashboard/my-profile/remarks"}
							className=" bg-medium-gray min-w-[29%] px-20 py-14 text-white text-center font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
						>
							Remarks
						</NavLink>
					</div>

					<div>
						{/* Here the sections of the Attendance should get open */}
						<Outlet />
					</div>
				</>
			)}
		</div>
	);
}

export default MyProfile;

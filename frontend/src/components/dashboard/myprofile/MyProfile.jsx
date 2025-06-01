import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";
import { ACCOUNT_TYPE } from "../../../utils/constants.utils";
import { RiEdit2Fill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { updateProfile } from "../../../services/operations/profile.service";
import Modal from "../extras/Modal";
import { logout } from "../../../services/operations/auth.service";

function MyProfile() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);

	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || "",
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

	const handleDeleteClick = () => {
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			dispatch(logout(navigate));
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
	};

	return (
		<div className="w-full max-w-7xl mx-auto flex flex-col gap-y-12 p-6">
			{/* Profile Details */}
			<div className="bg-white rounded-2xl shadow-xl shadow-slate-gray/5 overflow-hidden transition-all duration-300 hover:shadow-xl ">
				{isEditing ? (
					<form
						onSubmit={handleFormSubmit}
						className="p-8 space-y-6 bg-gradient-to-b from-light-gray/20 to-white"
					>
						<div className="space-y-3">
							<label className="block text-charcoal-gray text-sm font-semibold tracking-wide">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter your name"
								className="w-full px-5 py-3 rounded-xl bg-light-gray/50 text-charcoal-gray border border-slate-gray/50 focus:outline-none focus:ring-2 focus:ring-medium-gray/50 transition-all duration-300"
							/>
						</div>
						<div className="space-y-3">
							<label className="block text-charcoal-gray text-sm font-semibold tracking-wide">
								Phone Number
							</label>
							<input
								type="number"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleInputChange}
								placeholder="Enter your phone number"
								className="w-full px-5 py-3 rounded-xl bg-light-gray/50 text-charcoal-gray border border-slate-gray/50 focus:outline-none focus:ring-2 focus:ring-medium-gray/50 transition-all duration-300"
							/>
						</div>
						<div className="space-y-3">
							<label className="block text-charcoal-gray text-sm font-semibold tracking-wide">
								Gender
							</label>
							<select
								name="gender"
								value={formData.gender}
								onChange={handleInputChange}
								className="w-full px-5 py-3 rounded-xl bg-light-gray/50 text-charcoal-gray border border-slate-gray/50 focus:outline-none focus:ring-2 focus:ring-medium-gray/50 transition-all duration-300"
							>
								<option value="" disabled>
									Select Gender
								</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</div>
						<div className="flex justify-end space-x-4 pt-6">
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="px-6 py-2.5 rounded-xl bg-slate-gray text-white font-medium hover:bg-medium-gray transition-all duration-300 hover:scale-105"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2.5 rounded-xl bg-medium-gray text-white font-medium hover:bg-charcoal-gray transition-all duration-300 hover:scale-105"
							>
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className="p-8 bg-gradient-to-b from-light-gray/20 to-white">
						<div className="flex items-center space-x-8">
							<div className="flex-shrink-0">
								<div className="w-24 h-24 rounded-full bg-medium-gray flex items-center justify-center text-5xl text-white shadow-md">
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
								<div className="flex items-center justify-between ">
									<div className="min-w-[60%] ">
										<div className="">
											<h2 className="text-3xl font-bold text-charcoal-gray tracking-tight">
												{user.name}
											</h2>
											<p className="text-slate-gray text-sm">
												{user.email}
											</p>
										</div>
										<div className="mt-6 grid grid-cols-2 gap-6">
											<div className="space-y-1">
												<p className="text-sm text-slate-gray font-medium">
													Phone Number
												</p>
												<p className="text-charcoal-gray font-semibold">
													{user?.profile
														?.phoneNumber || (
														<span className="text-slate-gray text-sm italic">
															Not
															provided
														</span>
													)}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-sm text-slate-gray font-medium">
													Gender
												</p>
												<p className="text-charcoal-gray font-semibold">
													{user?.profile
														?.gender || (
														<span className="text-slate-gray text-sm italic">
															Not
															specified
														</span>
													)}
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-col gap-y-7">
										<button
											onClick={() =>
												setIsEditing(true)
											}
											className="flex w-[8vw] items-center space-x-2 pl-8 cursor-pointer py-2.5 rounded-xl bg-medium-gray text-white font-medium hover:bg-charcoal-gray transition-all duration-300 hover:scale-105"
										>
											<span>Edit</span>
											<RiEdit2Fill />
										</button>
										<button
											onClick={() =>
												handleDeleteClick()
											}
											className="flex w-[8vw] items-center space-x-2 cursor-pointer px-5 py-2.5 rounded-xl bg-medium-gray text-white font-medium hover:bg-charcoal-gray transition-all duration-300 hover:scale-105"
										>
											<span>Logout</span>
											<MdLogout />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{user && user.role === ACCOUNT_TYPE.STUDENT && (
				<>
					<div className="bg-white rounded-2xl py-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8  transition-all duration-300 ">
						<NavLink
							to={"/dashboard/my-profile/attendance"}
							className="bg-medium-gray min-w-[30%] px-16 py-12 text-white text-center font-bold text-2xl rounded-xl hover:bg-charcoal-gray transition-all duration-300 hover:scale-105 hover:shadow-lg"
						>
							Attendance
						</NavLink>
						<NavLink
							to={"/dashboard/my-profile/progress"}
							className="bg-medium-gray min-w-[30%] px-16 py-12 text-white text-center font-bold text-2xl rounded-xl hover:bg-charcoal-gray transition-all duration-300 hover:scale-105 hover:shadow-lg"
						>
							Progress
						</NavLink>
						<NavLink
							to={"/dashboard/my-profile/remarks"}
							className="bg-medium-gray min-w-[30%] px-16 py-12 text-white text-center font-bold text-2xl rounded-xl hover:bg-charcoal-gray transition-all duration-300 hover:scale-105 hover:shadow-lg"
						>
							Remarks
						</NavLink>
					</div>

					<div>
						<Outlet />
					</div>
				</>
			)}

			{showDeleteModal && (
				<Modal
					title="Log out"
					description={`Are you sure you want to logout ?`}
					btn1={{
						text: "Log Out",
						onClick: handleDeleteConfirm,
					}}
					btn2={{
						text: "Cancel",
						onClick: handleDeleteCancel,
					}}
				/>
			)}
		</div>
	);
}

export default MyProfile;

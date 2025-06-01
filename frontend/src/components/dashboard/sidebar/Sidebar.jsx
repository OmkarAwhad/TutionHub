import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logos/noBg_white.png";
import { sidbarLinks as sidebarLinks } from "../../../data/sidebarLinks";
import { useDispatch, useSelector } from "react-redux";
import SidebarLinks from "./SidebarLinks";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyDetails } from "../../../services/operations/users.service";

function Sidebar() {
	const { user } = useSelector((state) => state.profile);
	const { token } = useSelector((state) => state.auth);

	const [announcementCount, setAnnouncementCount] = useState(0);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMyNotifications = async () => {
			try {
				const response = await dispatch(getMyDetails(token));
				if (response) {
					// console.log(response.announcement.length);
					setAnnouncementCount(response.announcement.length);
				}
			} catch (error) {
				toast.error("Error in fetching notifications");
				console.log(error);
			}
		};
		fetchMyNotifications();
	}, [dispatch, token]);

	return (
		<div className="fixed h-screen bg-medium-gray text-white w-[20%] flex flex-col justify-between">
			<div>
				<img src={Logo} className="h-16 pl-[23%] pt-3 " alt="" />
				<div className="h-[2px] w-[90%] mx-auto bg-slate-gray mt-3 "></div>
				<div className="w-full flex flex-col gap-2 pt-5 ">
					<SidebarLinks item={sidebarLinks[0]} />
					{user &&
						sidebarLinks.map((item) => {
							if (user.role === item.type) {
								return (
									<SidebarLinks
										key={item.id}
										item={item}
									/>
								);
							}
							return null;
						})}
				</div>
			</div>
			{user.role !== "Admin" && (
				<div className="flex justify-end pr-6 pb-6">
					<style>{`
						@keyframes wobble {
							0% { transform: rotate(0deg); }
							15% { transform: rotate(-12deg); }
							30% { transform: rotate(10deg); }
							45% { transform: rotate(-8deg); }
							60% { transform: rotate(6deg); }
							75% { transform: rotate(-4deg); }
							90% { transform: rotate(2deg); }
							100% { transform: rotate(0deg); }
						}
						.wobble-icon:hover .icon {
							animation: wobble 0.6s ease-in-out;
						}
					`}</style>
					<div
						onClick={() =>
							navigate("/dashboard/my-announcement")
						}
						className="p-4 bg-slate-gray hover:bg-charcoal-gray transition-all duration-150 border rounded-full relative cursor-pointer text-2xl font-extrabold flex items-center justify-center group wobble-icon"
					>
						<span className="absolute text-xs bg-white text-medium-gray w-6 h-6 flex items-center justify-center rounded-full -top-2 right-0">
							{announcementCount}
						</span>
						<span className="absolute text-xs bg-gray-300 text-medium-gray px-1 py-0.5 -left-25 rounded-md transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
							Announcements
						</span>
						<IoMdNotificationsOutline className="icon" />
					</div>
				</div>
			)}
		</div>
	);
}

export default Sidebar;

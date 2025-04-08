import React from "react";
import Logo from "../../../assets/logos/noBg_white2.png";
import { sidbarLinks as sidebarLinks } from "../../../data/sidebarLinks";
import { useSelector } from "react-redux";
import SidebarLinks from "./SidebarLinks";

function Sidebar() {
	const { user } = useSelector((state) => state.profile);

	return (
		<div className="fixed h-screen bg-medium-gray text-white w-[20%] ">
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
	);
}

export default Sidebar;

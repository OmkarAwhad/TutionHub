import React from "react";

function Tab({ tabData, role, setRole }) {
	return (
		<div className="flex ml-[20%] md:ml-[28%] bg-gray-300 p-1 gap-x-1  rounded-full max-w-max">
			{tabData.map((item) => (
				<button
					key={item.id}
					onClick={() => setRole(item.type)}
					className={`${role === item.type
							? "bg-slate-gray text-white "
							: "bg-transparent text-charcoal-gray "
						} py-2 px-5 rounded-full transition-all duration-200`}
				>
					{item?.tabName}
				</button>
			))}
		</div>
	);
}

export default Tab;

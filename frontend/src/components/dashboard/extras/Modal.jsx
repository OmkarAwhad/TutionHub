import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

function Modal({ title, description, btn1, btn2, onClose, type = "warning" }) {
	// Handle backdrop click to close modal
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	};

	// Get icon based on modal type
	const getIcon = () => {
		switch (type) {
			case "danger":
				return (
					<FaExclamationTriangle className="text-red-500 text-2xl" />
				);
			case "warning":
				return (
					<FaExclamationTriangle className="text-yellow-500 text-2xl" />
				);
			case "info":
				return (
					<FaExclamationTriangle className="text-blue-500 text-2xl" />
				);
			default:
				return (
					<FaExclamationTriangle className="text-yellow-500 text-2xl" />
				);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform animate-slideIn">
				{/* Header */}
				<div className="flex items-start justify-between mb-6">
					<div className="flex items-center gap-3">
						{getIcon()}
						<h2 className="text-xl font-bold text-charcoal-gray">
							{title}
						</h2>
					</div>

					{onClose && (
						<button
							onClick={onClose}
							className="text-slate-gray hover:text-charcoal-gray transition-colors duration-200 p-1"
						>
							<FaTimes className="text-lg" />
						</button>
					)}
				</div>

				{/* Content */}
				<div className="mb-8">
					<p className="text-medium-gray leading-relaxed text-sm">
						{description}
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<button
						onClick={btn1.onClick}
						className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
							btn1.className ||
							"bg-charcoal-gray text-white hover:bg-medium-gray"
						}`}
					>
						{btn1.text}
					</button>

					<button
						onClick={btn2.onClick}
						className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
							btn2.className ||
							"bg-light-gray text-charcoal-gray hover:bg-slate-gray hover:text-white"
						}`}
					>
						{btn2.text}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Modal;

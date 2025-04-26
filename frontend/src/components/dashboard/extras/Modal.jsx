import React from "react";
import "./Modal.css";

function Modal({ title, description, btn1, btn2, onClose }) {
	return (
		<div className="modal-overlay">
			<div className="modal-container">
				<div className="modal-content">
					<h2 className="modal-title">{title}</h2>
					<p className="modal-description">{description}</p>
					<div className="modal-buttons">
						<button
							className="modal-btn btn1"
							onClick={btn1.onClick}
						>
							{btn1.text}
						</button>
						<button
							className="modal-btn btn2"
							onClick={btn2.onClick}
						>
							{btn2.text}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;

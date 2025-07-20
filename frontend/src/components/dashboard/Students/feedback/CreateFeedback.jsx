import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { makeAFeedback } from "../../../../services/operations/feedback.service";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaPaperPlane } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";

function CreateFeedback() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		try {
			setIsSubmitting(true);
			const response = await dispatch(makeAFeedback(data, token));
			if (response) {
				toast.success("Feedback submitted successfully");
				reset();
				navigate(-1);
			}
		} catch (error) {
			toast.error("Failed to submit feedback");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaPaperPlane className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						Submit Feedback
					</h1>
				</div>

				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Form */}
			<div className="max-w-2xl mx-auto">
				<div className="bg-white p-6 rounded-lg shadow-md border border-light-gray">
					{/* <div className="mb-6">
						<div className="flex items-center gap-3 mb-4">
							<FaComment className="text-charcoal-gray text-xl" />
							<h2 className="text-xl font-semibold text-charcoal-gray">
								Share Your Thoughts
							</h2>
						</div>
						<p className="text-medium-gray">
							Your feedback helps us improve our services
							and your learning experience.
						</p>
					</div> */}

					<form
						onSubmit={handleSubmit(submitHandler)}
						className="space-y-4"
					>
						{/* Comment Field */}
						<div>
							<label className="block text-sm font-medium text-charcoal-gray mb-2">
								Your Feedback
							</label>
							<textarea
								placeholder="Please share your thoughts, suggestions, or report any issues..."
								{...register("comment", {
									required:
										"Feedback comment is required",
									minLength: {
										value: 10,
										message: "Feedback must be at least 10 characters long",
									},
								})}
								className={`w-full px-4 py-3 border rounded-lg text-charcoal-gray placeholder-slate-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200 min-h-[150px] resize-y ${
									errors.comment
										? "border-red-400 focus:border-red-400"
										: "border-light-gray"
								}`}
							/>
							{errors.comment && (
								<p className="text-red-500 text-sm mt-1">
									{errors.comment.message}
								</p>
							)}
						</div>

						{/* Anonymous Option */}
						<div className="flex items-start gap-3 p-4 bg-light-gray rounded-lg">
							<input
								type="checkbox"
								{...register("isAnonymous")}
								className="w-4 h-4 mt-1 text-charcoal-gray focus:ring-charcoal-gray border-slate-gray rounded"
							/>
							<div>
								<label className="text-sm font-medium text-charcoal-gray">
									Submit anonymously
								</label>
								<p className="text-xs text-slate-gray mt-1">
									Your name will not be associated
									with this feedback
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-4 pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${
									isSubmitting
										? "bg-light-gray text-slate-gray cursor-not-allowed"
										: "bg-charcoal-gray text-white hover:bg-medium-gray"
								}`}
							>
								<FaPaperPlane className="text-sm" />
								{isSubmitting
									? "Submitting..."
									: "Submit Feedback"}
							</button>

							<button
								type="button"
								onClick={() => navigate(-1)}
								className="px-6 py-3 bg-light-gray text-charcoal-gray font-medium rounded-lg hover:bg-slate-gray hover:text-white transition-colors duration-200"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>

				{/* Help Text */}
				<div className="mt-6 p-4 bg-light-gray rounded-lg">
					<h3 className="text-sm font-medium text-charcoal-gray mb-2">
						Guidelines:
					</h3>
					<ul className="text-sm text-slate-gray space-y-1">
						<li>• Be specific about issues or suggestions</li>
						<li>
							• Include relevant details to help us
							understand better
						</li>
						<li>
							• Choose anonymous submission if you prefer
							privacy
						</li>
						<li>
							• All feedback is reviewed and considered for
							improvements
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default CreateFeedback;

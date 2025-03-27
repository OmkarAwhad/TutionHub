class ApiError extends Error {
	constructor(
		statusCode,
		message = "Something went wrong",
		errors = [],
		stack = " "
	) {
		super(message); // Call the Error constructor
		this.statusCode = statusCode;
		this.data = null;
		this.message = message;
		this.success = false;
		this.errors = errors;
		this.stack = stack; // Include the stack trace if needed
	}

	toJSON() {
		// Custom serialization logic
		return {
			statusCode: this.statusCode,
			message: this.message,
			success: this.success,
			errors: this.errors,
			stack: this.stack,
		};
	}
}

module.exports = { ApiError };

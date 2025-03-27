const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose").connect();

app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

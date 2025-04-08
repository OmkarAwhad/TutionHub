import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import rootReducers from "./reducers/reducers.js";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
	reducer: rootReducers,
});

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<Provider store={store}>
		<BrowserRouter>
			<Toaster />
			<App />
		</BrowserRouter>
	</Provider>
	// </StrictMode>
);

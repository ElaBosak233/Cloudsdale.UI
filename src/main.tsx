import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { HashRouter as Router } from "react-router-dom";
import Banner from "@/utils/banner";
import "@/assets/main.scss";
import "@fontsource/jetbrains-mono";

Banner();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
);

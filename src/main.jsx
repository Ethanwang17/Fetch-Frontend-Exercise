import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "antd/dist/reset.css"; // Ant Design styles for v5
import "./styles/index.css";
import App from "./pages/App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);

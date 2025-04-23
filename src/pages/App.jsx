import {useState} from "react";
import "../styles/App.css";
import LoginPage from "./LoginPage";
import SearchPage from "./SearchPage";
import {Button, Layout, Typography} from "antd";
import {authAPI} from "../services/api";

const {Header} = Layout;
const {Title} = Typography;

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = async () => {
		try {
			await authAPI.logout();
			console.log("Logout successful");
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<div className="app-container">
			{!isAuthenticated ? (
				<LoginPage onLoginSuccess={handleLoginSuccess} />
			) : (
				<Layout className="search-page">
					<Header
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Title level={3} style={{color: "black", margin: 0}}>
							TESTING
						</Title>
						<Button onClick={handleLogout} type="primary" danger>
							Logout
						</Button>
					</Header>
					<SearchPage />
				</Layout>
			)}
		</div>
	);
}

export default App;

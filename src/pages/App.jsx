import {useState, useEffect} from "react";
import "../styles/App.css";
import LoginPage from "./LoginPage";
import SearchPage from "./SearchPage";
import {Button, Layout, Typography} from "antd";
import {authAPI} from "../services/api";

const {Header} = Layout;
const {Title} = Typography;

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const authStatus = await authAPI.checkAuth();
				setIsAuthenticated(!!authStatus);
			} catch (error) {
				console.log("Not authenticated:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = async () => {
		try {
			await authAPI.logout();
			console.log("Logout successful");
			setIsAuthenticated(false);
			window.location.reload();
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	if (isLoading) {
		return <div className="loading">Loading...</div>;
	}

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
							Dog Adoption Search
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

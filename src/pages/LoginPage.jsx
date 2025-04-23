import React, {useState} from "react";
import "../styles/LoginPage.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faUser} from "@fortawesome/free-solid-svg-icons";
import fetchLogo from "../assets/fetch logo.png";
import {authAPI} from "../services/api";

function LoginPage({onLoginSuccess}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!name || !email) {
			setError("Please enter both name and email.");
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			// Clear any existing cookies that might be interfering
			document.cookie.split(";").forEach(function (c) {
				document.cookie = c
					.replace(/^ +/, "")
					.replace(
						/=.*/,
						"=;expires=" + new Date().toUTCString() + ";path=/"
					);
			});

			await authAPI.login({name, email});

			// Force a small delay to ensure cookies are set
			setTimeout(() => {
				if (onLoginSuccess) {
					onLoginSuccess();
				}
				setIsLoading(false);
			}, 300);
		} catch (err) {
			console.error("Authentication error:", err);
			let errorMessage = "Authentication failed";

			if (err.status === 401) {
				errorMessage = "Invalid credentials. Please try again.";
			} else if (err.message) {
				errorMessage = `${errorMessage}: ${err.message}`;
			}

			setError(errorMessage);
			setIsLoading(false);
		}
	};

	return (
		<div className="login-page-container">
			<div className="login-card">
				<div className="card-icon-container">
					<img
						src={fetchLogo}
						alt="Fetch logo"
						className="fetch-logo"
					/>
				</div>
				<h2>Sign in</h2>
				<p className="subtitle">
					Thousands of dogs are waiting for someone like you. Sign in
					to start your journey toward adoption.
				</p>
				<form onSubmit={handleSubmit}>
					{error && <p className="error-message">{error}</p>}
					<div className="form-group input-group">
						<span className="icon input-icon">
							<FontAwesomeIcon icon={faUser} />
						</span>
						<input
							type="text"
							id="name"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="form-group input-group">
						<span className="icon input-icon">
							<FontAwesomeIcon icon={faEnvelope} />
						</span>
						<input
							type="email"
							id="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="submit-button"
						disabled={isLoading}
					>
						{isLoading ? "Signing in..." : "Get Started"}
					</button>

					{/* Cross-browser note */}
					<p className="browser-note">
						Note: For best experience, please allow cookies in your
						browser.
					</p>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;

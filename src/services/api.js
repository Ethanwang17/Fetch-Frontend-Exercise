const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const request = async (endpoint, options = {}) => {
	// Set default options for all requests
	const defaultOptions = {
		credentials: "include", // Include cookies for authentication
		headers: {
			"Content-Type": "application/json",
			// Add cache control to prevent caching issues across sessions
			"Cache-Control": "no-cache, no-store, must-revalidate",
			Pragma: "no-cache",
		},
		...options,
	};

	// stringify body if it's not already a string
	if (options.body && typeof options.body !== "string") {
		defaultOptions.body = JSON.stringify(options.body);
	}

	try {
		const response = await fetch(
			`${API_BASE_URL}${endpoint}`,
			defaultOptions
		);

		if (!response.ok) {
			const error = new Error(`API Error: ${response.status}`);
			error.status = response.status;

			// Handle authentication errors explicitly
			if (response.status === 401) {
				console.error("Authentication error - please log in again");
				// If this is a client-side navigation app, you might want to redirect to login
				// window.location.href = "/"; // Uncomment if you want automatic redirect
			}

			throw error;
		}

		if (response.status === 204) {
			return null;
		}

		// Check if response has content before parsing JSON
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			// Parse JSON response
			const data = await response.json();
			return data;
		} else {
			// For non-JSON responses, just return the response text or null
			return response.text ? await response.text() : null;
		}
	} catch (error) {
		console.error(`Error in API request to ${endpoint}:`, error);
		throw error;
	}
};

// Authentication endpoints
export const authAPI = {
	login: (userData) =>
		request("/auth/login", {
			method: "POST",
			body: userData,
		}),

	logout: () =>
		request("/auth/logout", {
			method: "POST",
		}),

	// Check if the user is already authenticated
	checkAuth: () =>
		request("/auth/check", {
			method: "GET",
		}).catch((error) => {
			// Silently handle auth check errors
			console.log("Auth check failed:", error);
			return false;
		}),
};

// Dogs endpoints
export const dogsAPI = {
	getBreeds: () => request("/dogs/breeds"),

	searchDogs: (params) => {
		const queryString = new URLSearchParams(params).toString();
		return request(`/dogs/search?${queryString}`);
	},

	getDogsByIds: (dogIds) =>
		request("/dogs", {
			method: "POST",
			body: dogIds,
		}),

	generateMatch: (favoriteIds) =>
		request("/dogs/match", {
			method: "POST",
			body: favoriteIds,
		}),
};

export default {
	auth: authAPI,
	dogs: dogsAPI,
};

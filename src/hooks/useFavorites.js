import {useState, useEffect, useCallback} from "react";
import {dogsAPI} from "../services/api";
import {notification} from "antd";

/**
 * Custom hook for managing dog favorites
 * @param {Object} options - Hook options
 * @param {Array} options.initialFavorites - Initial favorite dog IDs
 * @param {Array} options.availableDogs - Dogs that are already loaded and available
 * @returns {Object} Favorites state and functions
 */
const useFavorites = ({initialFavorites = [], availableDogs = []} = {}) => {
	const [favorites, setFavorites] = useState(initialFavorites);
	const [favoriteDogs, setFavoriteDogs] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [matchResult, setMatchResult] = useState(null);
	const [matchLoading, setMatchLoading] = useState(false);

	/**
	 * Toggle a dog in favorites
	 * @param {string} dogId - The dog ID to toggle
	 */
	const toggleFavorite = useCallback((dogId) => {
		setFavorites((prev) => {
			if (prev.includes(dogId)) {
				return prev.filter((id) => id !== dogId);
			} else {
				return [...prev, dogId];
			}
		});
	}, []);

	/**
	 * Check if a dog is in favorites
	 * @param {string} dogId - The dog ID to check
	 * @returns {boolean} Whether the dog is in favorites
	 */
	const isFavorite = useCallback(
		(dogId) => {
			return favorites.includes(dogId);
		},
		[favorites]
	);

	/**
	 * Clear all favorites
	 */
	const clearFavorites = useCallback(() => {
		setFavorites([]);
		notification.success({
			message: "Favorites cleared",
			description: "All favorites have been cleared.",
		});
	}, []);

	/**
	 * Generate a match from favorites
	 */
	const generateMatch = useCallback(async () => {
		if (favorites.length === 0) {
			notification.warning({
				message: "No favorites selected",
				description:
					"Please select at least one dog as favorite before generating a match.",
			});
			return;
		}

		setMatchLoading(true);
		try {
			const data = await dogsAPI.generateMatch(favorites);

			// Find the matched dog from our favoriteDogs list or fetch it
			let matchedDog = favoriteDogs.find((dog) => dog.id === data.match);

			if (!matchedDog) {
				const dogData = await dogsAPI.getDogsByIds([data.match]);
				matchedDog = dogData[0];
			}

			setMatchResult(matchedDog);

			notification.success({
				message: "Match found!",
				description: `You've been matched with ${matchedDog.name}!`,
				style: {borderLeft: "4px solid #6a5acd"},
			});
		} catch (error) {
			console.error("Error generating match:", error);
			notification.error({
				message: "Error",
				description: "Failed to generate a match. Please try again.",
			});
		} finally {
			setMatchLoading(false);
		}
	}, [favorites, favoriteDogs]);

	// Fetch favorites when they change
	useEffect(() => {
		const fetchFavoriteDogs = async () => {
			if (favorites.length === 0) {
				setFavoriteDogs([]);
				return;
			}

			setIsLoading(true);
			try {
				// Find which favorited dogs are not in our current available dogs list
				const missingDogIds = favorites.filter(
					(id) => !availableDogs.some((dog) => dog.id === id)
				);

				if (missingDogIds.length > 0) {
					// Fetch the missing dogs
					const missingDogs = await dogsAPI.getDogsByIds(
						missingDogIds
					);

					// Combine existing dogs with the newly fetched ones
					const currentDogs = availableDogs.filter((dog) =>
						favorites.includes(dog.id)
					);
					setFavoriteDogs([...currentDogs, ...missingDogs]);
				} else {
					// All favorited dogs are already in our available dogs list
					setFavoriteDogs(
						availableDogs.filter((dog) =>
							favorites.includes(dog.id)
						)
					);
				}
			} catch (error) {
				console.error("Error fetching favorite dogs:", error);
				notification.error({
					message: "Error",
					description:
						"Failed to fetch your favorite dogs. Please try again.",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchFavoriteDogs();
	}, [favorites, availableDogs]);

	return {
		favorites,
		setFavorites,
		favoriteDogs,
		isLoading,
		toggleFavorite,
		isFavorite,
		clearFavorites,
		generateMatch,
		matchResult,
		setMatchResult,
		matchLoading,
	};
};

export default useFavorites;

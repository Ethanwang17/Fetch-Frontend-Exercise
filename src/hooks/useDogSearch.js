import {useState, useEffect, useCallback} from "react";
import {dogsAPI} from "../services/api";
import {notification} from "antd";

/**
 * Custom hook for handling dog search functionality
 * @param {Object} options - Hook options
 * @param {number} options.pageSize - Number of items per page
 * @returns {Object} Search state and functions
 */
const useDogSearch = ({pageSize = 20} = {}) => {
	const [loading, setLoading] = useState(false);
	const [breeds, setBreeds] = useState([]);
	const [selectedBreeds, setSelectedBreeds] = useState([]);
	const [sortOrder, setSortOrder] = useState("breed:asc");
	const [dogs, setDogs] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);

	/**
	 * Fetch all available dog breeds
	 */
	const fetchBreeds = useCallback(async () => {
		try {
			const data = await dogsAPI.getBreeds();
			setBreeds(data);
		} catch (error) {
			console.error("Error fetching breeds:", error);
			notification.error({
				message: "Error",
				description: "Failed to fetch dog breeds. Please try again.",
			});
		}
	}, []);

	/**
	 * Fetch dogs based on current filters and pagination
	 */
	const fetchDogs = useCallback(async () => {
		setLoading(true);
		try {
			// Construct query params
			const params = {};

			if (selectedBreeds.length > 0) {
				params.breeds = selectedBreeds;
			}

			params.size = pageSize.toString();
			params.sort = sortOrder;

			// Calculate from parameter based on current page
			const from = (currentPage - 1) * pageSize;
			if (from > 0) {
				params.from = from.toString();
			}

			// Make the search request
			const searchData = await dogsAPI.searchDogs(params);
			setTotal(searchData.total);

			// Fetch actual dog details using the IDs
			if (searchData.resultIds.length > 0) {
				const dogsData = await dogsAPI.getDogsByIds(
					searchData.resultIds
				);
				setDogs(dogsData);
			} else {
				setDogs([]);
			}
		} catch (error) {
			console.error("Error fetching dogs:", error);
			notification.error({
				message: "Error",
				description: "Failed to fetch dogs. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	}, [selectedBreeds, sortOrder, currentPage, pageSize]);

	/**
	 * Change the active page
	 * @param {number} page - The page number to change to
	 */
	const handlePageChange = useCallback((page) => {
		setCurrentPage(page);
	}, []);

	/**
	 * Update the breed filter
	 * @param {Array} breeds - Array of selected breeds
	 */
	const updateBreedFilter = useCallback((breeds) => {
		setSelectedBreeds(breeds);
		setCurrentPage(1); // Reset to first page on filter change
	}, []);

	/**
	 * Update the sort order
	 * @param {string} order - The sort order to use
	 */
	const updateSortOrder = useCallback((order) => {
		setSortOrder(order);
		setCurrentPage(1); // Reset to first page on sort change
	}, []);

	// Fetch breeds on component mount
	useEffect(() => {
		fetchBreeds();
	}, [fetchBreeds]);

	// Fetch dogs whenever filters or pagination changes
	useEffect(() => {
		fetchDogs();
	}, [fetchDogs]);

	return {
		loading,
		breeds,
		selectedBreeds,
		setSelectedBreeds: updateBreedFilter,
		sortOrder,
		setSortOrder: updateSortOrder,
		dogs,
		currentPage,
		setCurrentPage: handlePageChange,
		total,
		pageSize,
		refreshDogs: fetchDogs,
		refreshBreeds: fetchBreeds,
	};
};

export default useDogSearch;

import {Typography, Select, Button, Space, notification} from "antd";
import "../styles/SearchPageFilters.css";

const {Title} = Typography;
const {Option} = Select;

const SearchPageFilters = ({
	breeds,
	selectedBreeds,
	setSelectedBreeds,
	sortOrder,
	setSortOrder,
	favorites,
	setFavorites,
	navigateToFavorites,
	setCurrentPage,
}) => {
	// Handle breed selection change
	const handleBreedChange = (value) => {
		setSelectedBreeds(value);
		setCurrentPage(1); // Reset to first page on filter change
	};

	// Handle sort order change
	const handleSortChange = (value) => {
		setSortOrder(value);
		setCurrentPage(1); // Reset to first page on sort change
	};

	return (
		<div className="search-controls">
			<Title level={4}>Filters</Title>
			<Space direction="vertical" size="middle" style={{width: "100%"}}>
				<div>
					<Title level={5}>Sort:</Title>
					<Select
						value={sortOrder}
						onChange={handleSortChange}
						style={{width: "100%"}}
					>
						<Option value="breed:asc">Breeds A-Z</Option>
						<Option value="breed:desc">Breeds Z-A</Option>
					</Select>
				</div>

				<div>
					<Title level={5}>Filter by Breed:</Title>
					<Select
						mode="multiple"
						placeholder="Select breeds"
						value={selectedBreeds}
						onChange={handleBreedChange}
						style={{width: "100%"}}
						maxTagCount={3}
					>
						{breeds.map((breed) => (
							<Option key={breed} value={breed}>
								{breed}
							</Option>
						))}
					</Select>
				</div>

				<div className="favorites-actions">
					<Space direction="vertical" style={{width: "100%"}}>
						<Button
							type="primary"
							onClick={navigateToFavorites}
							style={{width: "100%"}}
						>
							{favorites.length > 0
								? `View ${favorites.length} Favorites`
								: "View Favorites"}
						</Button>
					</Space>
				</div>
			</Space>
		</div>
	);
};

export default SearchPageFilters;

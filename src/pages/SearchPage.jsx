import {useState} from "react";
import {
	Layout,
	Typography,
	Card,
	Row,
	Col,
	Pagination,
	Space,
	Tag,
	Spin,
	Empty,
	notification,
	Button,
} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as regularHeart} from "@fortawesome/free-regular-svg-icons";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import "../styles/SearchPage.css";
import SearchPageFilters from "../components/SearchPageFilters";
import FavoritesPage from "./FavoritesPage";
import useDogSearch from "../hooks/useDogSearch";
import useFavorites from "../hooks/useFavorites";

const {Content} = Layout;
const {Title, Text} = Typography;

const SearchPage = () => {
	const {
		loading,
		breeds,
		selectedBreeds,
		setSelectedBreeds,
		sortOrder,
		setSortOrder,
		dogs,
		currentPage,
		setCurrentPage,
		total,
		pageSize,
	} = useDogSearch();

	const {favorites, setFavorites, toggleFavorite, isFavorite} = useFavorites({
		availableDogs: dogs,
	});

	const [showFavoritesPage, setShowFavoritesPage] = useState(false);

	const navigateToFavorites = () => {
		setShowFavoritesPage(true);
	};

	const navigateToSearch = () => {
		setShowFavoritesPage(false);
	};

	if (showFavoritesPage) {
		return (
			<FavoritesPage
				favorites={favorites}
				setFavorites={setFavorites}
				dogs={dogs}
				navigate={navigateToSearch}
			/>
		);
	}

	return (
		<Content className="search-content">
			<Row className="main-layout" gutter={[24, 24]}>
				{/* Filters - Left Side */}
				<Col xs={24} md={8} lg={6} className="filters-column">
					<SearchPageFilters
						breeds={breeds}
						selectedBreeds={selectedBreeds}
						setSelectedBreeds={setSelectedBreeds}
						sortOrder={sortOrder}
						setSortOrder={setSortOrder}
						favorites={favorites}
						setFavorites={setFavorites}
						navigateToFavorites={navigateToFavorites}
						setCurrentPage={setCurrentPage}
					/>
				</Col>

				{/* Main Content */}
				<Col xs={24} md={16} lg={18} className="content-column">
					<Space
						direction="vertical"
						size="large"
						style={{width: "100%"}}
					>
						{/* Dogs list */}
						{loading ? (
							<div className="loading-container">
								<Spin size="large" />
							</div>
						) : dogs.length > 0 ? (
							<>
								<Row gutter={[16, 16]}>
									{dogs.map((dog) => (
										<Col
											xs={24}
											sm={12}
											md={8}
											lg={6}
											key={dog.id}
										>
											<Card
												hoverable
												cover={
													<div className="image-container">
														<img
															alt={dog.name}
															src={dog.img}
															className="dog-image"
														/>
														<div
															className="heart-icon"
															onClick={(e) => {
																e.stopPropagation();
																toggleFavorite(
																	dog.id
																);
															}}
														>
															<FontAwesomeIcon
																icon={
																	isFavorite(
																		dog.id
																	)
																		? solidHeart
																		: regularHeart
																}
																color={
																	isFavorite(
																		dog.id
																	)
																		? "#ff6b6b"
																		: "#ffffff"
																}
																size="lg"
															/>
														</div>
													</div>
												}
												className={
													isFavorite(dog.id)
														? "dog-card favorite-card"
														: "dog-card"
												}
											>
												<Card.Meta
													title={
														<span
															style={{
																color: "#6a5acd",
															}}
														>
															{dog.name}
														</span>
													}
													description={
														<>
															<p>
																<Tag className="info-tag age-tag">
																	{dog.age ===
																	0
																		? "<1 year"
																		: dog.age ===
																		  1
																		? "1 year"
																		: `${dog.age} years`}
																</Tag>
																<Tag className="info-tag">
																	{dog.breed}
																</Tag>
																<Tag className="info-tag">
																	<FontAwesomeIcon
																		icon={
																			faLocationDot
																		}
																		style={{
																			color: "#ff6b6b",
																		}}
																	/>{" "}
																	{
																		dog.zip_code
																	}
																</Tag>
															</p>
														</>
													}
												/>
											</Card>
										</Col>
									))}
								</Row>

								{/* Pagination */}
								<div className="pagination-container">
									<Pagination
										current={currentPage}
										total={total}
										pageSize={pageSize}
										onChange={setCurrentPage}
										showSizeChanger={false}
									/>
								</div>
							</>
						) : (
							<Empty
								description="No dogs found matching your criteria"
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							/>
						)}
					</Space>
				</Col>
			</Row>
		</Content>
	);
};

export default SearchPage;

import React from "react";
import {
	Layout,
	Typography,
	Card,
	Row,
	Col,
	Button,
	Space,
	Tag,
	Empty,
	Spin,
} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {ArrowLeftOutlined} from "@ant-design/icons";
import "../styles/FavoritesPage.css";
import useFavorites from "../hooks/useFavorites";

const {Content} = Layout;
const {Title, Text} = Typography;

const FavoritesPage = ({favorites, setFavorites, dogs, navigate}) => {
	// Use the favorites hook to manage favorites functionality
	const {
		favoriteDogs,
		isLoading,
		generateMatch,
		matchResult,
		setMatchResult,
		matchLoading,
		clearFavorites,
	} = useFavorites({
		initialFavorites: favorites,
		availableDogs: dogs,
	});

	const goBackToSearch = () => {
		navigate("/");
	};

	return (
		<Content className="favorites-content">
			<Button
				type="text"
				icon={<ArrowLeftOutlined />}
				onClick={goBackToSearch}
				className="back-button"
			>
				Back to Search
			</Button>

			<Title level={2} className="favorites-title">
				Your Favorite Dogs
			</Title>

			<div className="favorites-actions">
				<Button
					type="primary"
					onClick={generateMatch}
					disabled={favorites.length === 0 || matchLoading}
					loading={matchLoading}
					size="large"
					className="match-button"
				>
					Match with a Dog
				</Button>
				{favorites.length > 0 && (
					<Button
						onClick={() => {
							clearFavorites();
							setFavorites([]);
						}}
						size="large"
						className="clear-button"
						danger
					>
						Clear Favorites
					</Button>
				)}
			</div>

			{/* Match Result */}
			{matchResult && (
				<div className="match-result">
					<Title level={3} className="match-title">
						Your Match: {matchResult.name}!
					</Title>
					<Card className="match-card">
						<Row gutter={16}>
							<Col xs={24} md={8}>
								<img
									src={matchResult.img}
									alt={matchResult.name}
									className="match-image"
								/>
							</Col>
							<Col xs={24} md={16}>
								<div className="match-info">
									<p>
										<Tag className="info-tag age-tag">
											{matchResult.age === 0
												? "<1 year"
												: matchResult.age === 1
												? "1 year"
												: `${matchResult.age} years`}
										</Tag>
										<Tag className="info-tag">
											{matchResult.breed}
										</Tag>
									</p>
									<p>
										<Tag className="info-tag">
											<strong>
												<FontAwesomeIcon
													icon={faLocationDot}
													style={{
														color: "#ff6b6b",
													}}
												/>{" "}
											</strong>{" "}
											{matchResult.zip_code}
										</Tag>
									</p>
								</div>
							</Col>
						</Row>
					</Card>
				</div>
			)}

			{/* Favorites List */}
			{isLoading || matchLoading ? (
				<div className="loading-container">
					<Spin size="large" />
				</div>
			) : favoriteDogs.length > 0 ? (
				<div className="favorites-list">
					<Row gutter={[16, 16]}>
						{favoriteDogs.map((dog) => (
							<Col key={dog.id}>
								<Card
									hoverable
									cover={
										<div className="image-container">
											<img
												alt={dog.name}
												src={dog.img}
												className="dog-image"
											/>
											<div className="heart-icon">
												<FontAwesomeIcon
													icon={solidHeart}
													color="#ff6b6b"
													size="lg"
												/>
											</div>
										</div>
									}
									className="dog-card favorite-card"
								>
									<Card.Meta
										title={
											<span style={{color: "#6a5acd"}}>
												{dog.name}
											</span>
										}
										description={
											<>
												<p>
													<Tag className="info-tag age-tag">
														{dog.age === 0
															? "<1 year"
															: dog.age === 1
															? "1 year"
															: `${dog.age} years`}
													</Tag>
													<Tag className="info-tag">
														{dog.breed}
													</Tag>
													<Tag className="info-tag">
														<FontAwesomeIcon
															icon={faLocationDot}
															style={{
																color: "#ff6b6b",
															}}
														/>{" "}
														{dog.zip_code}
													</Tag>
												</p>
											</>
										}
									/>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			) : (
				<Empty
					description="You haven't added any favorites yet"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			)}
		</Content>
	);
};

export default FavoritesPage;

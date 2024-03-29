import { useGameApi } from "@/api/game";
import ChallengeDialog from "@/components/modals/ChallengeDialog";
import Loading from "@/components/ui/Loading";
import ChallengeCard from "@/components/widgets/ChallengeCard";
import { useChallengeStore } from "@/store/challenge";
import { useGameStore } from "@/store/game";
import { useSnackBarStore } from "@/store/snackBar";
import { useTeamStore } from "@/store/team";
import { Category } from "@/types/category";
import { Challenge } from "@/types/challenge";
import { Game } from "@/types/game";
import { Team } from "@/types/team";
import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	Dialog,
	Divider,
	Grid,
	Paper,
	Icon,
	Tab,
	Tabs,
	Typography,
	tabsClasses,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import CryptoJS from "crypto-js";
import { formatUnixTimestamp } from "@/utils/datetime";

export default function Page() {
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const teamStore = useTeamStore();
	const gameStore = useGameStore();
	const navigate = useNavigate();

	const [game, setGame] = useState<Game>();
	const [team, setTeam] = useState<Team>();
	const [categories, setCategories] = useState<Record<number, Category>>({});
	const [selectedCategory, setSelectedCategory] = useState<number>(0);
	const [challenges, setChallenges] = useState<Array<Challenge>>();

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge>();

	const [progress, setProgress] = useState<number>(0);

	function getGame() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	function getTeam() {
		gameApi
			.getGameTeamByID({
				game_id: game?.id,
				team_id: teamStore?.selectedTeamID as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					if (r.data && teamStore.selectedTeamID !== 0) {
						setTeam(r.data);
						gameStore.setSelectedGameID(game?.id as number);
					} else {
						navigate(`/games/${game?.id}`);
						snackBarStore.error("你没有参赛权限");
					}
				}
			});
	}

	function getChallenges() {
		gameApi
			.getGameChallenges({
				game_id: game?.id,
				is_enabled: true,
				team_id: teamStore?.selectedTeamID!,
				submission_qty: 3,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setChallenges(r.data);
				}
			});
	}

	useEffect(() => {
		getGame();
	}, []);

	useEffect(() => {
		if (game) {
			getChallenges();
			setProgress(
				((Math.floor(Date.now() / 1000) -
					(game?.started_at as number)) /
					((game?.ended_at as number) -
						(game?.started_at as number))) *
					100
			);
		}
	}, [game, challengeStore.refresh]);

	useEffect(() => {
		if (game && progress) {
			if (progress >= 100) {
				snackBarStore.error("比赛已结束");
				navigate(`/games/${game?.id}`);
			}
			if (progress <= 0) {
				snackBarStore.error("比赛尚未开始");
				navigate(`/games/${game?.id}`);
			}
		}
	}, [game, progress]);

	useEffect(() => {
		if (challenges) {
			challenges.forEach((challenge) => {
				if (
					!(categories as Record<number, Category>)[
						challenge?.category_id as number
					]
				) {
					setCategories((categories) => {
						return {
							...categories,
							[challenge?.category_id as number]:
								challenge?.category as Category,
						};
					});
				}
			});
		}
	}, [challenges]);

	useEffect(() => {
		if (game) {
			getTeam();
		}
	}, [game]);

	useEffect(() => {
		document.title = `题目 - ${game?.title}`;
	}, [game]);

	return (
		<>
			{!game && <Loading />}
			<Box sx={{ marginTop: "2rem", marginX: "3.5%" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography
						sx={{
							marginX: "0.5rem",
							fontSize: "2rem",
							fontWeight: "bold",
							fontFamily: "sans-serif",
						}}
						color={"text.primary"}
					>
						{game?.title}
					</Typography>
					<Box>
						<Button
							disableElevation
							variant="contained"
							size="large"
							sx={{
								marginX: "0.5rem",
								fontWeight: "bold",
							}}
							startIcon={<Icon>flag</Icon>}
						>
							比赛题目
						</Button>
						<Button
							disableElevation
							variant="outlined"
							size="large"
							sx={{
								marginX: "0.5rem",
								fontWeight: "bold",
							}}
							startIcon={<Icon>trending_up</Icon>}
							onClick={() => {
								navigate(`/games/${id}/scoreboard`);
							}}
						>
							积分总榜
						</Button>
					</Box>
				</Box>
				<Box sx={{ marginY: "2rem" }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								width: "10%",
								display: "flex",
								flexDirection: "column",
							}}
						>
							{game?.is_need_write_up && (
								<>
									<Button
										variant="contained"
										disableElevation
										startIcon={<Icon>cloud_upload</Icon>}
									>
										上传题解
									</Button>
									<Divider sx={{ marginY: "1rem" }} />
								</>
							)}
							<Button
								variant="contained"
								size="large"
								disableElevation
								color="primary"
								startIcon={<Icon>extension</Icon>}
								sx={{
									bgcolor:
										selectedCategory === 0
											? "#0d47a1"
											: "transparent",
									color:
										selectedCategory === 0
											? "white"
											: "#0d47a1",
									"&:hover": {
										bgcolor: "#0d47a1",
										color: "white",
									},
									marginY: "0.25rem",
								}}
								onClick={() => {
									setSelectedCategory(0);
								}}
							>
								All
							</Button>
							{Object.entries(categories)?.map(
								([_, category]) => (
									<Button
										key={category?.id}
										variant="contained"
										size="large"
										disableElevation
										startIcon={
											<Icon>{category?.icon}</Icon>
										}
										sx={{
											bgcolor:
												selectedCategory === category.id
													? category?.color
													: "transparent",
											color:
												selectedCategory === category.id
													? "white"
													: category?.color,
											"&:hover": {
												bgcolor: category?.color,
												color: "white",
											},
											marginY: "0.25rem",
										}}
										onClick={() => {
											setSelectedCategory(
												category?.id as number
											);
										}}
									>
										{category?.name}
									</Button>
								)
							)}
						</Box>
						<Box
							sx={{
								width: "70%",
								height: "80vh",
								paddingBottom: "1rem",
								paddingX: "1rem",
								overflowY: "auto",
								overflowX: "hidden",
							}}
						>
							<Grid
								container
								spacing={{ xs: 2, md: 3 }}
								columns={{
									xs: 4,
									sm: 4,
									md: 8,
									lg: 12,
									xl: 12,
								}}
							>
								{challenges?.map((challenge) => {
									if (
										challenge?.category_id ===
											selectedCategory ||
										selectedCategory === 0
									) {
										return (
											<Grid
												item
												xs={4}
												sm={4}
												md={4}
												lg={4}
												xl={3}
												key={challenge?.id}
											>
												<ButtonBase
													component="span"
													onClick={() => {
														setSelectedChallenge(
															challenge
														);
														setDialogOpen(true);
													}}
												>
													<ChallengeCard
														challenge={challenge}
													/>
												</ButtonBase>
											</Grid>
										);
									}
								})}
							</Grid>
						</Box>
						<Box
							sx={{
								width: "18%",
							}}
						>
							<Paper
								sx={{
									padding: "1.5rem",
									minHeight: "12.5rem",
								}}
							>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Avatar
										src={`https://cravatar.cn/avatar/${CryptoJS.MD5(team?.email || "").toString()}`}
										sx={{
											width: "3.5rem",
											height: "3.5rem",
										}}
									/>
									<Typography
										sx={{
											marginX: "0.5rem",
											fontSize: "1.375rem",
											fontWeight: "bold",
										}}
									>
										{team?.name}
									</Typography>
								</Box>
								<Box
									className={"no-select"}
									sx={{
										display: "flex",
										justifyContent: "space-evenly",
										marginY: "1rem",
									}}
								>
									<Box sx={{ textAlign: "center" }}>
										<Box sx={{ fontWeight: "bold" }}>
											{team?.pts}
										</Box>
										<Box sx={{ fontSize: "0.8rem" }}>
											得分
										</Box>
									</Box>
									<Box sx={{ textAlign: "center" }}>
										<Box sx={{ fontWeight: "bold" }}>
											{(team?.pts as number) > 0
												? team?.rank
												: "无排名"}
										</Box>
										<Box sx={{ fontSize: "0.8rem" }}>
											排名
										</Box>
									</Box>
									<Box sx={{ textAlign: "center" }}>
										<Box sx={{ fontWeight: "bold" }}>
											{team?.solved}
										</Box>
										<Box sx={{ fontSize: "0.8rem" }}>
											已解决
										</Box>
									</Box>
								</Box>
							</Paper>
							<Box sx={{ marginY: "1rem" }}></Box>
							<Paper sx={{ height: "35rem" }}>
								<Tabs
									variant="scrollable"
									scrollButtons
									value={0}
									sx={{
										[`& .${tabsClasses.scrollButtons}`]: {
											"&.Mui-disabled": { opacity: 0.3 },
										},
										"& .MuiTabs-root": {
											minHeight: "1rem",
										},
										borderTopLeftRadius: "0.3rem",
										borderTopRightRadius: "0.3rem",
									}}
								>
									<Tab
										label="全部"
										sx={{
											"& .MuiTab-root": {
												padding: "0.5rem 1rem",
											},
										}}
									/>
									<Tab
										label="题目"
										sx={{
											"& .MuiTab-root .MuiButtonBase-root":
												{
													padding: "0.5rem 1rem",
												},
										}}
									/>
									<Tab
										label="通知"
										sx={{
											"& .MuiTab-root": {
												padding: "0.5rem 1rem",
											},
										}}
									/>
								</Tabs>
							</Paper>
						</Box>
					</Box>
				</Box>
				<Dialog
					maxWidth={false}
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
				>
					<ChallengeDialog
						mode="game"
						challenge={selectedChallenge}
					/>
				</Dialog>
			</Box>
		</>
	);
}

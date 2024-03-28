import GameScoreLines from "@/components/navigations/charts/GameScoreLines";
import {
	Box,
	Icon,
	Typography,
	Button,
	TableContainer,
	Paper,
	TableHead,
	TableRow,
	Table,
	TableCell,
	TableBody,
	Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useGameApi } from "@/api/game";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { Challenge } from "@/types/challenge";
import { Category } from "@/types/category";
import { Submission } from "@/types/submission";
import { Team } from "@/types/team";
import CryptoJS from "crypto-js";
import FirstBlood from "@/components/icons/hexagons/FirstBlood";
import SecondBlood from "@/components/icons/hexagons/SecondBlood";
import ThirdBlood from "@/components/icons/hexagons/ThirdBlood";

interface S {
	id?: number;
	team: Team;
	submissions: Array<Submission>;
	rank?: number;
	totalScore: number;
	solvedCount: number;
}

export default function Page() {
	const { id } = useParams<{ id: string }>();
	const gameApi = useGameApi();
	const navigate = useNavigate();

	const [game, setGame] = useState<Game>();
	const [challenges, setChallenges] = useState<Array<Challenge>>([]);
	const [categoriedChallenges, setCategoriedChallenges] = useState<
		Record<number, { category: Category; challenges: Array<Challenge> }>
	>({});
	const [rows, setRows] = useState<Array<S>>([]);

	function getGame() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	function getChallenges() {
		gameApi
			.getGameChallenges({
				game_id: parseInt(id as string),
				is_enabled: true,
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
		getChallenges();
	}, []);

	useEffect(() => {
		if (!challenges) return;

		const categoriedChallenges: Record<
			number,
			{ category: Category; challenges: Array<Challenge> }
		> = {};

		challenges?.forEach((challenge) => {
			const category_id = challenge.category_id;
			if (!category_id) return;

			if (!categoriedChallenges[category_id]) {
				categoriedChallenges[category_id] = {
					category: challenge.category as Category,
					challenges: [],
				};
			}

			categoriedChallenges[category_id].challenges.push(challenge);
		});
		setCategoriedChallenges(categoriedChallenges);
	}, [challenges]);

	useEffect(() => {
		if (!challenges) return;

		// 初始化团队提交数据的对象
		const teamSubmissions: Record<number, S> = {};

		// 遍历每个挑战和其提交记录
		challenges?.forEach((challenge) => {
			challenge?.submissions?.forEach((submission, index) => {
				const teamId = submission?.team_id;

				// 判断是否为前三次提交并设置相应的字段
				if (index === 0) submission.first_blood = true;
				if (index === 1) submission.second_blood = true;
				if (index === 2) submission.third_blood = true;

				// 如果团队尚未在记录中，则初始化
				if (!teamSubmissions[teamId]) {
					teamSubmissions[teamId] = {
						id: teamId,
						team: submission?.team,
						submissions: [],
						totalScore: 0,
						solvedCount: 0,
					};
				}

				// 累加团队的得分和解决数量
				const teamData = teamSubmissions[teamId];
				teamData.submissions.push(submission);
				if (submission?.status === 2) {
					teamData.totalScore += submission?.pts;
					teamData.solvedCount += 1;
				}
			});
		});

		// 将对象转换为数组并按总分降序排序
		const rowsArray = Object.values(teamSubmissions).sort(
			(a, b) => b.totalScore - a.totalScore
		);

		// 设置排名
		rowsArray.forEach((row, index) => {
			row.rank = index + 1;
		});

		setRows(rowsArray);
	}, [challenges]);

	return (
		<Box sx={{ marginY: "2rem", marginX: "3.5%" }}>
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
						variant="outlined"
						size="large"
						sx={{
							marginX: "0.5rem",
							fontWeight: "bold",
						}}
						startIcon={<Icon>flag</Icon>}
						onClick={() => navigate(`/games/${id}/challenges`)}
					>
						比赛题目
					</Button>
					<Button
						disableElevation
						variant="contained"
						size="large"
						sx={{
							marginX: "0.5rem",
							fontWeight: "bold",
						}}
						startIcon={<Icon>trending_up</Icon>}
					>
						积分总榜
					</Button>
				</Box>
			</Box>
			<Box>
				<GameScoreLines game_id={Number(id)} />
			</Box>
			<Box>
				<TableContainer
					component={Paper}
					sx={{
						overflowX: "auto",
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell colSpan={4}></TableCell>
								{Object.values(categoriedChallenges)?.map(
									(categoriedChallenge) => (
										<TableCell
											colSpan={
												categoriedChallenge.challenges
													.length
											}
											sx={{
												bgcolor:
													categoriedChallenge
														?.category?.color,
												color: "white",
												whiteSpace: "nowrap",
											}}
											align="center"
											key={
												categoriedChallenge.category.id
											}
										>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Icon>
													{
														categoriedChallenge
															?.category?.icon
													}
												</Icon>
												<Box
													sx={{
														marginX: "0.5rem",
													}}
												>
													{
														categoriedChallenge
															.category.name
													}
												</Box>
											</Box>
										</TableCell>
									)
								)}
							</TableRow>
							<TableRow>
								<TableCell sx={{ whiteSpace: "nowrap" }}>
									排名
								</TableCell>
								<TableCell sx={{ whiteSpace: "nowrap" }}>
									团队
								</TableCell>
								<TableCell sx={{ whiteSpace: "nowrap" }}>
									解题数量
								</TableCell>
								<TableCell sx={{ whiteSpace: "nowrap" }}>
									总分
								</TableCell>
								{Object.values(categoriedChallenges)?.map(
									(categoriedChallenge) =>
										categoriedChallenge.challenges?.map(
											(challenge) => (
												<TableCell
													key={challenge.id}
													align="center"
													sx={{
														whiteSpace: "nowrap",
													}}
												>
													{challenge.title}
												</TableCell>
											)
										)
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows?.map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.rank}</TableCell>
									<TableCell
										sx={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<Box>
											<Avatar
												src={`https://cravatar.cn/avatar/${CryptoJS.MD5(row?.team?.email || "").toString()}`}
												sx={{
													width: 36,
													height: 36,
												}}
											/>
										</Box>
										<Box
											sx={{
												marginX: "0.7rem",
											}}
										>
											{row.team.name}
										</Box>
									</TableCell>
									<TableCell>{row.solvedCount}</TableCell>
									<TableCell>{row.totalScore}</TableCell>
									{Object.values(categoriedChallenges)?.map(
										(categoriedChallenge) =>
											categoriedChallenge.challenges?.map(
												(challenge) => {
													const submission =
														row.submissions.find(
															(s) =>
																s.challenge_id ===
																challenge.id
														);
													if (!submission) {
														return (
															<TableCell
																key={
																	challenge.id
																}
															></TableCell>
														);
													}
													return (
														<TableCell
															key={
																submission?.id!
															}
															align="center"
														>
															{submission.status ===
																2 && (
																<>
																	{submission.first_blood && (
																		<FirstBlood
																			sx={{
																				color: "#fcc419",
																			}}
																		/>
																	)}
																	{submission.second_blood && (
																		<SecondBlood
																			sx={{
																				color: "#a6a6a6",
																			}}
																		/>
																	)}
																	{submission.third_blood && (
																		<ThirdBlood
																			sx={{
																				color: "#f98539",
																			}}
																		/>
																	)}
																	{!(
																		submission.third_blood ||
																		submission.second_blood ||
																		submission.first_blood
																	) && (
																		<Icon>
																			flag
																		</Icon>
																	)}
																</>
															)}
															{submission.status ===
																1 && (
																<Icon>
																	close
																</Icon>
															)}
														</TableCell>
													);
												}
											)
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
}

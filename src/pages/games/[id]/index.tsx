import { useGameApi } from "@/api/game";
import { useUserApi } from "@/api/user";
import Loading from "@/components/ui/Loading";
import Markdown from "@/components/ui/Markdown";
import { useAuthStore } from "@/store/auth";
import { useConfigStore } from "@/store/config";
import { Game } from "@/types/game";
import { Team } from "@/types/team";
import { formatUnixTimestamp } from "@/utils/datetime";
import {
	Box,
	Button,
	Card,
	Chip,
	Dialog,
	Divider,
	Icon,
	IconButton,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { create } from "zustand";
import { useTeamStore } from "@/store/team";
import { useSnackBarStore } from "@/store/snackBar";

interface State {
	applyOpen: boolean;
	setApplyOpen: (open: boolean) => void;
	enterOpen: boolean;
	setEnterOpen: (open: boolean) => void;
}

const useStore = create<State>()((set, _get) => ({
	applyOpen: false,
	setApplyOpen: (open) => set({ applyOpen: open }),
	enterOpen: false,
	setEnterOpen: (open) => set({ enterOpen: open }),
}));

function Enter() {
	const authStore = useAuthStore();
	const teamStore = useTeamStore();
	const store = useStore();
	const gameApi = useGameApi();
	const userApi = useUserApi();
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();
	const [teams, setTeams] = useState<Array<Team>>();
	const [ownedTeams, setOwnedTeams] = useState<Array<Team>>();
	const [applyedTeams, setApplyedTeams] = useState<Array<Team>>();

	function getUser() {
		userApi
			.getUsers({
				id: authStore?.user?.id,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setOwnedTeams(r.data[0].teams);
				}
			});
	}

	function getTeams() {
		gameApi
			.getGameTeams({
				game_id: parseInt(id as string),
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setApplyedTeams(r.data);
				}
			});
	}

	useEffect(() => {
		setTeams(
			ownedTeams?.filter((ownedTeam) =>
				applyedTeams?.find(
					(applyedTeam) =>
						applyedTeam?.id === ownedTeam?.id &&
						applyedTeam?.is_allowed === true
				)
			)
		);
	}, [ownedTeams, applyedTeams]);

	useEffect(() => {
		getUser();
		getTeams();
	}, []);

	return (
		<Card
			sx={{
				width: "40rem",
				padding: "1.5rem",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Icon>play_arrow</Icon>
				<Box
					sx={{
						fontSize: "1rem",
						marginX: "0.5rem",
						fontWeight: "bolder",
					}}
				>
					进入比赛
				</Box>
			</Box>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			{teams?.map((team) => (
				<Box
					key={team?.id}
					sx={{
						borderRadius: "0.5rem",
						borderWidth: "1px",
						borderStyle: "ridge",
						borderColor: "primary",
						paddingX: "1rem",
						paddingY: "0.5rem",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginY: "0.5rem",
					}}
				>
					<Box>{team?.name}</Box>
					<Box>
						<IconButton
							size="small"
							onClick={() => {
								teamStore.setSelectedTeamID(team?.id as number);
								store.setEnterOpen(false);
								navigate(`/games/${id}/challenges`);
							}}
						>
							<Icon>play_arrow</Icon>
						</IconButton>
					</Box>
				</Box>
			))}
		</Card>
	);
}

function Apply() {
	const authStore = useAuthStore();
	const snackBarStore = useSnackBarStore();
	const store = useStore();
	const gameApi = useGameApi();
	const userApi = useUserApi();

	const { id } = useParams<{ id: string }>();
	const [teams, setTeams] = useState<Array<Team>>();
	const [ownedTeams, setOwnedTeams] = useState<Array<Team>>([]);
	const [applyedTeams, setApplyedTeams] = useState<Array<Team>>([]);

	function getUser() {
		userApi
			.getUsers({
				id: authStore?.user?.id,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setOwnedTeams(r.data[0].teams as Array<Team>);
				}
			});
	}

	function getTeams() {
		gameApi
			.getGameTeams({
				game_id: parseInt(id as string),
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setApplyedTeams(r.data as Array<Team>);
				}
			});
	}

	function createTeam(team_id: number) {
		gameApi
			.createGameTeam({
				game_id: parseInt(id as string),
				team_id: team_id,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("申请成功");
				}
			});
	}

	useEffect(() => {
		setTeams(
			ownedTeams?.filter(
				(ownedTeam) =>
					!applyedTeams?.find(
						(applyedTeam) => applyedTeam?.id === ownedTeam?.id
					)
			)
		);
	}, [ownedTeams, applyedTeams]);

	useEffect(() => {
		getUser();
		getTeams();
	}, []);

	return (
		<Card
			sx={{
				width: "40rem",
				padding: "1.5rem",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Icon>play_arrow</Icon>
				<Box
					sx={{
						fontSize: "1rem",
						marginX: "0.5rem",
						fontWeight: "bolder",
					}}
				>
					申请参赛
				</Box>
			</Box>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			{teams?.map((team) => (
				<Box
					key={team?.id}
					sx={{
						borderRadius: "0.5rem",
						borderWidth: "1px",
						borderStyle: "ridge",
						borderColor: "primary",
						paddingX: "1rem",
						paddingY: "0.5rem",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginY: "0.5rem",
					}}
				>
					<Box>{team?.name}</Box>
					<Box>
						<IconButton
							size="small"
							onClick={() => {
								createTeam(team?.id as number);
								store.setApplyOpen(false);
							}}
						>
							<Icon>play_arrow</Icon>
						</IconButton>
					</Box>
				</Box>
			))}
		</Card>
	);
}

export default function Page() {
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const navigate = useNavigate();
	const configStore = useConfigStore();
	const store = useStore();

	const started_at = formatUnixTimestamp(game?.started_at as number);
	const ended_at = formatUnixTimestamp(game?.ended_at as number);

	const progress =
		((Math.floor(Date.now() / 1000) - (game?.started_at as number)) /
			((game?.ended_at as number) - (game?.started_at as number))) *
		100;

	function getGameData() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	useEffect(() => {
		getGameData();
	}, []);

	useEffect(() => {
		document.title = `${game?.title} - ${configStore?.pltCfg?.site?.title}`;
	}, [game]);

	return (
		<>
			{!game && <Loading />}
			<Box>
				<Paper
					sx={{
						minHeight: "22rem",
						borderRadius: 0,
						paddingX: "25%",
						paddingY: "5rem",
					}}
				>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "45%" }}>
							<Typography
								sx={{
									fontSize: "2.25rem",
									fontWeight: "bold",
								}}
							>
								{game?.title}
							</Typography>
							<Typography
								sx={{
									fontSize: "0.8rem",
								}}
							>
								{game?.bio}
							</Typography>
							<Box sx={{ display: "flex", marginY: "1rem" }}>
								<Chip size={"small"} label={started_at}></Chip>
								<Box sx={{ marginX: "0.5rem" }}>→</Box>
								<Chip size={"small"} label={ended_at}></Chip>
							</Box>
							<LinearProgress
								variant={
									progress < 0
										? "indeterminate"
										: "determinate"
								}
								value={progress < 100 ? progress : 100}
							/>
							<Box sx={{ display: "flex", marginY: "1rem" }}>
								<Button
									variant="contained"
									disableElevation
									onClick={() => store.setApplyOpen(true)}
									disabled={progress < 0 || progress >= 100}
								>
									申请参赛
								</Button>
								<Button
									variant="contained"
									disableElevation
									sx={{ marginX: "1rem" }}
									onClick={() => {
										navigate(`/games/${id}/scoreboard`);
									}}
								>
									查看榜单
								</Button>
								<Button
									variant="contained"
									disableElevation
									disabled={progress < 0 || progress >= 100}
									onClick={() => store.setEnterOpen(true)}
								>
									进入比赛
								</Button>
							</Box>
						</Box>
						<Box
							sx={{
								width: "50%",
								marginLeft: "5%",
								backgroundImage: `url('${game?.cover_url}')`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center center",
								borderRadius: "0.5rem",
							}}
						/>
					</Box>
				</Paper>
				<Box sx={{ marginX: "25%", marginY: "2rem" }}>
					<Markdown content={game?.description} />
				</Box>
				<Dialog
					maxWidth={false}
					open={store.applyOpen}
					onClose={() => store.setApplyOpen(false)}
				>
					<Apply />
				</Dialog>
				<Dialog
					maxWidth={false}
					open={store.enterOpen}
					onClose={() => store.setEnterOpen(false)}
				>
					<Enter />
				</Dialog>
			</Box>
		</>
	);
}

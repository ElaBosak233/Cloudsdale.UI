import withGame from "@/components/layouts/admin/withGame";
import withAdmin from "@/components/layouts/withAdmin";
import { Game } from "@/types/game";
import {
	Icon,
	IconButton,
	Box,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Card,
	Button,
	Divider,
	TextField,
	Typography,
	Dialog,
	Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useGameApi } from "@/api/game";
import { useSnackBarStore } from "@/store/snackBar";
import { create } from "zustand";
import { useTeamApi } from "@/api/team";
import { Team } from "@/types/team";
import { useTeamStore } from "@/store/team";

interface State {
	editOpen: boolean;
	setEditOpen: (open: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (open: boolean) => void;

	selectOpen: boolean;
	setSelectOpen: (open: boolean) => void;

	team?: Team;
	setTeam: (team: Team) => void;
	clearTeam: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	selectOpen: false,
	setSelectOpen: (selectOpen) => set({ selectOpen }),
	setTeam: (team) => set({ team }),
	clearTeam: () => set({ team: undefined }),
}));

function TeamSelect() {
	const teamApi = useTeamApi();
	const store = useStore();

	const [teams, setTeams] = useState<Array<Team>>([]);
	const [searchTitle, setSearchTitle] = useState<string>("");
	const [searchID, setSearchID] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	function getTeams() {
		teamApi
			.getTeams({
				id: searchID,
				name: searchTitle,
				page: page,
				size: 5,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setTeams(r.data);
					setTotalPages(r.pages);
				}
			});
	}

	useEffect(() => {
		getTeams();
	}, [page, searchID, searchTitle]);

	return (
		<Card
			sx={{
				width: "45rem",
				padding: "1.5rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box>
				<Typography
					sx={{
						fontWeight: "bold",
					}}
				>
					团队选择器
				</Typography>
			</Box>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<TextField
					label="团队ID"
					variant="outlined"
					value={searchID}
					onChange={(e) => setSearchID(parseInt(e.target.value))}
					sx={{
						width: "20%",
					}}
				/>
				<TextField
					label="团队名"
					variant="outlined"
					value={searchTitle}
					onChange={(e) => setSearchTitle(e.target.value)}
					sx={{
						width: "80%",
						marginLeft: "1rem",
					}}
				/>
			</Box>
			<Box
				sx={{
					marginY: "1rem",
				}}
			>
				{teams?.map((team) => (
					<Box
						key={team.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							height: "2.5rem",
							alignItems: "center",
						}}
					>
						<Box>{team.id}</Box>
						<Box>{team.name}</Box>
						<Box
							sx={{
								maxWidth: "10rem",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{team.description}
						</Box>
						<IconButton
							size="small"
							onClick={() => {
								store.setTeam(team);
								store.setSelectOpen(false);
							}}
						>
							<Icon>check</Icon>
						</IconButton>
					</Box>
				))}
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Pagination
					count={totalPages}
					page={page}
					onChange={(
						e: React.ChangeEvent<unknown>,
						value: number
					) => {
						setPage(value);
					}}
				/>
			</Box>
		</Card>
	);
}

function Edit() {
	const store = useStore();
	const teamStore = useTeamStore();
	const snackBarStore = useSnackBarStore();
	const teamApi = useTeamApi();
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();

	const [team, setTeam] = useState<Team>();

	function createGameTeam() {
		gameApi
			.createGameTeam({
				game_id: parseInt(id as string),
				team_id: team?.id,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("团队添加成功");
				}
				store.setEditOpen(false);
				store.clearTeam();
				teamStore.setRefresh(teamStore.refresh + 1);
			});
	}

	useEffect(() => {
		setTeam(store.team);
	}, [store.team]);

	return (
		<Card
			sx={{
				width: "40rem",
				padding: "1rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Icon>edit</Icon>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					添加团队
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderWidth: "1px",
					borderStyle: "ridge",
					padding: "1rem",
					borderColor: "grey.300",
					borderRadius: "0.5rem",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexGrow: 1,
					}}
				>
					<Box>{team?.id}</Box>
					<Box
						sx={{
							width: "5rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontWeight: "bold",
						}}
					>
						{team?.name}
					</Box>
					<Box
						sx={{
							width: "15rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{team?.description}
					</Box>
				</Box>
				<IconButton
					size="small"
					onClick={() => store.setSelectOpen(true)}
					sx={{
						marginLeft: "2rem",
					}}
				>
					<Icon>edit</Icon>
				</IconButton>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					marginTop: "1rem",
				}}
			>
				<Button
					variant="contained"
					disableElevation
					startIcon={<Icon>save</Icon>}
					onClick={createGameTeam}
				>
					保存
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const store = useStore();
	const teamStore = useTeamStore();
	const snackBarStore = useSnackBarStore();
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();

	function deleteGameTeam() {
		gameApi
			.deleteGameTeam({
				game_id: parseInt(id as string),
				team_id: store.team?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("团队删除成功");
				}
				store.setDeleteOpen(false);
				store.clearTeam();
				teamStore.setRefresh(teamStore.refresh + 1);
			});
	}

	return (
		<Card
			sx={{
				width: "40rem",
				padding: "1rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Icon>delete</Icon>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除团队
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderWidth: "1px",
					borderStyle: "ridge",
					padding: "1rem",
					borderColor: "grey.300",
					borderRadius: "0.5rem",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexGrow: 1,
					}}
				>
					<Box>{store.team?.id}</Box>
					<Box
						sx={{
							width: "5rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontWeight: "bold",
						}}
					>
						{store.team?.name}
					</Box>
					<Box
						sx={{
							width: "15rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{store.team?.description}
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					marginY: "1rem",
					display: "flex",
					justifyContent: "end",
				}}
			>
				<Button
					variant="contained"
					disableElevation
					color="error"
					onClick={deleteGameTeam}
				>
					确定
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Team }) {
	const gameApi = useGameApi();
	const snackBarStore = useSnackBarStore();
	const store = useStore();

	const { id } = useParams<{ id: string }>();
	const [isAllowed, setIsAllowed] = useState(row.is_allowed);

	function updateTeam() {
		gameApi
			.updateGameTeam({
				game_id: parseInt(id as string),
				team_id: row.id,
				is_allowed: isAllowed,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success(
						isAllowed ? "已允许队伍参赛" : "已禁止队伍参赛"
					);
				}
			});
	}

	useEffect(() => {
		setIsAllowed(row.is_allowed);
	}, [row.is_allowed]);

	useEffect(() => {
		if (isAllowed !== row.is_allowed) {
			updateTeam();
			row.is_allowed = isAllowed;
		}
	}, [isAllowed]);

	return (
		<TableRow key={row.id}>
			<TableCell>{row.id}</TableCell>
			<TableCell
				sx={{
					fontWeight: "bold",
				}}
			>
				{row.name}
			</TableCell>
			<TableCell
				sx={{
					width: "20rem",
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
			>
				{row.description}
			</TableCell>
			<TableCell>{row.captain?.nickname}</TableCell>
			<TableCell>
				{row?.users?.map((user) => user.nickname).join(", ")}
			</TableCell>
			<TableCell>
				<Switch
					checked={isAllowed}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setIsAllowed(e.target.checked);
					}}
				/>
			</TableCell>
			<TableCell align="center">
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setTeam(row);
						store.setDeleteOpen(true);
					}}
				>
					<Icon>delete</Icon>
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const gameApi = useGameApi();
	const teamStore = useTeamStore();
	const store = useStore();

	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const [teams, setTeams] = useState<Array<Team>>();

	function getGame() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	function getTeams() {
		gameApi.getGameTeams({ game_id: game?.id }).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setTeams(r.data);
			}
		});
	}

	useEffect(() => {
		getGame();
	}, []);

	useEffect(() => {
		if (game) {
			getTeams();
		}
	}, [game, teamStore.refresh]);

	useEffect(() => {
		if (game) {
			document.title = `参赛团队 - ${game.title}`;
		}
	}, [game]);

	return (
		<Paper
			sx={{
				marginX: "1rem",
				width: "calc(100% - 2rem)",
				minHeight: "85vh",
				padding: "2rem",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650 }}
					aria-label="simple table"
					size="small"
					stickyHeader
				>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>队名</TableCell>
							<TableCell>小队简介</TableCell>
							<TableCell>队长</TableCell>
							<TableCell>队员</TableCell>
							<TableCell>允许参赛</TableCell>
							<TableCell align="center">
								<IconButton
									sx={{ marginX: "0.1rem" }}
									onClick={() => {
										store.clearTeam();
										store.setEditOpen(true);
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teams?.map((team) => <Row key={team.id} row={team} />)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog
				maxWidth={false}
				open={store.editOpen}
				onClose={() => store.setEditOpen(false)}
			>
				<Edit />
			</Dialog>
			<Dialog
				maxWidth={false}
				open={store.deleteOpen}
				onClose={() => store.setDeleteOpen(false)}
			>
				<Delete />
			</Dialog>
			<Dialog
				maxWidth={false}
				open={store.selectOpen}
				onClose={() => store.setSelectOpen(false)}
			>
				<TeamSelect />
			</Dialog>
		</Paper>
	);
}

export default withAdmin(withGame(Page));

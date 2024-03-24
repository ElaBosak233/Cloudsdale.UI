import withGame from "@/components/layouts/admin/withGame";
import withAdmin from "@/components/layouts/withAdmin";
import { Challenge } from "@/types/challenge";
import { Game } from "@/types/game";
import {
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
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
	Dialog,
	Pagination,
	FormControlLabel,
} from "@mui/material";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGameApi } from "@/api/game";
import {
	mdiBookPlus,
	mdiBookEdit,
	mdiBookMinus,
	mdiBookArrowRight,
	mdiContentSave,
	mdiPuzzleEdit,
	mdiCheck,
} from "@mdi/js";
import { challenge, challenge as color } from "@/utils/color";
import UIcon from "@/components/ui/UIcon";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { create } from "zustand";
import { useChallengeApi } from "@/api/challenge";

interface State {
	editOpen: boolean;
	setEditOpen: (open: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (open: boolean) => void;

	mode: "edit" | "create";
	setMode: (mode: "edit" | "create") => void;

	selectOpen: boolean;
	setSelectOpen: (open: boolean) => void;

	challenge?: Challenge;
	setChallenge: (challenge: Challenge) => void;
	clearChallenge: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	mode: "create",
	setMode: (mode) => set({ mode }),
	selectOpen: false,
	setSelectOpen: (selectOpen) => set({ selectOpen }),
	setChallenge: (challenge) => set({ challenge }),
	clearChallenge: () => set({ challenge: undefined }),
}));

function ChallengeSelect() {
	const challengeApi = useChallengeApi();
	const store = useStore();

	const [challenges, setChallenges] = useState<Array<Challenge>>([]);
	const [searchTitle, setSearchTitle] = useState<string>("");
	const [searchID, setSearchID] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	function getChallenges() {
		challengeApi
			.getChallenges({
				id: searchID,
				title: searchTitle,
				page: page,
				size: 5,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setChallenges(r.data);
					setTotalPages(r.pages);
				}
			});
	}

	useEffect(() => {
		getChallenges();
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
					题目选择器
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
					label="题目ID"
					variant="outlined"
					value={searchID}
					onChange={(e) => setSearchID(parseInt(e.target.value))}
					sx={{
						width: "20%",
					}}
				/>
				<TextField
					label="题目标题"
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
				{challenges?.map((challenge) => (
					<Box
						key={challenge.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							height: "2.5rem",
							alignItems: "center",
						}}
					>
						<Box>{challenge.id}</Box>
						<Box>{challenge.title}</Box>
						<Box
							sx={{
								maxWidth: "10rem",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{challenge.description}
						</Box>
						<Box>{challenge.category?.name}</Box>
						<IconButton
							size="small"
							onClick={() => {
								store.setChallenge({
									...store.challenge,
									id: challenge.id,
								});
								store.setSelectOpen(false);
							}}
						>
							<Icon path={mdiCheck} size={1} />
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
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();

	const [challenge, setChallenge] = useState<Challenge>();
	const [challengeID, setChallengeID] = useState<number>(0);
	const [maxPts, setMaxPts] = useState<number>(0);
	const [minPts, setMinPts] = useState<number>(0);
	const [isEnabled, setIsEnabled] = useState<boolean>(true);

	function getChallenge() {
		challengeApi
			.getChallenges({
				id: challengeID,
			})
			.then((res) => {
				const r = res.data;
				setChallenge(r.data[0]);
			});
	}

	function createGameChallenge() {
		gameApi
			.createGameChallenge({
				game_id: parseInt(id as string),
				challenge_id: challengeID,
				is_enabled: isEnabled,
				max_pts: maxPts,
				min_pts: minPts,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目添加成功");
				}
				store.setEditOpen(false);
				store.clearChallenge();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	function updateGameChallenge() {
		gameApi
			.updateGameChallenge({
				game_id: parseInt(id as string),
				challenge_id: challengeID,
				is_enabled: isEnabled,
				max_pts: maxPts,
				min_pts: minPts,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目更新成功");
				}
				store.setEditOpen(false);
				store.clearChallenge();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	useEffect(() => {
		if (store.challenge) {
			setChallengeID(store.challenge?.id || 0);
			setMaxPts(store.challenge?.max_pts || 0);
			setMinPts(store.challenge?.min_pts || 0);
			setIsEnabled(store.challenge?.is_enabled || false);
		}
	}, [store.challenge]);

	useEffect(() => {
		if (challengeID) {
			getChallenge();
		}
	}, [challengeID]);

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
				<Icon path={mdiPuzzleEdit} size={1} />
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					{useStore.getState().mode === "create"
						? "添加题目"
						: "编辑题目"}
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
					<Box>{challengeID}</Box>
					<Box
						sx={{
							width: "5rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontWeight: "bold",
						}}
					>
						{challenge?.title}
					</Box>
					<Box
						sx={{
							width: "15rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{challenge?.description}
					</Box>
					{challenge?.category && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<UIcon
								path={`mdi${challenge?.category?.icon as string}`}
								size={1}
							/>
							<Box sx={{ marginX: "0.5rem" }}>
								{challenge?.category?.name}
							</Box>
						</Box>
					)}
				</Box>
				{store.mode === "create" && (
					<IconButton
						size="small"
						onClick={() => store.setSelectOpen(true)}
						sx={{
							marginLeft: "2rem",
						}}
					>
						<Icon path={mdiPuzzleEdit} size={1} />
					</IconButton>
				)}
			</Box>
			<Box
				sx={{
					marginY: "1rem",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<TextField
					size="small"
					label="最高分值"
					type="number"
					value={maxPts}
					onChange={(e) => setMaxPts(Number(e.target.value))}
					sx={{
						width: "15rem",
					}}
				/>
				<TextField
					size="small"
					label="最低分值"
					type="number"
					value={minPts}
					onChange={(e) => setMinPts(Number(e.target.value))}
					sx={{
						width: "15rem",
					}}
				/>
				<FormControlLabel
					control={<Switch checked={isEnabled} />}
					label="启用"
					labelPlacement="start"
					onClick={() => setIsEnabled(!isEnabled)}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
				}}
			>
				<Button
					variant="contained"
					disableElevation
					startIcon={<Icon path={mdiContentSave} size={1} />}
					onClick={() =>
						store.mode === "create"
							? createGameChallenge()
							: updateGameChallenge()
					}
				>
					保存
				</Button>
			</Box>
			<Dialog
				maxWidth={false}
				open={store.selectOpen}
				onClose={() => store.setSelectOpen(false)}
			>
				<ChallengeSelect />
			</Dialog>
		</Card>
	);
}

function Delete() {
	const store = useStore();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();

	function deleteGameChallenge() {
		gameApi
			.deleteGameChallenge({
				game_id: parseInt(id as string),
				challenge_id: store.challenge?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目删除成功");
				}
				store.setDeleteOpen(false);
				store.clearChallenge();
				challengeStore.setRefresh(challengeStore.refresh + 1);
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
				<Icon path={mdiBookMinus} size={1} />
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除题目
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
					<Box>{store.challenge?.id}</Box>
					<Box
						sx={{
							width: "5rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontWeight: "bold",
						}}
					>
						{store.challenge?.title}
					</Box>
					<Box
						sx={{
							width: "15rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{store.challenge?.description}
					</Box>
					{store.challenge?.category && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<UIcon
								path={`mdi${store.challenge?.category?.icon as string}`}
								size={1}
							/>
							<Box sx={{ marginX: "0.5rem" }}>
								{store.challenge?.category?.name}
							</Box>
						</Box>
					)}
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
					onClick={() => deleteGameChallenge()}
				>
					确定
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Challenge }) {
	const gameApi = useGameApi();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const store = useStore();
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();
	const [isEnabled, setIsEnabled] = useState(row.is_enabled);

	function updateChallenge() {
		gameApi
			.updateGameChallenge({
				challenge_id: row.id,
				game_id: parseInt(id as string),
				is_enabled: isEnabled,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success(isEnabled ? "启用成功" : "禁用成功");
				}
			});
	}

	useEffect(() => {
		setIsEnabled(row.is_enabled);
	}, [row.is_enabled]);

	useEffect(() => {
		if (isEnabled !== row.is_enabled) {
			updateChallenge();
			row.is_enabled = isEnabled;
		}
	}, [isEnabled]);

	return (
		<TableRow key={row.id}>
			<TableCell>{row.id}</TableCell>
			<TableCell
				sx={{
					fontWeight: "bold",
				}}
			>
				{row.title}
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
			<TableCell>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: color.useTextColor(false, row?.category?.color),
					}}
				>
					<UIcon
						path={`mdi${row.category?.icon as string}`}
						size={1}
					/>
					<Box sx={{ marginX: "0.5rem" }}>{row.category?.name}</Box>
				</Box>
			</TableCell>
			<TableCell>
				<Switch
					checked={isEnabled}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setIsEnabled(e.target.checked);
					}}
				/>
			</TableCell>
			<TableCell>{row.pts}</TableCell>
			<TableCell align="center">
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => {
						store.setChallenge(row);
						store.setMode("edit");
						store.setEditOpen(true);
					}}
				>
					<Icon path={mdiBookEdit} size={1} />
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					onClick={() => navigate(`/admin/challenges/${row.id}`)}
				>
					<Icon path={mdiBookArrowRight} size={1} />
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setChallenge(row);
						store.setDeleteOpen(true);
					}}
				>
					<Icon path={mdiBookMinus} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const gameApi = useGameApi();
	const challengeStore = useChallengeStore();
	const store = useStore();

	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const [challenges, setChallenges] = useState<Array<Challenge>>();

	function getGame() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	function getChallenges() {
		gameApi.getGameChallenges({ game_id: game?.id }).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setChallenges(r.data);
				console.log(challenge);
			}
		});
	}

	useEffect(() => {
		getGame();
	}, []);

	useEffect(() => {
		if (game) {
			getChallenges();
		}
	}, [game, challengeStore.refresh]);

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
							<TableCell>标题</TableCell>
							<TableCell>描述</TableCell>
							<TableCell>分类</TableCell>
							<TableCell>启用</TableCell>
							<TableCell>当前分值</TableCell>
							<TableCell align="center">
								<IconButton
									sx={{ marginX: "0.1rem" }}
									onClick={() => {
										store.setMode("create");
										store.clearChallenge();
										store.setEditOpen(true);
									}}
								>
									<Icon path={mdiBookPlus} size={1} />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{challenges?.map((challenge) => (
							<Row key={challenge.id} row={challenge} />
						))}
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
		</Paper>
	);
}

export default withAdmin(withGame(Page));

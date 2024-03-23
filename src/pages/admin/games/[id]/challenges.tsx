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
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGameApi } from "@/api/game";
import {
	mdiBookPlus,
	mdiBookEdit,
	mdiBookMinus,
	mdiBookArrowRight,
	mdiContentSave,
	mdiPuzzleEdit,
} from "@mdi/js";
import { challenge as color } from "@/utils/color";
import UIcon from "@/components/ui/UIcon";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { create } from "zustand";
import { useChallengeApi } from "@/api/challenge";
import { type } from "os";
import { env } from "process";

interface State {
	editOpen: boolean;
	setEditOpen: (open: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (open: boolean) => void;

	mode: "edit" | "create";
	setMode: (mode: "edit" | "create") => void;

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
	setChallenge: (challenge) => set({ challenge }),
	clearChallenge: () => set({ challenge: undefined }),
}));

function Edit() {
	const store = useStore();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();

	const [challengeID, setChallengeID] = useState<number>(0);
	const [maxPts, setMaxPts] = useState<number>(0);
	const [minPts, setMinPts] = useState<number>(0);
	const [isEnabled, setIsEnabled] = useState<boolean>(true);

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
			setMaxPts(store.challenge?.min_pts || 0);
			setMinPts(store.challenge?.max_pts || 0);
			setIsEnabled(store.challenge?.is_enabled || false);
		}
	}, [store.challenge]);

	return (
		<Card
			sx={{
				width: "65vh",
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
			{/* <Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="Flag 内容"
					value={value}
					sx={{
						width: "75%",
						marginRight: "1rem",
					}}
					onChange={(e) => setValue(e.target.value)}
				/>
				<TextField
					label="环境变量"
					value={env}
					sx={{
						width: "25%",
					}}
					onChange={(e) => setEnv(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					marginY: "1rem",
					display: "flex",
				}}
			>
				<FormControl sx={{ width: "50%" }} size="small">
					<InputLabel>类型</InputLabel>
					<Select
						value={type}
						label="类型"
						onChange={(event: SelectChangeEvent) => {
							setType(event.target.value as string);
						}}
					>
						<MenuItem value={"static"}>静态</MenuItem>
						<MenuItem value={"pattern"}>正则表达式</MenuItem>
						<MenuItem value={"dynamic"}>动态</MenuItem>
					</Select>
				</FormControl>
				<FormControl
					sx={{ width: "50%", marginLeft: "1rem" }}
					size="small"
				>
					<InputLabel>黑名单</InputLabel>
					<Select
						value={banned ? "1" : "0"}
						label="黑名单"
						onChange={(event: SelectChangeEvent) => {
							setBanned(
								event.target.value === "1" ? true : false
							);
						}}
					>
						<MenuItem value={"1"}>是</MenuItem>
						<MenuItem value={"0"}>否</MenuItem>
					</Select>
				</FormControl>
			</Box> */}
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
		</Card>
	);
}

function Row({ row }: { row: Challenge }) {
	const gameApi = useGameApi();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
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
					onClick={() => navigate(`/admin/challenges/${row.id}`)}
				>
					<Icon path={mdiBookArrowRight} size={1} />
				</IconButton>
				<IconButton sx={{ marginX: "0.1rem" }} color="primary">
					<Icon path={mdiBookEdit} size={1} />
				</IconButton>
				<IconButton sx={{ marginX: "0.1rem" }} color="error">
					<Icon path={mdiBookMinus} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const gameApi = useGameApi();
	const challengeStore = useChallengeStore();

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
							<TableCell>标题</TableCell>
							<TableCell>描述</TableCell>
							<TableCell>分类</TableCell>
							<TableCell>启用</TableCell>
							<TableCell>当前分值</TableCell>
							<TableCell align="center">
								<IconButton sx={{ marginX: "0.1rem" }}>
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
		</Paper>
	);
}

export default withAdmin(withGame(Page));

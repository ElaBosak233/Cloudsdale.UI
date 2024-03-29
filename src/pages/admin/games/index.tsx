import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import {
	Box,
	Button,
	Card,
	Chip,
	Dialog,
	Divider,
	FormControl,
	FormControlLabel,
	Icon,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Rating,
	Select,
	SelectChangeEvent,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
	Typography,
	duration,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { useGameApi } from "@/api/game";
import { formatUnixTimestamp } from "@/utils/datetime";
import { useNavigate } from "react-router";
import { create } from "zustand";
import { useGameStore } from "@/store/game";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;
	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;
	game?: Game;
	setGame: (game: Game) => void;
	clearGame: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	setGame: (game) => set({ game }),
	clearGame: () => set({ game: undefined }),
}));

function Edit() {
	const store = useStore();
	const gameApi = useGameApi();
	const gameStore = useGameStore();
	const snackBarStore = useSnackBarStore();

	const [title, setTitle] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [startedAt, setStartedAt] = useState<number>(0);
	const [endedAt, setEndedAt] = useState<number>(0);

	function createGame() {
		gameApi
			.createGame({
				title: title,
				bio: bio,
				started_at: startedAt,
				ended_at: endedAt,
				is_enabled: false,
				member_limit_min: 1,
				member_limit_max: 3,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("创建成功");
					store.setEditOpen(false);
					gameStore.setRefresh(gameStore.refresh + 1);
				}
			});
	}

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
				<Icon>edit</Icon>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					创建比赛
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="标题"
					value={title}
					fullWidth
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					marginTop: "1rem",
				}}
			>
				<TextField
					label="简述"
					value={bio}
					fullWidth
					multiline
					rows={4}
					onChange={(e) => setBio(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					marginTop: "1rem",
					display: "flex",
				}}
			>
				<DateTimePicker
					label="开始时间"
					value={dayjs(new Date(startedAt * 1000))}
					onChange={(newStartedAt) =>
						setStartedAt(newStartedAt?.unix() as number)
					}
					sx={{
						width: "100%",
					}}
				/>
				<DateTimePicker
					label="结束时间"
					value={dayjs(new Date(endedAt * 1000))}
					onChange={(newEndedAt) =>
						setEndedAt(newEndedAt?.unix() as number)
					}
					sx={{
						marginLeft: "1rem",
						width: "100%",
					}}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					marginTop: "1rem",
				}}
			>
				<Button
					size="large"
					variant="contained"
					disableElevation
					startIcon={<Icon>save</Icon>}
					onClick={createGame}
				>
					创建
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const store = useStore();
	const gameApi = useGameApi();
	const gameStore = useGameStore();
	const snackBarStore = useSnackBarStore();

	function deleteGame() {
		gameApi
			.deleteGame({
				id: store.game?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("删除成功");
				}
				gameStore.setRefresh(gameStore.refresh + 1);
				store.setDeleteOpen(false);
			});
	}

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
				<Icon>delete</Icon>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除分类
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Typography>确定删除 {store.game?.title} 吗？</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					marginTop: "1rem",
				}}
			>
				<Button
					size="large"
					variant="contained"
					disableElevation
					color="error"
					startIcon={<Icon>delete</Icon>}
					onClick={deleteGame}
				>
					删除
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Game }) {
	const store = useStore();
	const navigate = useNavigate();
	const started_at = formatUnixTimestamp(row?.started_at as number);
	const ended_at = formatUnixTimestamp(row?.ended_at as number);
	const status = () => {
		if ((row?.started_at as number) > Date.now() / 1000) {
			return 0;
		} else if ((row?.ended_at as number) < Date.now() / 1000) {
			return 1;
		} else {
			return 2;
		}
	};

	return (
		<TableRow>
			<TableCell align={"left"}>
				<Box>{row.id}</Box>
			</TableCell>
			<TableCell
				align={"left"}
				padding="none"
				sx={{
					lineHeight: 0,
				}}
			>
				<img
					src={row?.cover_url}
					style={{
						width: "16rem",
						height: "9rem",
						objectFit: "cover",
					}}
					draggable={false}
					className={"no-select"}
				/>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						width: "10rem",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{row.title}
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						width: "10rem",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{row.bio}
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box sx={{ display: "flex", justifyContent: "start" }}>
					<Chip size={"small"} label={started_at}></Chip>
					<Box sx={{ marginX: "0.5rem" }}>→</Box>
					<Chip size={"small"} label={ended_at}></Chip>
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box sx={{ display: "flex", justifyContent: "start" }}>
					<Chip
						label={
							status() === 0
								? "未开始"
								: status() === 1
									? "已结束"
									: "进行中"
						}
						color={
							status() === 0
								? "warning"
								: status() === 1
									? "error"
									: "success"
						}
						sx={{
							color: "white",
						}}
					></Chip>
				</Box>
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => navigate(`/admin/games/${row.id}`)}
				>
					<Icon>edit</Icon>
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setGame(row);
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

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const store = useStore();
	const gameStore = useGameStore();

	const [games, setGames] = useState<Array<Game>>([]);
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(4);
	const [total, setTotal] = useState<number>(0);
	const [sortKey, setSortKey] = useState<
		"id" | "difficulty" | "created_at" | undefined
	>();
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

	function getGame() {
		gameApi
			.getGames({
				page: page + 1,
				size: rowsPerPage,
				title: search,
				sort_key: sortKey,
				sort_order: sortOrder,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setGames(r.data as Array<Game>);
					setTotal(r.total as number);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	function handleSort(key: "id" | "difficulty" | "created_at") {
		const isAsc = sortKey === key && sortOrder === "asc";
		setPage(0);
		setSortOrder(isAsc ? "desc" : "asc");
		setSortKey(key);
	}

	useEffect(() => {
		getGame();
	}, [page, rowsPerPage, search, sortKey, sortOrder, gameStore.refresh]);

	useEffect(() => {
		document.title = `比赛管理 - ${configStore?.pltCfg?.site?.title}`;
	}, []);

	return (
		<>
			<Paper
				sx={{
					padding: "1.5rem",
					minHeight: "82vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						marginY: "1rem",
					}}
				>
					<TextField
						hiddenLabel
						variant="filled"
						size="small"
						placeholder="搜索"
						value={searchInput}
						fullWidth
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<IconButton
						sx={{ marginX: "0.5rem" }}
						onClick={() => setSearch(searchInput)}
					>
						<Icon>search</Icon>
					</IconButton>
					<IconButton
						sx={{ marginRight: "0.5rem" }}
						onClick={() => {
							store.clearGame();
							store.setEditOpen(true);
						}}
					>
						<Icon>add</Icon>
					</IconButton>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
						flexGrow: 1,
					}}
				>
					<Table stickyHeader size={"small"}>
						<TableHead sx={{ height: "3.5rem" }}>
							<TableRow>
								<TableCell align={"left"}>
									<TableSortLabel
										active={sortKey === "id"}
										direction={sortOrder}
										onClick={() => handleSort("id")}
									>
										ID
									</TableSortLabel>
								</TableCell>
								<TableCell align={"left"}>海报</TableCell>
								<TableCell align={"left"}>标题</TableCell>
								<TableCell align={"left"}>描述</TableCell>
								<TableCell align={"left"}>
									开始 → 结束
								</TableCell>
								<TableCell align={"left"}>状态</TableCell>
								<TableCell align={"left"}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{games?.map((row) => (
								<Row row={row} key={row.id} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[4, 8, 12]}
					component="div"
					count={total}
					rowsPerPage={rowsPerPage}
					page={page}
					labelRowsPerPage={"每页显示"}
					labelDisplayedRows={({ from, to, count }) =>
						`${from}-${to} 共 ${count}`
					}
					onPageChange={(event: unknown, newPage: number) => {
						setPage(newPage);
					}}
					onRowsPerPageChange={(
						event: React.ChangeEvent<HTMLInputElement>
					) => {
						setRowsPerPage(parseInt(event.target.value));
						setPage(0);
					}}
				/>
			</Paper>
			<Dialog
				maxWidth={false}
				open={store.deleteOpen}
				onClose={() => store.setDeleteOpen(false)}
			>
				<Delete />
			</Dialog>
			<Dialog
				maxWidth={false}
				open={store.editOpen}
				onClose={() => store.setEditOpen(false)}
			>
				<Edit />
			</Dialog>
		</>
	);
}

export default withAdmin(Page);

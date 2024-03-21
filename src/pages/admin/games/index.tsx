import withAdmin from "@/components/layouts/withAdmin";
import { useChallengeStore } from "@/store/challenge";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { mdiBookEdit, mdiBookPlus, mdiDelete, mdiMagnify } from "@mdi/js";
import {
	Box,
	Chip,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { useGameApi } from "@/api/game";
import { formatUnixTimestamp } from "@/utils/datetime";

function Row({ row }: { row: Game }) {
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

	// function updateChallengeData() {
	// 	updateChallenge({
	// 		id: row.id,
	// 		is_practicable: isPracticable,
	// 	}).then((res) => {
	// 		const r = res.data;
	// 		if (r.code === 200) {
	// 			snackBarStore.success("题目更新成功");
	// 		}
	// 	});
	// }

	// function handlePracticableChange() {
	// 	setIsPracticable(!isPracticable);
	// }

	// useEffect(() => {
	// 	if (isPracticable !== row.is_practicable) {
	// 		updateChallengeData();
	// 	}
	// }, [isPracticable]);

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
					src={
						"https://cdn.vuetifyjs.com/images/parallax/material.jpg"
					}
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
					></Chip>
				</Box>
			</TableCell>
			<TableCell align={"center"}>
				<IconButton sx={{ marginX: "0.1rem" }} color="primary">
					<Icon path={mdiBookEdit} size={1} />
				</IconButton>
				<IconButton sx={{ marginX: "0.1rem" }} color="error">
					<Icon path={mdiDelete} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const gameApi = useGameApi();

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();

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

	function getGamesData() {
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
		getGamesData();
	}, [page, rowsPerPage, search, sortKey, sortOrder, challengeStore.refresh]);

	useEffect(() => {
		document.title = `比赛管理 - ${configStore.pltCfg.site.title}`;
	}, []);

	return (
		<>
			<Paper
				sx={{
					padding: "1.5rem",
					minHeight: "82vh",
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
						<Icon path={mdiMagnify} size={1} />
					</IconButton>
					<IconButton sx={{ marginRight: "0.5rem" }}>
						<Icon path={mdiBookPlus} size={1} />
					</IconButton>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
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
							{games.map((row) => (
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
		</>
	);
}

export default withAdmin(Page);
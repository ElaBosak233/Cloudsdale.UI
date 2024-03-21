import {
	Box,
	TableContainer,
	Table,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	Rating,
	Paper,
	IconButton,
	TablePagination,
	TableSortLabel,
	TextField,
	Dialog,
	Select,
	MenuItem,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import UIcon from "@/components/ui/UIcon";
import { getChallenges, useChallengeApi } from "@/api/challenge";
import { useConfigStore } from "@/store/config";
import { useEffect, useState } from "react";
import { Challenge } from "@/types/challenge";
import Icon from "@mdi/react";
import { mdiStar, mdiStarOutline, mdiPlay, mdiMagnify } from "@mdi/js";
import { challenge as color } from "@/utils/color";
import { create } from "zustand";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import ChallengeDialog from "@/components/modals/ChallengeDialog";
import { getPods } from "@/api/pod";
import { usePodStore } from "@/store/pod";
import { useCategoryStore } from "@/store/category";

interface State {
	open: boolean;
	setOpen: (open: boolean) => void;
	challenge?: Challenge;
	setChallenge: (challenge: Challenge) => void;
}

const useStore = create<State>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
	challenge: {} as Challenge,
	setChallenge: (challenge) => set({ challenge }),
}));

function Row({ row }: { row: Challenge }) {
	const store = useStore();

	const bgColor = color.useBgColor(
		row.solved ? true : false,
		row.category?.color
	);

	return (
		<TableRow
			sx={{
				bgcolor: bgColor,
				transition: "0.25s ease",
			}}
		>
			<TableCell align={"left"}>
				<Box
					sx={{
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
					}}
				>
					{row.id}
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
						width: "10rem",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						fontWeight: "bold",
					}}
				>
					{row.title}
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
						width: "20rem",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{row.description}
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
					}}
				>
					<UIcon
						path={`mdi${row.category?.icon as string}`}
						size={1}
					/>
					<Box sx={{ marginX: "0.5rem" }}>{row.category?.name}</Box>
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Rating
					readOnly
					value={row.difficulty}
					sx={{
						display: "flex",
						alignItems: "center",
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
						"& .MuiRating-iconEmpty": {
							color: color.useTextColor(
								row.solved ? true : false,
								row.category?.color
							),
						},
					}}
					size="large"
					icon={<Icon path={mdiStar} size={1} />}
					emptyIcon={<Icon path={mdiStarOutline} size={1} />}
				/>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
					}}
				>
					{row?.practice_pts} pts
				</Box>
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{
						color: color.useTextColor(
							row.solved ? true : false,
							row.category?.color
						),
					}}
					onClick={() => {
						store.setOpen(true);
						store.setChallenge(row);
					}}
				>
					<Icon path={mdiPlay} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

export default function Page() {
	const challengeApi = useChallengeApi();

	const store = useStore();
	const configStore = useConfigStore();
	const categoryStore = useCategoryStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const podStore = usePodStore();

	const [challenges, setChallenges] = useState<Array<Challenge>>([]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(12);
	const [total, setTotal] = useState<number>(0);
	const [category, setCategory] = useState<string>("0");
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");
	const [sortKey, setSortKey] = useState<
		"id" | "difficulty" | "category_id" | undefined
	>(undefined);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
		undefined
	);

	useEffect(() => {
		document.title = `练习场 - ${configStore.pltCfg.site.title}`;
	}, []);

	function handleSort(key: "id" | "difficulty" | "category_id") {
		const isAsc = sortKey === key && sortOrder === "asc";
		setPage(0);
		setSortOrder(isAsc ? "desc" : "asc");
		setSortKey(key);
	}

	function handleCategorySelect(event: SelectChangeEvent) {
		setCategory(event.target.value);
	}

	function getChallengesData() {
		challengeApi
			.getChallenges({
				is_practicable: true,
				page: page + 1,
				size: rowsPerPage,
				submission_qty: 3,
				title: search,
				category_id: category === "0" ? undefined : parseInt(category),
				sort_key: sortKey,
				sort_order: sortOrder,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setChallenges(r.data as Array<Challenge>);
					setTotal(r.total as number);
					console.log(r.data);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	function getExistPods() {
		getPods({
			is_available: true,
		}).then((res) => {
			const r = res.data;
			if (r.data) {
				r.data.forEach((i: any) => {
					podStore.addExistPod(i.challenge_id, i);
				});
			} else {
				podStore.setExistPods({});
			}
		});
	}

	useEffect(() => {
		getChallengesData();
		getExistPods();
	}, [
		page,
		rowsPerPage,
		sortKey,
		sortOrder,
		search,
		category,
		challengeStore.refresh,
	]);

	return (
		<>
			<Box sx={{ marginTop: "2rem", marginX: "10%" }}>
				<Box
					display={"flex"}
					alignItems={"center"}
					className={"no-select"}
				>
					<img
						src="/favicon.ico"
						alt="logo"
						width={48}
						height={48}
						draggable={false}
					/>
					<Typography
						sx={{
							marginX: "0.5rem",
							fontSize: "2rem",
							fontWeight: "bold",
							fontFamily: "sans-serif",
						}}
						color={"text.primary"}
					>
						练习场
					</Typography>
				</Box>
				<Box sx={{ marginY: "2rem" }}>
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
						<Select
							value={category}
							size="small"
							onChange={handleCategorySelect}
							sx={{
								width: "10rem",
								marginLeft: "1rem",
							}}
						>
							<MenuItem value={"0"}>
								<em>All</em>
							</MenuItem>
							{categoryStore.categories.map((category) => (
								<MenuItem
									value={String(category?.id)}
									key={category?.id}
								>
									{category?.name}
								</MenuItem>
							))}
						</Select>
						<IconButton
							sx={{ marginX: "1rem" }}
							onClick={() => setSearch(searchInput)}
						>
							<Icon path={mdiMagnify} size={1} />
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
									<TableCell align={"left"}>标题</TableCell>
									<TableCell align={"left"}>描述</TableCell>
									<TableCell align={"left"}>分类</TableCell>
									<TableCell align={"left"}>
										<TableSortLabel
											active={sortKey === "difficulty"}
											direction={sortOrder}
											onClick={() =>
												handleSort("difficulty")
											}
										>
											难度
										</TableSortLabel>
									</TableCell>
									<TableCell align={"left"}>分值</TableCell>
									<TableCell align={"left"}></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{challenges.map((row) => (
									<Row row={row} key={row.id} />
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[12, 25, 50]}
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
				</Box>
				<Dialog
					maxWidth={false}
					open={store.open}
					onClose={() => store.setOpen(false)}
				>
					<ChallengeDialog challenge={store.challenge} />
				</Dialog>
			</Box>
		</>
	);
}

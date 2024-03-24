import { useChallengeApi } from "@/api/challenge";
import withAdmin from "@/components/layouts/withAdmin";
import { useChallengeStore } from "@/store/challenge";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { Challenge } from "@/types/challenge";
import {
	mdiBookEdit,
	mdiBookPlus,
	mdiContentSave,
	mdiDelete,
	mdiMagnify,
	mdiPuzzleEdit,
	mdiStar,
	mdiStarOutline,
} from "@mdi/js";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	FormControl,
	FormControlLabel,
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
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category";
import UIcon from "@/components/ui/UIcon";
import { challenge as color } from "@/utils/color";
import { useNavigate } from "react-router";
import { create } from "zustand";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;
	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;
	challenge?: Challenge;
	setChallenge: (challenge: Challenge) => void;
	clearChallenge: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	challenge: {} as Challenge,
	setChallenge: (challenge) => set({ challenge }),
	clearChallenge: () => set({ challenge: undefined }),
}));

function Edit() {
	const challengeApi = useChallengeApi();
	const snackBarStore = useSnackBarStore();
	const store = useStore();
	const categoryStore = useCategoryStore();
	const challengeStore = useChallengeStore();

	const [title, setTitle] = useState<string>("");
	const [categoryID, setCategoryID] = useState<number>(1);
	const [description, setDescription] = useState<string>("");
	const [difficulty, setDifficulty] = useState<number>(1);
	const [isPracticable, setIsPracticable] = useState<boolean>(false);
	const [isDynamic, setIsDynamic] = useState<boolean>(false);
	const [hasAttachment, setHasAttachment] = useState<boolean>(false);
	const [practicePts, setPracticePts] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	function createChallenge() {
		challengeApi
			.createChallenge({
				title: title,
				category_id: categoryID,
				description: description,
				difficulty: difficulty,
				is_practicable: isPracticable,
				is_dynamic: isDynamic,
				practice_pts: practicePts,
				duration: duration,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目创建成功");
					challengeStore.setRefresh(challengeStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearChallenge();
			});
	}

	useEffect(() => {
		if (store.challenge) {
			setTitle(store?.challenge?.title || "");
			setCategoryID(store?.challenge?.category_id || 1);
			setDescription(store?.challenge?.description || "");
			setDifficulty(store?.challenge?.difficulty || 1);
			setIsPracticable(store?.challenge?.is_practicable || false);
			setIsDynamic(store?.challenge?.is_dynamic || false);
			setHasAttachment(store?.challenge?.has_attachment || false);
			setPracticePts(store?.challenge?.practice_pts || 0);
			setDuration(store?.challenge?.duration || 0);
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
					创建题目
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
					sx={{
						width: "70%",
					}}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<FormControl
					sx={{
						width: "30%",
						marginLeft: "1rem",
					}}
				>
					<InputLabel>分类</InputLabel>
					<Select
						value={String(categoryID)}
						label="分类"
						onChange={(e: SelectChangeEvent) => {
							setCategoryID(parseInt(e.target.value));
						}}
					>
						{categoryStore?.categories?.map((category) => (
							<MenuItem value={String(category?.id)}>
								{category?.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					marginTop: "1rem",
					justifyContent: "space-between",
				}}
			>
				<Rating
					value={difficulty}
					size="large"
					onChange={(event, newValue) => {
						setDifficulty(newValue as number);
					}}
				/>
				<FormControlLabel
					control={<Switch checked={hasAttachment} color="primary" />}
					label="是否有附件"
					labelPlacement="start"
					onClick={() => {
						setHasAttachment(!hasAttachment);
					}}
				/>
				<FormControlLabel
					control={<Switch checked={isDynamic} color="primary" />}
					label="是否为动态题"
					labelPlacement="start"
					onClick={() => {
						setIsDynamic(!isDynamic);
					}}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					marginTop: "1rem",
					justifyContent: "space-between",
				}}
			>
				<FormControlLabel
					control={<Switch checked={isPracticable} color="primary" />}
					label="是否为练习题"
					labelPlacement="start"
					onClick={() => {
						setIsPracticable(!isPracticable);
					}}
				/>
				<TextField
					label="练习分数"
					value={practicePts}
					size="small"
					sx={{
						flexGrow: 1,
						marginLeft: "1rem",
					}}
					onChange={(e) =>
						setPracticePts(parseInt(e.target.value) || 0)
					}
				/>
				<TextField
					label="动态容器持续时间"
					value={duration}
					size="small"
					sx={{
						flexGrow: 1,
						marginLeft: "1rem",
					}}
					onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
				/>
			</Box>
			<Box
				sx={{
					marginTop: "1rem",
				}}
			>
				<TextField
					label="描述"
					value={description}
					fullWidth
					multiline
					rows={4}
					onChange={(e) => setDescription(e.target.value)}
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
					startIcon={<Icon path={mdiContentSave} size={1} />}
					onClick={createChallenge}
				>
					创建
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const challengeApi = useChallengeApi();
	const snackBarStore = useSnackBarStore();
	const store = useStore();
	const challengeStore = useChallengeStore();

	function deleteChallenge() {
		challengeApi
			.deleteChallenge({
				id: store.challenge?.id as number,
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
				minWidth: "25rem",
				padding: "1rem",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Icon path={mdiDelete} size={1} />
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除题目
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
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography
					sx={{
						fontSize: "1.25rem",
						fontWeight: "bold",
					}}
				>
					是否永久删除题目，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{store.challenge?.title}
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
				}}
			>
				<Button
					variant="contained"
					color="error"
					disableElevation
					startIcon={<Icon path={mdiDelete} size={1} />}
					onClick={deleteChallenge}
				>
					删除
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Challenge }) {
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();
	const store = useStore();

	const navigate = useNavigate();

	const [isPracticable, setIsPracticable] = useState<boolean>(
		row?.is_practicable as boolean
	);

	function updateChallengeData() {
		challengeApi
			.updateChallenge({
				id: row.id,
				is_practicable: isPracticable,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目更新成功");
				}
			});
	}

	function handlePracticableChange() {
		setIsPracticable(!isPracticable);
	}

	useEffect(() => {
		if (isPracticable !== row.is_practicable) {
			updateChallengeData();
			row.is_practicable = isPracticable;
		}
	}, [isPracticable]);

	return (
		<TableRow>
			<TableCell align={"left"}>
				<Box>{row.id}</Box>
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
						color: color.useTextColor(false, row.category?.color),
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
					}}
					size="large"
					icon={<Icon path={mdiStar} size={1} />}
					emptyIcon={<Icon path={mdiStarOutline} size={1} />}
				/>
			</TableCell>
			<TableCell align={"left"} onClick={handlePracticableChange}>
				<Switch checked={isPracticable} />
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => navigate(`/admin/challenges/${row.id}`)}
				>
					<Icon path={mdiBookEdit} size={1} />
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setChallenge(row);
						store.setDeleteOpen(true);
					}}
				>
					<Icon path={mdiDelete} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const challengeApi = useChallengeApi();

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const categoryStore = useCategoryStore();
	const store = useStore();

	const [challenges, setChallenges] = useState<Array<Challenge>>([]);
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(11);
	const [total, setTotal] = useState<number>(0);
	const [category, setCategory] = useState<string>("0");
	const [sortKey, setSortKey] = useState<
		"id" | "difficulty" | "created_at" | undefined
	>();
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

	function getChallengesData() {
		challengeApi
			.getChallenges({
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

	function handleSort(key: "id" | "difficulty" | "created_at") {
		const isAsc = sortKey === key && sortOrder === "asc";
		setPage(0);
		setSortOrder(isAsc ? "desc" : "asc");
		setSortKey(key);
	}

	function handleCategorySelect(event: SelectChangeEvent) {
		setCategory(event.target.value);
	}

	useEffect(() => {
		getChallengesData();
	}, [
		page,
		rowsPerPage,
		category,
		search,
		sortKey,
		sortOrder,
		challengeStore.refresh,
	]);

	useEffect(() => {
		document.title = `题库管理 - ${configStore?.pltCfg?.site?.title}`;
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
						sx={{ marginX: "0.5rem" }}
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
								<TableCell align={"left"}>难度</TableCell>
								<TableCell align={"left"}>练习题</TableCell>
								<TableCell align={"center"}>
									<IconButton
										onClick={() => {
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
							{challenges.map((row) => (
								<Row row={row} key={row.id} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[11, 25, 50]}
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
				open={store.editOpen}
				maxWidth={false}
				onClose={() => store.setEditOpen(false)}
			>
				<Edit />
			</Dialog>
			<Dialog
				open={store.deleteOpen}
				maxWidth={false}
				onClose={() => store.setDeleteOpen(false)}
			>
				<Delete />
			</Dialog>
		</>
	);
}

export default withAdmin(Page);

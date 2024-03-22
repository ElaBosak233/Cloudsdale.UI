import { useChallengeApi } from "@/api/challenge";
import withAdmin from "@/components/layouts/withAdmin";
import { useChallengeStore } from "@/store/challenge";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { Challenge } from "@/types/challenge";
import {
	mdiBookEdit,
	mdiBookPlus,
	mdiDelete,
	mdiMagnify,
	mdiStar,
	mdiStarOutline,
} from "@mdi/js";
import {
	Box,
	IconButton,
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
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category";
import UIcon from "@/components/ui/UIcon";
import { challenge as color } from "@/utils/color";
import { useNavigate } from "react-router";

function Row({ row }: { row: Challenge }) {
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();

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
				<IconButton sx={{ marginX: "0.1rem" }} color="error">
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
		document.title = `题库管理 - ${configStore.pltCfg.site.title}`;
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
								<TableCell align={"left"}>标题</TableCell>
								<TableCell align={"left"}>描述</TableCell>
								<TableCell align={"left"}>分类</TableCell>
								<TableCell align={"left"}>难度</TableCell>
								<TableCell align={"left"}>练习题</TableCell>
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
		</>
	);
}

export default withAdmin(Page);

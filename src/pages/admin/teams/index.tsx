import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import {
	mdiAccountEdit,
	mdiAccountMinus,
	mdiAccountPlus,
	mdiCheck,
	mdiContentSave,
	mdiDelete,
	mdiMagnify,
	mdiPuzzleEdit,
} from "@mdi/js";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	IconButton,
	Pagination,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { useUserStore } from "@/store/user";
import { Team } from "@/types/team";
import { useTeamApi } from "@/api/team";
import { useTeamStore } from "@/store/team";
import { useUserApi } from "@/api/user";
import { User } from "@/types/user";
import Users from "../users";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;

	mode: "edit" | "create";
	setMode: (mode: "edit" | "create") => void;

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
	mode: "create",
	setMode: (mode) => set({ mode }),
	selectOpen: false,
	setSelectOpen: (selectOpen) => set({ selectOpen }),
	setTeam: (team) => set({ team }),
	clearTeam: () => set({ team: undefined }),
}));

function UserSelect() {
	const userApi = useUserApi();
	const store = useStore();

	const [users, setUsers] = useState<Array<User>>([]);
	const [searchName, setSearchName] = useState<string>("");
	const [searchID, setSearchID] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	function getUsers() {
		userApi
			.getUsers({
				id: searchID,
				name: searchName,
				page: page,
				size: 5,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setUsers(r.data);
					setTotalPages(r.pages);
				}
			});
	}

	useEffect(() => {
		getUsers();
	}, [page, searchID, searchName]);

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
					用户选择器
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
					label="用户ID"
					variant="outlined"
					value={searchID}
					onChange={(e) => setSearchID(parseInt(e.target.value))}
					sx={{
						width: "20%",
					}}
				/>
				<TextField
					label="用户名"
					variant="outlined"
					value={searchName}
					onChange={(e) => setSearchName(e.target.value)}
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
				{users?.map((user) => (
					<Box
						key={user.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							height: "2.5rem",
							alignItems: "center",
						}}
					>
						<Box>{user.id}</Box>
						<Box>{user.username}</Box>
						<Box
							sx={{
								maxWidth: "10rem",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{user.nickname}
						</Box>
						<IconButton
							size="small"
							onClick={() => {
								store.setTeam({
									...store.team,
									captain_id: user.id,
									captain: user,
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
	const teamApi = useTeamApi();
	const snackBarStore = useSnackBarStore();
	const teamStore = useTeamStore();
	const store = useStore();

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [captainID, setCaptainID] = useState<number>(0);

	function createTeam() {
		teamApi
			.createTeam({
				name: name,
				description: description,
				captain_id: captainID,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("团队创建成功");
					teamStore.setRefresh(teamStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearTeam();
			});
	}

	function updateTeam() {
		teamApi
			.updateTeam({
				id: store.team?.id as number,
				description: description,
				captain_id: captainID,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("团队更新成功");
					teamStore.setRefresh(teamStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearTeam();
			});
	}

	useEffect(() => {
		if (store.team) {
			setName(store.team?.name || "");
			setDescription(store.team?.description || "");
			setCaptainID(store.team?.captain_id || 0);
		}
	}, []);

	useEffect(() => {
		setCaptainID(store.team?.captain_id || 0);
	}, [store.team]);

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
					{store.mode === "edit" ? "编辑团队" : "创建团队"}
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="团队名"
					value={name}
					fullWidth
					onChange={(e) => setName(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					marginTop: "1rem",
				}}
			>
				<TextField
					label="小队简介"
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
					alignItems: "center",
					justifyContent: "space-between",
					borderWidth: "1px",
					borderStyle: "ridge",
					padding: "1rem",
					borderColor: "grey.300",
					borderRadius: "0.5rem",
					marginTop: "1rem",
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
					<Box>{captainID}</Box>
					<Box
						sx={{
							width: "10rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							fontWeight: "bold",
						}}
					>
						{store?.team?.captain?.username}
					</Box>
					<Box
						sx={{
							width: "15rem",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{store?.team?.captain?.nickname}
					</Box>
				</Box>
				<IconButton
					size="small"
					onClick={() => store.setSelectOpen(true)}
					sx={{
						marginLeft: "2rem",
					}}
				>
					<Icon path={mdiPuzzleEdit} size={1} />
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
					size="large"
					variant="contained"
					disableElevation
					startIcon={<Icon path={mdiContentSave} size={1} />}
					onClick={() => {
						store.mode === "edit" ? updateTeam() : createTeam();
					}}
				>
					{store.mode === "edit" ? "保存" : "创建"}
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const teamStore = useTeamStore();
	const teamApi = useTeamApi();
	const snackBarStore = useSnackBarStore();
	const store = useStore();

	function deleteTeam() {
		teamApi
			.deleteTeam({
				id: store.team?.id as number,
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
					删除团队
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
					是否永久删除团队，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{store.team?.name}
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
					onClick={deleteTeam}
				>
					删除
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Team }) {
	const store = useStore();

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
					{row.name}
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
					{row.description}
				</Box>
			</TableCell>
			<TableCell
				sx={{
					width: "20rem",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}
			>
				{row.captain?.nickname}
			</TableCell>
			<TableCell
				sx={{
					width: "20rem",
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}
			>
				{row?.users?.map((user) => user.nickname).join(", ")}
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => {
						store.setTeam(row);
						store.setMode("edit");
						store.setEditOpen(true);
					}}
				>
					<Icon path={mdiAccountEdit} size={1} />
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setTeam(row);
						store.setDeleteOpen(true);
					}}
				>
					<Icon path={mdiAccountMinus} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const teamApi = useTeamApi();

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const teamStore = useTeamStore();
	const store = useStore();

	const [teams, setTeams] = useState<Array<Team>>([]);
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(11);
	const [total, setTotal] = useState<number>(0);

	function getTeams() {
		teamApi
			.getTeams({
				name: search,
				page: page + 1,
				size: rowsPerPage,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setTeams(r.data as Array<Team>);
					setTotal(r.total as number);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	useEffect(() => {
		getTeams();
	}, [page, rowsPerPage, search, teamStore.refresh]);

	useEffect(() => {
		document.title = `团队管理 - ${configStore?.pltCfg?.site?.title}`;
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
						<Icon path={mdiMagnify} size={1} />
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
								<TableCell align={"left"}>ID</TableCell>
								<TableCell align={"left"}>团队名</TableCell>
								<TableCell align={"left"}>小队简介</TableCell>
								<TableCell align={"left"}>队长</TableCell>
								<TableCell align={"left"}>队员</TableCell>
								<TableCell align={"center"}>
									<IconButton
										onClick={() => {
											store.clearTeam();
											store.setMode("create");
											store.setEditOpen(true);
										}}
									>
										<Icon path={mdiAccountPlus} size={1} />
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams?.map((row) => (
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
					onPageChange={(e: unknown, newPage: number) => {
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
			<Dialog
				open={store.selectOpen}
				maxWidth={false}
				onClose={() => store.setSelectOpen(false)}
			>
				<UserSelect />
			</Dialog>
		</>
	);
}

export default withAdmin(Page);

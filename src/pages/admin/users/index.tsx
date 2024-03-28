import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import {
	Avatar,
	Box,
	Button,
	Card,
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { useUserApi } from "@/api/user";
import { User } from "@/types/user";
import { useUserStore } from "@/store/user";
import { useGroupStore } from "@/store/group";
import CryptoJS from "crypto-js";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;
	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;
	mode: "edit" | "create";
	setMode: (mode: "edit" | "create") => void;
	user?: User;
	setUser: (user: User) => void;
	clearUser: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	mode: "create",
	setMode: (mode) => set({ mode }),
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: undefined }),
}));

function Edit() {
	const userApi = useUserApi();
	const snackBarStore = useSnackBarStore();
	const userStore = useUserStore();
	const groupStore = useGroupStore();
	const store = useStore();

	const [username, setUsername] = useState<string>("");
	const [nickname, setNickname] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [groupID, setGroupID] = useState<number>(3);
	const [password, setPassword] = useState<string>("");

	function createUser() {
		userApi
			.createUser({
				username: username,
				nickname: nickname,
				email: email,
				group_id: groupID,
				password: password,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("用户创建成功");
					userStore.setRefresh(userStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearUser();
			});
	}

	function updateUser() {
		userApi
			.updateUser({
				id: store.user?.id as number,
				username: username,
				nickname: nickname,
				email: email,
				group_id: groupID,
				password: password,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("用户更新成功");
					userStore.setRefresh(userStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearUser();
			});
	}

	useEffect(() => {
		if (store.user) {
			setUsername(store.user.username);
			setNickname(store.user.nickname);
			setEmail(store.user.email);
			setGroupID(store.user.group_id);
		}
	}, [store.user]);

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
					{store.mode === "edit" ? "编辑用户" : "创建用户"}
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="用户名"
					value={username}
					sx={{
						width: "70%",
					}}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<FormControl
					sx={{
						width: "30%",
						marginLeft: "1rem",
					}}
				>
					<InputLabel>用户组</InputLabel>
					<Select
						value={String(groupID)}
						label="用户组"
						onChange={(e: SelectChangeEvent) => {
							setGroupID(parseInt(e.target.value));
						}}
					>
						{groupStore?.groups?.map((group) => (
							<MenuItem
								key={group?.id as number}
								value={String(group?.id)}
							>
								{group?.display_name}
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
				<TextField
					label="昵称"
					value={nickname}
					size="small"
					sx={{
						flexGrow: 1,
					}}
					onChange={(e) => setNickname(e.target.value)}
				/>
				<TextField
					label="邮箱"
					value={email}
					size="small"
					sx={{
						flexGrow: 1,
						marginLeft: "1rem",
					}}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					marginTop: "1rem",
				}}
			>
				<TextField
					label="密码"
					value={password}
					fullWidth
					size="small"
					onChange={(e) => setPassword(e.target.value)}
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
					onClick={() => {
						store.mode === "edit" ? updateUser() : createUser();
					}}
				>
					{store.mode === "edit" ? "保存" : "创建"}
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const userStore = useUserStore();
	const userApi = useUserApi();
	const snackBarStore = useSnackBarStore();
	const store = useStore();

	function deleteUser() {
		if (store?.user?.id === 1) {
			snackBarStore.error("无法删除超级管理员");
			return;
		}
		userApi
			.deleteUser({
				id: store.user?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("用户删除成功");
				}
				store.setDeleteOpen(false);
				store.clearUser();
				userStore.setRefresh(userStore.refresh + 1);
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
				<Icon>delete</Icon>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除用户
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
					是否永久删除用户，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{store.user?.username}
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
					startIcon={<Icon>delete</Icon>}
					onClick={deleteUser}
				>
					删除
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: User }) {
	const store = useStore();

	return (
		<TableRow>
			<TableCell align={"left"}>
				<Box>{row.id}</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Avatar
						src={`https://cravatar.cn/avatar/${CryptoJS.MD5(row.email || "").toString()}`}
						sx={{
							width: 36,
							height: 36,
						}}
					/>
					<Box
						sx={{
							width: "10rem",
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
							marginX: "0.7rem",
						}}
					>
						{row.username}
					</Box>
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
					{row.nickname}
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
				{row.email}
			</TableCell>
			<TableCell>{row?.group?.display_name}</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => {
						store.setUser(row);
						store.setMode("edit");
						store.setEditOpen(true);
					}}
				>
					<Icon>edit</Icon>
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setUser(row);
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
	const userApi = useUserApi();

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const userStore = useUserStore();
	const store = useStore();

	const [users, setUsers] = useState<Array<User>>([]);
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(11);
	const [total, setTotal] = useState<number>(0);
	const [sortKey, setSortKey] = useState<"id" | "created_at" | undefined>();
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

	function getUsers() {
		userApi
			.getUsers({
				name: search,
				page: page + 1,
				size: rowsPerPage,
				sort_key: sortKey,
				sort_order: sortOrder,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setUsers(r.data as Array<User>);
					setTotal(r.total as number);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	function handleSort(key: "id" | "created_at") {
		const isAsc = sortKey === key && sortOrder === "asc";
		setPage(0);
		setSortOrder(isAsc ? "desc" : "asc");
		setSortKey(key);
	}

	useEffect(() => {
		getUsers();
	}, [page, rowsPerPage, search, sortKey, sortOrder, userStore.refresh]);

	useEffect(() => {
		document.title = `用户管理 - ${configStore?.pltCfg?.site?.title}`;
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
								<TableCell align={"left"}>用户名</TableCell>
								<TableCell align={"left"}>昵称</TableCell>
								<TableCell align={"left"}>邮箱</TableCell>
								<TableCell align={"left"}>用户组</TableCell>
								<TableCell align={"center"}>
									<IconButton
										onClick={() => {
											store.clearUser();
											store.setMode("create");
											store.setEditOpen(true);
										}}
									>
										<Icon>add</Icon>
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users?.map((row) => (
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

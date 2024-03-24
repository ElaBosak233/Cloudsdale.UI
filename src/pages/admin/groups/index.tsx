import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import {
	mdiAccountEdit,
	mdiContentSave,
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
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { useGroupApi } from "@/api/group";
import { Group } from "@/types/group";
import { useGroupStore } from "@/store/group";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;
	group?: Group;
	setGroup: (group: Group) => void;
	clearGroup: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	setGroup: (group) => set({ group }),
	clearGroup: () => set({ group: undefined }),
}));

function Edit() {
	const groupApi = useGroupApi();
	const snackBarStore = useSnackBarStore();
	const groupStore = useGroupStore();
	const store = useStore();

	const [displayName, setDisplayName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	function updateGroup() {
		groupApi
			.updateGroup({
				id: store.group?.id,
				display_name: displayName,
				description: description,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("用户组更新成功");
					groupStore.setRefresh(groupStore.refresh + 1);
				}
				store.setEditOpen(false);
				store.clearGroup();
			});
	}

	useEffect(() => {
		if (store.group) {
			setDescription(store.group?.description || "");
			setDisplayName(store.group?.display_name || "");
		}
	}, [store.group]);

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
					编辑用户组
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="显示名称"
					value={displayName}
					fullWidth
					onChange={(e) => setDisplayName(e.target.value)}
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
					onClick={updateGroup}
				>
					保存
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Group }) {
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
					{row.display_name}
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
				{row.description}
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => {
						store.setGroup(row);
						store.setEditOpen(true);
					}}
				>
					<Icon path={mdiAccountEdit} size={1} />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const groupApi = useGroupApi();

	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const groupStore = useGroupStore();
	const store = useStore();

	const [groups, setGroups] = useState<Array<Group>>([]);
	const [search, setSearch] = useState<string>("");
	const [searchInput, setSearchInput] = useState<string>("");

	function getGroups() {
		groupApi
			.getGroups({
				name: search,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setGroups(r.data as Array<Group>);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	useEffect(() => {
		getGroups();
	}, [search, groupStore.refresh]);

	useEffect(() => {
		document.title = `用户组管理 - ${configStore?.pltCfg?.site?.title}`;
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
								<TableCell align={"left"}>名称</TableCell>
								<TableCell align={"left"}>显示名称</TableCell>
								<TableCell align={"left"}>描述</TableCell>
								<TableCell align={"center"}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{groups?.map((row) => (
								<Row row={row} key={row.id} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Dialog
				open={store.editOpen}
				maxWidth={false}
				onClose={() => store.setEditOpen(false)}
			>
				<Edit />
			</Dialog>
		</>
	);
}

export default withAdmin(Page);

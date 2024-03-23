import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { Challenge } from "@/types/challenge";
import { useEffect, useState } from "react";
import { useChallengeApi } from "@/api/challenge";
import { useParams } from "react-router";
import Icon from "@mdi/react";
import { mdiContentSave, mdiDelete, mdiFlagPlus, mdiPuzzleEdit } from "@mdi/js";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { Flag } from "@/types/flag";
import { create } from "zustand";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;

	mode: "create" | "edit";
	setMode: (mode: "create" | "edit") => void;

	flag?: Flag;
	setFlag: (flag: Flag) => void;
	clearFlag: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	mode: "create",
	setMode: (mode) => set({ mode }),
	setFlag: (flag) => set({ flag }),
	clearFlag: () => set({ flag: undefined }),
}));

function Edit() {
	const store = useStore();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();

	const { id } = useParams<{ id: string }>();

	const [value, setValue] = useState<string>("");
	const [type, setType] = useState<string>("static");
	const [banned, setBanned] = useState<boolean>(false);
	const [env, setEnv] = useState<string>("");

	function createFlag() {
		challengeApi
			.createChallengeFlag({
				challenge_id: parseInt(id as string),
				value: value,
				type: type,
				banned: banned,
				env: env,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("Flag 创建成功");
				}
				store.setEditOpen(false);
				store.clearFlag();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	function updateFlag() {
		challengeApi
			.updateChallengeFlag({
				id: store?.flag?.id as number,
				value: value,
				type: type,
				banned: banned,
				env: env,
				challenge_id: parseInt(id as string),
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("Flag 更新成功");
				}
				store.setEditOpen(false);
				store.clearFlag();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	useEffect(() => {
		if (store.flag) {
			setValue(store.flag.value);
			setType(store.flag.type);
			setBanned(store.flag.banned);
			setEnv(store.flag.env);
		}
	}, [store.flag]);

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
						? "创建 Flag"
						: "编辑 Flag"}
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
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
						store.mode === "create" ? createFlag() : updateFlag()
					}
				>
					保存
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const store = useStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const challengeApi = useChallengeApi();

	const { id } = useParams<{ id: string }>();

	function deleteFlag() {
		challengeApi
			.deleteChallengeFlag({
				id: store.flag?.id as number,
				challenge_id: parseInt(id as string),
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("Flag 删除成功");
				}
				store.clearFlag();
				store.setDeleteOpen(false);
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
					删除 Flag
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
					是否永久删除 Flag，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{store.flag?.value}
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
					onClick={() => {
						deleteFlag();
						store.setDeleteOpen(false);
						store.clearFlag();
					}}
				>
					确定
				</Button>
			</Box>
		</Card>
	);
}

function Page() {
	const challengeApi = useChallengeApi();

	const store = useStore();
	const challengeStore = useChallengeStore();

	const { id } = useParams<{ id: string }>();
	const [challenge, setChallenge] = useState<Challenge>();
	const [flags, setFlags] = useState<Array<Flag>>();

	function getChallengeData() {
		challengeApi
			.getChallenges({
				id: parseInt(id as string),
				is_detailed: true,
			})
			.then((res) => {
				const r = res.data;
				setChallenge(r.data[0]);
				setFlags(r.data[0].flags);
			});
	}

	useEffect(() => {
		getChallengeData();
	}, [challengeStore.refresh]);

	useEffect(() => {
		document.title = `Flag - ${challenge?.title}`;
	}, [challenge]);

	return (
		<>
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
								<TableCell>Flag 内容</TableCell>
								<TableCell>Flag 类型</TableCell>
								<TableCell>黑名单</TableCell>
								<TableCell>环境变量</TableCell>
								<TableCell align="center">
									<IconButton
										sx={{ marginX: "0.1rem" }}
										onClick={() => {
											store.setEditOpen(true);
											store.setMode("create");
											store.clearFlag();
										}}
									>
										<Icon path={mdiFlagPlus} size={1} />
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{flags?.map((flag) => (
								<TableRow key={flag.id}>
									<TableCell>{flag.id}</TableCell>
									<TableCell
										sx={{
											fontWeight: "bold",
										}}
									>
										{flag.value}
									</TableCell>
									<TableCell>{flag.type}</TableCell>
									<TableCell>{String(flag.banned)}</TableCell>
									<TableCell>{flag.env}</TableCell>
									<TableCell align="center">
										<IconButton
											sx={{ marginX: "0.1rem" }}
											color="primary"
											onClick={() => {
												store.setEditOpen(true);
												store.setMode("edit");
												store.setFlag(flag);
											}}
										>
											<Icon
												path={mdiPuzzleEdit}
												size={1}
											/>
										</IconButton>
										<IconButton
											sx={{ marginX: "0.1rem" }}
											color="error"
											onClick={() => {
												store.setDeleteOpen(true);
												store.setFlag(flag);
											}}
										>
											<Icon path={mdiDelete} size={1} />
										</IconButton>
									</TableCell>
								</TableRow>
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

export default withAdmin(withChallenge(Page));

import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	FormControl,
	Grid,
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
import { memo, useEffect, useState } from "react";
import { useChallengeApi } from "@/api/challenge";
import { useParams } from "react-router";
import Icon from "@mdi/react";
import {
	mdiContentSave,
	mdiDelete,
	mdiFlagPlus,
	mdiPackageVariantMinus,
	mdiPackageVariantPlus,
	mdiPuzzleEdit,
} from "@mdi/js";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { create } from "zustand";
import { Image } from "@/types/image";
import { Port } from "@/types/port";
import { Env } from "@/types/env";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;

	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;

	mode: "create" | "edit";
	setMode: (mode: "create" | "edit") => void;

	image?: Image;
	setImage: (image: Image) => void;
	clearImage: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	mode: "create",
	setMode: (mode) => set({ mode }),
	setImage: (image) => set({ image }),
	clearImage: () => set({ image: undefined }),
}));

function Edit() {
	const store = useStore();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();
	const challengeApi = useChallengeApi();

	const { id } = useParams<{ id: string }>();

	const [imageID, setImageID] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const [cpuLimit, setCpuLimit] = useState<number>(0);
	const [memoryLimit, setMemoryLimit] = useState<number>(0);
	const [description, setDescription] = useState<string>("");
	const [ports, setPorts] = useState<Array<Port>>([]);
	const [envs, setEnvs] = useState<Array<Env>>([]);

	function createImage() {
		challengeApi
			.createChallengeImage({
				challenge_id: parseInt(id as string),
				name: name,
				cpu_limit: cpuLimit,
				memory_limit: memoryLimit,
				description: description,
				ports: ports,
				envs: envs,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("镜像创建成功");
				}
				store.setEditOpen(false);
				store.clearImage();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	function updateImage() {
		challengeApi
			.updateChallengeImage({
				id: store?.image?.id as number,
				challenge_id: parseInt(id as string),
				name: name,
				cpu_limit: cpuLimit,
				memory_limit: memoryLimit,
				description: description,
				ports: ports,
				envs: envs,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("镜像更新成功");
				}
				store.setEditOpen(false);
				store.clearImage();
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	useEffect(() => {
		if (store.image) {
			setImageID(store.image.id);
			setName(store.image.name);
			setCpuLimit(store.image.cpu_limit);
			setMemoryLimit(store.image.memory_limit);
			setDescription(store.image.description);
			setPorts(store.image.ports || []);
			setEnvs(store.image.envs || []);
		}
	}, [store.image]);

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
					{store.mode === "create" ? "创建镜像" : "编辑镜像"}
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="镜像名"
					value={name}
					sx={{
						width: "50%",
					}}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					label="CPU 限制（核）"
					value={cpuLimit}
					sx={{
						width: "25%",
						marginX: "1rem",
					}}
					onChange={(e) => setCpuLimit(Number(e.target.value))}
				/>
				<TextField
					label="内存限制（MB）"
					value={memoryLimit}
					sx={{
						width: "25%",
					}}
					onChange={(e) => setMemoryLimit(Number(e.target.value))}
				/>
			</Box>
			<Box
				sx={{
					marginY: "1rem",
					display: "flex",
				}}
			>
				<TextField
					label="描述"
					multiline
					rows={4}
					value={description}
					sx={{
						width: "100%",
					}}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</Box>
			<Box>
				{ports?.map((port, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							alignItems: "center",
							marginY: "0.5rem",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexGrow: 1,
							}}
						>
							<TextField
								value={port.value}
								size="small"
								label={`端口 ${index + 1}`}
								onChange={(event) => {
									const newPorts = [...ports];
									newPorts[index].value = Number(
										event.target.value
									);
									setPorts(newPorts);
								}}
								sx={{
									width: "5rem",
								}}
							/>
							<TextField
								value={port.description}
								size="small"
								label="描述"
								onChange={(event) => {
									const newPorts = [...ports];
									newPorts[index].description =
										event.target.value;
									setPorts(newPorts);
								}}
								sx={{
									width: "100%",
									marginX: "0.5rem",
								}}
							/>
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Box>
								<Button
									color="primary"
									variant="contained"
									disableElevation
									onClick={() => {
										const newPorts = [...ports];
										newPorts.splice(index, 1);
										setPorts(newPorts);
									}}
								>
									-
								</Button>
							</Box>
						</Box>
					</Box>
				))}
				<Box
					sx={{
						display: "flex",
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={(index) => {
							setPorts([
								...ports,
								{
									value: 0,
									description: "",
									image_id: imageID,
								},
							]);
						}}
						disableElevation
						sx={{
							width: "100%",
							marginTop: "0.5rem",
							marginBottom: "1rem",
						}}
					>
						+ 添加端口
					</Button>
				</Box>
			</Box>
			<Box>
				{envs?.map((env, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							alignItems: "center",
							marginY: "0.5rem",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexGrow: 1,
							}}
						>
							<TextField
								value={env.key}
								size="small"
								label={`环境变量 ${index + 1}`}
								onChange={(event) => {
									const newEnvs = [...envs];
									newEnvs[index].key = event.target.value;
									setEnvs(newEnvs);
								}}
								sx={{
									width: "20rem",
								}}
							/>
							<TextField
								value={env.value}
								size="small"
								label="值"
								onChange={(event) => {
									const newEnvs = [...envs];
									newEnvs[index].value = event.target.value;
									setEnvs(newEnvs);
								}}
								sx={{
									width: "100%",
									marginX: "0.5rem",
								}}
							/>
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Box>
								<Button
									color="primary"
									variant="contained"
									disableElevation
									onClick={() => {
										const newEnvs = [...envs];
										newEnvs.splice(index, 1);
										setEnvs(newEnvs);
									}}
								>
									-
								</Button>
							</Box>
						</Box>
					</Box>
				))}
				<Box
					sx={{
						display: "flex",
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={(index) => {
							setEnvs([
								...envs,
								{
									key: "",
									value: "",
									image_id: imageID,
								},
							]);
						}}
						disableElevation
						sx={{
							width: "100%",
							marginTop: "0.5rem",
							marginBottom: "1rem",
						}}
					>
						+ 添加环境变量
					</Button>
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
					disableElevation
					startIcon={<Icon path={mdiContentSave} size={1} />}
					onClick={() =>
						store.mode === "create" ? createImage() : updateImage()
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

	function deleteImage() {
		challengeApi
			.deleteChallengeImage({
				id: store.image?.id as number,
				challenge_id: parseInt(id as string),
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("镜像删除成功");
				}
				store.clearImage();
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
					删除镜像
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
					是否永久删除镜像，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{useStore.getState().image?.name}
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
						deleteImage();
						store.setDeleteOpen(false);
						store.clearImage();
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
	const [images, setImages] = useState<Array<Image>>();

	function getChallengeData() {
		challengeApi
			.getChallenges({
				id: parseInt(id as string),
				is_detailed: true,
			})
			.then((res) => {
				const r = res.data;
				setChallenge(r.data[0]);
				setImages(r.data[0].images);
			});
	}

	useEffect(() => {
		getChallengeData();
	}, [challengeStore.refresh]);

	useEffect(() => {
		document.title = `镜像	 - ${challenge?.title}`;
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
								<TableCell>镜像名</TableCell>
								<TableCell>CPU 限制（核）</TableCell>
								<TableCell>内存限制（MB）</TableCell>
								<TableCell>描述</TableCell>
								<TableCell>开放端口</TableCell>
								<TableCell align="center">
									<IconButton
										sx={{ marginX: "0.1rem" }}
										onClick={() => {
											store.setEditOpen(true);
											store.setMode("create");
											store.clearImage();
										}}
									>
										<Icon
											path={mdiPackageVariantPlus}
											size={1}
										/>
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{images?.map((image) => (
								<TableRow key={image.id}>
									<TableCell>{image.id}</TableCell>
									<TableCell
										sx={{
											fontWeight: "bold",
										}}
									>
										{image.name}
									</TableCell>
									<TableCell>{image.cpu_limit}</TableCell>
									<TableCell>{image.memory_limit}</TableCell>
									<TableCell>{image.description}</TableCell>
									<TableCell>
										{image?.ports?.map((port) => (
											<Box
												key={port.id}
												sx={{ marginX: "0.25rem" }}
											>
												{port.value}
											</Box>
										))}
									</TableCell>
									<TableCell align="center">
										<IconButton
											sx={{ marginX: "0.1rem" }}
											color="primary"
											onClick={() => {
												store.setEditOpen(true);
												store.setMode("edit");
												store.setImage(image);
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
												store.setImage(image);
											}}
										>
											<Icon
												path={mdiPackageVariantMinus}
												size={1}
											/>
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

import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	IconButton,
	Icon,
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
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/category";
import { challenge as color } from "@/utils/color";
import { useCategoryApi } from "@/api/category";
import { Category } from "@/types/category";
import { create } from "zustand";

interface State {
	editOpen: boolean;
	setEditOpen: (editOpen: boolean) => void;
	mode: "create" | "edit";
	setMode: (mode: "create" | "edit") => void;
	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;
	category?: Category;
	setCategory: (category: Category) => void;
	clearCategory: () => void;
}

const useStore = create<State>((set) => ({
	editOpen: false,
	setEditOpen: (editOpen) => set({ editOpen }),
	mode: "create",
	setMode: (mode) => set({ mode }),
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	setCategory: (category) => set({ category }),
	clearCategory: () => set({ category: undefined }),
}));

function Edit() {
	const store = useStore();
	const categoryStore = useCategoryStore();
	const snackBarStore = useSnackBarStore();
	const categoryApi = useCategoryApi();

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [color, setColor] = useState<string>("");
	const [icon, setIcon] = useState<string>("");

	function createCategory() {
		categoryApi
			.createCategory({
				name: name,
				description: description,
				color: color,
				icon: icon,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("创建成功");
				}
				store.setEditOpen(false);
				store.clearCategory();
				categoryStore.setRefresh(categoryStore.refresh + 1);
			});
	}

	function updateCategory() {
		categoryApi
			.updateCategory({
				id: store.category?.id as number,
				name: name,
				description: description,
				color: color,
				icon: icon,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("保存成功");
				}
				store.setEditOpen(false);
				store.clearCategory();
				categoryStore.setRefresh(categoryStore.refresh + 1);
			});
	}

	useEffect(() => {
		if (store.category) {
			setName(store?.category?.name || "");
			setDescription(store?.category?.description || "");
			setColor(store?.category?.color || "");
			setIcon(store?.category?.icon || "");
		}
	}, [store.category]);

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
					{store.mode === "create" ? "创建分类" : "编辑分类"}
				</Typography>
			</Box>
			<Divider sx={{ marginY: "0.75rem" }} />
			<Box
				sx={{
					display: "flex",
				}}
			>
				<TextField
					label="名称"
					value={name}
					sx={{
						width: "60%",
					}}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					label="颜色"
					value={color}
					sx={{
						width: "40%",
						marginLeft: "1rem",
					}}
					onChange={(e) => setColor(e.target.value)}
				/>
			</Box>
			<Box>
				<TextField
					label="图标"
					value={icon}
					sx={{
						width: "100%",
						marginTop: "1rem",
					}}
					onChange={(e) => setIcon(e.target.value)}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					marginTop: "1rem",
				}}
			>
				<TextField
					multiline
					rows={4}
					label="描述"
					value={description}
					sx={{
						width: "100%",
					}}
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
					startIcon={<Icon>save</Icon>}
					onClick={() => {
						store.mode === "create"
							? createCategory()
							: updateCategory();
					}}
				>
					{store.mode === "create" ? "创建" : "保存"}
				</Button>
			</Box>
		</Card>
	);
}

function Delete() {
	const store = useStore();
	const categoryStore = useCategoryStore();
	const snackBarStore = useSnackBarStore();
	const categoryApi = useCategoryApi();

	function deleteCategory() {
		categoryApi
			.deleteCategory({
				id: store.category?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("删除成功");
				}
				store.setDeleteOpen(false);
				store.clearCategory();
				categoryStore.setRefresh(categoryStore.refresh + 1);
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
				<Typography>确定删除 {store.category?.name} 吗？</Typography>
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
					onClick={() => {
						deleteCategory();
					}}
				>
					删除
				</Button>
			</Box>
		</Card>
	);
}

function Row({ row }: { row: Category }) {
	const store = useStore();

	return (
		<TableRow>
			<TableCell align={"left"}>
				<Box>{row.id}</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						width: "5rem",
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
			<TableCell align={"left"}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: color.useTextColor(false, row.color),
					}}
				>
					<Box sx={{ marginX: "0.5rem" }}>{row?.color}</Box>
				</Box>
			</TableCell>
			<TableCell align={"left"}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: color.useTextColor(false, row.color),
					}}
				>
					<Icon>{row?.icon as string}</Icon>
					<Box sx={{ marginX: "0.5rem" }}>{row?.icon}</Box>
				</Box>
			</TableCell>
			<TableCell align={"center"}>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="primary"
					onClick={() => {
						store.setEditOpen(true);
						store.setCategory(row);
						store.setMode("edit");
					}}
				>
					<Icon>edit</Icon>
				</IconButton>
				<IconButton
					sx={{ marginX: "0.1rem" }}
					color="error"
					onClick={() => {
						store.setDeleteOpen(true);
						store.setCategory(row);
					}}
				>
					<Icon>delete</Icon>
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

function Page() {
	const store = useStore();
	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const categoryStore = useCategoryStore();

	const categoryApi = useCategoryApi();

	const [categories, setCategories] = useState<Array<Category>>([]);

	function getCategoriesData() {
		categoryApi
			.getCategories()
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setCategories(r.data as Array<Category>);
				}
			})
			.catch((err) => {
				snackBarStore.error(`加载失败 ${err}`);
			});
	}

	useEffect(() => {
		getCategoriesData();
	}, [categoryStore.refresh]);

	useEffect(() => {
		document.title = `分类管理 - ${configStore?.pltCfg?.site?.title}`;
	}, []);

	return (
		<>
			<Paper
				sx={{
					padding: "1.5rem",
					minHeight: "82vh",
				}}
			>
				<TableContainer
					component={Paper}
					sx={{
						borderTopLeftRadius: "0.5rem",
						borderTopRightRadius: "0.5rem",
						minHeight: "75vh",
					}}
				>
					<Table stickyHeader size={"small"}>
						<TableHead sx={{ height: "3.5rem" }}>
							<TableRow>
								<TableCell align={"left"}>ID</TableCell>
								<TableCell align={"left"}>名称</TableCell>
								<TableCell align={"left"}>描述</TableCell>
								<TableCell align={"left"}>颜色</TableCell>
								<TableCell align={"left"}>图标</TableCell>
								<TableCell align={"center"}>
									<IconButton
										onClick={() => {
											store.clearCategory();
											store.setEditOpen(true);
											store.setMode("create");
										}}
									>
										<Icon>add</Icon>
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories?.map((row) => (
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

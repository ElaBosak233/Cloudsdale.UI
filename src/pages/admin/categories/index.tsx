import { getChallenges, updateChallenge } from "@/api/challenge";
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
import { getCategories } from "@/api/category";
import { Category } from "@/types/category";
import Loading from "@/components/ui/Loading";

function Row({ row }: { row: Category }) {
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
					<UIcon path={`mdi${row?.icon as string}`} size={1} />
					<Box sx={{ marginX: "0.5rem" }}>{row?.icon}</Box>
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
	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const categoryStore = useCategoryStore();

	const [categories, setCategories] = useState<Array<Category>>([]);

	function getCategoriesData() {
		getCategories()
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
		document.title = `分类管理 - ${configStore.pltCfg.site.title}`;
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
									<IconButton>
										<Icon path={mdiBookPlus} size={1} />
									</IconButton>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories.map((row) => (
								<Row row={row} key={row.id} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</>
	);
}

export default withAdmin(Page);

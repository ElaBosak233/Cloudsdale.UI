import { useConfigApi } from "@/api/config";
import withAdmin from "@/components/layouts/withAdmin";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function Page() {
	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const configApi = useConfigApi();

	const [title, setTitle] = useState<string>(
		configStore?.pltCfg?.site?.title || ""
	);
	const [description, setDescription] = useState<string>(
		configStore?.pltCfg?.site?.description || ""
	);

	function updateConfig() {
		configApi
			.updatePltCfg({
				...configStore.pltCfg,
				site: {
					title: title,
					description: description,
				},
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("更新成功");
				}
				configStore.setRefresh(configStore.refresh + 1);
			});
	}

	useEffect(() => {
		setTitle(configStore.pltCfg?.site?.title || "");
		setDescription(configStore.pltCfg?.site?.description || "");
	}, [configStore?.pltCfg]);

	useEffect(() => {
		document.title = `全局设置 - ${configStore.pltCfg?.site?.title}`;
	}, []);

	return (
		<Paper
			sx={{
				padding: "2rem",
				minHeight: "82vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					flexGrow: 1,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: "text.secondary",
					}}
				>
					<Icon path={mdiWeb} size={1.5} />
					<Typography
						sx={{
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
					>
						站点
					</Typography>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
					}}
				>
					<TextField
						fullWidth
						label="标题"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					/>
					<TextField
						size="small"
						fullWidth
						label="描述"
						value={description}
						sx={{
							marginTop: "1rem",
						}}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</Box>
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
					disableElevation
					variant="contained"
					onClick={updateConfig}
				>
					保存
				</Button>
			</Box>
		</Paper>
	);
}

export default withAdmin(Page);

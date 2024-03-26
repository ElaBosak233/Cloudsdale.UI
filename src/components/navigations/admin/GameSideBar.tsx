import {
	mdiArrowLeft,
	mdiInformation,
	mdiFlag,
	mdiPackageVariant,
	mdiCheckDecagram,
	mdiBookshelf,
	mdiBookMultiple,
	mdiAccountMultiple,
	mdiBullhorn,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Box, Button, Divider } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";

export default function GameSideBar() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const path = location.pathname.split(`/admin/games/${id}`)[1];
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				width: "10rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Button
				variant="contained"
				disableElevation
				startIcon={<Icon path={mdiArrowLeft} size={1} />}
				sx={{
					fontWeight: "bold",
				}}
				onClick={() => navigate(`/admin/games`)}
			>
				返回上级
			</Button>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			<Button
				variant={path === "" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiInformation} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/games/${id}`)}
			>
				基本信息
			</Button>
			<Button
				variant={path === "/challenges" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiBookMultiple} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/games/${id}/challenges`)}
			>
				题目
			</Button>
			<Button
				variant={path === "/teams" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiAccountMultiple} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/games/${id}/teams`)}
			>
				参赛团队
			</Button>
			<Button
				variant={path === "/submissions" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiCheckDecagram} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/games/${id}/submissions`)}
			>
				提交记录
			</Button>
			<Button
				variant={path === "/notices" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiBullhorn} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				disabled={true}
				onClick={() => navigate(`/admin/games/${id}/notices`)}
			>
				公告
			</Button>
		</Box>
	);
}

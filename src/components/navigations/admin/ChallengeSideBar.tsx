import {
	mdiArrowLeft,
	mdiInformation,
	mdiFlag,
	mdiPackageVariant,
	mdiCheckDecagram,
	mdiAttachment,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Box, Button, Divider } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";

export default function ChallengeSideBar() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const path = location.pathname.split(`/admin/challenges/${id}`)[1];
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
				onClick={() => navigate(`/admin/challenges`)}
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
				onClick={() => navigate(`/admin/challenges/${id}`)}
			>
				基本信息
			</Button>
			<Button
				variant={path === "/flags" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiFlag} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/challenges/${id}/flags`)}
			>
				Flag
			</Button>
			<Button
				variant={path === "/images" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiPackageVariant} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/challenges/${id}/images`)}
			>
				镜像
			</Button>
			<Button
				variant={path === "/attachments" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiAttachment} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/challenges/${id}/attachments`)}
			>
				附件
			</Button>
			<Button
				variant={path === "/submissions" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon path={mdiCheckDecagram} size={1} />}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/challenges/${id}/submissions`)}
			>
				提交记录
			</Button>
		</Box>
	);
}

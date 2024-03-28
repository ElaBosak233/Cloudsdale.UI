import { Box, Button, Divider, Icon } from "@mui/material";
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
				startIcon={<Icon>arrow_back</Icon>}
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
				startIcon={<Icon>info</Icon>}
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
				startIcon={<Icon>flag</Icon>}
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
				startIcon={<Icon>deployed_code</Icon>}
				sx={{
					fontWeight: "bold",
					marginY: "0.25rem",
				}}
				onClick={() => navigate(`/admin/challenges/${id}/images`)}
			>
				镜像
			</Button>
			<Button
				variant={path === "/submissions" ? "contained" : "text"}
				disableElevation
				startIcon={<Icon>verified</Icon>}
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

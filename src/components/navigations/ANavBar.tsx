import Logo from "@/components/widgets/Logo";
import { Box, Button, Icon } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

export default function ANavBar() {
	const location = useLocation();
	const navigate = useNavigate();
	const path = location.pathname.split("/admin")[1];

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Logo />
				<Box sx={{ display: "flex" }}>
					<Button
						disableElevation
						variant={path === "" ? "contained" : "outlined"}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>home</Icon>}
						onClick={() => {
							navigate("/admin");
						}}
					>
						全局
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/challenges")
								? "contained"
								: "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>collections_bookmark</Icon>}
						onClick={() => {
							navigate("/admin/challenges");
						}}
					>
						题库
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/categories")
								? "contained"
								: "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>category</Icon>}
						onClick={() => {
							navigate("/admin/categories");
						}}
					>
						分类
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/games") ? "contained" : "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>flag</Icon>}
						onClick={() => {
							navigate("/admin/games");
						}}
					>
						比赛
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/teams") ? "contained" : "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>group</Icon>}
						onClick={() => {
							navigate("/admin/teams");
						}}
					>
						团队
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/groups")
								? "contained"
								: "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>shield_person</Icon>}
						onClick={() => {
							navigate("/admin/groups");
						}}
					>
						用户组
					</Button>
					<Button
						disableElevation
						variant={
							path.startsWith("/users") ? "contained" : "outlined"
						}
						size="large"
						sx={{
							fontWeight: "bold",
							marginX: "0.5rem",
						}}
						startIcon={<Icon>person</Icon>}
						onClick={() => {
							navigate("/admin/users");
						}}
					>
						用户
					</Button>
				</Box>
			</Box>
		</>
	);
}

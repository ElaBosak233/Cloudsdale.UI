import {
	Divider,
	Drawer,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useThemeStore } from "@/store/theme";
import { useNavigate } from "react-router";
import Icon from "@mdi/react";
import {
	mdiHome,
	mdiBookMultiple,
	mdiFlag,
	mdiAccountMultiple,
	mdiCog,
	mdiThemeLightDark,
	mdiAccount,
	mdiLogout,
} from "@mdi/js";
import { useAuthStore } from "@/store/auth";

function SideBarTooltip({
	children,
	...props
}: {
	children: React.ReactElement<any, any>;
	[key: string]: any;
}) {
	return (
		<Tooltip
			title={props.title}
			placement="right"
			slotProps={{
				popper: {
					sx: {
						fontSize: "5rem",
					},
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [0, 10],
							},
						},
					],
				},
			}}
			{...props}
		>
			{children}
		</Tooltip>
	);
}

export default function SideBar() {
	const { mode, toggleMode } = useThemeStore();
	const authStore = useAuthStore();
	const navigate = useNavigate();

	const drawerWidth = "4.375rem";

	const [menuOpen, setMenuOpen] = useState(false);

	function handleLogout() {
		authStore.setPgsToken("");
		authStore.setUser();
		setMenuOpen(false);
		navigate("/login");
	}

	return (
		<>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					boxSizing: "border-box",
					whiteSpace: "nowrap",
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						overflowX: "hidden",
						backgroundColor: "primary.900",
					},
				}}
				variant="permanent"
				anchor="left"
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						marginTop: "1rem",
					}}
				>
					<img
						src={"/favicon.ico"}
						width={32}
						height={32}
						alt={""}
						draggable={false}
						className={"no-select"}
					/>
				</Box>
				<div style={{ flexGrow: 1 }}></div>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<SideBarTooltip title="主页">
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => navigate("/")}
						>
							<Icon path={mdiHome} size={1} />
						</IconButton>
					</SideBarTooltip>
					<SideBarTooltip title="练习场">
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => navigate("/challenges")}
						>
							<Icon path={mdiBookMultiple} size={1} />
						</IconButton>
					</SideBarTooltip>
					<SideBarTooltip title="比赛">
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => navigate("/games")}
						>
							<Icon path={mdiFlag} size={1} />
						</IconButton>
					</SideBarTooltip>
					<SideBarTooltip title="团队">
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => navigate("/teams")}
						>
							<Icon path={mdiAccountMultiple} size={1} />
						</IconButton>
					</SideBarTooltip>
					{authStore.user?.group?.name === "admin" && (
						<SideBarTooltip title="管理">
							<IconButton
								sx={{ color: "white", marginTop: "5px" }}
								onClick={() => navigate("/admin")}
							>
								<Icon path={mdiCog} size={1} />
							</IconButton>
						</SideBarTooltip>
					)}
				</Box>
				<div style={{ flexGrow: 1 }}></div>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						marginBottom: "1rem",
					}}
				>
					<IconButton
						sx={{ color: "white" }}
						onClick={() =>
							toggleMode(mode === "dark" ? "light" : "dark")
						}
					>
						<Icon path={mdiThemeLightDark} size={1} />
					</IconButton>
					{!authStore.user && (
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => navigate("/login")}
						>
							<Icon path={mdiAccount} size={1} />
						</IconButton>
					)}
					{authStore.user && (
						<IconButton
							sx={{ color: "white", marginTop: "5px" }}
							onClick={() => setMenuOpen(true)}
						>
							<Icon path={mdiAccount} size={1} />
						</IconButton>
					)}
				</Box>
			</Drawer>
			<Menu
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: window.innerHeight, left: 80 }}
				slotProps={{
					paper: {
						sx: {
							minWidth: "10rem",
							transformOrigin: "left top",
						},
					},
				}}
			>
				<MenuItem onClick={() => navigate("/profile")}>
					<ListItemIcon>
						<Icon path={mdiAccount} size={0.8} />
					</ListItemIcon>
					<Typography sx={{ fontSize: "0.8rem" }}>
						{authStore.user?.nickname}
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<Icon path={mdiLogout} size={0.8} />
					</ListItemIcon>
					<Typography sx={{ fontSize: "0.8rem" }}>登出</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}

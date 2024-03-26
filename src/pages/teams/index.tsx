import { useUserApi } from "@/api/user";
import { useAuthStore } from "@/store/auth";
import { useConfigStore } from "@/store/config";
import { Team } from "@/types/team";
import { Avatar, Box, Card, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import CryptoJS from "crypto-js";
import { mdiAccountGroup, mdiStar } from "@mdi/js";

function TeamCard({ team }: { team: Team }) {
	const authStore = useAuthStore();

	return (
		<Card
			sx={{
				position: "relative",
				height: "12.5rem",
				width: "22rem",
				padding: "1.5rem",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Avatar
					src={`https://cravatar.cn/avatar/${CryptoJS.MD5(team?.email || "").toString()}`}
					sx={{
						width: 56,
						height: 56,
					}}
				/>
				<Box
					sx={{
						fontWeight: "bold",
						fontSize: "1.25rem",
						marginX: "1rem",
					}}
				>
					{team.name}
				</Box>
			</Box>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			<Box>{team.description}</Box>
			<Box
				sx={{
					position: "absolute",
					bottom: "-1rem",
					right: "1rem",
					opacity: 0.1,
					zIndex: 0,
				}}
			>
				<Icon path={mdiAccountGroup} size={8} />
			</Box>
			{team.captain_id === authStore.user?.id && (
				<Box
					sx={{
						position: "absolute",
						top: "1rem",
						right: "1rem",
						zIndex: 1,
					}}
				>
					<Icon path={mdiStar} size={1.25} color="#fcc419" />
				</Box>
			)}
		</Card>
	);
}

export default function Page() {
	const authStore = useAuthStore();
	const configStore = useConfigStore();
	const userApi = useUserApi();

	const [teams, setTeams] = useState<Array<Team>>();

	function getUser() {
		userApi
			.getUsers({
				id: authStore?.user?.id,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setTeams(r.data[0].teams);
				}
			});
	}

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		document.title = `团队 - ${configStore?.pltCfg?.site?.title}`;
	}, []);

	return (
		<Box sx={{ marginTop: "2rem", marginX: "10%" }}>
			<Box display={"flex"} alignItems={"center"} className={"no-select"}>
				<img
					src="/favicon.ico"
					alt="logo"
					width={48}
					height={48}
					draggable={false}
				/>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontSize: "2rem",
						fontWeight: "bold",
						fontFamily: "sans-serif",
					}}
					color={"text.primary"}
				>
					团队
				</Typography>
			</Box>
			<Grid container spacing={2} sx={{ marginY: "2rem" }}>
				{teams?.map((team, index) => (
					<Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
						<TeamCard team={team} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

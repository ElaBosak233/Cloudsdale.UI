import { useUserApi } from "@/api/user";
import { useAuthStore } from "@/store/auth";
import { useConfigStore } from "@/store/config";
import { Team } from "@/types/team";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function TeamCard({ team }: { team: Team }) {
	return (
		<Card
			sx={{
				height: "12.5rem",
				width: "22rem",
				padding: "1.5rem",
			}}
		>
			<Typography>{team.name}</Typography>
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

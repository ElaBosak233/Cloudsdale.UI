import { useGameApi } from "@/api/game";
import Loading from "@/components/ui/Loading";
import Markdown from "@/components/ui/Markdown";
import { useConfigStore } from "@/store/config";
import { Game } from "@/types/game";
import { formatUnixTimestamp } from "@/utils/datetime";
import {
	Box,
	Button,
	Chip,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Page() {
	const gameApi = useGameApi();

	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const navigate = useNavigate();
	const configStore = useConfigStore();

	const started_at = formatUnixTimestamp(game?.started_at as number);
	const ended_at = formatUnixTimestamp(game?.ended_at as number);

	const progress =
		(Math.floor(Date.now() / 1000) - (game?.started_at as number)) /
		((game?.ended_at as number) - (game?.started_at as number));

	function getGameData() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	useEffect(() => {
		getGameData();
	}, []);

	useEffect(() => {
		document.title = `${game?.title} - ${configStore?.pltCfg?.site?.title}`;
	}, [game]);

	return (
		<>
			{!game && <Loading />}
			<Box>
				<Paper
					sx={{
						minHeight: "22rem",
						borderRadius: 0,
						paddingX: "25%",
						paddingY: "5rem",
					}}
				>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "45%" }}>
							<Typography
								sx={{
									fontSize: "2.25rem",
									fontWeight: "bold",
								}}
							>
								{game?.title}
							</Typography>
							<Typography
								sx={{
									fontSize: "0.8rem",
								}}
							>
								{game?.bio}
							</Typography>
							<Box sx={{ display: "flex", marginY: "1rem" }}>
								<Chip size={"small"} label={started_at}></Chip>
								<Box sx={{ marginX: "0.5rem" }}>→</Box>
								<Chip size={"small"} label={ended_at}></Chip>
							</Box>
							<LinearProgress value={progress} />
							<Box sx={{ display: "flex", marginY: "1rem" }}>
								<Button variant="contained" disableElevation>
									申请参赛
								</Button>
								<Button
									variant="contained"
									disableElevation
									sx={{ marginX: "1rem" }}
									onClick={() => {
										navigate(`/games/${id}/scoreboard`);
									}}
								>
									查看榜单
								</Button>
								<Button
									variant="contained"
									disableElevation
									onClick={() => {
										navigate(`/games/${id}/challenges`);
									}}
								>
									进入比赛
								</Button>
							</Box>
						</Box>
						<Box
							sx={{
								width: "50%",
								marginLeft: "5%",
								backgroundImage:
									"url('https://cdn.vuetifyjs.com/images/parallax/material.jpg')",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								borderRadius: "0.5rem",
							}}
						/>
					</Box>
				</Paper>
				<Box sx={{ marginX: "25%", marginY: "2rem" }}>
					<Markdown content={game?.description} />
				</Box>
			</Box>
		</>
	);
}

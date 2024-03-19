import { getGameByID, getGameChallenges } from "@/api/game";
import ChallengeCard from "@/components/widgets/ChallengeCard";
import { Challenge } from "@/types/challenge";
import { Game } from "@/types/game";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Page() {
	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const [challenges, setChallenges] = useState<Array<Challenge>>();

	function getGameData() {
		getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
			}
		});
	}

	function getChallengesData() {
		getGameChallenges({
			game_id: game?.id,
			is_enabled: true,
		}).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setChallenges(r.data);
			}
		});
	}

	useEffect(() => {
		getGameData();
	}, []);

	useEffect(() => {
		if (game) {
			getChallengesData();
		}
	}, [game]);

	useEffect(() => {
		document.title = `题目 - ${game?.title}`;
	}, [game]);

	return (
		<>
			<Box sx={{ marginTop: "2rem", marginX: "10%" }}>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontSize: "2rem",
						fontWeight: "bold",
						fontFamily: "sans-serif",
					}}
					color={"text.primary"}
				>
					{game?.title}
				</Typography>
				<Box sx={{ marginY: "2rem" }}>
					{challenges?.map((challenge) => (
						<ChallengeCard challenge={challenge} />
					))}
				</Box>
			</Box>
		</>
	);
}

import { Box, ButtonBase, Chip, Paper, Typography } from "@mui/material";
import { game as color } from "@/utils/color";
import { Game } from "@/types/game";
import { useNavigate } from "react-router";
import { formatUnixTimestamp } from "@/utils/datetime";

export default function GameCard({ game }: { game: Game }) {
	const navigate = useNavigate();
	const duration = (game?.ended_at as number) - (game?.started_at as number);
	const started_at = formatUnixTimestamp(game?.started_at as number);
	const ended_at = formatUnixTimestamp(game?.ended_at as number);

	return (
		<ButtonBase
			sx={{ minWidth: "100%" }}
			onClick={() => {
				navigate(`/games/${game?.id}`);
			}}
		>
			<Paper
				sx={{
					display: "flex",
					height: "12rem",
					width: "100%",
				}}
			>
				<Paper
					sx={{
						width: "35%",
						backgroundImage: `url('${game?.cover_url}')`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center center",
						borderTopRightRadius: 0,
						borderBottomRightRadius: 0,
					}}
					elevation={0}
				/>
				<Box
					sx={{
						padding: "2rem",
						textAlign: "start",
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<Box>
						<Box
							sx={{
								marginY: "0.1rem",
								display: "flex",
							}}
						>
							<Chip
								size="small"
								label={
									game?.member_limit_min === 1 &&
									game?.member_limit_max === 1
										? "单人赛"
										: "多人赛"
								}
								sx={{
									fontSize: "0.7rem",
									fontWeight: "bold",
									marginX: "0.5rem",
									bgcolor: color.useChipColor("#e7f5ff"),
									color: color.useTextColor("#2187df"),
								}}
							/>
							<Chip
								size="small"
								label={`${duration / 3600} 小时`}
								sx={{
									fontSize: "0.7rem",
									fontWeight: "bold",
									marginX: "0.5rem",
									bgcolor: color.useChipColor("#e7f5ff"),
									color: color.useTextColor("#2187df"),
								}}
							/>
						</Box>
						<Box>
							<Typography
								sx={{
									fontSize: "2rem",
									fontWeight: 900,
									fontFamily: "san-serif",
								}}
							>
								{game?.title}
							</Typography>
							<Typography
								sx={{
									marginTop: "0.5rem",
									fontSize: "0.8rem",
									fontFamily: "san-serif",
								}}
							>
								{game?.bio}
							</Typography>
						</Box>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Chip size={"small"} label={started_at}></Chip>
						<Box sx={{ marginX: "0.5rem" }}>→</Box>
						<Chip size={"small"} label={ended_at}></Chip>
					</Box>
				</Box>
			</Paper>
		</ButtonBase>
	);
}

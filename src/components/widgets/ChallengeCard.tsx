import { Challenge } from "@/types/challenge";
import {
	Box,
	Icon,
	Card,
	CardContent,
	Chip,
	Divider,
	Rating,
	Tooltip,
	Typography,
} from "@mui/material";
import { useThemeStore } from "@/store/theme";
import { hexToRGBA } from "@/utils/color";
import StarOutlined from "../icons/stars/StarOutlined";
import Star from "../icons/stars/Star";

export default function ChallengeCard({
	challenge,
}: {
	challenge: Challenge;
}): JSX.Element {
	const themeStore = useThemeStore();

	const isSolved: boolean = challenge.solved ? true : false;

	const bgColor = () => {
		switch (themeStore.mode) {
			case "dark":
				return isSolved
					? hexToRGBA(challenge?.category?.color as string, 0.6)
					: hexToRGBA(challenge?.category?.color as string, 0.2);
			case "light":
			default:
				return isSolved
					? hexToRGBA(challenge?.category?.color as string, 1)
					: hexToRGBA(challenge?.category?.color as string, 0.1);
		}
	};

	const chipColor = isSolved
		? hexToRGBA("#FFFFFF", 0.1)
		: hexToRGBA(challenge?.category?.color as string, 0.1);

	const textColor = () => {
		switch (themeStore.mode) {
			case "dark":
				return isSolved
					? hexToRGBA("#FFFFFF", 1)
					: hexToRGBA("#FFFFFF", 0.9);
			case "light":
			default:
				return isSolved
					? hexToRGBA("#FFFFFF", 1)
					: challenge?.category?.color;
		}
	};

	return (
		<Card
			sx={{
				width: 275,
				height: 150,
				backgroundColor: bgColor,
				position: "relative",
				cursor: "pointer",
				zIndex: 0,
			}}
		>
			<CardContent>
				<Chip
					label={challenge?.category?.name}
					size="small"
					sx={{
						fontSize: "0.75rem",
						fontWeight: "500",
						mb: "0.25rem",
						bgcolor: chipColor,
						color: textColor,
					}}
				/>
				<Typography
					variant="h6"
					sx={{
						fontWeight: "bold",
						width: 200,
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						my: 1,
					}}
					color={textColor}
				>
					{challenge.title}
				</Typography>
				<Divider
					sx={{
						my: 1,
						bgcolor: textColor,
						borderColor: textColor,
						zIndex: 1,
					}}
				/>
				<Box
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography
						sx={{ m: 1, fontWeight: "bold", color: textColor }}
					>
						{challenge.pts} pts
					</Typography>
					<Rating
						readOnly
						value={challenge.difficulty}
						sx={{
							color: textColor,
							"& .MuiRating-iconEmpty": {
								color: textColor,
							},
						}}
						size="large"
						icon={
							<Star
								sx={{
									fontSize: "1.75rem",
								}}
							/>
						}
						emptyIcon={
							<StarOutlined
								sx={{
									fontSize: "1.75rem",
								}}
							/>
						}
					/>
				</Box>
			</CardContent>
			{isSolved && (
				<Box
					sx={{
						position: "absolute",
						top: "0.75rem",
						right: "0.75rem",
						zIndex: 1,
						color: textColor,
					}}
				>
					<Tooltip title="已解决" placement="top">
						<Icon>done</Icon>
					</Tooltip>
				</Box>
			)}
			<Box
				sx={{
					position: "absolute",
					right: "-1rem",
					bottom: "-2.5rem",
					zIndex: -1,
					opacity: 0.2,
					fontSize: "3rem",
					color: textColor,
				}}
			>
				<Icon
					sx={{
						fontSize: "12rem",
					}}
				>
					{challenge.category?.icon}
				</Icon>
			</Box>
		</Card>
	);
}

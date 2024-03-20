import { Challenge } from "@/types/challenge";
import {
	Box,
	ButtonBase,
	Card,
	CardContent,
	Chip,
	Divider,
	Rating,
	Tooltip,
	Typography,
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiCheck, mdiStar, mdiStarOutline } from "@mdi/js";
import { useThemeStore } from "@/store/theme";
import UIcon from "@/components/ui/UIcon";
import { hexToRGBA } from "@/utils/color";

export default function ChallengeCard({
	challenge,
}: {
	challenge: Challenge;
}): JSX.Element {
	const themeStore = useThemeStore();

	// const isSolved: boolean = challenge.solved ? true : false;

	const isSolved: boolean = false;

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
						icon={<Icon path={mdiStar} size={1.25} />}
						emptyIcon={<Icon path={mdiStarOutline} size={1.25} />}
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
						<Icon path={mdiCheck} size={1.25}></Icon>
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
				<UIcon path={`mdi${challenge.category?.icon}`} size={8} />
			</Box>
		</Card>
	);
}

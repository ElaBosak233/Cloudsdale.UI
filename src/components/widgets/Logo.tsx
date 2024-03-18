import { Box, Typography } from "@mui/material";
import { useConfigStore } from "@/store/config";

export default function Logo() {

	const configStore = useConfigStore();

	return (
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
				{configStore.pltCfg.site.title}
			</Typography>
		</Box>
	);
}

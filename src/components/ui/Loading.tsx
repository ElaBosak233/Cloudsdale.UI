import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<CircularProgress sx={{ color: "loading.main" }} />
		</Box>
	);
}

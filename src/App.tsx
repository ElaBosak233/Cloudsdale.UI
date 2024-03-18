import {
	Alert,
	Box,
	CircularProgress,
	CssBaseline,
	Snackbar,
	ThemeProvider,
} from "@mui/material";
import { Suspense, useEffect } from "react";
import { useRoutes } from "react-router";
import routes from "~react-pages";
import SideBar from "@/components/navigations/SideBar";
import { useTheme } from "@/utils/theme";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { getPltCfg } from "@/api/config";

function Loading(): React.ReactNode {
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

function ESnackBar(): React.ReactNode {
	const snackBarStore = useSnackBarStore();

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		snackBarStore.close();
	};

	return (
		<Snackbar
			open={snackBarStore.open}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			autoHideDuration={2000}
			onClose={handleClose}
		>
			<Alert
				onClose={handleClose}
				severity={snackBarStore.severity}
				sx={{ width: "100%" }}
			>
				{snackBarStore.msg}
			</Alert>
		</Snackbar>
	);
}

export default function App() {
	const configStore = useConfigStore();

	// Get platform config
	useEffect(() => {
		getPltCfg()
			.then((res) => {
				configStore.setPltCfg(res.data["data"]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<>
			<ThemeProvider theme={useTheme()}>
				<SideBar />
				<Suspense fallback={<Loading />}>
					<CssBaseline />
					<Box sx={{ marginLeft: "4.375rem" }}>
						{useRoutes(routes)}
					</Box>
					<ESnackBar />
				</Suspense>
			</ThemeProvider>
		</>
	);
}

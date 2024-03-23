import {
	Alert,
	Box,
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
import { useConfigApi } from "@/api/config";
import { useCategoryApi } from "@/api/category";
import { useCategoryStore } from "@/store/category";
import Loading from "@/components/ui/Loading";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
	const categoryStore = useCategoryStore();
	const categoryApi = useCategoryApi();
	const configApi = useConfigApi();

	// Get platform config
	useEffect(() => {
		configApi
			.getPltCfg()
			.then((res) => {
				const r = res.data;
				configStore.setPltCfg(r.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [configStore.refresh]);

	// Get exists categories
	useEffect(() => {
		categoryApi.getCategories().then((res) => {
			const r = res.data;
			if (r.code === 200) {
				categoryStore.setCategories(r.data);
			}
		});
	}, [categoryStore.refresh]);

	return (
		<>
			<ThemeProvider theme={useTheme()}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<SideBar />
					<Suspense fallback={<Loading />}>
						<CssBaseline />
						<Box sx={{ marginLeft: "4.375rem" }}>
							{useRoutes(routes)}
						</Box>
						<ESnackBar />
					</Suspense>
				</LocalizationProvider>
			</ThemeProvider>
		</>
	);
}

import { useEffect, useState } from "react";
import { useConfigStore } from "@/store/config";
import { Box, Typography } from "@mui/material";
import Logo from "@/components/widgets/Logo";
import { api } from "@/utils/axios";

export default function Page() {
	const configStore = useConfigStore();
	const [count, setCount] = useState(0);

	useEffect(() => {
		document.title = `${configStore?.pltCfg?.site?.title}`;
	}, []);

	return (
		<>
			<Box sx={{ marginTop: "2rem", marginX: "10%" }}>
				<Logo />
			</Box>
			<Box
				sx={{
					position: "fixed",
					top: "45%",
					left: "50%",
					zIndex: -1,
					transform: "translate(-45%, -50%)",
				}}
				className={"no-select"}
			>
				<Typography
					sx={{ fontSize: "5rem", opacity: 0.2, textAlign: "center" }}
				>
					{configStore?.pltCfg?.site?.description}
				</Typography>
			</Box>
		</>
	);
}

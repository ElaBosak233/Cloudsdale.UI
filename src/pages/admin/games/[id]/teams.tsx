import withGame from "@/components/layouts/admin/withGame";
import withAdmin from "@/components/layouts/withAdmin";
import { Paper } from "@mui/material";

function Page() {
	return (
		<Paper
			sx={{
				marginX: "1rem",
				width: "calc(100% - 2rem)",
				minHeight: "85vh",
				padding: "2rem",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			111
		</Paper>
	);
}

export default withAdmin(withGame(Page));

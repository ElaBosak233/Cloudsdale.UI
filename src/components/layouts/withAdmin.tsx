import ANavBar from "@/components/navigations/ANavBar";
import { Box } from "@mui/material";

export default function withAdmin(WrappedComponent: React.ComponentType<any>) {
	return function Admin(props: any) {
		return (
			<>
				<Box sx={{ marginX: "5%", marginY: "2rem" }}>
					<ANavBar />
					<Box
						sx={{
							marginY: "2rem",
						}}
					>
						<WrappedComponent {...props} />
					</Box>
				</Box>
			</>
		);
	};
}

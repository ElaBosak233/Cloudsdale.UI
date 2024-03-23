import GameSideBar from "@/components/navigations/admin/GameSideBar";
import { Box } from "@mui/material";

export default function withGame(WrappedComponent: React.ComponentType<any>) {
	return function withGame(props: any) {
		return (
			<>
				<Box
					sx={{
						display: "flex",
					}}
				>
					<GameSideBar />
					<WrappedComponent {...props} />
				</Box>
			</>
		);
	};
}

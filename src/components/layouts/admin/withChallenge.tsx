import ChallengeSideBar from "@/components/navigations/admin/ChallengeSideBar";
import { Box } from "@mui/material";

export default function withChallenge(
	WrappedComponent: React.ComponentType<any>
) {
	return function withChallenge(props: any) {
		return (
			<>
				<Box
					sx={{
						display: "flex",
					}}
				>
					<ChallengeSideBar />
					<WrappedComponent {...props} />
				</Box>
			</>
		);
	};
}

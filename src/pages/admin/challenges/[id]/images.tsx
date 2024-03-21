import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import { Box } from "@mui/material";

function Page() {
	return (
		<>
			<Box>1111</Box>
		</>
	);
}

export default withAdmin(withChallenge(Page));

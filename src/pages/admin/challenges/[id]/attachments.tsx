import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import { Box, Button, Dialog, Paper } from "@mui/material";
import { Challenge } from "@/types/challenge";
import { useEffect, useState } from "react";
import { useChallengeApi } from "@/api/challenge";
import { useParams } from "react-router";
import { useChallengeStore } from "@/store/challenge";
import { useMediaApi } from "@/api/media";
import { useSnackBarStore } from "@/store/snackBar";

function Page() {
	const challengeApi = useChallengeApi();
	const mediaApi = useMediaApi();
	const challengeStore = useChallengeStore();
	const snackBarStore = useSnackBarStore();

	const { id } = useParams<{ id: string }>();
	const [challenge, setChallenge] = useState<Challenge>();
	const [info, setInfo] = useState<any>("");

	function getChallengeData() {
		challengeApi
			.getChallenges({
				id: parseInt(id as string),
				is_detailed: true,
			})
			.then((res) => {
				const r = res.data;
				setChallenge(r.data[0]);
			});
	}

	function getAttachmentInfo() {
		mediaApi
			.getChallengeAttachmentInfoByChallengeID(parseInt(id as string))
			.then((res) => {
				const r = res.data;
				setInfo(r);
			});
	}

	function deleteAttachment() {
		mediaApi
			.deleteChallengeAttachmentByChallengeID(parseInt(id as string))
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("删除成功");
					getAttachmentInfo();
				}
			});
	}

	function setAttachment(file: File) {
		const data = new FormData();
		data.append("attachment", file);
		mediaApi
			.setChallengeAttachmentByChallengeID(parseInt(id as string), data)
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("上传成功");
					getAttachmentInfo();
				}
			});
	}

	useEffect(() => {
		getChallengeData();
		getAttachmentInfo();
	}, [challengeStore.refresh]);

	useEffect(() => {
		document.title = `附件 - ${challenge?.title}`;
	}, [challenge]);

	return (
		<>
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
				<Box>
					<Box>{info?.file_name}</Box>
					<Box>{info?.file_size} 字节</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
					}}
				>
					<Button
						component="label"
						size="large"
						variant="contained"
						tabIndex={-1}
						disableElevation
						color="error"
						onClick={deleteAttachment}
					>
						删除附件
					</Button>
					<Button
						component="label"
						size="large"
						variant="contained"
						tabIndex={-1}
						disableElevation
						sx={{
							marginLeft: "0.5rem",
						}}
					>
						上传附件
						<input
							type="file"
							style={{
								clip: "rect(0 0 0 0)",
								clipPath: "inset(50%)",
								height: 1,
								overflow: "hidden",
								position: "absolute",
								bottom: 0,
								left: 0,
								whiteSpace: "nowrap",
								width: 1,
							}}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setAttachment(file);
								}
							}}
						/>
					</Button>
				</Box>
			</Paper>
		</>
	);
}

export default withAdmin(withChallenge(Page));

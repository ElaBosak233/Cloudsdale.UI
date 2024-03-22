import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import {
	Box,
	Button,
	Card,
	Dialog,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { Challenge } from "@/types/challenge";
import { useEffect, useState } from "react";
import { useChallengeApi } from "@/api/challenge";
import { useSubmissionApi } from "@/api/submission";
import { useParams } from "react-router";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { Flag } from "@/types/flag";
import { create } from "zustand";
import { Submission } from "@/types/submission";

interface State {
	deleteOpen: boolean;
	setDeleteOpen: (deleteOpen: boolean) => void;
	submission?: Submission;
	setSubmission: (submission: Submission) => void;
	clearSubmission: () => void;
}

const useStore = create<State>((set) => ({
	deleteOpen: false,
	setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
	setSubmission: (submission) => set({ submission }),
	clearSubmission: () => set({ submission: undefined }),
}));

function Delete() {
	const store = useStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const submissionApi = useSubmissionApi();

	function deleteSubmission() {
		submissionApi
			.deleteSubmission({
				id: store.submission?.id as number,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("提交记录删除成功");
				}
				store.clearSubmission();
				store.setDeleteOpen(false);
				challengeStore.setRefresh(challengeStore.refresh + 1);
			});
	}

	return (
		<Card
			sx={{
				minWidth: "25rem",
				padding: "1rem",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Icon path={mdiDelete} size={1} />
				<Typography
					sx={{
						marginX: "0.5rem",
						fontWeight: "bold",
					}}
				>
					删除提交记录
				</Typography>
			</Box>
			<Divider
				sx={{
					marginY: "1rem",
				}}
			/>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography
					sx={{
						fontSize: "1.25rem",
						fontWeight: "bold",
					}}
				>
					是否永久删除提交记录，真的很久！
				</Typography>
				<Box
					sx={{
						marginY: "0.5rem",
					}}
				>
					{store.submission?.flag}
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
				}}
			>
				<Button
					variant="contained"
					color="error"
					disableElevation
					startIcon={<Icon path={mdiDelete} size={1} />}
					onClick={() => {
						deleteSubmission();
						store.setDeleteOpen(false);
						store.clearSubmission();
					}}
				>
					确定
				</Button>
			</Box>
		</Card>
	);
}

function Page() {
	const challengeApi = useChallengeApi();
	const submissionApi = useSubmissionApi();

	const store = useStore();
	const challengeStore = useChallengeStore();

	const { id } = useParams<{ id: string }>();
	const [challenge, setChallenge] = useState<Challenge>();
	const [submissions, setSubmissions] = useState<Array<Submission>>();

	function getChallenge() {
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

	function getSubmissions() {
		submissionApi
			.getSubmissions({
				challenge_id: parseInt(id as string),
				is_detailed: true,
			})
			.then((res) => {
				const r = res.data;
				setSubmissions(r.data as Array<Submission>);
			});
	}

	useEffect(() => {
		getChallenge();
		getSubmissions();
	}, [challengeStore.refresh]);

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
				<TableContainer component={Paper}>
					<Table
						sx={{ minWidth: 650 }}
						aria-label="simple table"
						size="small"
						stickyHeader
					>
						<TableHead>
							<TableRow
								sx={{
									height: "3.5rem",
								}}
							>
								<TableCell>ID</TableCell>
								<TableCell>Flag</TableCell>
								<TableCell>判定</TableCell>
								<TableCell>用户</TableCell>
								<TableCell>团队</TableCell>
								<TableCell>比赛</TableCell>
								<TableCell align="center"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{submissions?.map((submission) => (
								<TableRow key={submission.id}>
									<TableCell>{submission.id}</TableCell>
									<TableCell
										sx={{
											fontWeight: "bold",
											width: "20rem",
										}}
									>
										{submission.flag}
									</TableCell>
									<TableCell>
										{submission?.status === 0 && "未判定"}
										{submission?.status === 1 && "正确"}
										{submission?.status === 2 && "错误"}
										{submission?.status === 3 && "作弊"}
										{submission?.status === 4 && "重复提交"}
									</TableCell>
									<TableCell>
										{submission?.user?.nickname}
									</TableCell>
									<TableCell>
										{submission?.team?.name || "无"}
									</TableCell>
									<TableCell>
										{submission?.game?.title || "练习"}
									</TableCell>
									<TableCell align="center">
										<IconButton
											sx={{ marginX: "0.1rem" }}
											color="error"
											onClick={() => {
												store.setDeleteOpen(true);
												store.setSubmission(submission);
											}}
										>
											<Icon path={mdiDelete} size={1} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Dialog
				open={store.deleteOpen}
				maxWidth={false}
				onClose={() => store.setDeleteOpen(false)}
			>
				<Delete />
			</Dialog>
		</>
	);
}

export default withAdmin(withChallenge(Page));

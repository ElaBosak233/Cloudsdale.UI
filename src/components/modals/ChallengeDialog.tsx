import { Challenge } from "@/types/challenge";
import {
	Box,
	Button,
	Card,
	Divider,
	IconButton,
	InputAdornment,
	TextField,
	Tooltip,
} from "@mui/material";
import UIcon from "@/components/ui/UIcon";
import {
	mdiFlag,
	mdiServerNetwork,
	mdiOpenInNew,
	mdiDownload,
	mdiHexagonSlice6,
	mdiHexagonSlice4,
	mdiHexagonSlice2,
} from "@mdi/js";
import { createSubmission } from "@/api/submissions";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import Icon from "@mdi/react";
import Markdown from "@/components/ui/Markdown";
import { useState } from "react";
import { Submission } from "@/types/submission";

export default function ChallengeDialog({
	challenge,
}: {
	challenge?: Challenge;
}) {
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();

	const [flag, setFlag] = useState<string>("");

	function redirectTo(url: string) {
		window.open(`http://${url}`, "_blank");
	}

	function submit() {
		if (flag === "") {
			snackBarStore.error("Flag 不能为空");
			return;
		}
		snackBarStore.info("判题中");
		createSubmission({
			challenge_id: challenge?.id as number,
			flag: flag,
		}).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				switch (r.status) {
					case 1:
						snackBarStore.warning("错误");
						break;
					case 2:
						snackBarStore.success("正确");
						setFlag("");
						challengeStore.setRefresh(challenge?.id as number);
						break;
					case 3:
						snackBarStore.error("作弊");
						break;
					case 4:
						snackBarStore.info("重复提交");
						setFlag("");
						challengeStore.setRefresh(challenge?.id as number);
						break;
				}
			}
		});
	}

	return (
		<Card
			sx={{
				width: "65vh",
				minHeight: "30vh",
				padding: "1rem",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								color: challenge?.category?.color,
								display: "flex",
								alignItems: "center",
							}}
						>
							<UIcon
								path={`mdi${challenge?.category?.icon}`}
								size={1}
							/>
						</Box>
						<Box
							sx={{ fontWeight: "bold", marginX: "0.5rem" }}
							className={"no-select"}
						>
							{challenge?.title}
						</Box>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						{(challenge?.submissions?.length as number) > 0 && (
							<Tooltip
								title={`一血 ${(challenge?.submissions as Array<Submission>)[0]?.user?.nickname}`}
								placement={"top"}
							>
								<Icon
									path={mdiHexagonSlice6}
									size={1}
									color={"#fcc419"}
								/>
							</Tooltip>
						)}
						{(challenge?.submissions?.length as number) > 1 && (
							<Tooltip
								title={`二血 ${(challenge?.submissions as Array<Submission>)[1]?.user?.nickname}`}
								placement={"top"}
							>
								<Icon
									path={mdiHexagonSlice4}
									size={1}
									color={"#a6a6a6"}
								/>
							</Tooltip>
						)}
						{(challenge?.submissions?.length as number) > 2 && (
							<Tooltip
								title={`三血 ${(challenge?.submissions as Array<Submission>)[2]?.user?.nickname}`}
								placement={"top"}
							>
								<Icon
									path={mdiHexagonSlice2}
									size={1}
									color={"#f98539"}
								/>
							</Tooltip>
						)}
					</Box>
				</Box>
				<Divider sx={{ marginY: "1rem" }} />
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box sx={{ flexGrow: 1 }}>
						<Markdown content={challenge?.description} />
					</Box>
					{challenge?.has_attachment && (
						<Box>
							<IconButton
								sx={{
									color: challenge?.category?.color,
								}}
							>
								<Icon path={mdiDownload} size={1} />
							</IconButton>
						</Box>
					)}
				</Box>
			</Box>
			<Box sx={{ marginTop: "2.5rem" }}>
				{challenge?.is_dynamic && (
					<>
						<Box sx={{ display: "flex" }}>
							<TextField
								size="small"
								variant="filled"
								hiddenLabel
								placeholder={"0.0.0.0"}
								sx={{
									"& .MuiFilledInput-root::after": {
										borderBottomColor:
											challenge?.category?.color,
									},
									flexGrow: 1,
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Icon
												path={mdiServerNetwork}
												size={1}
											/>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment
											position="end"
											sx={{
												cursor: "pointer",
											}}
											onClick={() => {
												redirectTo("0.0.0.0");
											}}
										>
											<Icon
												path={mdiOpenInNew}
												size={1}
											/>
										</InputAdornment>
									),
								}}
							/>
						</Box>
						<Box
							sx={{
								marginY: "1rem",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Box>
								<Box
									sx={{
										fontSize: "0.8rem",
										fontWeight: "bold",
									}}
								>
									本题为容器题目，解题需开启容器实例
								</Box>
								<Box
									sx={{ fontSize: "0.8rem" }}
									color={"text.secondary"}
								>
									本题容器时间 {challenge?.duration}s
								</Box>
							</Box>
							<Box sx={{ display: "flex" }}>
								<Button
									variant="contained"
									disableElevation
									sx={{
										bgcolor: challenge?.category?.color,
										"&:hover": {
											bgcolor: challenge?.category?.color,
										},
										fontWeight: "bold",
										color: "#FFF",
									}}
								>
									开启实例
								</Button>
							</Box>
						</Box>
					</>
				)}
				<Divider sx={{ marginY: "1rem" }} />
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<TextField
						size="small"
						variant="filled"
						hiddenLabel
						placeholder={"Flag"}
						value={flag}
						onChange={(e) => setFlag(e.target.value)}
						sx={{
							"& .MuiFilledInput-root::after": {
								borderBottomColor: challenge?.category?.color,
							},
							flexGrow: 1,
							marginRight: "0.5rem",
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Icon path={mdiFlag} size={1} />
								</InputAdornment>
							),
						}}
					/>
					<Button
						variant="contained"
						disableElevation
						sx={{
							bgcolor: challenge?.category?.color,
							"&:hover": {
								bgcolor: challenge?.category?.color,
							},
							fontWeight: "bold",
							color: "#FFF",
						}}
						onClick={submit}
					>
						提交
					</Button>
				</Box>
			</Box>
		</Card>
	);
}

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
	mdiPackageVariant,
} from "@mdi/js";
import { useSubmissionApi } from "@/api/submission";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";
import { usePodStore } from "@/store/pod";
import Icon from "@mdi/react";
import Markdown from "@/components/ui/Markdown";
import { useEffect, useState } from "react";
import { Submission } from "@/types/submission";
import { usePodApi } from "@/api/pod";
import { LoadingButton } from "@mui/lab";
import { Instance } from "@/types/instance";
import { useTeamStore } from "@/store/team";
import { useGameStore } from "@/store/game";
import { useMediaApi } from "@/api/media";
import { saveAs } from "file-saver";

export default function ChallengeDialog({
	challenge,
	mode,
}: {
	challenge?: Challenge;
	mode: "practice" | "game";
}) {
	const submissionApi = useSubmissionApi();
	const podApi = usePodApi();
	const mediaApi = useMediaApi();

	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();
	const podStore = usePodStore();
	const teamStore = useTeamStore();
	const gameStore = useGameStore();

	function downloadAttachment() {
		let info: any = {};
		mediaApi
			.getChallengeAttachmentInfoByChallengeID(challenge?.id as number)
			.then((res) => {
				const r = res.data;
				if (r.code !== 200) {
					snackBarStore.error("获取附件信息失败");
					return;
				}
				info = r;
				mediaApi
					.getChallengeAttachmentByChallengeID(
						challenge?.id as number
					)
					.then((res) => {
						const r = res.data;
						const blob = new Blob([r]);
						saveAs(blob, info?.file_name || "attachment");
					});
			});
	}

	// Flag 输入框
	const [flag, setFlag] = useState<string>("");

	// 容器相关
	const [podID, setPodID] = useState<number>(0);
	const [podInstances, setPodInstances] = useState<Array<Instance>>([]);
	const [podCreateLoading, setPodCreateLoading] = useState<boolean>(false);
	const [podRemoveLoading, setPodRemoveLoading] = useState<boolean>(false);
	const [podRenewLoading, setPodRenewLoading] = useState<boolean>(false);

	useEffect(() => {
		if (podStore?.existPods && challenge?.id) {
			const pod = podStore?.existPods[challenge?.id];
			if (pod) {
				setPodID(pod.id);
				setPodInstances(pod.instances);
			}
		}
	}, []);

	// 重定向
	function redirectTo(url: string) {
		window.open(`http://${url}`, "_blank");
	}

	// Flag 提交
	function handleSubmit() {
		if (flag === "") {
			snackBarStore.error("Flag 不能为空");
			return;
		}
		snackBarStore.info("判题中");
		submissionApi
			.createSubmission({
				challenge_id: challenge?.id as number,
				flag: flag,
				team_id:
					mode === "game" ? teamStore?.selectedTeamID : undefined,
				game_id:
					mode === "game" ? gameStore?.selectedGameID : undefined,
			})
			.then((res) => {
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

	// 容器创建
	function handlePodCreate() {
		snackBarStore.info("创建中");
		setPodCreateLoading(true);
		podApi
			.createPod({
				challenge_id: challenge?.id as number,
				team_id:
					mode === "game" ? teamStore?.selectedTeamID : undefined,
				game_id:
					mode === "game" ? gameStore?.selectedGameID : undefined,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setPodID(r.id);
					setPodInstances(r.instances);
					podStore.addExistPod(challenge?.id as number, r);
					snackBarStore.success("创建成功");
				}
			})
			.catch((err) => {
				snackBarStore.error(`创建失败 ${err}`);
			})
			.finally(() => {
				setPodCreateLoading(false);
			});
	}

	// 容器移除
	function handlePodRemove() {
		snackBarStore.info("删除中");
		setPodRemoveLoading(true);
		podApi
			.removePod({
				id: podID,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("删除成功");
				}
			})
			.catch((err) => {
				snackBarStore.error(`删除失败 ${err}`);
			})
			.finally(() => {
				setPodID(0);
				setPodInstances([]);
				setPodRemoveLoading(false);
			});
	}

	// 容器续期
	function handlePodRenew() {
		snackBarStore.info("续期中");
		setPodRenewLoading(true);
		podApi
			.removePod({
				id: podID,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("续期成功");
				}
			})
			.catch((err) => {
				snackBarStore.error(`续期失败 ${err}`);
			})
			.finally(() => {
				setPodRenewLoading(false);
			});
	}

	return (
		<Card
			sx={{
				width: "40rem",
				minHeight: "20rem",
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
								onClick={downloadAttachment}
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
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								marginTop: "1rem",
							}}
						>
							{podInstances?.map((instance, index) => (
								<>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											paddingX: "0.5rem",
											marginTop: "1rem",
										}}
									>
										<Icon
											path={mdiPackageVariant}
											size={1}
										/>
										<Box
											sx={{
												marginX: "0.5rem",
												fontWeight: "bold",
											}}
										>
											容器 {index + 1}
										</Box>
									</Box>
									{instance.nats?.map((nat) => (
										<TextField
											size="small"
											variant="filled"
											hiddenLabel
											value={nat.entry}
											sx={{
												"& .MuiFilledInput-root::after":
													{
														borderBottomColor:
															challenge?.category
																?.color,
													},
												flexGrow: 1,
												marginTop: "0.5rem",
											}}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
															}}
														>
															<Icon
																path={
																	mdiServerNetwork
																}
																size={1}
															/>
															<Box
																sx={{
																	marginX:
																		"0.5rem",
																}}
															>
																{nat.src_port} →
															</Box>
														</Box>
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment
														position="end"
														sx={{
															cursor: "pointer",
														}}
														onClick={() => {
															redirectTo(
																"0.0.0.0"
															);
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
									))}
								</>
							))}
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
								{podID > 0 && (
									<>
										<LoadingButton
											variant="contained"
											disableElevation
											loading={podRenewLoading}
											sx={{
												bgcolor: "#3b81f5",
												"&:hover": {
													bgcolor: "#3b81f5",
												},
												fontWeight: "bold",
												color: "#FFF",
												marginX: "0.25rem",
											}}
											onClick={handlePodRenew}
										>
											实例续期
										</LoadingButton>
										<LoadingButton
											variant="contained"
											disableElevation
											loading={podRemoveLoading}
											sx={{
												bgcolor: "#d22e2d",
												"&:hover": {
													bgcolor: "#d22e2d",
												},
												fontWeight: "bold",
												color: "#FFF",
												marginX: "0.25rem",
											}}
											onClick={handlePodRemove}
										>
											销毁实例
										</LoadingButton>
									</>
								)}
								{podID === 0 && (
									<LoadingButton
										variant="contained"
										disableElevation
										loading={podCreateLoading}
										sx={{
											bgcolor: challenge?.category?.color,
											"&:hover": {
												bgcolor:
													challenge?.category?.color,
											},
											fontWeight: "bold",
											color: "#FFF",
											marginX: "0.25rem",
										}}
										onClick={handlePodCreate}
									>
										开启实例
									</LoadingButton>
								)}
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
						onClick={handleSubmit}
					>
						提交
					</Button>
				</Box>
			</Box>
		</Card>
	);
}

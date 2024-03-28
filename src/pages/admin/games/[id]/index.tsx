import { useGameApi } from "@/api/game";
import withGame from "@/components/layouts/admin/withGame";
import withAdmin from "@/components/layouts/withAdmin";
import { Game } from "@/types/game";
import {
	Box,
	Button,
	FormControlLabel,
	Icon,
	Paper,
	Switch,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useSnackBarStore } from "@/store/snackBar";
import { useGameStore } from "@/store/game";

function Page() {
	const gameApi = useGameApi();
	const snackBarStore = useSnackBarStore();
	const gameStore = useGameStore();

	const { id } = useParams<{ id: string }>();
	const [game, setGame] = useState<Game>();
	const [title, setTitle] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [memberLimitMin, setMemberLimitMin] = useState<number>(1);
	const [memberLimitMax, setMemberLimitMax] = useState<number>(1);
	const [parallelContainerLimit, setParallelContainerLimit] =
		useState<number>(1);
	const [firstBloodRewardRatio, setFirstBloodRewardRatio] =
		useState<number>(1);
	const [secondBloodRewardRatio, setSecondBloodRewardRatio] =
		useState<number>(1);
	const [thirdBloodRewardRatio, setThirdBloodRewardRatio] =
		useState<number>(1);
	const [isNeedWriteUp, setIsNeedWriteUp] = useState<boolean>(false);
	const [isEnabled, setIsEnabled] = useState<boolean>(false);
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [coverURL, setCoverURL] = useState<string>("");
	const [startedAt, setStartedAt] = useState<number>(0);
	const [endedAt, setEndedAt] = useState<number>(0);

	function getGame() {
		gameApi.getGameByID(parseInt(id as string)).then((res) => {
			const r = res.data;
			if (r.code === 200) {
				setGame(r.data);
				setTitle(r.data.title);
				setBio(r.data.bio);
				setDescription(r.data.description);
				setCoverURL(r.data.cover_url);
				setMemberLimitMin(r.data.member_limit_min);
				setMemberLimitMax(r.data.member_limit_max);
				setParallelContainerLimit(r.data.parallel_container_limit);
				setFirstBloodRewardRatio(r.data.first_blood_reward_ratio);
				setSecondBloodRewardRatio(r.data.second_blood_reward_ratio);
				setThirdBloodRewardRatio(r.data.third_blood_reward_ratio);
				setIsNeedWriteUp(r.data.is_need_write_up);
				setIsEnabled(r.data.is_enabled);
				setIsPublic(r.data.is_public);
				setStartedAt(r.data.started_at);
				setEndedAt(r.data.ended_at);
			}
		});
	}

	function updateGame() {
		gameApi
			.updateGame({
				id: parseInt(id as string),
				title: title,
				bio: bio,
				description: description,
				member_limit_min: memberLimitMin,
				member_limit_max: memberLimitMax,
				parallel_container_limit: parallelContainerLimit,
				first_blood_reward_ratio: firstBloodRewardRatio,
				second_blood_reward_ratio: secondBloodRewardRatio,
				third_blood_reward_ratio: thirdBloodRewardRatio,
				is_need_write_up: isNeedWriteUp,
				is_enabled: isEnabled,
				is_public: isPublic,
				started_at: startedAt,
				ended_at: endedAt,
				cover_url: coverURL,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("更新成功");
				}
				gameStore.setRefresh(gameStore.refresh + 1);
			});
	}

	useEffect(() => {
		getGame();
	}, [gameStore.refresh]);

	useEffect(() => {
		document.title = `${game?.title} - 比赛管理`;
	}, [game]);

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
			<Box
				sx={{
					flexGrow: 1,
				}}
			>
				<Box>
					<TextField
						value={title}
						label="标题"
						fullWidth
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
					}}
				>
					<TextField
						value={bio}
						label="简述"
						fullWidth
						multiline
						rows={2}
						onChange={(e) => {
							setBio(e.target.value);
						}}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
					}}
				>
					<TextField
						value={coverURL}
						label="比赛封面 URL"
						fullWidth
						onChange={(e) => {
							setCoverURL(e.target.value);
						}}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
					}}
				>
					<TextField
						value={description}
						label="详细描述"
						fullWidth
						multiline
						minRows={6}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
						display: "flex",
					}}
				>
					<TextField
						value={memberLimitMin}
						label="最小人数"
						type="number"
						onChange={(e) => {
							setMemberLimitMin(parseInt(e.target.value));
						}}
						sx={{
							width: "100%",
						}}
					/>
					<TextField
						value={memberLimitMax}
						label="最大人数"
						type="number"
						onChange={(e) => {
							setMemberLimitMax(parseInt(e.target.value));
						}}
						sx={{
							marginLeft: "1rem",
							width: "100%",
						}}
					/>
					<TextField
						value={parallelContainerLimit}
						label="容器并行限制"
						type="number"
						onChange={(e) => {
							setParallelContainerLimit(parseInt(e.target.value));
						}}
						sx={{
							marginLeft: "1rem",
							width: "100%",
						}}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						marginTop: "1rem",
					}}
				>
					<TextField
						value={firstBloodRewardRatio}
						label="一血奖励比例（%）"
						type="number"
						onChange={(e) => {
							setFirstBloodRewardRatio(parseInt(e.target.value));
						}}
						sx={{
							width: "100%",
						}}
					/>
					<TextField
						value={secondBloodRewardRatio}
						label="二血奖励比例（%）"
						type="number"
						onChange={(e) => {
							setSecondBloodRewardRatio(parseInt(e.target.value));
						}}
						sx={{
							marginLeft: "1rem",
							width: "100%",
						}}
					/>
					<TextField
						value={thirdBloodRewardRatio}
						label="三血奖励比例（%）"
						type="number"
						onChange={(e) => {
							setThirdBloodRewardRatio(parseInt(e.target.value));
						}}
						sx={{
							marginLeft: "1rem",
							width: "100%",
						}}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<FormControlLabel
						control={<Switch checked={isEnabled} color="primary" />}
						label="是否启用"
						labelPlacement="start"
						onClick={() => setIsEnabled(!isEnabled)}
					/>
					<FormControlLabel
						control={<Switch checked={isPublic} color="primary" />}
						label="是否为公开赛"
						labelPlacement="start"
						onClick={() => setIsPublic(!isPublic)}
					/>
					<FormControlLabel
						control={
							<Switch checked={isNeedWriteUp} color="primary" />
						}
						label="是否需要题解"
						labelPlacement="start"
						onClick={() => setIsNeedWriteUp(!isNeedWriteUp)}
					/>
				</Box>
				<Box
					sx={{
						marginTop: "1rem",
						display: "flex",
					}}
				>
					<DateTimePicker
						label="开始时间"
						value={dayjs(new Date(startedAt * 1000))}
						onChange={(newStartedAt) =>
							setStartedAt(newStartedAt?.unix() as number)
						}
						sx={{
							width: "100%",
						}}
					/>
					<DateTimePicker
						label="结束时间"
						value={dayjs(new Date(endedAt * 1000))}
						onChange={(newEndedAt) =>
							setEndedAt(newEndedAt?.unix() as number)
						}
						sx={{
							marginLeft: "1rem",
							width: "100%",
						}}
					/>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					marginTop: "1rem",
				}}
			>
				<Button
					variant="contained"
					disableElevation
					size="large"
					startIcon={<Icon>save</Icon>}
					onClick={updateGame}
				>
					保存
				</Button>
			</Box>
		</Paper>
	);
}

export default withAdmin(withGame(Page));

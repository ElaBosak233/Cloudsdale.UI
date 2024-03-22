import withAdmin from "@/components/layouts/withAdmin";
import withChallenge from "@/components/layouts/admin/withChallenge";
import {
	Box,
	Button,
	FormControlLabel,
	MenuItem,
	Paper,
	Rating,
	Switch,
	TextField,
} from "@mui/material";
import { Challenge } from "@/types/challenge";
import { useCategoryStore } from "@/store/category";
import { useEffect, useState } from "react";
import { useChallengeApi } from "@/api/challenge";
import { useParams } from "react-router";
import Icon from "@mdi/react";
import { mdiContentSave } from "@mdi/js";
import { useSnackBarStore } from "@/store/snackBar";
import { useChallengeStore } from "@/store/challenge";

function Page() {
	const challengeApi = useChallengeApi();

	const categoryStore = useCategoryStore();
	const snackBarStore = useSnackBarStore();
	const challengeStore = useChallengeStore();

	const { id } = useParams<{ id: string }>();
	const [challenge, setChallenge] = useState<Challenge>();
	const [title, setTitle] = useState<string>("");
	const [categoryID, setCategoryID] = useState<number>(1);
	const [description, setDescription] = useState<string>("");
	const [difficulty, setDifficulty] = useState<number>(1);
	const [hasAttachment, setHasAttachment] = useState<boolean>(false);
	const [isPracticable, setIsPracticable] = useState<boolean>(false);
	const [isDynamic, setIsDynamic] = useState<boolean>(false);
	const [practicePts, setPracticePts] = useState<number>(0);

	function getChallengeData() {
		challengeApi
			.getChallenges({
				id: parseInt(id as string),
				is_detailed: true,
			})
			.then((res) => {
				const r = res.data;
				setChallenge(r.data[0]);
				setTitle(r.data[0].title);
				setCategoryID(r.data[0].category_id);
				setDescription(r.data[0].description);
				setIsDynamic(r.data[0].is_dynamic);
				setIsPracticable(r.data[0].is_practicable);
				setDifficulty(r.data[0].difficulty);
				setHasAttachment(r.data[0].has_attachment);
				setPracticePts(r.data[0].practice_pts);
			});
	}

	function handleUpdateChallenge() {
		challengeApi
			.updateChallenge({
				id: parseInt(id as string),
				title: title,
				category_id: categoryID,
				description: description,
				difficulty: difficulty,
				has_attachment: hasAttachment,
				is_dynamic: isDynamic,
				is_practicable: isPracticable,
				practice_pts: practicePts,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					snackBarStore.success("题目更新成功");
					challengeStore.setRefresh(challengeStore.refresh + 1);
				}
			});
	}

	useEffect(() => {
		getChallengeData();
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
				<Box
					sx={{
						flexGrow: 1,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<TextField
							required
							label="标题"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							sx={{
								width: "100%",
							}}
						/>
						<TextField
							select
							label="分类"
							value={String(categoryID)}
							onChange={(e) => {
								setCategoryID(Number(e.target.value));
							}}
							sx={{
								marginX: "1rem",
								width: "20rem",
							}}
						>
							{categoryStore.categories.map((category) => (
								<MenuItem key={category.id} value={category.id}>
									{category.name}
								</MenuItem>
							))}
						</TextField>
						<Rating
							value={difficulty}
							size="large"
							onChange={(event, newValue) => {
								setDifficulty(newValue as number);
							}}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							marginY: "1rem",
							justifyContent: "space-between",
						}}
					>
						<FormControlLabel
							control={
								<Switch
									checked={hasAttachment}
									color="primary"
								/>
							}
							label="是否有附件"
							labelPlacement="start"
							onClick={() => {
								setHasAttachment(!hasAttachment);
							}}
						/>
						<FormControlLabel
							control={
								<Switch checked={isDynamic} color="primary" />
							}
							label="是否为动态题"
							labelPlacement="start"
							onClick={() => {
								setIsDynamic(!isDynamic);
							}}
						/>
						<FormControlLabel
							control={
								<Switch
									checked={isPracticable}
									color="primary"
								/>
							}
							label="是否为练习题"
							labelPlacement="start"
							onClick={() => {
								setIsPracticable(!isPracticable);
							}}
						/>
						<TextField
							label="练习分数"
							value={practicePts}
							size="small"
							onChange={(e) =>
								setPracticePts(parseInt(e.target.value) || 0)
							}
						/>
					</Box>
					<Box sx={{ marginY: "1rem" }}>
						<TextField
							label="描述"
							multiline
							rows={23}
							value={description}
							variant="outlined"
							sx={{
								width: "100%",
							}}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
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
						disableElevation
						size="large"
						startIcon={<Icon path={mdiContentSave} size={1} />}
						onClick={handleUpdateChallenge}
					>
						保存
					</Button>
				</Box>
			</Paper>
		</>
	);
}

export default withAdmin(withChallenge(Page));

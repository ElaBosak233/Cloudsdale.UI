import GameCard from "@/components/widgets/GameCard";
import { useConfigStore } from "@/store/config";
import {
	Box,
	IconButton,
	Pagination,
	TextField,
	Typography,
} from "@mui/material";
import { mdiMagnify } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useEffect, useState } from "react";
import { useGameApi } from "@/api/game";
import { Game } from "@/types/game";

export default function Page() {
	const gameApi = useGameApi();

	const configStore = useConfigStore();

	const [games, setGames] = useState<Array<Game>>();
	const [pages, setPages] = useState<number>(1);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		document.title = `比赛 - ${configStore?.pltCfg?.site?.title}`;
	}, []);

	function getGamesData() {
		gameApi
			.getGames({
				is_enabled: true,
				size: 3,
				page: page,
			})
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					setGames(r.data);
					setPages(r.pages);
				}
			});
	}

	useEffect(() => {
		getGamesData();
	}, [page]);

	function handlePageChange(
		event: React.ChangeEvent<unknown>,
		value: number
	) {
		setPage(value);
	}

	return (
		<Box sx={{ marginTop: "2rem", marginX: "10%" }}>
			<Box display={"flex"} alignItems={"center"} className={"no-select"}>
				<img
					src="/favicon.ico"
					alt="logo"
					width={48}
					height={48}
					draggable={false}
				/>
				<Typography
					sx={{
						marginX: "0.5rem",
						fontSize: "2rem",
						fontWeight: "bold",
						fontFamily: "sans-serif",
					}}
					color={"text.primary"}
				>
					比赛
				</Typography>
			</Box>
			<Box
				sx={{
					marginY: "2rem",
				}}
			>
				<Box sx={{ display: "flex" }}>
					<TextField
						hiddenLabel
						variant="filled"
						size="small"
						placeholder="搜索"
						fullWidth
					/>
					<IconButton sx={{ marginX: "1rem" }}>
						<Icon path={mdiMagnify} size={1} />
					</IconButton>
				</Box>
				{games?.map((game) => (
					<Box sx={{ marginY: "1.5rem" }} key={game?.id as number}>
						<GameCard game={game} />
					</Box>
				))}
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					marginTop: "3rem",
				}}
			>
				<Pagination
					size="large"
					count={pages}
					onChange={handlePageChange}
				/>
			</Box>
		</Box>
	);
}

import { defineStore } from "pinia";
interface GameTable {
	loading: boolean;
	search: string;
	games: Array<Game>;
	pageCount: number;
	total: number;
	itemsPerPage: number;
	page: number;
}

export interface GameState {
	games: Array<Game>;
	pages: number;
	currentPage: number;
	lastFilters: string;
	gameCover: Record<number, string>;
	gameTable: GameTable;
}

export const useGameStore = defineStore("game", {
	state: (): GameState => ({
		games: [],
		pages: 1,
		currentPage: 1,
		lastFilters: "",
		gameCover: {},
		gameTable: {
			loading: false,
			search: "",
			games: [],
			pageCount: 1,
			total: 0,
			itemsPerPage: 10,
			page: 1,
		},
	}),
	actions: {
		async loadGames(page?: number, filters?: string) {
			interface Response {
				code: number;
				data: Array<Game>;
				pages: number;
			}
			const url = filters
				? `/games/?page=${page}&size=3&${filters}`
				: `/games/?page=${page}&size=3`;
			this.lastFilters = filters || "";
			const { data: res } = await useAuthFetch(url, {
				method: "GET",
			});
			const resObj = res.value as Response;
			if (resObj?.code === 200) {
				this.games = resObj.data ? resObj.data : [];
				this.pages = resObj.pages;
				this.currentPage = page || 1;
			}
		},
		async getGameCover(id: number) {
			if (this.gameCover[id]) {
				return this.gameCover[id];
			}
			const { data: res } = await useAuthFetch(
				`/media/games/cover/${id}`,
				{
					method: "GET",
				}
			);
			const resObj = res.value as any;
			if (resObj && resObj?.code !== 404) {
				this.gameCover[id] = URL.createObjectURL(resObj);
			} else {
				this.gameCover[id] =
					"https://cdn.vuetifyjs.com/images/parallax/material.jpg";
			}
		},
		deleteGameCover(id: number) {
			if (this.gameCover[id]) {
				URL.revokeObjectURL(this.gameCover[id]);
				delete this.gameCover[id];
			}
		},
	},
});

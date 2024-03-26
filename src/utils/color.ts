import { useThemeStore } from "@/store/theme";

export function hexToRGBA(hex: string, alpha = 1) {
	try {
		if (hex?.length === 4) {
			hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
		}
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	} catch {
		return `rgba(0, 0, 0, 0)`;
	}
}

export const challenge = {
	useBgColor: (isSolved = false, color?: string) => {
		const themeStore = useThemeStore();
		switch (themeStore.mode) {
			case "dark":
				return isSolved
					? hexToRGBA(color as string, 0.6)
					: hexToRGBA(color as string, 0.2);
			case "light":
			default:
				return isSolved
					? hexToRGBA(color as string, 1)
					: hexToRGBA(color as string, 0.1);
		}
	},
	useTextColor: (isSolved = false, color?: string) => {
		const themeStore = useThemeStore();
		switch (themeStore.mode) {
			case "dark":
				return isSolved
					? hexToRGBA("#FFFFFF", 1)
					: hexToRGBA("#FFFFFF", 0.9);
			case "light":
			default:
				return isSolved ? hexToRGBA("#FFFFFF", 1) : color;
		}
	},
	useChipColor: (isSolved = false, color?: string) => {
		return isSolved
			? hexToRGBA("#FFFFFF", 0.1)
			: hexToRGBA(color as string, 0.1);
	},
};

export const game = {
	useChipColor: (color?: string) => {
		const themeStore = useThemeStore();
		switch (themeStore.mode) {
			case "dark":
				return hexToRGBA("#9e9e9e", 1);
			case "light":
			default:
				return color;
		}
	},
	useTextColor: (color?: string) => {
		const themeStore = useThemeStore();
		switch (themeStore.mode) {
			case "dark":
				return hexToRGBA("#000", 0.9);
			case "light":
			default:
				return color;
		}
	},
};

import { PaletteOptions, createTheme } from "@mui/material/styles";
import { blue, yellow, red, green, grey } from "@mui/material/colors";
import { useThemeStore } from "@/store/theme";

declare module "@mui/material/styles" {
	interface PaletteOptions {
		loading?: {
			main: string;
		};
	}
}

function getPalette(mode: string): PaletteOptions {
	switch (mode) {
		case "dark":
			return {
				mode: "dark",
				primary: grey,
				secondary: grey,
				divider: grey[800],
				background: {
					default: grey[900],
					paper: grey[900],
				},
				loading: {
					main: "#fff",
				},
				text: {
					primary: "#fff",
					secondary: "#ccc",
				},
			};
		case "light":
		default:
			return {
				mode: "light",
				primary: blue,
				warning: yellow,
				error: red,
				success: green,
				background: {
					default: "#efefef",
					paper: "#fff",
				},
				loading: {
					main: blue[900],
				},
				text: {
					primary: "#414141",
					secondary: "#616161",
				},
			};
	}
}

export function useTheme() {
	const { mode } = useThemeStore();

	return createTheme({
		palette: getPalette(mode),
		typography: {
			fontFamily: "Jetbrains Mono, sans-serif",
		},
	});
}

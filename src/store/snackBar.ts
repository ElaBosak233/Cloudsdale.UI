import { AlertColor } from "@mui/material/Alert";
import { create } from "zustand";

interface SnackBarState {
	msg?: string;
	severity?: AlertColor;
	open: boolean;
	info: (msg: string) => void;
	success: (msg: string) => void;
	error: (msg: string) => void;
	warning: (msg: string) => void;
	close: () => void;
}

export const useSnackBarStore = create<SnackBarState>()((set) => ({
	open: false,
	info: (msg) => set({ msg, severity: "info", open: true }),
	success: (msg) => set({ msg, severity: "success", open: true }),
	error: (msg) => set({ msg, severity: "error", open: true }),
	warning: (msg) => set({ msg, severity: "warning", open: true }),
	close: () => set({ open: false }),
}));

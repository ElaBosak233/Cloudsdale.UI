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

export const useSnackBarStore = create<SnackBarState>()((_set, _get) => ({
	open: false,
	info: (msg) => _set({ msg, severity: "info", open: true }),
	success: (msg) => _set({ msg, severity: "success", open: true }),
	error: (msg) => _set({ msg, severity: "error", open: true }),
	warning: (msg) => _set({ msg, severity: "warning", open: true }),
	close: () => _set({ open: false }),
}));

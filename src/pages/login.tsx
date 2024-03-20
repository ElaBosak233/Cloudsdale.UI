import { useEffect, useState } from "react";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router";
import { Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { login } from "@/api/user";
import Logo from "@/components/widgets/Logo";
import Icon from "@mdi/react";
import { mdiLock, mdiAccount } from "@mdi/js";
import { User } from "@/types/user";

export default function Page() {
	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const authStore = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		document.title = `${configStore.pltCfg.site.title}`;
	}, []);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginLoading, setLoginLoading] = useState(false);

	function handleLogin() {
		if (username === "" || password === "") {
			snackBarStore.error("用户名或密码不能为空");
			return;
		}
		setLoginLoading(true);
		login(username, password)
			.then((res) => {
				const r = res.data;
				if (r.code === 200) {
					authStore.setPgsToken(r.token as string);
					authStore.setUser(r.data as User);
					snackBarStore.success("登陆成功");
					navigate("/");
				} else {
					snackBarStore.error(`登陆失败 ${r.msg}`);
				}
			})
			.catch((err) => {
				snackBarStore.error(`登陆失败 ${err}`);
			})
			.finally(() => {
				setLoginLoading(false);
			});
	}

	return (
		<>
			<Box
				sx={{
					position: "fixed",
					top: "45%",
					left: "50%",
					zIndex: -1,
					transform: "translate(-45%, -50%)",
				}}
				className={"no-select"}
			>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Logo />
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						marginTop: "2rem",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Icon path={mdiAccount} size={1} />
						<TextField
							label="用户名"
							variant="filled"
							value={username}
							sx={{ marginLeft: "1rem", flexGrow: 1 }}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							marginTop: "1rem",
						}}
					>
						<TextField
							label="密码"
							variant="filled"
							type="password"
							value={password}
							sx={{ marginRight: "1rem", flexGrow: 1 }}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<Icon path={mdiLock} size={1} />
					</Box>
					<LoadingButton
						loading={loginLoading}
						size={"large"}
						variant="contained"
						sx={{ marginTop: "2rem", bgcolor: "primary.700" }}
						onClick={handleLogin}
					>
						登录
					</LoadingButton>
				</Box>
			</Box>
		</>
	);
}

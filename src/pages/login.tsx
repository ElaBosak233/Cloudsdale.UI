import { useEffect, useState } from "react";
import { useConfigStore } from "@/store/config";
import { useSnackBarStore } from "@/store/snackBar";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router";
import { Box, TextField, Icon } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useUserApi } from "@/api/user";
import Logo from "@/components/widgets/Logo";
import { User } from "@/types/user";

export default function Page() {
	const configStore = useConfigStore();
	const snackBarStore = useSnackBarStore();
	const authStore = useAuthStore();
	const navigate = useNavigate();
	const userApi = useUserApi();

	useEffect(() => {
		document.title = `${configStore?.pltCfg?.site?.title}`;
	}, []);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginLoading, setLoginLoading] = useState(false);

	function login() {
		if (username === "" || password === "") {
			snackBarStore.error("用户名或密码不能为空");
			return;
		}
		setLoginLoading(true);
		userApi
			.login(username, password)
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
						<Icon>person</Icon>
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
						<Icon>lock</Icon>
						<TextField
							label="密码"
							variant="filled"
							type="password"
							value={password}
							sx={{ marginLeft: "1rem", flexGrow: 1 }}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</Box>
					<LoadingButton
						loading={loginLoading}
						size={"large"}
						fullWidth
						disableElevation
						variant="contained"
						sx={{ marginTop: "2rem", bgcolor: "primary.700" }}
						onClick={login}
					>
						登录
					</LoadingButton>
				</Box>
			</Box>
		</>
	);
}

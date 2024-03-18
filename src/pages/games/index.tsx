import { useConfigStore } from "@/store/config";
import { useEffect } from "react";

export default function Page() {
	const configStore = useConfigStore();

	useEffect(() => {
		document.title = `比赛 - ${configStore.pltCfg.site.title}`;
	}, []);

	return <div>114514</div>;
}

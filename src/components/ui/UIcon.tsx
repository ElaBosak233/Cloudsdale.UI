import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import * as icons from "@mdi/js";

export default function UIcon({
	path,
	size,
	...props
}: {
	path?: string;
	size: number;
	[key: string]: any;
}) {
	type Icons = typeof icons;

	const [p, setP] = useState("");

	useEffect(() => {
		try {
			setP(icons[path as keyof Icons]);
		} catch {
			setP("");
		}
	}, [path]);

	return <Icon path={p} size={size} {...props} />;
}

import { useParams } from "react-router";

export default function Page() {
	const { id } = useParams<{ id: string }>();

	return <div>{id}</div>;
}

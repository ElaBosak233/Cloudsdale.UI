import MuiMarkdown from "mui-markdown";
import { Highlight, themes } from "prism-react-renderer";

export default function Markdown({ content }: { content?: string }) {
	return (
		<MuiMarkdown
			Highlight={Highlight}
			themes={themes}
			prismTheme={themes.github}
			hideLineNumbers
		>
			{content}
		</MuiMarkdown>
	);
}

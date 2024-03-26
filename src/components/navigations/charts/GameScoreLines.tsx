import { useSubmissionApi } from "@/api/submission";
import { Submission } from "@/types/submission";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Team } from "@/types/team";

export default function GameScoreLines({ game_id }: { game_id: number }) {
	const submissionApi = useSubmissionApi();
	const [submissions, setSubmissions] = useState<Array<Submission>>([]);
	const [series, setSeries] = useState<
		Array<{
			data: Array<number | null>;
			label: string;
			connectNulls: boolean;
		}>
	>([]);
	const [xData, setXData] = useState<Array<number>>([]);

	function getSubmissions() {
		submissionApi
			.getSubmissions({
				game_id: game_id,
			})
			.then((res) => {
				const r = res.data;
				setSubmissions(r.data);
			});
	}

	useEffect(() => {
		getSubmissions();
	}, []);

	useEffect(() => {
		if (submissions.length === 0) return;

		// 提取所有唯一的时间戳
		const xData = Array.from(new Set(submissions.map((s) => s.created_at)));
		xData.sort((a, b) => a - b); // 对时间戳进行排序

		// 初始化累加器对象的类型
		interface TeamScores {
			[teamId: number]: {
				team: Team;
				scores: { [timestamp: number]: number };
			};
		}
		const teamScores: TeamScores = {};

		submissions.forEach((submission) => {
			const { team, pts, created_at } = submission;
			const teamId = team?.id;

			// 如果队伍ID不存在，则跳过
			if (!teamId) return;

			// 如果该队伍还没有分数记录，则初始化
			if (!teamScores[teamId]) {
				teamScores[teamId] = { team, scores: {} };
			}

			// 累加该队伍在该时间戳的分数
			if (!teamScores[teamId].scores[created_at]) {
				teamScores[teamId].scores[created_at] = 0;
			}
			teamScores[teamId].scores[created_at] += pts; // 累加当前时间戳的分数
		});

		// 生成图表数据
		const series = Object.values(teamScores).map((teamScore) => {
			// 对每个队伍的分数进行累加
			let cumulativeScore = 0;
			const data = xData.map((timestamp) => {
				const temp =
					cumulativeScore + teamScore.scores[timestamp] || null;
				cumulativeScore += teamScore.scores[timestamp] || 0;
				return temp;
			});
			return {
				data,
				label: teamScore.team.name || `Team ${teamScore.team.id}`,
				connectNulls: true,
			};
		});

		// 对series按照总分进行排序，并只保留前十名
		series.sort((a, b) => {
			const totalA = a.data.reduce((acc, val) => acc + (val || 0), 0);
			const totalB = b.data.reduce((acc, val) => acc + (val || 0), 0);
			return totalB - totalA; // 降序排列
		});
		if (series.length > 10) {
			series.length = 10; // 只保留前十名
		}

		console.log(series);

		setSeries(series);
		setXData(xData);
	}, [submissions]);

	return (
		<LineChart
			height={500}
			series={series}
			xAxis={[
				{
					data: xData,
					valueFormatter(value, _) {
						return new Date(value).toLocaleString();
					},
				},
			]}
			grid={{ vertical: true, horizontal: true }}
			tooltip={{ trigger: "axis" }}
		/>
	);
}

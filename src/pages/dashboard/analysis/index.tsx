import { Chart } from "@/components/chart";
import { useChart } from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Title } from "@/ui/typography";

const positionData = {
	categories: ["Professorlar", "Dotsentlar", "Katta o'qituvchilar", "Assistentlar"],
	series: [{ name: "Soni", data: [18, 45, 97, 88] }],
};

const genderData = {
	labels: ["Erkaklar", "Ayollar"],
	series: [142, 106],
	colors: ["#2563eb", "#ec4899"],
};

const ageData = {
	categories: ["25-35 yosh", "36-45 yosh", "46-55  yosh", "56-65 yosh"],
	series: [{ name: "O'qituvchilar", data: [62, 89, 71, 26] }],
};

const knowladgeData = {
	labels: ["Dsc", "PhD", "Assisten"],
	series: [23, 64, 161],
	colors: ["#F59E0B", "#3A3D8E", "#10B981"],
};

export default function Analysis() {
	const positionChart = useChart({
		xaxis: { categories: positionData.categories },
		yaxis: { tickAmount: 4 },
		colors: ["#6366f1"],
	});

	const genderChart = useChart({
		labels: genderData.labels,
		colors: genderData.colors,
		stroke: { show: false },
		legend: { show: false },
		tooltip: { fillSeriesColor: false },
		plotOptions: {
			pie: {
				donut: {
					size: "65%",
				},
			},
		},
	});

	const ageChart = useChart({
		xaxis: { categories: ageData.categories },
		yaxis: { tickAmount: 4 },
		colors: ["#10b981"],
	});

	const knowladgeChart = useChart({
		labels: knowladgeData.labels,
		colors: knowladgeData.colors,
		stroke: { show: false },
		legend: { show: false },
		tooltip: { fillSeriesColor: false },
		plotOptions: {
			pie: {
				donut: {
					size: "65%",
				},
			},
		},
	});
	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div>
				<Title as="h4" className="text-xl mb-1">
					O'qituvchilar Analitikasi
				</Title>
				<span className="text-[13px] text-muted-foreground">
					Lavozim, jins, yosh va ilmiy darajalar bo'yicha taqsimot
				</span>
			</div>

			<div className="grid grid-cols-12 gap-4">
				<Card className="col-span-12 lg:col-span-7">
					<CardHeader>
						<span className="text-[14px] font-semibold">Lavozim taqsimoti</span>
					</CardHeader>
					<CardContent>
						<Chart type="bar" height={280} options={positionChart} series={positionData.series} />
					</CardContent>
				</Card>

				<Card className="col-span-12 lg:col-span-5">
					<CardHeader>
						<span className="text-[14px] font-semibold">Jins taqsimoti</span>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center gap-4">
						<Chart type="donut" height={280} options={genderChart} series={genderData.series} />
						<div className="flex gap-6">
							{genderData.labels.map((label, i) => (
								<div key={label} className="flex items-center  gap-2">
									<span
										className="w-3 h-3 rounded-full inline-block"
										style={{ backgroundColor: genderData.colors[i] }}
									></span>
									<span className="text-[12px] text-muted-foreground">{label}</span>
									<span className="text-[13px] font-bold ">{genderData.series[i]}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card className="col-span-12 lg:col-span-7">
					<CardHeader>
						<span className="text-[14px] font-semibold">Yosh taqsimoti</span>
					</CardHeader>
					<CardContent>
						<Chart type="bar" height={280} options={ageChart} series={ageData.series} />
					</CardContent>
				</Card>

				<Card className="col-span-12 lg:col-span-5">
					<CardHeader>
						<span className="text-[14px] font-semibold">Ilmiy darajalar</span>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center gap-4">
						<Chart  type="donut" height={280} options={knowladgeChart} series={knowladgeData.series} />
						<div className="flex flex-col gap-1 w-full">
							{knowladgeData.labels.map((label, i) => (
								<div key={label} className="flex justify-between items-center ">
									<div className="flex items-center gap-3">
										<span
											className="w-3 h-3 rounded-full inline-block"
											style={{ backgroundColor: knowladgeData.colors[i] }}
										></span>
										<span className="text-[12px] text-muted-foreground">{label}</span>
									</div>
									<span className="text-[13px] font-bold ">{knowladgeData.series[i]}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

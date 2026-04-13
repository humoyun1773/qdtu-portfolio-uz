import ApexChart from "react-apexcharts";
import { chartWrapper } from "./styles.css";

import type { Props as ApexChartProps } from "react-apexcharts";

export function Chart(props: ApexChartProps) {
	return (
		<div className={chartWrapper}>
			<ApexChart
				{...props}
				options={{
					...props.options,
					chart: {
						...props.options?.chart,
						animations: {
							...props.options?.chart?.animations,
							enabled: true,
							speed: 200,
							animateGradually: {
								enabled: false,
							},
							dynamicAnimation: {
								enabled: true,
								speed: 200,
							},
						},
						redrawOnParentResize: true,
						redrawOnWindowResize: true,
					},
				}}
			/>
		</div>
	);
}

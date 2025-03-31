import React from "react";
import {LineChart} from "@mui/x-charts/LineChart";

const config = {
	xAxisData: [1, 2, 3, 5, 8, 10],
	series: [
		{
			label: "Revenue ($)",
			data: [2, 5.5, 2, 8.5, 1.5, 5],
			color: "#3f51b5",
		},
	],
	width: 450,
	height: 250,
};

const LineChartComponent = () => {
	return (
		<LineChart
			xAxis={[{data: config.xAxisData}]}
			series={config.series}
			width={config.width}
			height={config.height}
		/>
	);
};

export default LineChartComponent;

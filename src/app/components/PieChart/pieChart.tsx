import React, {useCallback, useEffect, useState} from "react";
import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";
import chartStore from "../../store/chartStore";
import {PieChart} from "@mui/x-charts";
import './pieChart.scss';
import stateStore from "../../store/stateStore";

type FrameMessage = {
	type: string;
	objects: {
		[label: string]: {
			number: number;
			otherInfo?: any;
		};
	};
};

type AnchorPosition = {
	vertical: 'top' | 'middle' | 'bottom';
	horizontal: 'left' | 'center' | 'right';
};


const PieChartComponent = () => {
	const {chartData, dataLabel, addData, updateLabels} = chartStore();
	const [pieData, setPieData] = useState<{ id: number; value: number; label: string }[]>([]);
	
	const {cleanTab, setCleanTab} = stateStore();
	
	
	useEffect(() => {
		subscribeTo("data", handleMessage);
		
		return () => {
			unsubscribeFrom("data", handleMessage);
		};
	}, []);
	
	const handleMessage = useCallback((data: FrameMessage) => {
		if (!data.objects) return;
		
		const parsedData = Object.entries(data.objects).map(([label, obj], index) => ({
			id: index,
			value: obj.number,
			label,
		}));
		
		setPieData(parsedData);
		
	}, [dataLabel]);
	
	useEffect(() => {
		if (cleanTab) {
			setPieData([]);
			setCleanTab(false);
		}
	}, [cleanTab]);
	
	return (
		<div className="customPieChart">
			<PieChart
				series={[
					{
						data: pieData
					}
				]}
				margin={{top: 80, bottom: 40, left: 40, right: 40}}
				slotProps={{
					legend: {
						direction: 'row',
						position: {
							vertical: 'top',
							horizontal: 'middle'
						},
					},
				}}
			/>
		</div>
	);
};

export default PieChartComponent;

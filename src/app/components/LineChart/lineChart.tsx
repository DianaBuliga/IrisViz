import React, {useCallback, useEffect, useMemo} from "react";
import {LineChart} from "@mui/x-charts/LineChart";
import stateStore from "../../store/stateStore";
import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";
import chartStore from "../../store/chartStore";
import './lineChart.scss';

type FrameMessage = {
	type: string;
	objects: {
		[label: string]: {
			number: number;
			otherInfo?: any;
		};
	};
};


const LineChartComponent = () => {
	const {chartData, dataLabel, addData, updateLabels, clearData} = chartStore();
	const {cleanTab, setCleanTab} = stateStore();
	
	useEffect(() => {
		subscribeTo("data", handleMessage);
		
		return () => {
			unsubscribeFrom("data", handleMessage);
		};
	}, []);
	
	const handleMessage = useCallback((data: FrameMessage) => {
		if (!data.objects) return;
		
		const timestamp = stateStore.getState().timestamp;
		const newEntry: { timestamp: number; [label: string]: number } = {timestamp: timestamp};
		
		const incomingLabels = Object.keys(data.objects);
		incomingLabels.forEach((label) => {
			newEntry[label] = data.objects[label].number;
		});
		
		const updatedLabels = Array.from(new Set([...dataLabel, ...incomingLabels]));
		if (updatedLabels.length !== dataLabel.length) {
			updateLabels(updatedLabels);
		}
		
		addData(newEntry);
		
	}, []);
	
	useEffect(() => {
		if (cleanTab) {
			clearData();
			setCleanTab(false);
		}
	}, [cleanTab]);
	
	const dataSeries = useMemo(() => {
		return dataLabel.map((label) => ({
			label,
			data: chartData.map((d) => d[label] ?? 0),
		}));
	}, [chartData, dataLabel]);
	
	
	const timestamps = useMemo(() => {
		return chartData.map((d) => d.timestamp);
	}, [chartData]);
	
	return (
		<div className='customLineChart'>
			<LineChart
				skipAnimation
				xAxis={[{data: timestamps}]}
				series={dataSeries}
			/>
		</div>
	);
};

export default LineChartComponent;

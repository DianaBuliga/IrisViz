import React, {useEffect, useMemo, useState} from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import {subscribeTo, unsubscribeFrom} from "../../websocket/websocket";
import {Slider} from '@mui/material';
import './playControls.scss';
import stateStore from '../../store/stateStore';
import {jumpToBeginning, startStopAction} from "../../utils";

function formatTimeWithFraction(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = (seconds % 60).toFixed(1);
	return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${secs.padStart(4, '0')}`;
}

const PlayControlsComponent = () => {
	
	const [isImage, setIsImage] = useState<boolean>(false);
	const [videoDuration, setVideoDuration] = useState<number>(0);
	
	const {playControl, timestamp, setTimestamp} = stateStore();
	
	useEffect(() => {
		subscribeTo("player", handleMessage);
		
		return () => {
			unsubscribeFrom("player", handleMessage);
		};
	}, []);
	
	const handleMessage = (data: any) => {
		if (data.videoData) setVideoDuration(data.videoData.videoDuration);
		if (data.isImage) setIsImage(data.isImage);
		if (data.timeFrame || data.timeFrame === 0) setTimestamp(data.timeFrame);
	};
	
	const playIcon = useMemo(() => {
		return !playControl ?
			<PlayArrowIcon className='playButton' onClick={startStopAction}/>
			:
			<PauseIcon className='playButton' onClick={startStopAction}/>;
	}, [playControl]);
	
	const maxSliderValue: string = useMemo(() => {
		return !isImage ? formatTimeWithFraction(videoDuration) : '0:0:0';
	}, [videoDuration]);
	
	const currentSliderValue: string = useMemo(() => {
		return !isImage ? formatTimeWithFraction(timestamp) : '0:0:0';
	}, [timestamp]);
	
	return (
		<div className='playControls'>
			<SkipPreviousIcon className='skipButton' onClick={jumpToBeginning}/>
			{playIcon}
			<SkipNextIcon className='skipButton'/>
			
			<div className='timeValue'>{currentSliderValue}</div>
			
			<Slider
				className='slider'
				size="small"
				min={0}
				max={videoDuration}
				step={0.1}
				value={timestamp}
				aria-label="Small"
				valueLabelDisplay="auto"
			/>
			<div className='timeValue'>{maxSliderValue}</div>
		
		</div>
	);
}

export default PlayControlsComponent;
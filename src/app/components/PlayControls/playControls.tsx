import React, {useCallback, useMemo} from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import {sendMessage} from "../../websocket/websocket";
import {Slider} from '@mui/material';
import './playControls.scss';

const PlayControlsComponent = () => {
	
	const [playControls, setPlayControls] = React.useState<boolean>(false);
	
	const handlePlayEvent = useCallback(() => {
		if (!playControls)
			sendMessage({type: "startPlay", payload: ""});
		else {
			sendMessage({type: "stopPlay", payload: ""});
			console.log('stop ')
		}
		setPlayControls(!playControls);
	}, [playControls])
	
	const playIcon = useMemo(() => {
		return !playControls ?
			<PlayArrowIcon className='playButton' onClick={handlePlayEvent}/>
			:
			<PauseIcon className='playButton' onClick={handlePlayEvent}/>;
	}, [playControls])
	
	return (
		<div className='playControls'>
			<SkipPreviousIcon className='skipButton'/>
			{playIcon}
			<SkipNextIcon className='skipButton'/>
			
			<div className='timeValue'>0:0:0</div>
			
			<Slider
				className='slider'
				size="small"
				defaultValue={70}
				aria-label="Small"
				valueLabelDisplay="auto"
			/>
			<div className='timeValue'>0:10:0</div>
		
		</div>
	);
}

export default PlayControlsComponent;
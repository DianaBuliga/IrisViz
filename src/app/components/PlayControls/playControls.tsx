import React, {useCallback} from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {sendMessage} from "../../websocket/websocket";

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
	
	return (
		(
			!playControls ?
				<PlayArrowIcon onClick={handlePlayEvent}/>
				:
				<PauseIcon onClick={handlePlayEvent}/>
		)
	);
}

export default PlayControlsComponent;
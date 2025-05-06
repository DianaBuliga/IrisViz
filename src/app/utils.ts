import {sendMessage} from "./websocket/websocket";
import stateStore from "./store/stateStore";

export const logToMain = (level: 'info' | 'warn' | 'error', message: string) => {
	window.electron.send('log-message', {level, message});
};

export const openVideo = async () => {
	const filePath = await window.electron.openFileDialog();
	if (filePath) {
		sendMessage({
			type: "openFile",
			payload: filePath,
		});
	}
}

export const startStopAction = () => {
	const {playControl, setPlayControl} = stateStore.getState();
	if (!playControl)
		sendMessage({type: "startPlay", payload: ""});
	else {
		sendMessage({type: "stopPlay", payload: ""});
	}
	setPlayControl(!playControl);
}

const {setCleanTab} = stateStore.getState();
export const jumpToBeginning = () => {
	sendMessage({type: "jumpToBeginning", payload: ""});
	setCleanTab(true);
}
import {sendMessage} from "./websocket/websocket";
import stateStore from "./store/stateStore";
import log from "electron-log";

export const openVideo = async () => {
	const filePath = await window.electron.openFileDialog();
	if (filePath) {
		sendMessage({
			type: "openFile",
			payload: filePath,
		});
		log.info('Send file path:', filePath);
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
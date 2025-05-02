import useTabStore from "../Layout/layoutStore";
import {ImageRenderer} from '../../components/ImageRenderer/configuration';
import {LineChart} from '../../components/LineChart/configuration';
import {Table} from '../../components/Table/configuration';
import {jumpToBeginning, openVideo, startStopAction} from "../../utils";


const {addTab, currentPanel} = useTabStore.getState();

const menuItems: { [key: string]: { label: string; action?: () => void; shortcut?: string }[] } = {
	File: [
		{label: "Open Video", action: () => openVideo()},
		{
			label: "Exit",
			action: () => {
				window.electron.send("close-app");
			},
			shortcut: "Ctrl+Q",
		},
	],
	Actions: [
		{
			label: "Open Video",
			action: () => openVideo(),
			shortcut: "Ctrl+O",
		},
		{
			label: "Play/Stop",
			action: () => startStopAction()
		},
		{label: "Jump to Beginning", action: () => jumpToBeginning()},
		{label: "Jump to End", action: () => console.log("Copy Clicked")},
	],
	Components: [
		{
			label: "Image Renderer",
			action: () => addTab(currentPanel, ImageRenderer.title, ImageRenderer.icon, ImageRenderer.component),
		},
		{
			label: "Line Chart",
			action: () => addTab(currentPanel, LineChart.title, LineChart.icon, LineChart.component),
		},
		{
			label: "Table",
			action: () => addTab(currentPanel, Table.title, Table.icon, Table.component),
		},
	],
	Help: [
		{label: "About", action: () => console.log("About Clicked")},
	],
};

export default menuItems;
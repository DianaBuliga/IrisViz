import {sendMessage} from "../../websocket/websocket";

const menuItems: { [key: string]: { label: string; action?: () => void; shortcut?: string }[] } = {
	File: [
		{
			label: "New File",
			action: () => sendMessage(
				{type: "openFile", payload: "D:\\backend\\videoReaderBackend\\intersection1.mp4"}
			)
		},
		{label: "Open File", action: () => console.log("Open File Clicked")},
		{label: "Save", action: () => console.log("Save Clicked")},
		{
			label: "Exit",
			action: () => {
				window.electron.send("close-app");
			},
			shortcut: "Ctrl+Q",
		},
	],
	Edit: [
		{label: "Undo", action: () => console.log("Undo Clicked")},
		{label: "Redo", action: () => console.log("Redo Clicked")},
		{label: "Cut", action: () => console.log("Cut Clicked")},
		{label: "Copy", action: () => console.log("Copy Clicked")},
		{label: "Paste", action: () => console.log("Paste Clicked")},
	],
	Actions: [
		{
			label: "Open File",
			action: () => sendMessage(
				{type: "openFile", payload: "D:\\backend\\videoReaderBackend\\frame0.jpg"}
			)
		},
		{
			label: "Play",
			action: () => sendMessage(
				{type: "playVideo", payload: ""}
			)
		},
		{label: "Cut", action: () => console.log("Cut Clicked")},
		{label: "Copy", action: () => console.log("Copy Clicked")},
		{label: "Paste", action: () => console.log("Paste Clicked")},
	],
	View: [
		{label: "Zoom In", action: () => console.log("Zoom In Clicked")},
		{label: "Zoom Out", action: () => console.log("Zoom Out Clicked")},
		{label: "Reset Layout", action: () => console.log("Reset Layout Clicked")},
	],
	Help: [
		{label: "About", action: () => console.log("About Clicked")},
		{label: "Documentation", action: () => console.log("Documentation Clicked")},
		{label: "Report Issue", action: () => console.log("Report Issue Clicked")},
	],
};

export default menuItems;
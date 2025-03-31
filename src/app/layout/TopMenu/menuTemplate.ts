const menuItems: { [key: string]: { label: string; action?: () => void; shortcut?: string }[] } = {
	File: [
		{label: "New File", action: () => console.log("New File Clicked")},
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
	View: [
		{label: "Zoom In", action: () => console.log("Zoom In Clicked")},
		{label: "Zoom Out", action: () => console.log("Zoom Out Clicked")},
		{label: "Reset Layout lo lol olo lo lo", action: () => console.log("Reset Layout Clicked")},
	],
	Help: [
		{label: "About", action: () => console.log("About Clicked")},
		{label: "Documentation", action: () => console.log("Documentation Clicked")},
		{label: "Report Issue", action: () => console.log("Report Issue Clicked")},
	],
};

export default menuItems;
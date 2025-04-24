import {app, BrowserWindow} from 'electron';
import path from 'path';
import electronDebug from 'electron-debug';
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";

const {ipcMain} = require('electron')

electronDebug({showDevTools: true});

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		autoHideMenuBar: true,
		resizable: true,
		webPreferences: {
			preload: path.join(__dirname, "../electron/preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	})
	mainWindow.setMenuBarVisibility(false);
	
	const indexPath = path.join(__dirname, '../app/index.html');
	if (isDev) {
		mainWindow.loadURL('http://localhost:3000');
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log("An error occurred: ", err));
	} else {
		mainWindow.loadFile(indexPath);
	}
}

ipcMain.on('close-app', () => {
	app.quit()
})

ipcMain.on("minimize-window", () => {
	if (mainWindow) mainWindow.minimize();
});

ipcMain.on("maximize-window", () => {
	mainWindow.maximize();
});

ipcMain.on("restore-window", () => {
	mainWindow.unmaximize();
});

app.whenReady().then(() => {
	createWindow()
	
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

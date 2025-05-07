import {app, BrowserWindow} from 'electron';
import path from 'path';

const {ipcMain, dialog} = require('electron');
const log = require('electron-log');
log.initialize();
log.info('App is starting...');

const isDev = process.env.NODE_ENV === 'development';
if (!isDev)
	try {
		require('electron-debug')();
	} catch (e) {
		console.warn('electron-debug not available');
	}


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
	
	// const indexPath = path.join(__dirname, './app/index.html');
	// if (isDev) {
	// 	mainWindow.loadURL('http://localhost:3000');
	// 	mainWindow.webContents.openDevTools();
	// } else {
	// mainWindow.loadFile(indexPath);
	// }
	const indexPath = path.join(__dirname, '../app/index.html');
	mainWindow.loadFile(indexPath);
	log.error(indexPath)
}

ipcMain.on('close-app', () => {
	log.info('App is closing...');
	app.exit();
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

ipcMain.handle("open-file-dialog", async () => {
	const {canceled, filePaths} = await dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [{name: 'Videos', extensions: ['mp4', 'mkv', 'jpg', 'png']}]
	});
	
	if (canceled || filePaths.length === 0) return null;
	return filePaths[0];
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
		log.info('App is closing...');
		app.exit();
	}
});

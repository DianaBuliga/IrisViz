import {app, BrowserWindow} from 'electron';
import path from 'path';
import electronDebug from 'electron-debug';

electronDebug({showDevTools: true});

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true
		}
	})
	mainWindow.setMenuBarVisibility(false);
	
	const indexPath = path.join(__dirname, '../app/index.html');
	if (isDev) {
		mainWindow.loadURL('http://localhost:3000');
	} else {
		const indexPath = path.join(__dirname, '../app/index.html');
		mainWindow.loadFile(indexPath);
	}
}

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
})
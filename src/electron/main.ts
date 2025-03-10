const {app, BrowserWindow} = require('electron/main')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'development';

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	})
	mainWindow.setMenuBarVisibility(null);
	
	const indexPath = path.resolve(__dirname, '../app/index.html');
	mainWindow.loadFile(indexPath);
	mainWindow.webContents.openDevTools(); // Open DevTools for debugging
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
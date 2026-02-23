const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: 'Upload Labs: Network Empire',
        backgroundColor: '#0a0e14',
        icon: path.join(__dirname, '..', 'assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load the game's index.html directly from the project root
    win.loadFile(path.join(__dirname, '..', 'index.html'));

    // Hide the default menu bar for a cleaner game experience
    win.setMenuBarVisibility(false);

    // Open DevTools in development mode (set ELECTRON_DEV=1 to enable)
    if (process.env.ELECTRON_DEV === '1') {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

// Quit when all windows are closed (Windows/Linux behavior)
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

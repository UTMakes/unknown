const { contextBridge } = require('electron');

// Expose a flag so the game can detect it's running in the desktop app
contextBridge.exposeInMainWorld('electronAPI', {
    isDesktop: true,
    platform: process.platform
});

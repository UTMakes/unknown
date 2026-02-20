// Game Engine Worker
import { gameTick, game, updateConnectivity } from './game.js';

let isRunning = false;
let lastTime = 0;

self.onmessage = (e) => {
    const { type, data } = e.data;
    
    if (type === 'INIT') {
        Object.assign(game, data.game);
        lastTime = performance.now();
        isRunning = true;
        tick();
    }
    
    if (type === 'UPDATE_STATE') {
        Object.assign(game, data);
    }
};

function tick() {
    if (!isRunning) return;
    
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Run physics/math loop
    gameTick(dt);
    
    // Periodically update connectivity in worker too
    if (Math.random() < 0.01) updateConnectivity();

    // Post updated state back to UI thread
    // Only send what's needed to reduce serialization overhead
    self.postMessage({ 
        type: 'TICK_UPDATE', 
        data: { 
            money: game.money,
            rp: game.rp,
            res: game.res,
            stats: game.stats,
            routerHeat: game.routerHeat,
            overheatMode: game.overheatMode
        }
    });

    setTimeout(tick, 16); 
}

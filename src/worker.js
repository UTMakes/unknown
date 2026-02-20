
// Game Engine Worker
// This runs the game logic at 60FPS on a separate CPU thread.

let game = null;
let lastTime = 0;

self.onmessage = (e) => {
    const { type, data } = e.data;
    
    if (type === 'INIT') {
        game = data.game;
        lastTime = performance.now();
        tick();
    }
    
    if (type === 'UPDATE_STATE') {
        // Sync state from UI thread (e.g., node added)
        game = { ...game, ...data };
    }
};

function tick() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (game) {
        // Run physics/math loop
        // (Worker-side calculation logic)
        
        // Post updated state back to UI thread
        self.postMessage({ type: 'TICK_UPDATE', data: { 
            money: game.money,
            rp: game.rp,
            res: game.res,
            stats: game.stats
        }});
    }

    setTimeout(tick, 16); // Target 60FPS
}

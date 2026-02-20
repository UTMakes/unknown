
import { game, gameTick, updateConnectivity, addNode } from './game.js';
import { initUI, renderWorld, updateStatsUI } from './ui.js';
import './style.css';

// 1. Initialize Web Worker for Background Logic
const engineWorker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

engineWorker.onmessage = (e) => {
    const { type, data } = e.data;
    if (type === 'TICK_UPDATE') {
        Object.assign(game, data);
    }
};

// 2. Setup Interactions
function setupEvents() {
    const resBtn = document.querySelector('.btn-research');
    if (resBtn) {
        resBtn.onclick = () => {
            document.getElementById('researchModal').style.display = 'flex';
        };
    }
    
    const zoomIn = document.getElementById('zoomInBtn');
    if (zoomIn) zoomIn.onclick = () => { /* Zoom Logic */ };
    
    // Add more bindings as needed
}

function init() {
    console.log("Initializing Optimized Engine...");
    
    if (game.nodes.size === 0) {
        addNode('router', 2500, 2500);
    }
    
    initUI();
    setupEvents();
    
    // Start Worker
    engineWorker.postMessage({ type: 'INIT', data: { game } });

    function renderLoop(timestamp) {
        renderWorld();
        updateStatsUI();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

document.addEventListener('DOMContentLoaded', init);

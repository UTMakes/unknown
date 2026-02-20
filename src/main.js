import { game, gameTick, updateConnectivity, addNode } from './game.js';
import { initUI, renderWorld, updateStatsUI, setTab } from './ui.js';
import { setupInputs } from './inputs.js';
import './style.css';

// Web Worker for Background Logic
const engineWorker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

engineWorker.onmessage = (e) => {
    const { type, data } = e.data;
    if (type === 'TICK_UPDATE') {
        Object.assign(game, data);
    }
};

function init() {
    console.log("Re-initializing Gameplay Systems...");
    
    if (game.nodes.size === 0) {
        addNode('router', 2500, 2500);
    }
    
    initUI();
    
    const viewport = document.getElementById('viewport');
    const world = document.getElementById('world');
    setupInputs(viewport, world);
    
    // Tab handlers
    document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            setTab(tab.dataset.tab);
        };
    });

    engineWorker.postMessage({ type: 'INIT', data: { game } });

    function renderLoop(timestamp) {
        renderWorld();
        updateStatsUI();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
    
    setInterval(() => updateConnectivity(), 1000);
}

document.addEventListener('DOMContentLoaded', init);

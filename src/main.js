import { game, addNode } from './game.js';
import { initUI, renderWorld, updateStatsUI } from './ui.js';
import './style.css';

// 1. Initialize Web Worker for Background Logic
const engineWorker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

engineWorker.onmessage = (e) => {
    const { type, data } = e.data;
    if (type === 'TICK_UPDATE') {
        // Sync worker calculations back to the main game state
        Object.assign(game, data);
    }
};

// 2. Lazy-Load Modals (Vercel Efficiency)
async function openResearch() {
    // Only import TECH_TREE when needed
    const { TECH_TREE } = await import('./data.js');
    console.log("Research loaded dynamically:", TECH_TREE.length, "items");
    document.getElementById('researchModal').style.display = 'flex';
}

function init() {
    console.log("Initializing Optimized Engine...");
    
    if (game.nodes.size === 0) addNode('router', 2500, 2500);
    
    initUI();
    
    // Start Worker
    engineWorker.postMessage({ type: 'INIT', data: { game } });

    // Main Render Loop (Main Thread Only Handles Visuals)
    function renderLoop(timestamp) {
        renderWorld();
        updateStatsUI();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
    
    // Bind dynamic buttons
    const resBtn = document.querySelector('.btn-research');
    if (resBtn) resBtn.onclick = openResearch;
}

document.addEventListener('DOMContentLoaded', init);

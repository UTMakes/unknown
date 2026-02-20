import { 
    game, gameTick, updateConnectivity, addNode, upgradeRouter, 
    cleanNode, performPrestige, convertCodeBits, installDriver, 
    toggleCableDeleteMode, deleteAllCables, activeNodes, addConnection,
    upgradeNode, removeNode, updateCombo, updateEvents, checkOfflineEarnings,
    autoSaveLocal, loadLocalSave
} from './game.js';
import { initUI, renderWorld, updateStatsUI, setTab, updateWorldTransform, showEventNotification } from './ui.js';
import { setupInputs } from './inputs.js';
import './style.css';

// Initialize Game
function init() {
    console.log("Initializing Modular Upload Labs...");
    
    // Load local save
    loadLocalSave();

    // Setup Window.Game API for HTML event handlers
    window.Game = {
        zoomIn: () => {
            game.viewScale = Math.min(2, (game.viewScale || 1) * 1.2);
            updateWorldTransform(game.viewX, game.viewY, game.viewScale);
        },
        zoomOut: () => {
            game.viewScale = Math.max(0.3, (game.viewScale || 1) / 1.2);
            updateWorldTransform(game.viewX, game.viewY, game.viewScale);
        },
        resetZoom: () => {
            game.viewScale = 1;
            updateWorldTransform(game.viewX, game.viewY, game.viewScale);
        },
        clearSaveAndReset: () => {
            if (confirm("Reset everything?")) {
                localStorage.removeItem('uploadLabsSave');
                location.reload();
            }
        },
        upgradeRouter: () => upgradeRouter(),
        toggleCableDeleteMode: () => {
            const active = toggleCableDeleteMode();
            const btn = document.getElementById('cableDeleteBtn');
            const txt = document.getElementById('cableDeleteText');
            if (active) {
                btn.classList.add('active');
                txt.innerText = 'Click Cable to Delete';
                document.getElementById('world').classList.add('cable-delete-mode');
            } else {
                btn.classList.remove('active');
                txt.innerText = 'Delete Cables';
                document.getElementById('world').classList.remove('cable-delete-mode');
            }
        },
        convertCodeBits: () => convertCodeBits(),
        installDriver: (id) => installDriver(id), // Helper for onclicks
        performPrestige: () => performPrestige(),
        addMoney: (e) => {
            game.money += 5;
            // Simple visual feedback could be added here
        }
    };

    // Global helper for adding money via click (referenced in HTML)
    window.addMoney = window.Game.addMoney;
    window.upgradeRouter = window.Game.upgradeRouter;
    window.convertCodeBits = window.Game.convertCodeBits;
    window.toggleCableDeleteMode = window.Game.toggleCableDeleteMode;
    window.deleteAllCables = () => {
        deleteAllCables();
        renderWorld(); // Re-render to remove cables
    };
    window.setTab = setTab;
    window.cleanNode = (id) => {
        cleanNode(id);
        renderWorld();
    };
    
    // Context Menu Actions
    window.upgradeSelectedNode = () => {
        if (window.selectedNodeId) {
            upgradeNode(window.selectedNodeId);
            renderWorld(); // Force update to show new level
            document.getElementById('contextMenu').style.display = 'none';
        }
    };
    window.deleteSelectedNode = () => {
        if (window.selectedNodeId) {
            removeNode(window.selectedNodeId);
            renderWorld();
            document.getElementById('contextMenu').style.display = 'none';
        }
    };
    
    // Modal Helpers
    window.openModal = (id) => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        document.getElementById(id).style.display = 'flex';
    };
    window.closeModal = (id) => {
        document.getElementById(id).style.display = 'none';
    };

    // Initialize View State
    if (!game.viewX) game.viewX = window.innerWidth / 2 - 2500;
    if (!game.viewY) game.viewY = window.innerHeight / 2 - 2500;
    game.viewScale = 1;

    // Spawn Router if empty
    if (game.nodes.size === 0) {
        addNode('router', 2500, 2500);
    }

    initUI();
    
    const viewport = document.getElementById('viewport');
    const world = document.getElementById('world');
    setupInputs(viewport, world);

    // Initial Connectivity
    updateConnectivity();
    
    // Check Offline Earnings
    setTimeout(() => {
        const earnings = checkOfflineEarnings();
        if (earnings) {
            // UI logic for showing offline earnings modal would go here
            console.log("Offline Earnings:", earnings);
        }
    }, 1000);

    // Start Game Loop (Main Thread)
    let lastTime = performance.now();
    let autoSaveTimer = 0;
    
    function loop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        gameTick(dt);
        updateCombo(dt);
        
        const eventFinished = updateEvents(dt);
        if (eventFinished) {
            // Event ended logic if needed
        }
        
        // Auto Save
        autoSaveTimer += dt;
        if (autoSaveTimer > 60) {
            autoSaveLocal();
            autoSaveTimer = 0;
        }
        
        // Throttled Rendering
        renderWorld();
        updateStatsUI();
        
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    
    // Periodic tasks
    setInterval(() => updateConnectivity(), 1000);
    
    // Initial Render
    renderWorld();
    updateStatsUI();
}

document.addEventListener('DOMContentLoaded', init);


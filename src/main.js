import { 
    game, gameTick, updateConnectivity, addNode, upgradeRouter, 
    cleanNode, performPrestige, convertCodeBits, installDriver, 
    toggleCableDeleteMode, deleteAllCables, activeNodes, addConnection,
    upgradeNode, removeNode, updateCombo, updateEvents, checkOfflineEarnings,
    autoSaveLocal, loadLocalSave, batchUpgrade, toggleAutoBalancer,
    calculateRates, attemptVirusInfection, triggerRandomEvent, startContract
} from './game.js';
import { 
    initUI, renderWorld, updateStatsUI, setTab, updateWorldTransform, 
    showEventNotification, showNetworkAnalysis, updateRateUI, showFloat, spawnParticles,
    openContracts
} from './ui.js';
import { setupInputs } from './inputs.js';
import { initFirebase, loginUser, registerUser, logoutUser, syncToCloud, loadFromCloud } from './auth.js';
import './style.css';

// Initialize Game
function init() {
    console.log("Initializing Modular Upload Labs...");
    
    // Load local save
    loadLocalSave();
    
    // Initialize Auth
    initFirebase();

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
            showFloat('+$5', e.clientX, e.clientY, '#10b981');
        },
        batchUpgrade: (type) => {
            const count = batchUpgrade(type);
            if (count > 0) {
                renderWorld();
                showFloat(`Upgraded ${count} nodes!`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
            }
        },
        toggleAutoBalancer: () => toggleAutoBalancer(),
        showNetworkAnalysis: () => showNetworkAnalysis()
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
        if (cleanNode(id)) {
            const n = game.nodes.get(id);
            if (n) {
                spawnParticles(n.x + 90, n.y + 40, '#10b981', 10);
                showFloat("CLEANED", n.x + 90, n.y, '#10b981');
            }
            renderWorld();
        }
    };
    
    // Contract Globals
    window.openContracts = openContracts;
    window.startContract = (c) => {
        if (startContract(c)) {
            // Close modal
            document.getElementById('contractModal').style.display = 'none';
            // Visual feedback
            showFloat('Contract Started!', window.innerWidth/2, window.innerHeight/2, '#fbbf24');
        }
    };
    
    // Auth Globals
    window.loginUser = loginUser;
    window.registerUser = registerUser;
    window.logoutUser = logoutUser;
    window.syncToCloud = syncToCloud;
    window.loadFromCloud = loadFromCloud;
    
    // Context Menu Actions
    window.upgradeSelectedNode = () => {
        if (window.selectedNodeId) {
            if (upgradeNode(window.selectedNodeId)) {
                const n = game.nodes.get(window.selectedNodeId);
                spawnParticles(n.x + 90, n.y + 40, '#fbbf24', 10);
                renderWorld();
            }
            document.getElementById('contextMenu').style.display = 'none';
        }
    };
    window.deleteSelectedNode = () => {
        if (window.selectedNodeId) {
            const n = game.nodes.get(window.selectedNodeId);
            if (n) spawnParticles(n.x + 90, n.y + 40, '#ef4444', 8);
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
    
    // 1-Second Loop (Rates)
    setInterval(() => {
        const rates = calculateRates();
        updateRateUI(rates.money, rates.rp);
    }, 1000);
    
    // 2-Minute Loop (Viruses)
    setInterval(() => {
        const target = attemptVirusInfection();
        if (target) {
            showFloat("⚠️ VIRUS", target.x + 90, target.y, '#8b5cf6');
            console.log("Virus infection at node", target.id);
            renderWorld();
        }
    }, 120000);
    
    // 10-Minute Loop (Events)
    setInterval(() => {
        const result = triggerRandomEvent();
        if (result) {
            showEventNotification(result.event);
        }
    }, 600000);
    
    // Periodic tasks
    setInterval(() => updateConnectivity(), 1000);
    
    // Save on exit
    window.addEventListener('beforeunload', () => {
        autoSaveLocal();
    });
    
    // Initial Render
    renderWorld();
    updateStatsUI();
}

document.addEventListener('DOMContentLoaded', init);

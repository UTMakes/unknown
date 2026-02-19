// Import configurations
import { GAME_VERSION, DAILY_REWARDS, MILESTONES, NODE_DEFS, RESOURCES, DRIVERS, TECH_TREE, ACHIEVEMENTS, RANDOM_EVENTS } from './game-config.js';

// --- STATE ---
let game = {
    money: 2000,
    rp: 0,
    prestige: 0, 
    res: { files: 0, images: 0, videos: 0, audio: 0 },
    nodes: [],
    conns: [],
    routerLevel: 1,
    routerHeat: 0,
    overheatMode: false,
    unlocked: [],
    nextId: 1,
    activeContract: null,
    
    // CODE SYSTEM
    codeBits: 0,
    optimizationCode: 0,
    drivers: {
        network: 0,
        compression: 0,
        security: 0,
        mining: 0,
        research: 0,
        upload: 0,
        download: 0
    },
    
    // STATISTICS
    stats: {
        totalMoney: 0,
        peakMoney: 2000,
        moneySpent: 0,
        totalRP: 0,
        nodesCreated: 0,
        nodesDeleted: 0,
        cablesPlaced: 0,
        upgrades: 0,
        contractsCompleted: 0,
        filesDownloaded: 0,
        virusesCleaned: 0,
        totalCodeBits: 0,
        totalDrivers: 0,
        playTime: 0,
        techsUnlocked: 0,
        prestigeCount: 0,
        startTime: Date.now()
    },
    
    // ACHIEVEMENTS
    achievements: [],
    achievementRewardsClaimed: 0,
    
    // EVENTS
    activeEvent: null,
    eventTimeLeft: 0,
    
    // DAILY REWARDS
    lastLoginDate: null,
    loginStreak: 0,
    dailyRewardClaimed: false,
    
    // MILESTONES
    milestonesCompleted: [],
    
    // SETTINGS
    autoSaveEnabled: true,
    notificationsEnabled: true,
    offlineEarningsEnabled: true,
    lastSaveTime: Date.now()
};

// Offline earnings tracking
let offlineEarnings = { money: 0, rp: 0, timeAway: 0 };

// Event multipliers
let eventMultipliers = { money: 1, rp: 1, code: 1, speed: 1 };

let view = { x: window.innerWidth/2 - 2500, y: window.innerHeight/2 - 2500, scale: 1 };
let activeNodes = new Set();
let history = { money: 0, rp: 0 };
let rateHistory = { money: [], rp: [] };
const RATE_WINDOW = 60; // 1 second at 60fps
let activeContract = null; 

// --- ZOOM FUNCTIONS ---
function updateZoomDisplay() {
    document.getElementById('zoomLevel').innerText = Math.round(view.scale * 100) + '%';
}

function zoomIn() {
    view.scale = Math.min(2, view.scale * 1.2);
    updateWorldTransform();
    updateZoomDisplay();
}

function zoomOut() {
    view.scale = Math.max(0.3, view.scale / 1.2);
    updateWorldTransform();
    updateZoomDisplay();
}

function resetZoom() {
    view.scale = 1;
    updateWorldTransform();
    updateZoomDisplay();
}

function updateWorldTransform() {
    const world = document.getElementById('world');
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}

window.Game = { zoomIn, zoomOut, resetZoom };

// --- CORE FUNCTIONS ---

function init() {
    if (game.nodes.length === 0) spawnNode('router', 2500, 2500);
    renderWorld();
    updateUI();
    logEvent("System initialized.");
    updateRouterCostDisplay();
    
    requestAnimationFrame(gameLoop);
    setInterval(secLoop, 1000);
    setInterval(virusLoop, 120000);
    setInterval(eventLoop, 600000); // Check for events every 10 minutes
    
    setupInputs();
    updateZoomDisplay();
    renderDriverGrid();
    renderAchievements();
    
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.game-container') || e.target.closest('.modal') || e.target.closest('.welcome-container')) {
            e.preventDefault();
        }
    });
}

function logEvent(msg, type = 'info') {
    const log = document.getElementById('eventLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.prepend(entry);
    if (log.children.length > 5) log.lastChild.remove();
}

// ==================== ACHIEVEMENTS SYSTEM ====================
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (game.achievements.includes(ach.id)) return;
        if (ach.condition(game.stats)) {
            unlockAchievement(ach);
        }
    });
}

function unlockAchievement(ach) {
    game.achievements.push(ach.id);
    game.money += ach.reward;
    showFloat(`+ $${ach.reward} (Achievement!)`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
    
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementText').innerText = `${ach.name}: ${ach.desc}`;
    popup.classList.add('show');
    
    setTimeout(() => popup.classList.remove('show'), 4000);
    logEvent(`Achievement: ${ach.name}!`, 'good');
    renderAchievements();
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    const unlocked = game.achievements.length;
    document.getElementById('achievementCount').innerText = unlocked;
    document.getElementById('achievementTotal').innerText = ACHIEVEMENTS.length;
    
    list.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = game.achievements.includes(ach.id);
        return `
            <div class="help-item" style="opacity: ${isUnlocked ? 1 : 0.5}; margin-bottom: 8px;">
                <div class="help-item-title" style="color: ${isUnlocked ? '#fbbf24' : 'var(--text-muted)'}">
                    <i class="${ach.icon}"></i> ${ach.name} ${isUnlocked ? '<i class="fa-solid fa-check" style="color:#10b981;"></i>' : '<i class="fa-solid fa-lock"></i>'}
                </div>
                <div class="help-item-desc">${ach.desc} | Reward: $${ach.reward}</div>
            </div>
        `;
    }).join('');
}

// ==================== RANDOM EVENTS SYSTEM ====================
function triggerRandomEvent() {
    if (game.activeEvent) return;
    if (Math.random() > 0.30) return; // 30% chance when checked (every 10 minutes)
    
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    
    if (event.instant) {
        event.effect(game);
        showEventNotification(event);
        logEvent(`Event: ${event.name}`, event.type === 'good' ? 'good' : 'bad');
    } else {
        game.activeEvent = event;
        game.eventTimeLeft = event.duration;
        event.effect();
        showEventNotification(event);
        logEvent(`Event started: ${event.name} (${event.duration}s)`, event.type === 'good' ? 'good' : 'bad');
    }
}

function showEventNotification(event) {
    const notif = document.getElementById('eventNotification');
    document.getElementById('eventTitle').innerText = event.name;
    document.getElementById('eventDesc').innerText = event.desc;
    document.getElementById('eventEffect').innerText = event.instant ? 'Instant effect applied!' : `Duration: ${event.duration} seconds`;
    
    notif.style.display = 'block';
    notif.className = `event-notification ${event.type} show`;
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.style.display = 'none', 500);
    }, event.instant ? 4000 : 6000);
}

function updateEvents(dt) {
    if (game.activeEvent) {
        game.eventTimeLeft -= dt;
        if (game.eventTimeLeft <= 0) {
            game.activeEvent.cleanup();
            logEvent(`Event ended: ${game.activeEvent.name}`);
            game.activeEvent = null;
        }
    }
}

// ==================== STATISTICS SYSTEM ====================
function updateStatistics() {
    // Peak money tracking
    if (game.money > game.stats.peakMoney) {
        game.stats.peakMoney = game.money;
    }
    
    // Play time
    game.stats.playTime = Math.floor((Date.now() - game.stats.startTime) / 1000);
    
    // Tech count
    game.stats.techsUnlocked = game.unlocked.length;
    
    // Total drivers
    game.stats.totalDrivers = Object.values(game.drivers).reduce((a, b) => a + b, 0);
    
    // Check achievements
    checkAchievements();
}

function renderStatistics() {
    document.getElementById('statTotalMoney').innerText = '$' + fmt(game.stats.totalMoney);
    document.getElementById('statPeakMoney').innerText = '$' + fmt(game.stats.peakMoney);
    document.getElementById('statMoneySpent').innerText = '$' + fmt(game.stats.moneySpent);
    document.getElementById('statContracts').innerText = game.stats.contractsCompleted;
    document.getElementById('statNodesCreated').innerText = game.stats.nodesCreated;
    document.getElementById('statNodesDeleted').innerText = game.stats.nodesDeleted;
    document.getElementById('statCablesPlaced').innerText = game.stats.cablesPlaced;
    document.getElementById('statUpgrades').innerText = game.stats.upgrades;
    document.getElementById('statFilesDownloaded').innerText = fmt(Math.floor(game.stats.filesDownloaded));
    document.getElementById('statTotalRP').innerText = fmt(Math.floor(game.stats.totalRP)) + ' RP';
    document.getElementById('statViruses').innerText = game.stats.virusesCleaned;
    
    const hours = Math.floor(game.stats.playTime / 3600);
    const mins = Math.floor((game.stats.playTime % 3600) / 60);
    document.getElementById('statPlayTime').innerText = `${hours}h ${mins}m`;
}

// ==================== PRESTIGE SYSTEM ====================
function updatePrestigeUI() {
    const currentBonus = game.prestige * 50;
    const nextBonus = (game.prestige + 1) * 50;
    document.getElementById('currentPrestigeBonus').innerText = `+${currentBonus}%`;
    document.getElementById('nextPrestigeBonus').innerText = `+${nextBonus}%`;
    
    const nodeCount = game.nodes.length;
    const moneyReq = 50000;
    const canPrestige = nodeCount >= 20 && game.money >= moneyReq;
    
    const reqText = document.getElementById('prestigeRequirements');
    reqText.innerHTML = `
        <span style="color: ${nodeCount >= 20 ? '#10b981' : '#ef4444'}">${nodeCount}/20 nodes</span> | 
        <span style="color: ${game.money >= moneyReq ? '#10b981' : '#ef4444'}">$${fmt(game.money)}/$50,000</span>
    `;
    
    const btn = document.getElementById('prestigeBtn');
    btn.disabled = !canPrestige;
    btn.style.opacity = canPrestige ? 1 : 0.5;
}

function performPrestige() {
    if (game.nodes.length < 20 || game.money < 50000) return;
    
    game.prestige++;
    game.stats.prestigeCount++;
    
    // Reset game state
    game.money = 5000; // Starting bonus
    game.rp = 0;
    game.res = { files: 0, images: 0, videos: 0, audio: 0 };
    game.nodes = [];
    game.conns = [];
    game.routerLevel = 1;
    game.routerHeat = 0;
    game.overheatMode = false;
    game.activeContract = null;
    game.codeBits = 0;
    game.optimizationCode = 0;
    
    // Reset stats that should be reset
    game.stats.nodesCreated = 0;
    game.stats.nodesDeleted = 0;
    game.stats.cablesPlaced = 0;
    game.stats.upgrades = 0;
    game.stats.filesDownloaded = 0;
    game.stats.virusesCleaned = 0;
    game.stats.contractsCompleted = 0;
    
    activeNodes.clear();
    selectedNode = null;
    
    // Spawn new router
    spawnNode('router', 2500, 2500);
    renderWorld();
    
    document.getElementById('prestigeModal').style.display = 'none';
    logEvent(`Data Center Migrated! +50% speed bonus (Total: +${game.prestige * 50}%)`, 'good');
    showFloat(`MIGRATED! +50% Speed`, window.innerWidth/2, window.innerHeight/2, '#a855f7');
    
    checkAchievements();
}

// ==================== COMBO SYSTEM ====================
let combo = { count: 0, timer: 0, lastAction: 0 };

function addCombo() {
    const now = Date.now();
    if (now - combo.lastAction < 3000) {
        combo.count++;
        combo.timer = 3;
        if (combo.count >= 3) {
            showComboIndicator();
            const bonus = Math.min(combo.count * 0.1, 1); // Max 100% bonus
            // Apply combo bonus temporarily
        }
    } else {
        combo.count = 1;
        combo.timer = 3;
    }
    combo.lastAction = now;
}

function showComboIndicator() {
    const indicator = document.getElementById('comboIndicator');
    indicator.innerText = `COMBO x${combo.count}!`;
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

function updateCombo(dt) {
    if (combo.timer > 0) {
        combo.timer -= dt;
        if (combo.timer <= 0) {
            combo.count = 0;
        }
    }
}

// ==================== PARTICLE EFFECTS ====================
function spawnParticles(x, y, color, count = 5) {
    const world = document.getElementById('world');
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${4 + Math.random() * 6}px;
            height: ${4 + Math.random() * 6}px;
            background: ${color};
            --tx: ${(Math.random() - 0.5) * 100}px;
            --ty: ${(Math.random() - 0.5) * 100}px;
        `;
        world.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}


// ==================== GAME LOOP ====================
function gameLoop(time) {
    const dt = 1/60; 
    
    // Safety check - ensure game loop continues even with large numbers
    if (!game || typeof game.money !== 'number') {
        console.error('Game state corrupted, resetting...');
        location.reload();
        return;
    }
    
    updateConnectivity();
    
    // Heat
    const router = game.nodes.find(n => n.type === 'router');
    let isOverclocked = false;
    
    if (router && activeNodes.has(router.id)) {
        game.conns.forEach(c => {
            if (c.to === router.id) {
                const source = game.nodes.find(n => n.id === c.from);
                if (source && source.type === 'overclock' && activeNodes.has(source.id) && !source.infected) {
                    isOverclocked = true;
                }
            }
        });

        if (isOverclocked) {
            game.routerHeat = Math.min(100, game.routerHeat + (15 * dt));
        } else {
            game.routerHeat = Math.max(0, game.routerHeat - (5 * dt));
        }
        
        if (game.routerHeat >= 100) game.overheatMode = true;
        if (game.routerHeat <= 50) game.overheatMode = false;
    }

    // Calculate multipliers
    let efficiency = 1.0;
    if (isOverclocked) efficiency *= 2.0;
    if (game.overheatMode) efficiency *= 0.7;
    
    // Driver effects
    const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect);
    const driverUploadMult = 1 + (game.drivers.upload * DRIVERS.upload.effect);
    const driverMiningMult = 1 + (game.drivers.mining * DRIVERS.mining.effect);
    const driverResearchMult = 1 + (game.drivers.research * DRIVERS.research.effect);

    const prestigeMult = 1 + (game.prestige * 0.5); 
    const fiberMult = game.unlocked.includes('tech_fiber') ? 1.25 : 1;
    const satMult = game.unlocked.includes('tech_sat') ? 1.5 : 1;
    const neuralMult = game.unlocked.includes('tech_neural') ? 1.5 : 1;
    const cdnBoost = 1 + (game.nodes.filter(n => n.type === 'cdn' && activeNodes.has(n.id) && !n.infected).length * 0.25);
    const aiBoost = 1 + (game.nodes.filter(n => n.type === 'ai_processor' && activeNodes.has(n.id) && !n.infected).length * 1.0);
    const clusterCount = game.nodes.filter(n => n.type === 'cluster' && activeNodes.has(n.id) && !n.infected).length;
    const clusterBoost = 1 + (clusterCount * 0.2);
    let quantumMult = 1;
    game.nodes.forEach(n => { if (n.type === 'quantum' && activeNodes.has(n.id) && !n.infected) quantumMult *= 2; });
    
    // Event multipliers
    const eventSpeedMult = eventMultipliers.speed;
    const eventMoneyMult = eventMultipliers.money;
    const eventRPMult = eventMultipliers.rp;
    const eventCodeMult = eventMultipliers.code;
    
    const baseSpeed = 25 * Math.pow(1.5, game.routerLevel - 1) * prestigeMult * fiberMult * quantumMult * neuralMult * efficiency * driverDownloadMult * eventSpeedMult;
    
    // CODE GENERATION
    const coders = game.nodes.filter(n => n.type === 'coder' && activeNodes.has(n.id) && !n.infected);
    const devStations = game.nodes.filter(n => n.type === 'dev_station' && activeNodes.has(n.id) && !n.infected);
    const compilers = game.nodes.filter(n => n.type === 'compiler' && activeNodes.has(n.id) && !n.infected);
    
    let codeGenRate = 0;
    coders.forEach(coder => {
        const lvlMult = Math.pow(1.2, coder.level - 1);
        codeGenRate += 5 * lvlMult * eventCodeMult; // 5 bits per second base
    });
    devStations.forEach(station => {
        const lvlMult = Math.pow(1.2, station.level - 1);
        codeGenRate += 10 * lvlMult * eventCodeMult; // 10 bits per second
    });
    
    const bitsGenerated = codeGenRate * dt;
    game.codeBits += bitsGenerated;
    game.stats.totalCodeBits += bitsGenerated;
    
    // Auto-compiler - benefits from level (more conversion capacity per level)
    if (compilers.length > 0 && game.codeBits >= 100) {
        const totalCompilerPower = compilers.reduce((sum, c) => sum + Math.pow(1.2, c.level - 1), 0);
        const toConvert = Math.min(Math.floor(game.codeBits / 100), Math.floor(totalCompilerPower * 10));
        if (toConvert > 0) {
            game.codeBits -= toConvert * 100;
            game.optimizationCode += toConvert;
        }
    }

    // Process resources
    let fileConsumers = [];
    let totalFileDemand = 0;
    let analyzerCount = game.nodes.filter(n => n.type === 'analyzer' && activeNodes.has(n.id) && !n.infected).length;
    let rpBoost = 1 + (analyzerCount * 0.5);
    const warehouseCount = game.nodes.filter(n => n.type === 'warehouse' && activeNodes.has(n.id) && !n.infected).length;

    game.nodes.forEach(node => {
        if (!activeNodes.has(node.id)) return;
        if (node.infected) { 
            // Security driver reduces money loss from viruses
            const securityMult = Math.max(0, 1 - (game.drivers.security * DRIVERS.security.effect));
            game.money -= 10 * dt * securityMult; 
            return; 
        }

        const def = NODE_DEFS[node.type];
        const lvlMult = Math.pow(1.2, node.level - 1);
        
        let boost = 1 * aiBoost * clusterBoost;
        let hasCompressor = false;
        
        game.conns.forEach(c => {
            const nid = c.from === node.id ? c.to : c.from;
            const n = game.nodes.find(x => x.id === nid);
            if (n && activeNodes.has(nid) && !n.infected) {
                if (n.type === 'cache') boost *= 1.5;
                if (n.type === 'rack') boost *= 1.2;
                if (n.type === 'compressor') hasCompressor = true;
            }
        });
        
        if (node.type === 'balancer') {
            const neighbors = [];
            game.conns.forEach(c => {
                if (c.from === node.id) neighbors.push(c.to);
                else if (c.to === node.id) neighbors.push(c.from);
            });
            boost *= (1 + neighbors.length * 0.1);
        }
        
        let isStreamingServer = node.type === 'streaming';
        if (node.type === 'crypto_farm') boost *= 3;
        
        const effectiveSpeed = baseSpeed * boost * lvlMult * dt;

        if (def.type === 'download' || node.type === 'dl_audio') {
            const resourceKey = def.out || node.type.replace('dl_', '');
            let amt = effectiveSpeed / RESOURCES[resourceKey].size;
            if (warehouseCount > 0) amt *= (1 + warehouseCount * 0.3);
            game.res[resourceKey] += amt;
            workAnim(node);
        }
        else if (node.type === 'miner') {
            const gain = effectiveSpeed * 0.05 * driverMiningMult * eventMoneyMult;
            game.money += gain;
            history.money += gain;
            game.stats.totalMoney += gain;
            workAnim(node);
        }
        else if (node.type === 'crypto_farm') {
            const gain = effectiveSpeed * 0.15 * driverMiningMult * eventMoneyMult;
            game.money += gain;
            history.money += gain;
            game.stats.totalMoney += gain;
            workAnim(node);
        }

        if (def.type === 'upload' || node.type === 'rack') {
            const upSpeed = effectiveSpeed * (node.type === 'rack' ? 2 : satMult) * cdnBoost * driverUploadMult;
            let cap = upSpeed;
            
            if (node.type === 'rack') {
                game.res.files += (upSpeed * 0.15) / RESOURCES.files.size;
                if(game.unlocked.includes('tech_img')) game.res.images += (upSpeed * 0.15) / RESOURCES.images.size;
                if(game.unlocked.includes('tech_vid')) game.res.videos += (upSpeed * 0.15) / RESOURCES.videos.size;
                if(game.unlocked.includes('tech_audio')) game.res.audio += (upSpeed * 0.15) / RESOURCES.audio.size;
            }

            // Priority: audio, videos, images
            ['audio', 'videos', 'images'].forEach(k => {
                if (cap <= 0 || game.res[k] <= 0) return;
                let size = RESOURCES[k].size;
                if (hasCompressor) size *= (0.7 - (game.drivers.compression * DRIVERS.compression.effect));
                if (isStreamingServer && (k === 'audio' || k === 'videos')) size *= 0.5;
                
                const count = Math.min(game.res[k], cap / size);
                game.res[k] -= count;
                cap -= count * size;
                
                const gain = count * RESOURCES[k].price * eventMoneyMult;
                game.money += gain;
                history.money += gain;
                game.stats.totalMoney += gain;
                workAnim(node);
                if (activeContract && activeContract.type === 'upload') activeContract.current += count * size;
            });

            if (cap > 0) {
                fileConsumers.push({ node, capacity: cap, type: 'upload', hasCompressor });
                totalFileDemand += cap;
            }
        }
        else if (def.type === 'lab') {
            let labCap = effectiveSpeed * RESOURCES.files.size;
            const neighbors = [];
            game.conns.forEach(c => {
                if (c.from === node.id) neighbors.push(c.to);
                else if (c.to === node.id) neighbors.push(c.from);
            });
            if (neighbors.some(nid => {
                const n = game.nodes.find(x => x.id === nid);
                return n && n.type === 'balancer';
            })) {
                labCap *= 1.3;
            }
            if (aiBoost > 1) labCap *= aiBoost;
            fileConsumers.push({ node, capacity: labCap, type: 'lab', hasCompressor });
            totalFileDemand += labCap;
        }
    });

    if (totalFileDemand > 0) {
        const totalFilesBytes = game.res.files * RESOURCES.files.size;
        const ratio = totalFilesBytes >= totalFileDemand ? 1 : (totalFilesBytes / totalFileDemand);
        
        fileConsumers.forEach(c => {
            const allocatedBytes = c.capacity * ratio;
            if (allocatedBytes <= 0) return;
            
            let size = RESOURCES.files.size;
            if (c.hasCompressor) size *= (0.7 - (game.drivers.compression * DRIVERS.compression.effect));
            
            const count = allocatedBytes / size;
            
            if (game.res.files >= count) {
                game.res.files -= count;
                
                if (c.type === 'upload') {
                    const gain = count * RESOURCES.files.price * eventMoneyMult;
                    game.money += gain;
                    history.money += gain;
                    game.stats.totalMoney += gain;
                    if (activeContract && activeContract.type === 'upload') activeContract.current += count * size;
                } else {
                    const gain = count * RESOURCES.files.rp * rpBoost * driverResearchMult * eventRPMult;
                    game.rp += gain;
                    history.rp += gain;
                    game.stats.totalRP += gain;
                }
                workAnim(c.node);
            }
        });
    }

    game.nodes.forEach(n => {
        if ((n.type === 'backup' || n.type === 'warehouse') && activeNodes.has(n.id) && !n.infected) {
            const stored = Object.values(game.res).reduce((a, b) => a + b, 0);
            if (stored > 1000) {
                const bonus = stored * 0.002 * dt * (n.type === 'warehouse' ? 2 : 1);
                game.money += bonus;
                history.money += bonus;
            }
        }
    });

    if (activeContract) {
        activeContract.time -= dt;
        if (activeContract.time <= 0) {
            showFloat("Contract Failed", window.innerWidth/2, window.innerHeight/2, 'red');
            logEvent("Contract Failed.");
            activeContract = null;
        } else if (activeContract.current >= activeContract.target) {
            game.money += activeContract.rewardMoney;
            game.rp += activeContract.rewardRp;
            game.stats.totalMoney += activeContract.rewardMoney;
            game.stats.totalRP += activeContract.rewardRp;
            game.stats.contractsCompleted++;
            showFloat(`+$${fmt(activeContract.rewardMoney)}`, window.innerWidth/2, window.innerHeight/2, 'gold');
            logEvent("Contract Complete!");
            activeContract = null;
            checkAchievements();
        }
    }
    
    // Update systems
    updateEvents(dt);
    updateCombo(dt);
    updateStatistics();
    updatePrestigeUI();
    
    // Calculate rolling average rates
    rateHistory.money.push(history.money);
    rateHistory.rp.push(history.rp);
    if (rateHistory.money.length > RATE_WINDOW) rateHistory.money.shift();
    if (rateHistory.rp.length > RATE_WINDOW) rateHistory.rp.shift();
    
    // Update rate displays every frame for smoothness
    const avgMoneyRate = rateHistory.money.reduce((a, b) => a + b, 0) / rateHistory.money.length * 60;
    const avgRpRate = rateHistory.rp.reduce((a, b) => a + b, 0) / rateHistory.rp.length * 60;
    document.getElementById('moneyRate').innerText = `+$${fmt(avgMoneyRate)}/s`;
    document.getElementById('rpRate').innerText = `+${fmt(avgRpRate)}/s`;

    updateUI(efficiency);
    requestAnimationFrame(gameLoop);
}

function virusLoop() {
    // Security driver reduces virus chance
    const securityMult = Math.max(0.1, 1 - (game.drivers.security * DRIVERS.security.effect));
    if (Math.random() > (0.05 * securityMult)) return; 
    
    const targets = game.nodes.filter(n => activeNodes.has(n.id) && n.type !== 'router' && n.type !== 'firewall' && !n.infected);
    if (targets.length === 0) return;
    
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    let protected = false;
    game.conns.forEach(c => {
        const nid = c.from === target.id ? c.to : c.from;
        const n = game.nodes.find(x => x.id === nid);
        if (n && n.type === 'firewall' && activeNodes.has(nid) && !n.infected) protected = true;
    });
    
    if (!protected) {
        target.infected = true;
        showFloat("⚠️ VIRUS", target.x + 90, target.y, '#8b5cf6');
        logEvent("Virus detected!");
        renderWorld(); 
    }
}

function secLoop() {
    // Reset history accumulator (rates are now calculated from rolling window in gameLoop)
    history = { money: 0, rp: 0 };
}

function eventLoop() {
    // Random events checked every 10 minutes with 1% chance
    triggerRandomEvent();
}

function updateConnectivity() {
    const newActive = new Set();
    const q = [];
    
    game.nodes.filter(n => n.type === 'router').forEach(n => {
        newActive.add(n.id);
        q.push(n.id);
    });

    while (q.length) {
        const curr = q.shift();
        game.conns.forEach(c => {
            const other = c.from === curr ? c.to : (c.to === curr ? c.from : null);
            if (other && !newActive.has(other)) {
                newActive.add(other);
                q.push(other);
            }
        });
    }

    if (activeNodes.size !== newActive.size || [...newActive].some(x => !activeNodes.has(x))) {
        game.nodes.forEach(n => {
            const el = document.getElementById(`node-${n.id}`);
            if (!el) return;
            if (newActive.has(n.id)) el.classList.remove('disconnected');
            else el.classList.add('disconnected');
        });
        
        document.querySelectorAll('.cable-group').forEach(c => {
            if (!c.dataset.ends) return;
            const [id1, id2] = c.dataset.ends.split(',').map(Number);
            if (newActive.has(id1) && newActive.has(id2)) {
                c.classList.remove('disconnected');
                c.classList.add('active');
            } else {
                c.classList.add('disconnected');
                c.classList.remove('active');
            }
        });
    }
    activeNodes = newActive;
}


// --- CODE SYSTEM FUNCTIONS ---

function convertCodeBits() {
    if (game.codeBits >= 100) {
        game.codeBits -= 100;
        game.optimizationCode += 1;
        logEvent("Converted 100 code bits to 1 optimization code", 'code');
        updateCodeUI();
    }
}

function installDriver(driverId) {
    const driver = DRIVERS[driverId];
    if (game.optimizationCode >= driver.cost) {
        game.optimizationCode -= driver.cost;
        game.drivers[driverId]++;
        logEvent(`Installed ${driver.name} Level ${game.drivers[driverId]}!`, 'code');
        renderDriverGrid();
        updateCodeUI();
    }
}

function updateCodeUI() {
    document.getElementById('codeBitsDisplay').innerText = Math.floor(game.codeBits);
    document.getElementById('optCodeDisplay').innerText = game.optimizationCode;
    document.getElementById('codeDisplay').innerText = Math.floor(game.codeBits);
    document.getElementById('sidebarCodeBits').innerText = Math.floor(game.codeBits);
    document.getElementById('sidebarOptCode').innerText = game.optimizationCode;
    
    const convertBtn = document.getElementById('convertBitsBtn');
    const sidebarConvertBtn = document.getElementById('sidebarConvertBtn');
    if (convertBtn) convertBtn.disabled = game.codeBits < 100;
    if (sidebarConvertBtn) sidebarConvertBtn.disabled = game.codeBits < 100;
    
    updateInstalledDriversList();
}

function updateInstalledDriversList() {
    const lists = ['installedDriversList', 'sidebarDrivers'];
    lists.forEach(listId => {
        const list = document.getElementById(listId);
        if (!list) return;
        
        const installed = Object.entries(game.drivers).filter(([_, level]) => level > 0);
        if (installed.length === 0) {
            list.innerHTML = '<span style="font-size: 9px; color: #64748b;">No drivers installed</span>';
        } else {
            list.innerHTML = installed.map(([id, level]) => {
                const driver = DRIVERS[id];
                return `<div class="driver-badge"><i class="${driver.icon}"></i> ${driver.name.split(' ')[0]} Lv.${level}</div>`;
            }).join('');
        }
    });
}

function renderDriverGrid() {
    const grid = document.getElementById('driverGrid');
    if (!grid) return;
    
    grid.innerHTML = Object.entries(DRIVERS).map(([id, driver]) => {
        const level = game.drivers[id];
        const canAfford = game.optimizationCode >= driver.cost;
        const installed = level > 0;
        
        return `
            <div class="driver-card ${installed ? 'installed' : ''} ${!canAfford ? 'locked' : ''}" onclick="${canAfford ? `installDriver('${id}')` : ''}">
                <div class="driver-icon"><i class="${driver.icon}"></i></div>
                <div class="driver-name">${driver.name}</div>
                <div class="driver-desc">${driver.desc}</div>
                <div class="driver-cost">Cost: ${driver.cost} Opt Code</div>
                ${installed ? `<div class="driver-level">Level ${level} (+${Math.round(level * driver.effect * 100)}%)</div>` : ''}
            </div>
        `;
    }).join('');
}

// --- ACTIONS ---

function spawnNode(type, x, y) {
    game.nodes.push({ id: game.nextId++, type, x, y, level: 1, infected: false });
    game.stats.nodesCreated++;
    checkAchievements();
    addCombo();
    spawnParticles(x + 90, y + 40, NODE_DEFS[type]?.color || '#3b82f6', 8);
    renderWorld();
}

function buyNode(type) {
    const def = NODE_DEFS[type];
    if (game.money >= def.cost) {
        game.money -= def.cost;
        game.stats.moneySpent += def.cost;
        const cx = (-view.x + window.innerWidth/2) / view.scale;
        const cy = (-view.y + window.innerHeight/2) / view.scale;
        spawnNode(type, cx - 90, cy - 40);
        showFloat(`-$${fmt(def.cost)}`, window.innerWidth/2, window.innerHeight/2, 'red');
    }
}

function cleanNode(node, event) {
    if (event) event.stopPropagation();
    const cost = 500;
    if (game.money >= cost) {
        game.money -= cost;
        game.stats.moneySpent += cost;
        node.infected = false;
        game.stats.virusesCleaned++;
        spawnParticles(node.x + 90, node.y + 40, '#10b981', 10);
        showFloat("CLEANED", node.x + 90, node.y, '#10b981');
        renderWorld();
        checkAchievements();
        addCombo();
    } else {
        showFloat("Need $500", node.x + 90, node.y, 'red');
    }
}

function upgradeSelectedNode() {
    if (!selNodeId) return;
    const n = game.nodes.find(x => x.id === selNodeId);
    const def = NODE_DEFS[n.type];
    const base = n.type === 'router' ? 500 : def.cost;
    const cost = Math.floor(base * Math.pow(1.5, n.level));
    
    if (game.money >= cost) {
        game.money -= cost;
        game.stats.moneySpent += cost;
        game.stats.upgrades++;
        n.level++;
        spawnParticles(n.x + 90, n.y + 40, '#fbbf24', 10);
        if (n.type === 'router') {
            game.routerLevel = n.level;
            updateRouterCostDisplay();
        }
        renderWorld(); 
        document.getElementById('contextMenu').style.display = 'none';
        checkAchievements();
        addCombo();
    }
}

function deleteSelectedNode() {
     if (!selNodeId) return;
     const n = game.nodes.find(x => x.id === selNodeId);
     if (n.type === 'router') return; 
     
     game.nodes = game.nodes.filter(x => x.id !== selNodeId);
     game.conns = game.conns.filter(c => c.from !== selNodeId && c.to !== selNodeId);
     game.stats.nodesDeleted++;
     spawnParticles(n.x + 90, n.y + 40, '#ef4444', 8);
     document.getElementById('contextMenu').style.display = 'none';
     renderWorld();
     checkAchievements();
}

// ==================== CABLE DELETION SYSTEM ====================
let cableDeleteMode = false;

function toggleCableDeleteMode() {
    cableDeleteMode = !cableDeleteMode;
    const btn = document.getElementById('cableDeleteBtn');
    const btnText = document.getElementById('cableDeleteText');
    const world = document.getElementById('world');
    
    // Update pointer-events on all cable groups
    document.querySelectorAll('.cable-group').forEach(g => {
        g.style.pointerEvents = cableDeleteMode ? 'all' : 'none';
    });
    document.querySelectorAll('.cable').forEach(c => {
        c.style.pointerEvents = cableDeleteMode ? 'stroke' : 'none';
    });
    
    if (cableDeleteMode) {
        btn.classList.add('active');
        btnText.innerText = 'Click Cable to Delete';
        world.classList.add('cable-delete-mode');
        logEvent('Cable delete mode: ON - Click any cable to delete it', 'info');
        showFloat('🖱️ Click any cable to delete it', window.innerWidth/2, window.innerHeight/2, '#ef4444');
    } else {
        btn.classList.remove('active');
        btnText.innerText = 'Delete Cables';
        world.classList.remove('cable-delete-mode');
    }
}

function handleCableClick(fromId, toId, event) {
    if (!cableDeleteMode) return;
    
    event.stopPropagation();
    event.preventDefault();
    
    deleteCable(fromId, toId, event);
}

function deleteCable(fromId, toId, event) {
    // Find and remove the cable
    const cableIndex = game.conns.findIndex(c => 
        (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
    );
    
    if (cableIndex === -1) return;
    
    // Get cable position for particle effect
    const n1 = game.nodes.find(n => n.id === fromId);
    const n2 = game.nodes.find(n => n.id === toId);
    
    game.conns.splice(cableIndex, 1);
    
    // Spawn particles at cable midpoint
    if (n1 && n2) {
        const midX = (n1.x + 90 + n2.x) / 2;
        const midY = (n1.y + 40 + n2.y + 40) / 2;
        spawnParticles(midX, midY, '#ef4444', 5);
    }
    
    // Refund $5 for the cable
    game.money += 5;
    showFloat('+ $5 (Cable Refund)', window.innerWidth/2, window.innerHeight/2, '#10b981');
    
    renderCables();
    updateConnectivity();
    logEvent('Cable deleted (+$5 refund)', 'info');
    
    // Auto-exit delete mode if shift isn't held
    if (!event.shiftKey) {
        toggleCableDeleteMode();
    }
}

function deleteAllCables() {
    if (game.conns.length === 0) {
        showFloat('No cables to delete', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
        return;
    }
    
    const cableCount = game.conns.length;
    const refund = cableCount * 5;
    
    if (!confirm(`Delete all ${cableCount} cables? You'll get $${refund} refunded.`)) {
        return;
    }
    
    game.conns = [];
    game.money += refund;
    
    showFloat(`+ $${refund} (${cableCount} cables deleted)`, window.innerWidth/2, window.innerHeight/2, '#10b981');
    logEvent(`Deleted all ${cableCount} cables (+$${refund})`, 'good');
    
    renderCables();
    updateConnectivity();
    
    // Exit delete mode if active
    if (cableDeleteMode) toggleCableDeleteMode();
}

function unlockTech(id) {
    const tech = TECH_TREE.find(t => t.id === id);
    if (!game.unlocked.includes(id) && game.rp >= tech.cost && canUnlockTech(id)) {
        game.rp -= tech.cost;
        game.unlocked.push(id);
        renderResearchTree();
        setTab(currTab);
        logEvent(`Researched: ${tech.name}`);
    }
}

function canUnlockTech(id) {
    const tech = TECH_TREE.find(t => t.id === id);
    if (!tech.requires || tech.requires.length === 0) return true;
    return tech.requires.every(req => game.unlocked.includes(req));
}

function prestige() {
    if (game.money < 10000000) return;
    if (!confirm("Sell company? Resets money, nodes, tech. Drivers and code persist!")) return;
    
    game.prestige++;
    game.money = 2000;
    game.rp = 0;
    game.res = { files: 0, images: 0, videos: 0, audio: 0 };
    game.nodes = [];
    game.conns = [];
    game.routerLevel = 1;
    game.routerHeat = 0;
    game.unlocked = [];
    game.nextId = 1;
    activeContract = null;
    
    init(); 
    renderWorld();
    renderResearchTree();
    setTab('infra');
    logEvent(`Prestige Level ${game.prestige} Achieved!`);
}

function openContracts() {
    const list = document.getElementById('contractList');
    list.innerHTML = '';
    
    const types = [
        { title: "Data Dump", desc: "Upload 50 MB Data", target: 50 * 1024 * 1024, time: 60, rewardM: 5000, rewardR: 500 },
        { title: "Streaming Deal", desc: "Upload 500 MB Data", target: 500 * 1024 * 1024, time: 120, rewardM: 25000, rewardR: 2000 },
        { title: "Corporate Backups", desc: "Upload 1 GB Data", target: 1024 * 1024 * 1024, time: 180, rewardM: 100000, rewardR: 5000 }
    ];
    
    types.forEach(c => {
        const el = document.createElement('div');
        el.className = 'contract-item';
        el.innerHTML = `
            <div>
                <h4>${c.title}</h4>
                <p>${c.desc} | Time: ${c.time}s</p>
            </div>
            <div class="contract-reward">
                +$${fmt(c.rewardM)}<br>+${fmt(c.rewardR)} RP
                <button class="btn btn-contract" style="margin-top:5px; padding:4px 8px; width:auto;" onclick="startContract(${JSON.stringify(c).replace(/"/g, '&quot;')})">Accept</button>
            </div>
        `;
        list.appendChild(el);
    });
    
    document.getElementById('contractModal').style.display='flex';
}

function startContract(c) {
    activeContract = { 
        type: 'upload', 
        target: c.target, 
        current: 0, 
        time: c.time, 
        rewardMoney: c.rewardM, 
        rewardRp: c.rewardR,
        desc: c.desc 
    };
    logEvent("Contract Started: " + c.title);
    document.getElementById('contractModal').style.display='none';
}

function fmt(n) {
    if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n);
}

function updateRouterCostDisplay() {
    const base = 500;
    const cost = Math.floor(base * Math.pow(1.5, game.routerLevel));
    const costEl = document.getElementById('routerCostValue');
    costEl.innerText = '$' + fmt(cost);
    
    if (game.money >= cost) {
        costEl.className = 'cost-value affordable';
    } else {
        costEl.className = 'cost-value expensive';
    }
}


// --- RENDER FUNCTIONS ---

function renderWorld() {
    const nodesDiv = document.getElementById('nodes');
    nodesDiv.innerHTML = '';
    
    game.nodes.forEach(n => {
        const def = NODE_DEFS[n.type];
        const el = document.createElement('div');
        let classes = `node ${activeNodes.has(n.id) ? '' : 'disconnected'} ${n.infected ? 'infected' : ''}`;
        if (n.type === 'router' && game.overheatMode) classes += ' overheating';
        if (def.type === 'coding') classes += ' coding';
        
        el.className = classes;
        el.id = `node-${n.id}`;
        el.style.left = n.x + 'px';
        el.style.top = n.y + 'px';
        
        const ports = `<div class="port in" onmousedown="portDown(${n.id}, event)" onmouseup="portUp(${n.id})"></div>
                       <div class="port out" onmousedown="portDown(${n.id}, event)" onmouseup="portUp(${n.id})"></div>`;
        
        const cleanBtn = n.infected ? `<div class="clean-btn" onmousedown="cleanNode(game.nodes.find(x=>x.id===${n.id}), event)">CLEAN [-$500]</div>` : '';

        el.innerHTML = `
            ${ports}
            ${cleanBtn}
            <div class="node-header">
                <div class="node-icon-box" style="color:${def.color}"><i class="${def.icon}"></i></div>
                <div class="node-info">
                    <div class="node-title">${def.name}</div>
                    <div class="node-lvl">Level ${n.level}</div>
                </div>
            </div>
        `;
        
        el.onmousedown = (e) => {
            if (e.target.classList.contains('port')) return;
            if (e.target.classList.contains('clean-btn')) return;
            if (e.button === 2) {
                e.preventDefault();
                showContext(n, e);
                return;
            }
            if (n.infected) return; 
            dragStart(n, e);
        };
        
        nodesDiv.appendChild(el);
    });

    renderCables();
}

function renderCables() {
    const svg = document.getElementById('cables');
    svg.innerHTML = '';
    game.conns.forEach(c => {
        const n1 = game.nodes.find(n => n.id === c.from);
        const n2 = game.nodes.find(n => n.id === c.to);
        if (!n1 || !n2) return;
        
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.classList.add("cable-group");
        group.dataset.ends = `${c.from},${c.to}`;
        group.style.pointerEvents = cableDeleteMode ? 'all' : 'none';
        group.onclick = (e) => handleCableClick(c.from, c.to, e);
        
        const destDef = NODE_DEFS[n2.type];
        if (destDef.type === 'upload' || n2.type === 'rack') group.classList.add('money');
        else if (destDef.type === 'lab') group.classList.add('power');
        else if (destDef.type === 'coding') group.classList.add('code');
        if (activeNodes.has(n1.id) && activeNodes.has(n2.id)) group.classList.add('active');
        
        const x1 = n1.x + 180;
        const y1 = n1.y + 40;
        const x2 = n2.x;
        const y2 = n2.y + 40;
        
        const pathStr = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
        
        const bgLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bgLine.classList.add("cable");
        bgLine.setAttribute("d", pathStr);
        bgLine.dataset.from = c.from;
        bgLine.dataset.to = c.to;
        bgLine.style.pointerEvents = cableDeleteMode ? 'stroke' : 'none';
        
        const dashLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        dashLine.classList.add("cable-inner");
        dashLine.setAttribute("d", pathStr);
        
        group.appendChild(bgLine);
        group.appendChild(dashLine);
        svg.appendChild(group);
    });
}

function updateUI(eff = 1.0) {
    document.getElementById('moneyDisplay').innerText = '$' + fmt(game.money);
    document.getElementById('rpDisplay').innerText = fmt(game.rp) + ' RP';
    
    ['Files', 'Images', 'Videos'].forEach(k => {
        const key = k.toLowerCase();
        const val = game.res[key];
        document.getElementById(`txt${k}`).innerText = fmt(val);
        const pct = Math.min(100, Math.log10(val + 1) * 20); 
        document.getElementById(`bar${k}`).style.width = pct + '%';
    });
    
    document.getElementById('modalRpDisplay').innerText = fmt(game.rp);
    
    const world = document.getElementById('world');
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    
    const prestigeMult = 1 + (game.prestige * 0.5);
    const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect);
    const base = 25 * Math.pow(1.5, game.routerLevel - 1) * prestigeMult * driverDownloadMult;
    document.getElementById('globalDown').innerText = fmt(base * eff) + ' B/s';
    document.getElementById('globalUp').innerText = fmt(base * eff) + ' B/s';
    document.getElementById('routerLvl').innerText = 'LVL ' + game.routerLevel;
    
    const heatBar = document.getElementById('heatBar');
    const heatText = document.getElementById('heatText');
    const heatStatus = document.getElementById('heatStatus');
    heatBar.style.width = game.routerHeat + '%';
    heatText.innerText = Math.floor(game.routerHeat) + '°C';
    
    if (game.overheatMode) {
        heatBar.style.background = '#ef4444';
        heatStatus.innerText = 'Status: OVERHEATING (Speed -30%)';
        heatStatus.style.color = '#ef4444';
    } else if (game.routerHeat > 50) {
        heatBar.style.background = '#f59e0b';
        heatStatus.innerText = 'Status: Warm';
        heatStatus.style.color = '#f59e0b';
    } else {
        heatBar.style.background = '#10b981';
        heatStatus.innerText = 'Status: Normal';
        heatStatus.style.color = '#a0aec0';
    }
    
    if (game.money >= 10000000 || game.prestige > 0) document.getElementById('prestigeSection').style.display = 'block';
    document.getElementById('prestigeBonusDisplay').innerText = `Data Center Bonus: +${Math.round(game.prestige * 50)}%`;
    
    const cw = document.getElementById('activeContractWidget');
    if (activeContract) {
        cw.style.display = 'block';
        document.getElementById('contractDesc').innerText = activeContract.desc;
        document.getElementById('contractTimer').innerText = Math.floor(activeContract.time) + 's';
        const pct = Math.min(100, (activeContract.current / activeContract.target) * 100);
        document.getElementById('contractBar').style.width = pct + '%';
    } else {
        cw.style.display = 'none';
    }
    
    // Update active event widget
    const ew = document.getElementById('activeEventWidget');
    if (game.activeEvent) {
        ew.style.display = 'block';
        document.getElementById('eventName').innerText = game.activeEvent.name;
        document.getElementById('eventDesc').innerText = game.activeEvent.desc;
        document.getElementById('eventTimer').innerText = Math.floor(game.eventTimeLeft) + 's';
        ew.style.borderColor = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
        document.getElementById('eventName').style.color = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
    } else {
        ew.style.display = 'none';
    }
    
    updateRouterCostDisplay();
    updateCodeUI();
    renderStatistics();
}

function renderResearchTree() {
    const grid = document.getElementById('researchTreeGrid');
    const svg = document.getElementById('researchTreeSvg');
    grid.innerHTML = '';
    svg.innerHTML = '';
    
    const tiers = {};
    TECH_TREE.forEach(t => {
        if (!tiers[t.tier]) tiers[t.tier] = [];
        tiers[t.tier].push(t);
    });
    
    const maxTier = Math.max(...Object.keys(tiers).map(Number));
    
    for (let tier = 1; tier <= maxTier; tier++) {
        const tierCol = document.createElement('div');
        tierCol.className = 'research-tier';
        
        const tierLabel = document.createElement('div');
        tierLabel.className = `tier-label tier-${tier}`;
        tierLabel.innerText = 'Tier ' + tier;
        tierCol.appendChild(tierLabel);
        
        if (tiers[tier]) {
            tiers[tier].forEach(tech => {
                const owned = game.unlocked.includes(tech.id);
                const canAfford = game.rp >= tech.cost;
                const prerequisitesMet = canUnlockTech(tech.id);
                const isAvailable = !owned && canAfford && prerequisitesMet;
                
                const card = document.createElement('div');
                card.className = `tech-card ${owned ? 'owned' : ''} ${!prerequisitesMet ? 'locked' : ''} ${isAvailable ? 'available' : ''}`;
                card.id = `tech-${tech.id}`;
                card.onclick = () => { if (!owned && prerequisitesMet) unlockTech(tech.id); };
                
                const costClass = canAfford ? 'affordable' : '';
                
                card.innerHTML = `
                    <div class="tech-icon"><i class="${tech.icon}"></i></div>
                    <div class="tech-name">${tech.name}</div>
                    <div class="tech-desc">${tech.desc}</div>
                    ${!owned ? `<div class="tech-cost ${costClass}"><i class="fa-solid fa-flask"></i> ${fmt(tech.cost)} RP</div>` : '<div class="tech-cost"><i class="fa-solid fa-check"></i> Owned</div>'}
                    ${!prerequisitesMet && tech.requires.length > 0 ? `<div class="tech-req">Requires: ${tech.requires.map(r => TECH_TREE.find(t => t.id === r)?.name).join(', ')}</div>` : ''}
                `;
                
                tierCol.appendChild(card);
            });
        }
        
        grid.appendChild(tierCol);
    }
    
    setTimeout(() => drawResearchLines(), 100);
}

function drawResearchLines() {
    const svg = document.getElementById('researchTreeSvg');
    svg.innerHTML = '';
    
    const containerRect = document.getElementById('researchTreeContainer').getBoundingClientRect();
    
    TECH_TREE.forEach(tech => {
        if (tech.requires && tech.requires.length > 0) {
            const targetEl = document.getElementById(`tech-${tech.id}`);
            if (!targetEl) return;
            
            const targetRect = targetEl.getBoundingClientRect();
            const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
            const targetY = targetRect.top - containerRect.top;
            
            tech.requires.forEach(reqId => {
                const sourceEl = document.getElementById(`tech-${reqId}`);
                if (!sourceEl) return;
                
                const sourceRect = sourceEl.getBoundingClientRect();
                const sourceX = sourceRect.left - containerRect.left + sourceRect.width / 2;
                const sourceY = sourceRect.top - containerRect.top + sourceRect.height;
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const isUnlocked = game.unlocked.includes(tech.id) && game.unlocked.includes(reqId);
                line.className = `research-tree-line ${isUnlocked ? 'unlocked' : ''}`;
                
                const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
                line.setAttribute('d', d);
                
                svg.appendChild(line);
            });
        }
    });
}

let currTab = 'infra';

function setTab(t, el) {
    currTab = t;
    document.querySelectorAll('.tab').forEach(e => e.classList.remove('active'));
    if (el) el.classList.add('active');
    else document.querySelector(`.tab[data-tab="${t}"]`)?.classList.add('active');
    
    const tray = document.getElementById('tray');
    tray.innerHTML = '';
    
    Object.keys(NODE_DEFS).forEach(k => {
        const def = NODE_DEFS[k];
        if (currTab === 'infra' && def.type !== 'infra' && def.type !== 'core') return;
        if (currTab === 'download' && def.type !== 'download') return;
        if (currTab === 'upload' && def.type !== 'upload' && def.type !== 'lab' && def.type !== 'special') return;
        if (currTab === 'advanced' && def.type !== 'advanced') return;
        if (currTab === 'coding' && def.type !== 'coding') return;
        if (def.type === 'core') return;

        const el = document.createElement('div');
        el.className = 'shop-item';
        
        const locked = def.req && !game.unlocked.includes(def.req);
        if (locked) el.classList.add('disabled');
        
        el.onclick = () => { if (!locked) buyNode(k); };
        el.innerHTML = `
            <div class="item-cost">$${fmt(def.cost)}</div>
            <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
            <div class="item-name">${def.name}</div>
            <div class="item-desc">${locked ? "LOCKED (Research)" : def.desc}</div>
        `;
        tray.appendChild(el);
    });
}

let drag = { active: false, node: null, startX: 0, startY: 0, offX: 0, offY: 0 };
let port = { active: false, src: null };
let selNodeId = null;

function setupInputs() {
    const vp = document.getElementById('viewport');
    
    vp.onmousedown = (e) => {
        if (e.target.closest('.node')) return;
        drag.active = true;
        drag.startX = e.clientX; drag.startY = e.clientY;
        drag.offX = view.x; drag.offY = view.y;
        document.getElementById('contextMenu').style.display = 'none';
    };
    
    window.onmousemove = (e) => {
        if (drag.active) {
            view.x = drag.offX + (e.clientX - drag.startX);
            view.y = drag.offY + (e.clientY - drag.startY);
        }
        if (drag.node) {
            const z = view.scale;
            drag.node.x = drag.node.ix + (e.clientX - drag.sx)/z;
            drag.node.y = drag.node.iy + (e.clientY - drag.sy)/z;
            
            const el = document.getElementById(`node-${drag.node.id}`);
            if (el) { el.style.left = drag.node.x+'px'; el.style.top = drag.node.y+'px'; }
            renderCables(); 
        }
    };
    
    window.onmouseup = () => { drag.active = false; drag.node = null; };
    
    vp.onwheel = (e) => {
        e.preventDefault();
        
        const rect = vp.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const worldX = (mouseX - view.x) / view.scale;
        const worldY = (mouseY - view.y) / view.scale;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.3, Math.min(2, view.scale * zoomFactor));
        
        view.x = mouseX - worldX * newScale;
        view.y = mouseY - worldY * newScale;
        view.scale = newScale;
        
        updateZoomDisplay();
    };
    
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === '+' || e.key === '=') zoomIn();
        else if (e.key === '-' || e.key === '_') zoomOut();
        else if (e.key === '0') resetZoom();
        else if (e.key === '?' || e.key === '/') document.getElementById('helpModal').style.display='flex';
        else if (e.key === 'r' || e.key === 'R') document.getElementById('researchModal').style.display='flex';
        else if (e.key === 'c' || e.key === 'C') document.getElementById('codeModal').style.display='flex';
        else if (e.key === 'a' || e.key === 'A') document.getElementById('achievementsModal').style.display='flex';
        else if (e.key === 'x' || e.key === 'X') toggleCableDeleteMode();
        else if (e.key === 's' || e.key === 'S') document.getElementById('statsModal').style.display='flex';
        else if (e.key === 'p' || e.key === 'P') document.getElementById('prestigeModal').style.display='flex';
        else if (e.key === 'l' || e.key === 'L') document.getElementById('accountModal').style.display='flex';
        else if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        }
    });
    
    window.addEventListener('resize', () => drawResearchLines());
}

function dragStart(node, e) {
    drag.node = node;
    drag.sx = e.clientX; drag.sy = e.clientY;
    drag.node.ix = node.x; drag.node.iy = node.y;
    
    selNodeId = node.id;
    document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
    document.getElementById(`node-${node.id}`).classList.add('selected');
}

function portDown(id, e) {
    e.stopPropagation();
    port.active = true; port.src = id;
}

function portUp(id) {
    if (port.active && port.src !== id) {
        const cableCost = 10;
        if (game.money < cableCost) {
            showFloat("Need $10", window.innerWidth/2, window.innerHeight/2, 'red');
            port.active = false; return;
        }
        if (!game.conns.some(c => (c.from===port.src && c.to===id) || (c.from===id && c.to===port.src))) {
            game.money -= cableCost;
            game.stats.moneySpent += cableCost;
            game.conns.push({ from: port.src, to: id });
            game.stats.cablesPlaced++;
            renderCables();
            updateConnectivity();
            checkAchievements();
            addCombo();
        }
    }
    port.active = false;
}

function showContext(node, e) {
    const m = document.getElementById('contextMenu');
    selNodeId = node.id;
    m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px';
    m.style.display = 'block';
    const base = node.type === 'router' ? 500 : NODE_DEFS[node.type].cost;
    const cost = Math.floor(base * Math.pow(1.5, node.level));
    document.getElementById('ctxCost').innerText = '$' + fmt(cost);
}

function workAnim(node) {
    const el = document.getElementById(`node-${node.id}`);
    if (el) { el.classList.remove('working'); void el.offsetWidth; el.classList.add('working'); }
}

function showFloat(txt, x, y, col) {
    const el = document.createElement('div');
    el.className = 'floating-text'; el.innerText = txt;
    el.style.left = x+'px'; el.style.top = y+'px'; el.style.color = col;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function addMoney(e) {
    game.money += 5;
    showFloat('+$5', e.clientX, e.clientY, '#10b981');
}

function upgradeRouter() {
     const r = game.nodes.find(n => n.type === 'router');
     if(r) { selNodeId = r.id; upgradeSelectedNode(); }
}

// Make functions globally available
window.init = init;
window.logEvent = logEvent;
window.checkAchievements = checkAchievements;
window.unlockAchievement = unlockAchievement;
window.renderAchievements = renderAchievements;
window.triggerRandomEvent = triggerRandomEvent;
window.showEventNotification = showEventNotification;
window.updateEvents = updateEvents;
window.updateStatistics = updateStatistics;
window.renderStatistics = renderStatistics;
window.updatePrestigeUI = updatePrestigeUI;
window.performPrestige = performPrestige;
window.addCombo = addCombo;
window.showComboIndicator = showComboIndicator;
window.updateCombo = updateCombo;
window.spawnParticles = spawnParticles;
window.gameLoop = gameLoop;
window.virusLoop = virusLoop;
window.secLoop = secLoop;
window.eventLoop = eventLoop;
window.updateConnectivity = updateConnectivity;
window.convertCodeBits = convertCodeBits;
window.installDriver = installDriver;
window.updateCodeUI = updateCodeUI;
window.updateInstalledDriversList = updateInstalledDriversList;
window.renderDriverGrid = renderDriverGrid;
window.spawnNode = spawnNode;
window.buyNode = buyNode;
window.cleanNode = cleanNode;
window.upgradeSelectedNode = upgradeSelectedNode;
window.deleteSelectedNode = deleteSelectedNode;
window.toggleCableDeleteMode = toggleCableDeleteMode;
window.handleCableClick = handleCableClick;
window.deleteCable = deleteCable;
window.deleteAllCables = deleteAllCables;
window.unlockTech = unlockTech;
window.canUnlockTech = canUnlockTech;
window.prestige = prestige;
window.openContracts = openContracts;
window.startContract = startContract;
window.fmt = fmt;
window.updateRouterCostDisplay = updateRouterCostDisplay;
window.renderWorld = renderWorld;
window.renderCables = renderCables;
window.updateUI = updateUI;
window.renderResearchTree = renderResearchTree;
window.drawResearchLines = drawResearchLines;
window.setTab = setTab;
window.setupInputs = setupInputs;
window.dragStart = dragStart;
window.portDown = portDown;
window.portUp = portUp;
window.showContext = showContext;
window.workAnim = workAnim;
window.showFloat = showFloat;
window.addMoney = addMoney;
window.upgradeRouter = upgradeRouter;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;


// --- SAVE/LOAD FUNCTIONS ---

function exportSave() {
    // Create a clean copy of game state for export
    const saveData = {
        version: GAME_VERSION,
        timestamp: Date.now(),
        game: JSON.parse(JSON.stringify(game))
    };
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
    const node = document.createElement('a');
    node.setAttribute("href", data); node.setAttribute("download", "upload_labs_save_v" + GAME_VERSION + ".json");
    document.body.appendChild(node); node.click(); node.remove();
    logEvent('Game saved to file', 'good');
}

function importSave(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const saveData = JSON.parse(e.target.result);
            
            // Handle both old format (direct game object) and new format (wrapped with metadata)
            const importedGame = saveData.game || saveData;
            
            // Validate required fields
            if (!importedGame || typeof importedGame.money !== 'number') {
                throw new Error('Invalid save data structure');
            }
            
            // Create a fresh game state and merge
            game.money = Number(importedGame.money) || 2000;
            game.rp = Number(importedGame.rp) || 0;
            game.prestige = Number(importedGame.prestige) || 0;
            game.routerLevel = Number(importedGame.routerLevel) || 1;
            game.routerHeat = Number(importedGame.routerHeat) || 0;
            game.overheatMode = Boolean(importedGame.overheatMode);
            game.nextId = Number(importedGame.nextId) || 1;
            
            // Resources - ensure all are numbers
            game.res = {
                files: Number(importedGame.res?.files) || 0,
                images: Number(importedGame.res?.images) || 0,
                videos: Number(importedGame.res?.videos) || 0,
                audio: Number(importedGame.res?.audio) || 0
            };
            
            // Arrays
            game.nodes = Array.isArray(importedGame.nodes) ? importedGame.nodes : [];
            game.conns = Array.isArray(importedGame.conns) ? importedGame.conns : [];
            game.unlocked = Array.isArray(importedGame.unlocked) ? importedGame.unlocked : [];
            game.achievements = Array.isArray(importedGame.achievements) ? importedGame.achievements : [];
            
            // Code system
            game.codeBits = Number(importedGame.codeBits) || 0;
            game.optimizationCode = Number(importedGame.optimizationCode) || 0;
            game.drivers = importedGame.drivers || { network: 0, compression: 0, security: 0, mining: 0, research: 0, upload: 0, download: 0 };
            
            // Stats - preserve or create new
            if (importedGame.stats) {
                game.stats = {
                    totalMoney: Number(importedGame.stats.totalMoney) || game.money,
                    peakMoney: Number(importedGame.stats.peakMoney) || game.money,
                    moneySpent: Number(importedGame.stats.moneySpent) || 0,
                    totalRP: Number(importedGame.stats.totalRP) || game.rp,
                    nodesCreated: Number(importedGame.stats.nodesCreated) || game.nodes.length,
                    nodesDeleted: Number(importedGame.stats.nodesDeleted) || 0,
                    cablesPlaced: Number(importedGame.stats.cablesPlaced) || game.conns.length,
                    upgrades: Number(importedGame.stats.upgrades) || 0,
                    contractsCompleted: Number(importedGame.stats.contractsCompleted) || 0,
                    filesDownloaded: Number(importedGame.stats.filesDownloaded) || 0,
                    virusesCleaned: Number(importedGame.stats.virusesCleaned) || 0,
                    totalCodeBits: Number(importedGame.stats.totalCodeBits) || 0,
                    totalDrivers: Number(importedGame.stats.totalDrivers) || 0,
                    playTime: Number(importedGame.stats.playTime) || 0,
                    techsUnlocked: Number(importedGame.stats.techsUnlocked) || game.unlocked.length,
                    prestigeCount: Number(importedGame.stats.prestigeCount) || game.prestige,
                    startTime: Date.now()
                };
            }
            
            // Ensure nodes have infected property
            game.nodes.forEach(n => { 
                if (typeof n.infected === 'undefined') n.infected = false;
                if (typeof n.level === 'undefined') n.level = 1;
            });
            
            // Reset active nodes and reinitialize
            activeNodes.clear();
            selectedNode = null;
            
            renderWorld(); renderResearchTree(); renderDriverGrid(); renderAchievements(); updateUI();
            updateRouterCostDisplay();
            
            const version = saveData.version ? ` (v${saveData.version})` : '';
            logEvent(`Game loaded successfully${version}`, 'good');
            showFloat('✅ Game Loaded!', window.innerWidth/2, window.innerHeight/2, '#10b981');
            
        } catch(err) { 
            console.error('Save import error:', err);
            alert("Invalid Save File: " + err.message); 
        }
    };
    reader.onerror = () => alert("Error reading file");
    reader.readAsText(file);
}

// Make save/load functions globally available
window.exportSave = exportSave;
window.importSave = importSave;

// --- AUTO-SAVE SYSTEM ---
let autoSaveInterval = null;

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    autoSaveInterval = setInterval(() => {
        if (game.autoSaveEnabled) {
            autoSaveLocal();
        }
    }, 60000); // Auto-save every minute
}

function autoSaveLocal() {
    try {
        game.lastSaveTime = Date.now();
        const saveData = {
            game: JSON.parse(JSON.stringify(game)),
            version: GAME_VERSION,
            timestamp: Date.now()
        };
        localStorage.setItem('uploadLabsSave', JSON.stringify(saveData));
        console.log('Auto-saved to localStorage');
    } catch (e) {
        console.error('Auto-save failed:', e);
    }
}

function loadLocalSave() {
    try {
        const saveData = localStorage.getItem('uploadLabsSave');
        if (saveData) {
            const parsed = JSON.parse(saveData);
            if (parsed.game) {
                // Merge saved game into current game state
                Object.assign(game, parsed.game);
                // Ensure new fields exist
                if (!game.milestonesCompleted) game.milestonesCompleted = [];
                if (!game.lastLoginDate) game.lastLoginDate = null;
                if (!game.loginStreak) game.loginStreak = 0;
                if (!game.dailyRewardClaimed) game.dailyRewardClaimed = false;
                if (!game.settings) {
                    game.autoSaveEnabled = true;
                    game.notificationsEnabled = true;
                    game.offlineEarningsEnabled = true;
                }
                logEvent('Local save loaded', 'good');
                return true;
            }
        }
    } catch (e) {
        console.error('Local load failed:', e);
    }
    return false;
}

function toggleSetting(setting, value) {
    game[setting] = value;
    logEvent(`${setting.replace('Enabled', '')} ${value ? 'enabled' : 'disabled'}`, 'info');
    autoSaveLocal();
}

// Make auto-save functions globally available
window.startAutoSave = startAutoSave;
window.autoSaveLocal = autoSaveLocal;
window.loadLocalSave = loadLocalSave;
window.toggleSetting = toggleSetting;

// --- DAILY REWARDS SYSTEM ---
function checkDailyReward() {
    const now = new Date();
    const today = now.toDateString();
    const lastLogin = game.lastLoginDate;
    
    // First time login
    if (!lastLogin) {
        game.lastLoginDate = today;
        game.loginStreak = 1;
        game.dailyRewardClaimed = false;
        showDailyRewardModal();
        return;
    }
    
    const lastDate = new Date(lastLogin);
    const diffTime = now - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (lastLogin !== today) {
        if (diffDays === 1) {
            // Consecutive day
            game.loginStreak = (game.loginStreak || 0) + 1;
            if (game.loginStreak > 7) game.loginStreak = 1; // Reset after 7 days
        } else {
            // Streak broken
            game.loginStreak = 1;
        }
        game.lastLoginDate = today;
        game.dailyRewardClaimed = false;
        showDailyRewardModal();
    }
    
    updateSidebarStreak();
}

function showDailyRewardModal() {
    updateDailyRewardsUI();
    document.getElementById('dailyRewardModal').style.display = 'flex';
}

function updateDailyRewardsUI() {
    const grid = document.getElementById('dailyRewardsGrid');
    const currentStreak = game.loginStreak || 1;
    const claimed = game.dailyRewardClaimed;
    
    document.getElementById('streakDisplay').innerText = currentStreak;
    
    const claimBtn = document.getElementById('claimDailyBtn');
    const statusText = document.getElementById('dailyRewardStatus');
    
    if (claimed) {
        claimBtn.disabled = true;
        claimBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already Claimed';
        claimBtn.style.opacity = '0.5';
        statusText.innerText = 'Come back tomorrow for your next reward!';
    } else {
        claimBtn.disabled = false;
        claimBtn.innerHTML = '<i class="fa-solid fa-gift"></i> Claim Today\'s Reward';
        claimBtn.style.opacity = '1';
        statusText.innerText = `Day ${currentStreak} reward ready!`;
    }
    
    grid.innerHTML = DAILY_REWARDS.map((reward, index) => {
        const day = index + 1;
        const isCurrent = day === currentStreak;
        const isPast = day < currentStreak;
        const isClaimed = isCurrent && claimed;
        
        let style = 'background: rgba(30, 40, 55, 0.5); border: 1px solid var(--border-color);';
        let icon = '📦';
        
        if (isPast || isClaimed) {
            style = 'background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; opacity: 0.6;';
            icon = '✅';
        } else if (isCurrent) {
            style = 'background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2)); border: 2px solid #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);';
            icon = '🎁';
        }
        
        return `
            <div style="${style} border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 20px; margin-bottom: 5px;">${icon}</div>
                <div style="font-size: 10px; color: var(--text-muted);">Day ${day}</div>
                <div style="font-size: 11px; color: #fbbf24; font-weight: bold;">$${fmt(reward.money)}</div>
            </div>
        `;
    }).join('');
}

function claimDailyReward() {
    if (game.dailyRewardClaimed) return;
    
    const streak = game.loginStreak || 1;
    const reward = DAILY_REWARDS[Math.min(streak - 1, DAILY_REWARDS.length - 1)];
    
    game.money += reward.money;
    game.rp += reward.rp;
    if (reward.codeBits) game.codeBits += reward.codeBits;
    
    game.dailyRewardClaimed = true;
    game.stats.totalMoney += reward.money;
    
    updateDailyRewardsUI();
    updateSidebarStreak();
    updateUI();
    
    showFloat(`🎁 +$${fmt(reward.money)} Daily Reward!`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
    logEvent(`Claimed Day ${streak} daily reward!`, 'good');
    
    // Auto save after claiming
    if (game.autoSaveEnabled) autoSaveLocal();
}

function updateSidebarStreak() {
    const streakEl = document.getElementById('sidebarStreak');
    if (streakEl) streakEl.innerText = game.loginStreak || 0;
    
    const statusEl = document.getElementById('dailyRewardStatus');
    if (statusEl) {
        if (game.dailyRewardClaimed) {
            statusEl.innerText = '✅ Claimed today';
            statusEl.style.color = '#10b981';
        } else {
            statusEl.innerText = '🎁 Reward available!';
            statusEl.style.color = '#fbbf24';
        }
    }
}

// Make daily reward functions globally available
window.checkDailyReward = checkDailyReward;
window.showDailyRewardModal = showDailyRewardModal;
window.updateDailyRewardsUI = updateDailyRewardsUI;
window.claimDailyReward = claimDailyReward;
window.updateSidebarStreak = updateSidebarStreak;

// --- OFFLINE EARNINGS SYSTEM ---
function checkOfflineEarnings() {
    if (!game.offlineEarningsEnabled) return;
    
    const now = Date.now();
    const lastSave = game.lastSaveTime || now;
    const timeAway = now - lastSave;
    
    // Only show if away for more than 5 minutes
    if (timeAway < 5 * 60 * 1000) return;
    
    // Calculate max 12 hours of offline earnings
    const maxOfflineTime = 12 * 60 * 60 * 1000; // 12 hours
    const effectiveTime = Math.min(timeAway, maxOfflineTime);
    const hoursAway = effectiveTime / (1000 * 60 * 60);
    
    // Calculate earnings based on current income rates
    const moneyPerSecond = history.money || 10;
    const rpPerSecond = history.rp || 0.5;
    
    // Offline earnings are 50% of normal rate
    const offlineMoney = moneyPerSecond * hoursAway * 3600 * 0.5;
    const offlineRP = rpPerSecond * hoursAway * 3600 * 0.5;
    
    if (offlineMoney > 100) {
        game.money += offlineMoney;
        game.rp += offlineRP;
        game.stats.totalMoney += offlineMoney;
        
        // Format time display
        let timeText;
        if (hoursAway < 1) {
            timeText = Math.floor(hoursAway * 60) + ' minutes';
        } else if (hoursAway < 24) {
            timeText = Math.floor(hoursAway * 10) / 10 + ' hours';
        } else {
            timeText = Math.floor(hoursAway / 24 * 10) / 10 + ' days';
        }
        
        document.getElementById('offlineTime').innerText = timeText;
        document.getElementById('offlineMoney').innerText = '$' + fmt(offlineMoney);
        document.getElementById('offlineRP').innerText = fmt(offlineRP);
        document.getElementById('offlineEarningsModal').style.display = 'flex';
        
        logEvent(`Offline earnings: $${fmt(offlineMoney)}`, 'good');
    }
}

// Make offline earnings functions globally available
window.checkOfflineEarnings = checkOfflineEarnings;

// --- MILESTONES SYSTEM ---
function checkMilestones() {
    MILESTONES.forEach(milestone => {
        if (!game.milestonesCompleted.includes(milestone.id)) {
            if (milestone.check()) {
                completeMilestone(milestone);
            }
        }
    });
}

function completeMilestone(milestone) {
    game.milestonesCompleted.push(milestone.id);
    
    // Give rewards
    if (milestone.reward.money) {
        game.money += milestone.reward.money;
        game.stats.totalMoney += milestone.reward.money;
    }
    if (milestone.reward.rp) {
        game.rp += milestone.reward.rp;
    }
    
    // Show notification
    showFloat(`🏆 Milestone: ${milestone.name}!`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
    logEvent(`Milestone completed: ${milestone.name}!`, 'good');
    
    updateUI();
}

// Make milestone functions globally available
window.checkMilestones = checkMilestones;
window.completeMilestone = completeMilestone;

// --- ENHANCED NOTIFICATIONS ---
function showNotification(title, message, type = 'info', duration = 4000) {
    if (!game.notificationsEnabled) return;
    
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: ${80 + document.querySelectorAll('.game-notification').length * 70}px;
        right: 20px;
        background: ${type === 'good' ? 'rgba(16, 185, 129, 0.95)' : type === 'bad' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 5000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
        border-left: 4px solid rgba(255,255,255,0.5);
    `;
    notif.className = 'game-notification';
    notif.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 12px; opacity: 0.9;">${message}</div>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, duration);
}

// Make notification functions globally available
window.showNotification = showNotification;

// --- INITIALIZE GAME SYSTEMS ---
function initGameSystems() {
    // Load local save first
    loadLocalSave();
    
    // Check daily rewards
    checkDailyReward();
    
    // Check offline earnings (after a short delay to let game initialize)
    setTimeout(checkOfflineEarnings, 2000);
    
    // Start auto-save
    startAutoSave();
    
    // Update settings UI
    document.getElementById('autoSaveToggle').checked = game.autoSaveEnabled !== false;
    document.getElementById('offlineEarningsToggle').checked = game.offlineEarningsEnabled !== false;
    document.getElementById('notificationsToggle').checked = game.notificationsEnabled !== false;
    
    // Check milestones periodically
    setInterval(checkMilestones, 5000);
}

// Make init function globally available
window.initGameSystems = initGameSystems;

// Initialize game systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGameSystems();
    init();
    renderResearchTree();
    renderDriverGrid();
    setTab('infra');
});

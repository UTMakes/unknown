// Core Game Logic
import { NODE_DEFS, RESOURCES, DRIVERS, TECH_TREE, ACHIEVEMENTS, RANDOM_EVENTS, DAILY_REWARDS, MILESTONES } from './data.js';

export const game = {
    money: 1500,
    rp: 0,
    prestige: 0,
    res: { files: 0, images: 0, videos: 0, audio: 0 },
    nodes: new Map(),
    conns: [],
    routerLevel: 1,
    routerHeat: 0,
    overheatMode: false,
    overclockMult: 1.0,
    coolingPower: 0,
    overclockHeatGen: 0,
    unlocked: [],
    nextId: 1,
    activeContract: null,
    codeBits: 0,
    optimizationCode: 0,
    drivers: {
        network: 0, compression: 0, security: 0, mining: 0, research: 0, upload: 0, download: 0
    },
    stats: {
        totalMoney: 0, peakMoney: 2000, moneySpent: 0, totalRP: 0,
        nodesCreated: 0, nodesDeleted: 0, cablesPlaced: 0, upgrades: 0,
        contractsCompleted: 0, filesDownloaded: 0, virusesCleaned: 0,
        totalCodeBits: 0, totalDrivers: 0, playTime: 0, techsUnlocked: 0,
        prestigeCount: 0, synergyBonus: 0, startTime: Date.now()
    },
    achievements: [],
    activeEvent: null,
    eventTimeLeft: 0,
    milestonesCompleted: [],
    
    // Daily Rewards
    lastLoginDate: null,
    loginStreak: 0,
    dailyRewardClaimed: false,

    // Settings
    autoSaveEnabled: true, notificationsEnabled: true, offlineEarningsEnabled: true,
    lastSaveTime: Date.now(),
    saveVersion: "11.3",
    
    // UI State
    cableDeleteMode: false
};

export const eventMultipliers = { money: 1, rp: 1, code: 1, speed: 1 };
export const activeNodes = new Set();
export let history = { money: 0, rp: 0 };
export const neighbors = new Map();

// Combo System State
export const combo = { count: 0, timer: 0, lastAction: 0 };

// --- Node & Connection Logic ---

export function addNode(type, x, y) {
    const id = game.nextId++;
    const node = { id, type, x, y, level: 1, infected: false };
    game.nodes.set(id, node);
    if (!neighbors.has(id)) neighbors.set(id, []);
    game.stats.nodesCreated++;
    checkMilestones(); // Check milestones on node creation
    return node;
}

export function addConnection(from, to) {
    if (!game.nodes.has(from) || !game.nodes.has(to)) return false;
    
    if (!neighbors.has(from)) neighbors.set(from, []);
    if (!neighbors.has(to)) neighbors.set(to, []);

    const fromNeighbors = neighbors.get(from);
    if (fromNeighbors.includes(to)) return false;

    game.conns.push({ from, to });
    neighbors.get(from).push(to);
    neighbors.get(to).push(from);
    game.stats.cablesPlaced++;
    checkMilestones(); // Check milestones on connection
    return true;
}

export function removeNode(id) {
    if (!game.nodes.has(id)) return;
    const node = game.nodes.get(id);
    if (node.type === 'router') return;

    game.nodes.delete(id);

    const connected = neighbors.get(id) || [];
    connected.forEach(neighborId => {
        const nList = neighbors.get(neighborId);
        if (nList) {
            const idx = nList.indexOf(id);
            if (idx > -1) nList.splice(idx, 1);
        }
    });
    neighbors.delete(id);

    game.conns = game.conns.filter(c => c.from !== id && c.to !== id);
    game.stats.nodesDeleted++;
    return node;
}

export function upgradeRouter() {
    let router = null;
    for (const [id, n] of game.nodes) {
        if (n.type === 'router') { router = n; break; }
    }
    
    if (router) {
        const base = 500;
        const cost = Math.floor(base * Math.pow(1.5, router.level));
        if (game.money >= cost) {
            game.money -= cost;
            game.stats.moneySpent += cost;
            game.stats.upgrades++;
            router.level++;
            game.routerLevel = router.level;
            addCombo();
            return true;
        }
    }
    return false;
}

export function cleanNode(id) {
    const node = game.nodes.get(id);
    if (node && node.infected) {
        const cost = 500;
        if (game.money >= cost) {
            game.money -= cost;
            game.stats.moneySpent += cost;
            node.infected = false;
            game.stats.virusesCleaned++;
            addCombo();
            return true;
        }
    }
    return false;
}

export function upgradeNode(id) {
    const node = game.nodes.get(id);
    if (!node) return false;
    
    const def = NODE_DEFS[node.type];
    const base = node.type === 'router' ? 500 : def.cost;
    const cost = Math.floor(base * Math.pow(1.5, node.level));
    
    if (game.money >= cost) {
        game.money -= cost;
        game.stats.moneySpent += cost;
        game.stats.upgrades++;
        node.level++;
        if (node.type === 'router') game.routerLevel = node.level;
        addCombo();
        return true;
    }
    return false;
}

export function convertCodeBits() {
    if (game.codeBits >= 100) {
        game.codeBits -= 100;
        game.optimizationCode += 1;
        return true;
    }
    return false;
}

export function installDriver(id) {
    const driver = DRIVERS[id];
    if (game.optimizationCode >= driver.cost) {
        game.optimizationCode -= driver.cost;
        game.drivers[id]++;
        game.stats.totalDrivers++;
        checkAchievements();
        return true;
    }
    return false;
}

export function performPrestige() {
    if (game.nodes.size < 20 || game.money < 50000) return false;
    
    game.prestige++;
    game.stats.prestigeCount++;
    
    game.money = 5000;
    game.rp = 0;
    game.res = { files: 0, images: 0, videos: 0, audio: 0 };
    game.nodes.clear();
    neighbors.clear();
    game.conns = [];
    game.routerLevel = 1;
    game.routerHeat = 0;
    game.overheatMode = false;
    game.activeContract = null;
    game.codeBits = 0;
    game.optimizationCode = 0;
    // Keep unlocked tech as per index3.html legacy behavior (mostly)
    
    addNode('router', 2500, 2500);
    return true;
}

export function toggleCableDeleteMode() {
    game.cableDeleteMode = !game.cableDeleteMode;
    return game.cableDeleteMode;
}

export function deleteCable(from, to) {
    const idx = game.conns.findIndex(c => 
        (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );
    
    if (idx !== -1) {
        game.conns.splice(idx, 1);
        
        const n1 = neighbors.get(from);
        if (n1) {
            const i = n1.indexOf(to);
            if (i > -1) n1.splice(i, 1);
        }
        const n2 = neighbors.get(to);
        if (n2) {
            const i = n2.indexOf(from);
            if (i > -1) n2.splice(i, 1);
        }
        
        game.money += 5;
        return true;
    }
    return false;
}

export function deleteAllCables() {
    const count = game.conns.length;
    if (count === 0) return 0;
    
    const refund = count * 5;
    game.conns = [];
    neighbors.forEach(list => list.length = 0);
    game.money += refund;
    return refund;
}

export function updateConnectivity() {
    const newActive = new Set();
    const q = [];

    for (const [id, node] of game.nodes) {
        if (node.type === 'router') {
            newActive.add(id);
            q.push(id);
        }
    }

    while (q.length > 0) {
        const curr = q.shift();
        const currNeighbors = neighbors.get(curr) || [];

        for (const neighborId of currNeighbors) {
            if (!newActive.has(neighborId)) {
                newActive.add(neighborId);
                q.push(neighborId);
            }
        }
    }

    activeNodes.clear();
    for (const id of newActive) activeNodes.add(id);

    return newActive;
}

// --- Research System ---

export function canUnlockTech(id) {
    const tech = TECH_TREE.find(t => t.id === id);
    if (!tech) return false;
    if (!tech.requires || tech.requires.length === 0) return true;
    return tech.requires.every(req => game.unlocked.includes(req));
}

export function unlockTech(id) {
    const tech = TECH_TREE.find(t => t.id === id);
    if (!tech) return false;
    
    if (!game.unlocked.includes(id) && game.rp >= tech.cost && canUnlockTech(id)) {
        game.rp -= tech.cost;
        game.unlocked.push(id);
        game.stats.techsUnlocked++;
        checkAchievements();
        return true;
    }
    return false;
}

// --- Random Events ---

export function triggerRandomEvent() {
    if (game.activeEvent) return null;
    if (Math.random() > 0.30) return null; // 30% chance

    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    
    if (event.instant) {
        event.effect(game);
        return { event, instant: true };
    } else {
        game.activeEvent = event;
        game.eventTimeLeft = event.duration;
        event.effect();
        return { event, instant: false };
    }
}

export function updateEvents(dt) {
    if (game.activeEvent) {
        game.eventTimeLeft -= dt;
        if (game.eventTimeLeft <= 0) {
            if (game.activeEvent.cleanup) game.activeEvent.cleanup();
            const finishedEvent = game.activeEvent;
            game.activeEvent = null;
            return finishedEvent; // Signal event ended
        }
    }
    return null;
}

// --- Combo System ---

export function addCombo() {
    const now = Date.now();
    if (now - combo.lastAction < 3000) {
        combo.count++;
        combo.timer = 3;
    } else {
        combo.count = 1;
        combo.timer = 3;
    }
    combo.lastAction = now;
}

export function updateCombo(dt) {
    if (combo.timer > 0) {
        combo.timer -= dt;
        if (combo.timer <= 0) {
            combo.count = 0;
        }
    }
}

// --- Milestones & Achievements ---

export function checkMilestones() {
    const newMilestones = [];
    MILESTONES.forEach(milestone => {
        if (!game.milestonesCompleted.includes(milestone.id)) {
            if (milestone.check(game)) {
                completeMilestone(milestone);
                newMilestones.push(milestone);
            }
        }
    });
    return newMilestones;
}

function completeMilestone(milestone) {
    game.milestonesCompleted.push(milestone.id);
    if (milestone.reward.money) {
        game.money += milestone.reward.money;
        game.stats.totalMoney += milestone.reward.money;
    }
    if (milestone.reward.rp) {
        game.rp += milestone.reward.rp;
    }
}

export function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (game.achievements.includes(ach.id)) return;
        if (ach.condition(game.stats)) {
            game.achievements.push(ach.id);
            game.money += ach.reward;
        }
    });
}

// --- Advanced Features ---

export function batchUpgrade(type) {
    const nodesOfType = Array.from(game.nodes.values()).filter(n => n.type === type && activeNodes.has(n.id));
    if (nodesOfType.length === 0) return 0;
    
    let upgradedCount = 0;
    let totalCost = 0;
    
    nodesOfType.forEach(node => {
        const cost = NODE_DEFS[type].cost * Math.pow(1.5, node.level - 1);
        if (game.money >= cost + totalCost) {
            totalCost += cost;
            upgradedCount++;
        }
    });
    
    if (upgradedCount === 0) return 0;
    
    game.money -= totalCost;
    game.stats.moneySpent += totalCost;
    
    let actualUpgraded = 0;
    nodesOfType.forEach(node => {
        const cost = NODE_DEFS[type].cost * Math.pow(1.5, node.level - 1);
        if (actualUpgraded < upgradedCount) {
            node.level++;
            actualUpgraded++;
        }
    });
    
    game.stats.upgrades += actualUpgraded;
    checkAchievements();
    return actualUpgraded;
}

let autoBalancerEnabled = false;
export function toggleAutoBalancer() {
    autoBalancerEnabled = !autoBalancerEnabled;
    return autoBalancerEnabled;
}

export function analyzeNetwork() {
    const active = Array.from(game.nodes.values()).filter(n => activeNodes.has(n.id) && !n.infected);
    const totalNodes = active.length;
    
    if (totalNodes === 0) return { efficiency: 0, issues: [], suggestions: [] };
    
    const downloaders = active.filter(n => n.type.startsWith('dl_')).length;
    const uploaders = active.filter(n => n.type === 'uploader').length;
    const labs = active.filter(n => n.type === 'lab').length;
    
    const issues = [];
    const suggestions = [];
    
    if (downloaders > 0 && uploaders === 0) {
        issues.push('You have downloaders but no uploaders!');
        suggestions.push('Add Uploader nodes to sell your collected data.');
    }
    
    if (uploaders > downloaders * 2) {
        issues.push('Too many uploaders compared to downloaders');
        suggestions.push('Add more downloader nodes to feed your uploaders.');
    }
    
    if (labs > 0 && downloaders === 0) {
        issues.push('Research Labs need file input');
        suggestions.push('Add downloader nodes to supply files to your labs.');
    }
    
    // Check for orphaned nodes
    const connectedNodes = new Set();
    game.conns.forEach(c => {
        connectedNodes.add(c.from);
        connectedNodes.add(c.to);
    });
    const orphaned = active.filter(n => !connectedNodes.has(n.id) && n.type !== 'router').length;
    
    if (orphaned > 0) {
        issues.push(`${orphaned} node(s) have no connections`);
        suggestions.push('Connect all nodes to your router network.');
    }
    
    let efficiency = 100;
    if (issues.length > 0) efficiency -= issues.length * 15;
    if (orphaned > 0) efficiency -= orphaned * 10;
    efficiency = Math.max(0, Math.min(100, efficiency));
    
    return { efficiency, issues, suggestions, stats: { downloaders, uploaders, labs, totalNodes } };
}

// --- Save/Load System ---

function generateSaveChecksum(gameData) {
    const str = JSON.stringify(gameData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

export function autoSaveLocal() {
    try {
        game.lastSaveTime = Date.now();
        // Convert Map to Array for JSON serialization
        const gameCopy = { ...game, nodes: Array.from(game.nodes.entries()) };
        
        const saveData = {
            game: gameCopy,
            version: game.saveVersion,
            timestamp: Date.now(),
            checksum: generateSaveChecksum(gameCopy)
        };
        localStorage.setItem('uploadLabsSave', JSON.stringify(saveData));
    } catch (e) {
        console.error("Auto-save failed", e);
    }
}

export function loadLocalSave() {
    try {
        const saveData = localStorage.getItem('uploadLabsSave');
        if (saveData) {
            const parsed = JSON.parse(saveData);
            if (parsed.game) {
                const loadedGame = parsed.game;
                // Rehydrate Map
                if (Array.isArray(loadedGame.nodes)) {
                    loadedGame.nodes = new Map(loadedGame.nodes);
                }
                Object.assign(game, loadedGame);
                
                // Rebuild neighbors
                neighbors.clear();
                for (const [id, node] of game.nodes) {
                    neighbors.set(id, []);
                }
                game.conns.forEach(c => {
                    if (neighbors.has(c.from)) neighbors.get(c.from).push(c.to);
                    if (neighbors.has(c.to)) neighbors.get(c.to).push(c.from);
                });
                
                // Active nodes update will happen in init
                return true;
            }
        }
    } catch (e) {
        console.error("Load failed", e);
    }
    return false;
}

export function checkOfflineEarnings() {
    if (!game.offlineEarningsEnabled) return null;
    
    const now = Date.now();
    const lastSave = game.lastSaveTime || now;
    const timeAway = now - lastSave;
    
    if (timeAway < 5 * 60 * 1000) return null; // < 5 mins
    
    const maxOfflineTime = 12 * 60 * 60 * 1000;
    const effectiveTime = Math.min(timeAway, maxOfflineTime);
    const hoursAway = effectiveTime / (1000 * 60 * 60);
    
    // Estimate earnings (simplified)
    const moneyPerSecond = history.money > 0 ? history.money : 10;
    const rpPerSecond = history.rp > 0 ? history.rp : 0.5;
    
    const offlineMoney = moneyPerSecond * hoursAway * 3600 * 0.5;
    const offlineRP = rpPerSecond * hoursAway * 3600 * 0.5;
    
    if (offlineMoney > 100) {
        game.money += offlineMoney;
        game.rp += offlineRP;
        game.stats.totalMoney += offlineMoney;
        return { money: offlineMoney, rp: offlineRP, time: hoursAway };
    }
    return null;
}

// --- Main Tick ---

export function gameTick(dt) {
    // Heat & Overclock Logic
    let overclockMult = 1.0;
    let coolingPower = 0;
    let overclockHeatGen = 0;

    let routerId = null;
    for (const [id, node] of game.nodes) {
        if (node.type === 'router') {
            routerId = id;
            break;
        }
    }

    if (routerId && activeNodes.has(routerId)) {
        const routerNeighbors = neighbors.get(routerId) || [];
        routerNeighbors.forEach(nid => {
            const n = game.nodes.get(nid);
            if (n && n.type === 'overclock' && activeNodes.has(nid) && !n.infected) {
                overclockMult += 0.5 * n.level;
                overclockHeatGen += 15 + (5 * (n.level - 1));
            }
        });
        
        for (const [id, n] of game.nodes) {
            if (n.type === 'cryo_cooler' && activeNodes.has(id) && !n.infected) {
                coolingPower += 20 + (10 * (n.level - 1));
            }
        }

        const netHeatChange = overclockHeatGen - coolingPower;
        if (netHeatChange > 0) {
            game.routerHeat = Math.min(100, game.routerHeat + (netHeatChange * dt));
        } else {
            game.routerHeat = Math.max(0, game.routerHeat + (netHeatChange * dt));
        }

        if (overclockHeatGen === 0) {
            game.routerHeat = Math.max(0, game.routerHeat - (5 * dt));
        }
    }

    game.overheatMode = game.routerHeat >= 100;
    if (game.routerHeat <= 50) game.overheatMode = false;

    game.overclockMult = overclockMult;
    game.coolingPower = coolingPower;
    game.overclockHeatGen = overclockHeatGen;

    let efficiency = overclockMult;
    if (game.overheatMode) efficiency *= 0.7;

    const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect);
    const driverUploadMult = 1 + (game.drivers.upload * DRIVERS.upload.effect);
    const prestigeMult = 1 + (game.prestige * 1.0);
    // --- Synergy Logic ---
    let synergyBoost = 1.0;
    const activeNodeTypes = new Set();
    for (const [id, n] of game.nodes) {
        if (activeNodes.has(id) && !n.infected) activeNodeTypes.add(n.type);
    }
    
    let synergyPercent = 0;
    
    // Cache + Downloader
    if (activeNodeTypes.has('cache') && (activeNodeTypes.has('dl_file') || activeNodeTypes.has('dl_img') || activeNodeTypes.has('dl_vid') || activeNodeTypes.has('dl_audio'))) {
        synergyBoost *= 1.15;
        synergyPercent += 15;
    }
    // Lab + Analyzer
    if (activeNodeTypes.has('lab') && activeNodeTypes.has('analyzer')) {
        synergyBoost *= 1.20;
        synergyPercent += 20;
    }
    // Firewall Bonus
    if (activeNodeTypes.has('firewall')) {
        synergyBoost *= 1.10;
        synergyPercent += 10;
    }
    // Coding Trio
    if (activeNodeTypes.has('coder') && activeNodeTypes.has('dev_station') && activeNodeTypes.has('compiler')) {
        synergyBoost *= 1.25;
        synergyPercent += 25;
    }
    // Miner + Crypto Farm
    if (activeNodeTypes.has('miner') && activeNodeTypes.has('crypto_farm')) {
        synergyBoost *= 1.30;
        synergyPercent += 30;
    }
    
    if (synergyPercent > game.stats.synergyBonus) game.stats.synergyBonus = synergyPercent;

    // Advanced Global Boosts
    const cdnBoost = 1 + (Array.from(game.nodes.values()).filter(n => n.type === 'cdn' && activeNodes.has(n.id) && !n.infected).length * 0.20);
    const aiBoost = 1 + (Array.from(game.nodes.values()).filter(n => n.type === 'ai_processor' && activeNodes.has(n.id) && !n.infected).length * 0.5);
    const clusterCount = Array.from(game.nodes.values()).filter(n => n.type === 'cluster' && activeNodes.has(n.id) && !n.infected).length;
    const clusterBoost = 1 + (clusterCount * 0.15);
    const warehouseCount = Array.from(game.nodes.values()).filter(n => n.type === 'warehouse' && activeNodes.has(n.id) && !n.infected).length;
    
    let quantumMult = 1;
    for (const [id, n] of game.nodes) {
        if (n.type === 'quantum' && activeNodes.has(id) && !n.infected) quantumMult *= 2.5;
    }
    
    const fiberMult = game.unlocked.includes('tech_fiber') ? 1.25 : 1;
    const satMult = game.unlocked.includes('tech_sat') ? 1.5 : 1;
    const neuralMult = game.unlocked.includes('tech_neural') ? 1.5 : 1;

    const baseSpeed = 20 * Math.pow(1.4, game.routerLevel - 1) * prestigeMult * fiberMult * efficiency * driverDownloadMult * eventMultipliers.speed * synergyBoost * quantumMult * neuralMult;

    // Code Gen
    let codeGenRate = 0;
    for (const [id, n] of game.nodes) {
        if (!activeNodes.has(id) || n.infected) continue;
        if (n.type === 'coder') codeGenRate += 6.25 * Math.pow(1.2, n.level - 1);
        if (n.type === 'dev_station') codeGenRate += 12.5 * Math.pow(1.2, n.level - 1);
    }
    game.codeBits += codeGenRate * dt * eventMultipliers.code;
    
    // Auto-compiler
    const compilers = Array.from(game.nodes.values()).filter(n => n.type === 'compiler' && activeNodes.has(n.id) && !n.infected);
    if (compilers.length > 0 && game.codeBits >= 100) {
        const totalCompilerPower = compilers.reduce((sum, c) => sum + Math.pow(1.2, c.level - 1), 0);
        const toConvert = Math.min(Math.floor(game.codeBits / 100), Math.floor(totalCompilerPower * 10));
        if (toConvert > 0) {
            game.codeBits -= toConvert * 100;
            game.optimizationCode += toConvert;
        }
    }

    // Node Processing
    for (const [id, node] of game.nodes) {
        if (!activeNodes.has(id)) continue;

        if (node.infected) {
            const securityMult = Math.max(0, 1 - (game.drivers.security * DRIVERS.security.effect));
            game.money -= 10 * dt * securityMult;
            continue;
        }

        const def = NODE_DEFS[node.type];
        const lvlMult = Math.pow(1.2, node.level - 1);
        
        let boost = 1.0 * aiBoost * clusterBoost;
        let hasCompressor = false;

        const myNeighbors = neighbors.get(id) || [];
        for (const nid of myNeighbors) {
            const n = game.nodes.get(nid);
            if (n && activeNodes.has(nid) && !n.infected) {
                if (n.type === 'cache') boost *= 1.5;
                if (n.type === 'rack') boost *= 1.2;
                if (n.type === 'compressor') hasCompressor = true;
            }
        }
        
        // Balancer Logic
        if (node.type === 'balancer') {
            boost *= (1 + myNeighbors.length * 0.1);
        }
        
        if (node.type === 'crypto_farm') boost *= 3;

        const effectiveSpeed = baseSpeed * boost * lvlMult * dt;

        if (def.type === 'download' || node.type === 'dl_audio') {
            const resKey = def.out || node.type.replace('dl_', '');
            if (RESOURCES[resKey]) {
                let amt = effectiveSpeed / RESOURCES[resKey].size;
                if (warehouseCount > 0) amt *= (1 + warehouseCount * 0.3);
                game.res[resKey] += amt;
            }
        } else if (def.type === 'upload' || node.type === 'rack') {
            const upSpeed = effectiveSpeed * driverUploadMult * cdnBoost * (node.type === 'rack' ? 2 : satMult);
            
            // Rack multi-functionality
            if (node.type === 'rack') {
                game.res.files += (upSpeed * 0.15 * dt) / RESOURCES.files.size;
                if(game.unlocked.includes('tech_img')) game.res.images += (upSpeed * 0.15 * dt) / RESOURCES.images.size;
            }

            let cap = upSpeed * dt; // Capacity for this tick
            
            // Priority: Audio -> Video -> Images -> Files
            ['audio', 'videos', 'images', 'files'].forEach(k => {
                if (cap <= 0 || game.res[k] <= 0) return;
                let size = RESOURCES[k].size;
                
                if (hasCompressor) size *= (0.7 - (game.drivers.compression * DRIVERS.compression.effect));
                if (node.type === 'streaming' && (k === 'audio' || k === 'videos')) size *= 0.25; // 4x speed for media
                
                // Calculate amount we can upload
                const amount = Math.min(game.res[k], cap / size);
                
                game.res[k] -= amount;
                cap -= amount * size;
                
                const gain = amount * RESOURCES[k].price * eventMultipliers.money;
                game.money += gain;
                history.money += gain;
                
                if (game.activeContract && game.activeContract.type === 'upload') {
                    game.activeContract.current += amount * size;
                }
            });
            
        } else if (def.type === 'lab') {
            // Lab logic: Convert Files -> RP
            let labCap = effectiveSpeed * RESOURCES.files.size * dt; // Capacity in bytes
            // Analyzer boost
            let rpBoost = 1 + (Array.from(game.nodes.values()).filter(n => n.type === 'analyzer' && activeNodes.has(n.id) && !n.infected).length * 0.6);
            
            if (game.res.files > 0) {
                let size = RESOURCES.files.size;
                if (hasCompressor) size *= 0.7;
                
                const amount = Math.min(game.res.files, labCap / size);
                game.res.files -= amount;
                
                const gain = amount * RESOURCES.files.rp * rpBoost * (1 + game.drivers.research * DRIVERS.research.effect) * eventMultipliers.rp;
                game.rp += gain;
                history.rp += gain;
                game.stats.totalRP += gain;
            }
            
        } else if (node.type === 'miner' || node.type === 'crypto_farm') {
            const gain = effectiveSpeed * (node.type === 'crypto_farm' ? 0.08 : 0.025) * eventMultipliers.money * (1 + game.drivers.mining * DRIVERS.mining.effect);
            game.money += gain;
            history.money += gain;
        } else if (node.type === 'backup' || node.type === 'warehouse') {
            // Passive income from stored data
            const stored = Object.values(game.res).reduce((a, b) => a + b, 0);
            if (stored > 1000) {
                const bonus = stored * 0.001 * dt * (node.type === 'warehouse' ? 2 : 1);
                game.money += bonus;
                history.money += bonus;
            }
        }
    }
    
    // Contract Logic
    if (game.activeContract) {
        game.activeContract.time -= dt;
        if (game.activeContract.time <= 0) {
            game.activeContract = null; // Failed
        } else if (game.activeContract.current >= game.activeContract.target) {
            game.money += game.activeContract.rewardMoney;
            game.rp += game.activeContract.rewardRp;
            game.activeContract = null; // Complete
            game.stats.contractsCompleted++;
        }
    }

    if (game.money > 1e300) game.money = 1e300;
}
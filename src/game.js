// Core Game Logic
import { NODE_DEFS, RESOURCES, DRIVERS, TECH_TREE, ACHIEVEMENTS, RANDOM_EVENTS, DAILY_REWARDS } from './data.js';

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
    
    // UI State (managed here for simplicity in modular structure)
    cableDeleteMode: false
};

export const eventMultipliers = { money: 1, rp: 1, code: 1, speed: 1 };
export const activeNodes = new Set();
export let history = { money: 0, rp: 0 };

// Optimized Adjacency List
export const neighbors = new Map();

export function addNode(type, x, y) {
    const id = game.nextId++;
    const node = { id, type, x, y, level: 1, infected: false };
    game.nodes.set(id, node);
    if (!neighbors.has(id)) neighbors.set(id, []);
    game.stats.nodesCreated++;
    return node;
}

export function addConnection(from, to) {
    if (!game.nodes.has(from) || !game.nodes.has(to)) return false;
    
    // Ensure neighbors initialized
    if (!neighbors.has(from)) neighbors.set(from, []);
    if (!neighbors.has(to)) neighbors.set(to, []);

    const fromNeighbors = neighbors.get(from);
    if (fromNeighbors.includes(to)) return false;

    game.conns.push({ from, to });
    neighbors.get(from).push(to);
    neighbors.get(to).push(from);
    game.stats.cablesPlaced++;
    return true;
}

export function removeNode(id) {
    if (!game.nodes.has(id)) return;
    const node = game.nodes.get(id);
    if (node.type === 'router') return;

    game.nodes.delete(id);

    // Clean up connections
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
    // Find router
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
            return true; // Success
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
        return true;
    }
    return false;
}

export function performPrestige() {
    if (game.nodes.size < 20 || game.money < 50000) return false;
    
    game.prestige++;
    game.stats.prestigeCount++;
    
    // Reset State
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
    
    // Respawn Router
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
        
        // Update neighbors
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
        
        game.money += 5; // Refund
        return true;
    }
    return false;
}

export function deleteAllCables() {
    const count = game.conns.length;
    if (count === 0) return 0;
    
    const refund = count * 5;
    game.conns = [];
    neighbors.forEach(list => list.length = 0); // Clear all neighbor lists
    game.money += refund;
    return refund;
}

// Optimized BFS for connectivity
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
    const fiberMult = game.unlocked.includes('tech_fiber') ? 1.25 : 1;
    
    const baseSpeed = 20 * Math.pow(1.4, game.routerLevel - 1) * prestigeMult * fiberMult * efficiency * driverDownloadMult * eventMultipliers.speed;

    let codeGenRate = 0;
    for (const [id, n] of game.nodes) {
        if (!activeNodes.has(id) || n.infected) continue;
        if (n.type === 'coder') codeGenRate += 6.25 * Math.pow(1.2, n.level - 1);
        if (n.type === 'dev_station') codeGenRate += 12.5 * Math.pow(1.2, n.level - 1);
    }
    game.codeBits += codeGenRate * dt * eventMultipliers.code;

    for (const [id, node] of game.nodes) {
        if (!activeNodes.has(id)) continue;

        if (node.infected) {
            const securityMult = Math.max(0, 1 - (game.drivers.security * DRIVERS.security.effect));
            game.money -= 10 * dt * securityMult;
            continue;
        }

        const def = NODE_DEFS[node.type];
        const lvlMult = Math.pow(1.2, node.level - 1);
        let boost = 1.0;

        const myNeighbors = neighbors.get(id) || [];
        for (const nid of myNeighbors) {
            const n = game.nodes.get(nid);
            if (n && activeNodes.has(nid) && !n.infected) {
                if (n.type === 'cache') boost *= 1.5;
                if (n.type === 'rack') boost *= 1.2;
            }
        }

        const effectiveSpeed = baseSpeed * boost * lvlMult * dt;

        if (def.type === 'download') {
            const resKey = def.out;
            if (RESOURCES[resKey]) {
                game.res[resKey] += effectiveSpeed / RESOURCES[resKey].size;
            }
        } else if (def.type === 'upload') {
            const upSpeed = effectiveSpeed * driverUploadMult;
            const gain = upSpeed * 0.1;
            game.money += gain;
            history.money += gain;
        } else if (node.type === 'miner') {
            const gain = effectiveSpeed * 0.025 * eventMultipliers.money;
            game.money += gain;
            history.money += gain;
        }
    }

    if (game.money > 1e300) game.money = 1e300;
}

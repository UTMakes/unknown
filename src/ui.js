import { game, activeNodes, addNode, performPrestige, neighbors } from './game.js';
import { NODE_DEFS, DRIVERS, ACHIEVEMENTS, TECH_TREE, DAILY_REWARDS } from './data.js';
import { bindNodeEvents } from './inputs.js';

const nodeElements = new Map();

export function initUI() {
    game.viewX = window.innerWidth / 2 - 2500;
    game.viewY = window.innerHeight / 2 - 2500;
    game.viewScale = 1;
    updateWorldTransform(game.viewX, game.viewY, game.viewScale);
    setTab('infra');
    
    // Initial Render of Modals
    renderDriverGrid();
    renderAchievements();
    renderResearchTree();
    updatePrestigeUI();
    renderStatistics();
    updateDailyRewardsUI();
}

export function updateWorldTransform(x, y, scale) {
    const world = document.getElementById('world');
    if (world) world.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) zoomLevel.innerText = Math.round(scale * 100) + '%';
}

export function renderWorld() {
    const nodesDiv = document.getElementById('nodes');
    if (!nodesDiv) return;

    const currentIds = new Set();
    for (const [id, node] of game.nodes) {
        currentIds.add(id);
        let el = nodeElements.get(id);

        if (!el) {
            el = createNodeElement(node);
            nodesDiv.appendChild(el);
            nodeElements.set(id, el);
            bindNodeEvents(el, node);
        }

        el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        el.classList.toggle('disconnected', !activeNodes.has(id));
        el.classList.toggle('infected', node.infected);
        
        // Working animation: If connected and not infected
        if (activeNodes.has(id) && !node.infected) {
            el.classList.add('working');
        } else {
            el.classList.remove('working');
        }
        
        if (node.type === 'router' && game.overheatMode) el.classList.add('overheating');
        else el.classList.remove('overheating');

        // Update level if changed
        const lvlEl = el.querySelector('.node-lvl');
        if (lvlEl && lvlEl.innerText !== `Level ${node.level}`) {
            lvlEl.innerText = `Level ${node.level}`;
        }
    }

    for (const [id, el] of nodeElements) {
        if (!currentIds.has(id)) {
            el.remove();
            nodeElements.delete(id);
        }
    }
    renderCables();
}

function createNodeElement(node) {
    const def = NODE_DEFS[node.type];
    const el = document.createElement('div');
    el.className = `node`;
    el.id = `node-${node.id}`;

    // Add specific classes for styling
    if (def.type === 'coding') el.classList.add('coding');
    if (node.type === 'router') el.classList.add('router');

    el.innerHTML = `
        <div class="port in"></div><div class="port out"></div>
        ${node.infected ? `<div class="clean-btn" onmousedown="window.cleanNode(${node.id}); event.stopPropagation();">CLEAN [-$500]</div>` : ''}
        <div class="node-header">
            <div class="node-icon-box" style="color:${def.color}"><i class="${def.icon}"></i></div>
            <div class="node-info">
                <div class="node-title">${def.name}</div>
                <div class="node-lvl">Level ${node.level}</div>
            </div>
        </div>
    `;
    return el;
}

// Full Tab System
export function setTab(tabName) {
    const tray = document.getElementById('tray');
    if (!tray) return;
    tray.innerHTML = '';

    Object.keys(NODE_DEFS).forEach(key => {
        const def = NODE_DEFS[key];
        if (def.type === 'core') return;

        let match = false;
        if (tabName === 'infra' && (def.type === 'infra' || def.type === 'core')) match = true;
        if (tabName === 'download' && def.type === 'download') match = true;
        if (tabName === 'upload' && (def.type === 'upload' || def.type === 'lab' || def.type === 'special')) match = true;
        if (tabName === 'advanced' && def.type === 'advanced') match = true;
        if (tabName === 'coding' && def.type === 'coding') match = true;

        if (match) {
            const item = document.createElement('div');
            item.className = 'shop-item';
            // Add disabled class if locked (placeholder logic)
            if (def.req && !game.unlocked.includes(def.req)) item.classList.add('disabled');

            item.innerHTML = `
                <div class="item-cost">$${formatNumber(def.cost)}</div>
                <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
                <div class="item-name">${def.name}</div>
                <div class="item-desc">${def.desc}</div>
            `;
            item.onclick = () => {
                if (game.money >= def.cost && (!def.req || game.unlocked.includes(def.req))) {
                    game.money -= def.cost;
                    game.stats.moneySpent += def.cost;
                    const cx = (-game.viewX + window.innerWidth/2) / game.viewScale;
                    const cy = (-game.viewY + window.innerHeight/2) / game.viewScale;
                    const node = addNode(key, cx - 90, cy - 40);
                    showFloat(`-$${formatNumber(def.cost)}`, window.innerWidth/2, window.innerHeight/2, 'red');
                    spawnParticles(node.x + 90, node.y + 40, def.color || '#3b82f6', 8);
                }
            };
            tray.appendChild(item);
        }
    });
}

// Cable Cache to prevent DOM thrashing
const cableCache = new Map();

function renderCables() {
    const svg = document.getElementById('cables');
    if (!svg) return;

    // specific key for current set of connections to detect changes
    const currentKeys = new Set();

    game.conns.forEach(c => {
        const key = `${c.from}-${c.to}`;
        currentKeys.add(key);

        let cached = cableCache.get(key);
        if (!cached) {
            // Create new cable elements
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const inner = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            line.classList.add("cable");
            inner.classList.add("cable-inner");
            group.classList.add("cable-group");
            
            // Add delete handlers
            group.onclick = (e) => {
                if (game.cableDeleteMode) {
                    e.stopPropagation();
                    window.Game.deleteCable(c.from, c.to);
                }
            };

            group.appendChild(line);
            group.appendChild(inner);
            svg.appendChild(group);

            cached = { group, line, inner };
            cableCache.set(key, cached);
        }

        // Update positions
        const n1 = game.nodes.get(c.from);
        const n2 = game.nodes.get(c.to);
        
        if (n1 && n2) {
            const x1 = n1.x + 170, y1 = n1.y + 35;
            const x2 = n2.x, y2 = n2.y + 35;
            const d = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
            
            if (cached.lastD !== d) {
                cached.line.setAttribute("d", d);
                cached.inner.setAttribute("d", d);
                cached.lastD = d;
            }

            // Update classes
            const destDef = NODE_DEFS[n2.type];
            let typeClass = '';
            if (destDef.type === 'upload') typeClass = 'money';
            else if (destDef.type === 'lab') typeClass = 'power';
            else if (destDef.type === 'coding') typeClass = 'code';
            
            // Manage class list efficiently
            const isActive = activeNodes.has(c.from) && activeNodes.has(c.to);
            if (cached.lastActive !== isActive) {
                cached.group.classList.toggle('active', isActive);
                cached.lastActive = isActive;
            }
            if (cached.lastType !== typeClass) {
                if (cached.lastType) cached.group.classList.remove(cached.lastType);
                if (typeClass) cached.group.classList.add(typeClass);
                cached.lastType = typeClass;
            }
            
            // Handle delete mode style
            const pointerEvents = game.cableDeleteMode ? 'all' : 'none';
            if (cached.lastPE !== pointerEvents) {
                cached.group.style.pointerEvents = pointerEvents;
                cached.line.style.pointerEvents = game.cableDeleteMode ? 'stroke' : 'none';
                cached.group.style.cursor = game.cableDeleteMode ? 'crosshair' : 'default';
                cached.lastPE = pointerEvents;
            }
        }
    });

    // Cleanup removed cables
    for (const [key, cached] of cableCache) {
        if (!currentKeys.has(key)) {
            cached.group.remove();
            cableCache.delete(key);
        }
    }
}
// Advanced Stats & Sidebar
export function updateStatsUI() {
    // Header Stats
    document.getElementById('moneyDisplay').innerText = '$' + formatNumber(game.money);
    document.getElementById('rpDisplay').innerText = formatNumber(game.rp) + ' RP';
    const codeEl = document.getElementById('codeDisplay');
    if(codeEl) codeEl.innerText = Math.floor(game.codeBits);

    // Resource Bars
    ['Files', 'Images', 'Videos'].forEach(k => {
        const val = game.res[k.toLowerCase()];
        const txt = document.getElementById(`txt${k}`);
        const bar = document.getElementById(`bar${k}`);
        if(txt) txt.innerText = formatNumber(val);
        if(bar) bar.style.width = Math.min(100, (val / 1000) * 100) + '%';
    });

    // Heat Bar
    const heatBar = document.getElementById('heatBar');
    if (heatBar) {
        heatBar.style.width = Math.min(100, game.routerHeat) + '%';
        const heatText = document.getElementById('heatText');
        if(heatText) heatText.innerText = Math.floor(game.routerHeat) + '°C';

        if (game.overheatMode) {
            heatBar.style.backgroundColor = '#ef4444';
            if(heatText) heatText.style.color = '#ef4444';
        } else {
            heatBar.style.backgroundColor = '#10b981';
            if(heatText) heatText.style.color = '#a0aec0';
        }
        
        const heatStatus = document.getElementById('heatStatus');
        if(heatStatus) {
            let statusText = game.overheatMode ? 'OVERHEATING' : 'Normal';
            if (game.overclockMult > 1) statusText += ` | OC: ${game.overclockMult.toFixed(1)}x`;
            heatStatus.innerText = 'Status: ' + statusText;
        }
    }

    // Code Sidebar
    const sidebarBits = document.getElementById('sidebarCodeBits');
    const sidebarOpt = document.getElementById('sidebarOptCode');
    if(sidebarBits) sidebarBits.innerText = Math.floor(game.codeBits);
    if(sidebarOpt) sidebarOpt.innerText = game.optimizationCode;
    
    // Update Driver Grid Locks
    const grid = document.getElementById('driverGrid');
    if (grid && grid.children.length > 0) {
        // Efficiently toggle classes without full re-render
        Object.entries(DRIVERS).forEach(([id, driver], index) => {
            const card = grid.children[index];
            const canAfford = game.optimizationCode >= driver.cost;
            if (canAfford) card.classList.remove('locked');
            else if (!game.drivers[id]) card.classList.add('locked'); // Only lock if not installed
        });
    }
    
    // Modal RP
    const modalRp = document.getElementById('modalRpDisplay');
    if(modalRp) modalRp.innerText = formatNumber(game.rp);
    
    // Cost display for router
    updateRouterCostDisplay();
    
    // Contract Widget
    const cw = document.getElementById('activeContractWidget');
    if (cw) {
        if (game.activeContract) {
            cw.style.display = 'block';
            cw.querySelector('#contractDesc').innerText = game.activeContract.desc || 'Uploading...';
            cw.querySelector('#contractTimer').innerText = Math.floor(game.activeContract.time) + 's';
            const pct = Math.min(100, (game.activeContract.current / game.activeContract.target) * 100);
            cw.querySelector('#contractBar').style.width = pct + '%';
        } else {
            cw.style.display = 'none';
        }
    }
    
    // Event Widget
    const ew = document.getElementById('activeEventWidget');
    if (ew) {
        if (game.activeEvent) {
            ew.style.display = 'block';
            ew.querySelector('#eventName').innerText = game.activeEvent.name;
            ew.querySelector('#eventDesc').innerText = game.activeEvent.desc;
            ew.querySelector('#eventTimer').innerText = Math.floor(game.eventTimeLeft) + 's';
            ew.style.borderColor = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
            ew.querySelector('#eventName').style.color = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
        } else {
            ew.style.display = 'none';
        }
    }
}

export function updateRateUI(moneyRate, rpRate) {
    const mRate = document.getElementById('moneyRate');
    const rRate = document.getElementById('rpRate');
    if (mRate) mRate.innerText = `+$${formatNumber(moneyRate)}/s`;
    if (rRate) rRate.innerText = `+${formatNumber(rpRate)}/s`;
}

function updateRouterCostDisplay() {
    const costEl = document.getElementById('routerCostValue');
    if (!costEl) return;
    
    let routerLevel = 1;
    for (const [id, n] of game.nodes) { if (n.type === 'router') { routerLevel = n.level; break; } }
    
    const cost = Math.floor(500 * Math.pow(1.5, routerLevel));
    costEl.innerText = '$' + formatNumber(cost);
    costEl.className = game.money >= cost ? 'cost-value affordable' : 'cost-value expensive';
    document.getElementById('routerLvl').innerText = 'LVL ' + routerLevel;
}

// Render Driver Grid (Code Studio)
function renderDriverGrid() {
    const grid = document.getElementById('driverGrid');
    if (!grid) return;

    grid.innerHTML = Object.entries(DRIVERS).map(([id, driver]) => {
        const level = game.drivers[id] || 0;
        const canAfford = game.optimizationCode >= driver.cost;
        return `
            <div class="driver-card ${level > 0 ? 'installed' : ''} ${!canAfford ? 'locked' : ''}" onclick="window.installDriver('${id}')">
                <div class="driver-icon"><i class="${driver.icon}"></i></div>
                <div class="driver-name">${driver.name}</div>
                <div class="driver-desc">${driver.desc}</div>
                <div class="driver-cost">Cost: ${driver.cost} Opt Code</div>
                ${level > 0 ? `<div class="driver-level">Level ${level}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Render Research Tree
function renderResearchTree() {
    const grid = document.getElementById('researchTreeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
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
                const prerequisitesMet = !tech.requires || tech.requires.every(r => game.unlocked.includes(r));
                const isAvailable = !owned && canAfford && prerequisitesMet;
                
                const card = document.createElement('div');
                card.className = `tech-card ${owned ? 'owned' : ''} ${!prerequisitesMet ? 'locked' : ''} ${isAvailable ? 'available' : ''}`;
                card.id = `tech-${tech.id}`;
                
                // Add onclick logic directly
                card.onclick = () => {
                    if (!owned && prerequisitesMet && game.rp >= tech.cost) {
                        // Import unlock function dynamically to avoid circular dependency issues at runtime
                        import('./game.js').then(m => {
                            if(m.unlockTech(tech.id)) {
                                renderResearchTree(); // Re-render on success
                                drawResearchLines(); // Redraw lines
                                setTab('infra'); // Refresh shop
                            }
                        });
                    }
                };
                
                const costClass = canAfford ? 'affordable' : '';
                
                card.innerHTML = `
                    <div class="tech-icon"><i class="${tech.icon}"></i></div>
                    <div class="tech-name">${tech.name}</div>
                    <div class="tech-desc">${tech.desc}</div>
                    ${!owned ? `<div class="tech-cost ${costClass}"><i class="fa-solid fa-flask"></i> ${formatNumber(tech.cost)} RP</div>` : '<div class="tech-cost"><i class="fa-solid fa-check"></i> Owned</div>'}
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
    if (!svg) return;
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

// Render Achievements
function renderAchievements() {
    const list = document.getElementById('achievementsList');
    if (!list) return;

    list.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = game.achievements.includes(ach.id);
        return `
            <div class="help-item" style="opacity:${unlocked ? 1 : 0.5}">
                <div class="help-item-title" style="color:${unlocked ? '#fbbf24' : '#64748b'}">
                    <i class="${ach.icon}"></i> ${ach.name}
                </div>
                <div class="help-item-desc">${ach.desc}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('achievementCount').innerText = game.achievements.length;
    document.getElementById('achievementTotal').innerText = ACHIEVEMENTS.length;
}

export function updatePrestigeUI() {
    const currentBonus = game.prestige * 50;
    const nextBonus = (game.prestige + 1) * 50;
    const currEl = document.getElementById('currentPrestigeBonus');
    const nextEl = document.getElementById('nextPrestigeBonus');
    
    if (currEl) currEl.innerText = `+${currentBonus}%`;
    if (nextEl) nextEl.innerText = `+${nextBonus}%`;
    
    const nodeCount = game.nodes.size;
    const moneyReq = 50000;
    const canPrestige = nodeCount >= 20 && game.money >= moneyReq;
    
    const reqText = document.getElementById('prestigeRequirements');
    if (reqText) {
        reqText.innerHTML = `
            <span style="color: ${nodeCount >= 20 ? '#10b981' : '#ef4444'}">${nodeCount}/20 nodes</span> | 
            <span style="color: ${game.money >= moneyReq ? '#10b981' : '#ef4444'}">$${formatNumber(game.money)}/$50,000</span>
        `;
    }
    
    const btn = document.getElementById('prestigeBtn');
    if (btn) {
        btn.disabled = !canPrestige;
        btn.style.opacity = canPrestige ? 1 : 0.5;
    }
    
    // Sidebar display
    const bonusDisplay = document.getElementById('prestigeBonusDisplay');
    if (bonusDisplay) bonusDisplay.innerText = `Data Center Bonus: +${currentBonus}%`;
}

export function renderStatistics() {
    document.getElementById('statTotalMoney').innerText = '$' + formatNumber(game.stats.totalMoney);
    document.getElementById('statPeakMoney').innerText = '$' + formatNumber(game.stats.peakMoney);
    document.getElementById('statMoneySpent').innerText = '$' + formatNumber(game.stats.moneySpent);
    document.getElementById('statContracts').innerText = game.stats.contractsCompleted;
    document.getElementById('statNodesCreated').innerText = game.stats.nodesCreated;
    document.getElementById('statNodesDeleted').innerText = game.stats.nodesDeleted;
    document.getElementById('statCablesPlaced').innerText = game.stats.cablesPlaced;
    document.getElementById('statUpgrades').innerText = game.stats.upgrades;
    document.getElementById('statFilesDownloaded').innerText = formatNumber(Math.floor(game.stats.filesDownloaded));
    document.getElementById('statTotalRP').innerText = formatNumber(Math.floor(game.stats.totalRP)) + ' RP';
    document.getElementById('statViruses').innerText = game.stats.virusesCleaned;
    
    const hours = Math.floor(game.stats.playTime / 3600);
    const mins = Math.floor((game.stats.playTime % 3600) / 60);
    document.getElementById('statPlayTime').innerText = `${hours}h ${mins}m`;
}

export function updateDailyRewardsUI() {
    const grid = document.getElementById('dailyRewardsGrid');
    if (!grid) return;
    
    const currentStreak = game.loginStreak || 1;
    const claimed = game.dailyRewardClaimed;
    
    const streakEl = document.getElementById('streakDisplay');
    if (streakEl) streakEl.innerText = currentStreak;
    
    const claimBtn = document.getElementById('claimDailyBtn');
    const statusText = document.getElementById('dailyRewardStatus');
    
    if (claimBtn && statusText) {
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
                <div style="font-size: 11px; color: #fbbf24; font-weight: bold;">$${formatNumber(reward.money)}</div>
            </div>
        `;
    }).join('');
}

// Network Analysis
export function showNetworkAnalysis() {
    // Import dynamically to avoid circular dependency if needed, or rely on game.js export
    import('./game.js').then(module => {
        const analysis = module.analyzeNetwork();
        console.log('%c Network Analysis ', 'background: #3b82f6; color: white; font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 4px;');
        console.log('Efficiency Score:', analysis.efficiency + '%');
        console.log('Active Nodes:', analysis.stats.totalNodes);
        console.log('Issues:', analysis.issues.length > 0 ? analysis.issues : 'None');
        console.log('Suggestions:', analysis.suggestions.length > 0 ? analysis.suggestions : 'Network is optimal!');
        
        // Could also show a float notification here
        if (analysis.issues.length > 0) {
            showFloat(`Network Efficiency: ${analysis.efficiency}%`, window.innerWidth/2, window.innerHeight/2, '#f59e0b');
        } else {
            showFloat(`Network Optimal!`, window.innerWidth/2, window.innerHeight/2, '#10b981');
        }
    });
}

// Particle Effects
export function spawnParticles(x, y, color, count = 5) {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
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
        container.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

export function showFloat(txt, x, y, col) {
    const el = document.createElement('div');
    el.className = 'floating-text'; 
    el.innerText = txt;
    el.style.left = x + 'px'; 
    el.style.top = y + 'px'; 
    el.style.color = col;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

export function showEventNotification(event) {
    const notif = document.getElementById('eventNotification');
    if (!notif) return;
    
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

// Contracts
export function openContracts() {
    const list = document.getElementById('contractList');
    if (!list) return;
    list.innerHTML = '';
    
    const types = [
        { title: "Data Dump", desc: "Upload 50 MB Data", target: 50 * 1024 * 1024, time: 60, rewardM: 5000, rewardR: 500 },
        { title: "Streaming Deal", desc: "Upload 500 MB Data", target: 500 * 1024 * 1024, time: 120, rewardM: 25000, rewardR: 2000 },
        { title: "Corporate Backups", desc: "Upload 1 GB Data", target: 1024 * 1024 * 1024, time: 180, rewardM: 100000, rewardR: 5000 }
    ];
    
    types.forEach(c => {
        const el = document.createElement('div');
        el.className = 'contract-item';
        // Escape quotes for the JSON string in onclick
        const jsonStr = JSON.stringify(c).replace(/"/g, '&quot;');
        
        el.innerHTML = `
            <div>
                <h4>${c.title}</h4>
                <p>${c.desc} | Time: ${c.time}s</p>
            </div>
            <div class="contract-reward">
                +$${formatNumber(c.rewardM)}<br>+${formatNumber(c.rewardR)} RP
                <button class="btn btn-contract" style="margin-top:5px; padding:4px 8px; width:auto;" onclick="window.startContract(${jsonStr})">Accept</button>
            </div>
        `;
        list.appendChild(el);
    });
    
    // Open modal
    const modal = document.getElementById('contractModal');
    if (modal) {
        // Hide others first
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
        modal.style.display = 'flex';
    }
}

// Global exposure for event handlers
window.installDriver = (id) => {
    import('./game.js').then(module => {
        if (module.installDriver(id)) {
            renderDriverGrid();
            updateStatsUI();
        }
    });
};

function formatNumber(n) {
    if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n).toString();
}
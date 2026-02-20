import { game, activeNodes, addNode } from './game.js';
import { NODE_DEFS, DRIVERS, ACHIEVEMENTS } from './data.js';
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
        ${node.infected ? `<div class="clean-btn">CLEAN [-$500]</div>` : ''}
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
                <div class="item-cost">$${def.cost}</div>
                <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
                <div class="item-name">${def.name}</div>
                <div class="item-desc">${def.desc}</div>
            `;
            item.onclick = () => {
                if (game.money >= def.cost) {
                    game.money -= def.cost;
                    const cx = (-game.viewX + window.innerWidth/2) / game.viewScale;
                    const cy = (-game.viewY + window.innerHeight/2) / game.viewScale;
                    addNode(key, cx - 90, cy - 40);
                }
            };
            tray.appendChild(item);
        }
    });
}

function renderCables() {
    const svg = document.getElementById('cables');
    if (!svg) return;
    let html = '';
    game.conns.forEach(c => {
        const n1 = game.nodes.get(c.from);
        const n2 = game.nodes.get(c.to);
        if (!n1 || !n2) return;
        
        const x1 = n1.x + 170, y1 = n1.y + 35, x2 = n2.x, y2 = n2.y + 35;
        const d = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
        
        // Add classes for cable types based on destination
        let typeClass = '';
        const destDef = NODE_DEFS[n2.type];
        if (destDef.type === 'upload') typeClass = 'money';
        if (destDef.type === 'lab') typeClass = 'power';
        if (destDef.type === 'coding') typeClass = 'code';

        html += `<g class="cable-group ${activeNodes.has(c.from) && activeNodes.has(c.to) ? 'active' : ''} ${typeClass}">
            <path d="${d}" class="cable" /><path d="${d}" class="cable-inner" />
        </g>`;
    });
    if (svg.innerHTML !== html) svg.innerHTML = html;
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
        
        // Color logic
        if (game.overheatMode) {
            heatBar.style.backgroundColor = '#ef4444';
            if(heatText) heatText.style.color = '#ef4444';
        } else {
            heatBar.style.backgroundColor = '#10b981';
            if(heatText) heatText.style.color = '#a0aec0';
        }
    }
    
    // Code Sidebar
    const sidebarBits = document.getElementById('sidebarCodeBits');
    const sidebarOpt = document.getElementById('sidebarOptCode');
    if(sidebarBits) sidebarBits.innerText = Math.floor(game.codeBits);
    if(sidebarOpt) sidebarOpt.innerText = game.optimizationCode;
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
}

// Expose driver install globally so onclick works
window.installDriver = (id) => {
    // Logic handles in game.js, but trigger here
    import('./game.js').then(module => module.installDriver(id));
};

function formatNumber(n) {
    if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n).toString();
}

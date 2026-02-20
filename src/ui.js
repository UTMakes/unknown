
import { game, activeNodes } from './game.js';
import { NODE_DEFS } from './data.js';
import { bindNodeEvents } from './inputs.js';

const nodeElements = new Map();

export function initUI() {
    game.viewX = window.innerWidth / 2 - 2500;
    game.viewY = window.innerHeight / 2 - 2500;
    game.viewScale = 1;
    updateWorldTransform(game.viewX, game.viewY, game.viewScale);
    setTab('infra');
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
    }

    for (const [id, el] of nodeElements) {
        if (!currentIds.has(id)) { el.remove(); nodeElements.delete(id); }
    }
    renderCables();
}

function createNodeElement(node) {
    const def = NODE_DEFS[node.type];
    const el = document.createElement('div');
    el.className = `node`;
    el.id = `node-${node.id}`;
    el.innerHTML = `
        <div class="port in"></div><div class="port out"></div>
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
            item.innerHTML = `
                <div class="item-cost">$${def.cost}</div>
                <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
                <div class="item-name">${def.name}</div>
            `;
            item.onclick = () => { /* buying logic */ };
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
        html += `<g class="cable-group ${activeNodes.has(c.from) && activeNodes.has(c.to) ? 'active' : ''}">
            <path d="${d}" class="cable" /><path d="${d}" class="cable-inner" />
        </g>`;
    });
    if (svg.innerHTML !== html) svg.innerHTML = html;
}

export function updateStatsUI() {
    document.getElementById('moneyDisplay').innerText = '$' + formatNumber(game.money);
    document.getElementById('rpDisplay').innerText = formatNumber(game.rp) + ' RP';
    
    // Resource Bars
    ['Files', 'Images', 'Videos'].forEach(k => {
        const val = game.res[k.toLowerCase()];
        document.getElementById(`txt${k}`).innerText = formatNumber(val);
        document.getElementById(`bar${k}`).style.width = Math.min(100, (val / 1000) * 100) + '%';
    });

    // Heat Bar
    const heatBar = document.getElementById('heatBar');
    if (heatBar) {
        heatBar.style.width = game.routerHeat + '%';
        document.getElementById('heatText').innerText = Math.floor(game.routerHeat) + '°C';
    }
}

function formatNumber(n) {
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n).toString();
}

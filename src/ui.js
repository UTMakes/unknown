
// UI & Rendering System
import { game, activeNodes, neighbors } from './game.js';
import { NODE_DEFS } from './data.js';

let view = { x: 0, y: 0, scale: 1 };
const canvas = document.createElement('canvas'); // Replacing heavy SVG/DOM with Canvas? Or optimizing DOM.
// For this step, we'll stick to optimized DOM to match existing style but cleaner.

const nodesContainer = document.getElementById('nodes'); // Will be injected
const cablesSvg = document.getElementById('cables');

// Cache for DOM elements to avoid re-querying
const nodeElements = new Map();
const cableElements = new Map();

export function initUI() {
    view.x = window.innerWidth / 2 - 2500;
    view.y = window.innerHeight / 2 - 2500;
    updateWorldTransform();
}

export function updateWorldTransform() {
    const world = document.getElementById('world');
    if (world) {
        world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    }
}

// Reconciliation Render - Only touch DOM if changed
export function renderWorld() {
    const nodesDiv = document.getElementById('nodes');
    if (!nodesDiv) return;

    // 1. Sync Nodes
    const currentIds = new Set();
    
    for (const [id, node] of game.nodes) {
        currentIds.add(id);
        let el = nodeElements.get(id);
        
        if (!el) {
            // Create new node element
            el = createNodeElement(node);
            nodesDiv.appendChild(el);
            nodeElements.set(id, el);
        }
        
        // Update Position (if changed - optimization: store last rendered pos)
        el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        
        // Update Status Classes
        const isActive = activeNodes.has(id);
        if (el.classList.contains('disconnected') === isActive) {
            el.classList.toggle('disconnected', !isActive);
        }
        
        if (node.infected && !el.classList.contains('infected')) el.classList.add('infected');
        if (!node.infected && el.classList.contains('infected')) el.classList.remove('infected');
    }
    
    // Remove deleted nodes
    for (const [id, el] of nodeElements) {
        if (!currentIds.has(id)) {
            el.remove();
            nodeElements.delete(id);
        }
    }
    
    // 2. Sync Cables
    renderCables();
}

function createNodeElement(node) {
    const def = NODE_DEFS[node.type];
    const el = document.createElement('div');
    el.className = `node ${activeNodes.has(node.id) ? '' : 'disconnected'}`;
    el.id = `node-${node.id}`;
    // Use transform for hardware acceleration instead of top/left
    el.style.transform = `translate(${node.x}px, ${node.y}px)`;
    
    el.innerHTML = `
        <div class="port in"></div>
        <div class="port out"></div>
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

function renderCables() {
    const svg = document.getElementById('cables');
    if (!svg) return;
    
    // Simple full re-render for cables mostly fine unless huge count, 
    // but better to reconcile if possible. For now, we clear/redraw optimization.
    // Optimization: Only redraw if cable count changed or nodes moved.
    
    // For exact parity with request, we'll implement a cache key check later.
    // Here is the optimized draw:
    
    let html = '';
    game.conns.forEach(c => {
        const n1 = game.nodes.get(c.from);
        const n2 = game.nodes.get(c.to);
        if (!n1 || !n2) return;
        
        const x1 = n1.x + 170;
        const y1 = n1.y + 35;
        const x2 = n2.x;
        const y2 = n2.y + 35;
        
        const d = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
        const active = activeNodes.has(c.from) && activeNodes.has(c.to);
        
        html += `<g class="cable-group ${active ? 'active' : ''}">
            <path d="${d}" class="cable" />
            <path d="${d}" class="cable-inner" />
        </g>`;
    });
    
    // innerHTML is faster than massive DOM API calls for 100+ cables
    if (svg.innerHTML !== html) svg.innerHTML = html; 
}

// UI Update Loop (30 FPS is enough for text)
export function updateStatsUI() {
    const moneyEl = document.getElementById('moneyDisplay');
    if (moneyEl) moneyEl.innerText = '$' + formatNumber(game.money);
    
    const rpEl = document.getElementById('rpDisplay');
    if (rpEl) rpEl.innerText = formatNumber(game.rp) + ' RP';
}

function formatNumber(n) {
    if (n >= 1e300) return 'Infinite';
    if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.floor(n).toString();
}

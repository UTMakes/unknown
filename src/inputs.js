import { game, addConnection, removeNode, toggleCableDeleteMode } from './game.js';
import { updateWorldTransform } from './ui.js';

let drag = { active: false, node: null, startX: 0, startY: 0, offX: 0, offY: 0 };
let portDrag = { active: false, srcId: null };

export function setupInputs(viewport) {
    viewport.onmousedown = (e) => {
        if (e.target.closest('.node')) return;
        drag.active = true;
        drag.startX = e.clientX; drag.startY = e.clientY;
        drag.offX = game.viewX || 0; drag.offY = game.viewY || 0;
        document.getElementById('contextMenu').style.display = 'none';
    };

    window.onmousemove = (e) => {
        if (drag.active) {
            game.viewX = drag.offX + (e.clientX - drag.startX);
            game.viewY = drag.offY + (e.clientY - drag.startY);
            updateWorldTransform(game.viewX, game.viewY, game.viewScale);
        }
        if (drag.node) {
            const z = game.viewScale || 1;
            drag.node.x = drag.node.ix + (e.clientX - drag.sx) / z;
            drag.node.y = drag.node.iy + (e.clientY - drag.sy) / z;
        }
    };

    window.onmouseup = (e) => {
        drag.active = false;
        drag.node = null;
        portDrag.active = false;
    };

    viewport.onwheel = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        game.viewScale = Math.max(0.3, Math.min(2, (game.viewScale || 1) * zoomFactor));
        updateWorldTransform(game.viewX, game.viewY, game.viewScale);
    };
    
    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        if (e.key === '+' || e.key === '=') window.Game.zoomIn();
        else if (e.key === '-' || e.key === '_') window.Game.zoomOut();
        else if (e.key === '0') window.Game.resetZoom();
        else if (e.key === 'x' || e.key === 'X') window.Game.toggleCableDeleteMode();
        else if (e.key === '?' || e.key === '/') window.openModal('helpModal');
        else if (e.key === 'r' || e.key === 'R') window.openModal('researchModal');
        else if (e.key === 'c' || e.key === 'C') window.openModal('codeModal');
        else if (e.key === 'a' || e.key === 'A') window.openModal('achievementsModal');
        else if (e.key === 's' || e.key === 'S') window.openModal('statsModal');
        else if (e.key === 'p' || e.key === 'P') window.openModal('prestigeModal');
        else if (e.key === 'l' || e.key === 'L') window.openModal('accountModal');
        else if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
            document.getElementById('contextMenu').style.display = 'none';
        }
    });
}

export function bindNodeEvents(el, node) {
    el.onmousedown = (e) => {
        if (e.button === 2) { // Right Click
            e.preventDefault();
            showContextMenu(node, e);
            return;
        }
        if (e.target.classList.contains('port')) {
            portDrag.active = true;
            portDrag.srcId = node.id;
            e.stopPropagation();
            return;
        }
        drag.node = node;
        drag.sx = e.clientX; drag.sy = e.clientY;
        drag.node.ix = node.x; drag.node.iy = node.y;
    };

    el.onmouseup = (e) => {
        if (portDrag.active && portDrag.srcId !== node.id) {
            addConnection(portDrag.srcId, node.id);
        }
    };
}

function showContextMenu(node, e) {
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    // Bind actions to this specific node
    window.selectedNodeId = node.id;
    
    // Update cost display in context menu
    const ctxCost = document.getElementById('ctxCost');
    if (ctxCost) {
       // Placeholder for cost update
    }
}

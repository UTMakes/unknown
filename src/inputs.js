import { game, addConnection, removeNode } from './game.js';
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
}

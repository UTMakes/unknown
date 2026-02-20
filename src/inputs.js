
import { game, addConnection, removeConnection, addNode, removeNode } from './game.js';
import { updateWorldTransform } from './ui.js';

let drag = { active: false, node: null, startX: 0, startY: 0, offX: 0, offY: 0 };
let view = { x: 0, y: 0, scale: 1 }; // Internal state for inputs

export function setupInputs(viewport, world, scaleRef) {
    // Panning
    viewport.onmousedown = (e) => {
        if (e.target.closest('.node')) return;
        drag.active = true;
        drag.startX = e.clientX; drag.startY = e.clientY;
        drag.offX = game.viewX || 0; drag.offY = game.viewY || 0;
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

    window.onmouseup = () => {
        drag.active = false;
        drag.node = null;
    };

    // Zooming
    viewport.onwheel = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        game.viewScale = Math.max(0.3, Math.min(2, (game.viewScale || 1) * zoomFactor));
        updateWorldTransform(game.viewX, game.viewY, game.viewScale);
    };
}

export function bindNodeEvents(el, node) {
    el.onmousedown = (e) => {
        if (e.target.classList.contains('port')) return;
        drag.node = node;
        drag.sx = e.clientX; drag.sy = e.clientY;
        drag.node.ix = node.x; drag.node.iy = node.y;
    };
}

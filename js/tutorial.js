// ==================== TUTORIAL SYSTEM ====================
// Task 17: Interactive step-by-step tutorial for new players

const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Upload Labs!',
        message: "Let's build your first network together. This tutorial will walk you through the basics — it only takes a minute!",
        target: null,
        position: 'center',
        action: 'click_next',
        icon: 'fa-solid fa-rocket'
    },
    {
        id: 'router_intro',
        title: 'Your Network Router',
        message: "This is your <strong>Router</strong> — the core of your entire network. Every node must be connected to it to function. Click on the router to select it.",
        target: () => {
            const routerNode = game.nodes.find(n => n.type === 'router');
            return routerNode ? document.getElementById(`node-${routerNode.id}`) : null;
        },
        position: 'right',
        action: 'click_target',
        icon: 'fa-solid fa-globe'
    },
    {
        id: 'toolbar_intro',
        title: 'The Node Toolbar',
        message: "Down here is your <strong>toolbar</strong> — it has 5 tabs of different nodes you can buy. Let's start by switching to the <strong>Download</strong> tab.",
        target: () => document.querySelector('.tab[data-tab="download"]'),
        position: 'top',
        action: 'tab_changed',
        actionValue: 'download',
        icon: 'fa-solid fa-toolbox'
    },
    {
        id: 'buy_downloader',
        title: 'Buy a File Downloader',
        message: "Click the <strong>File Downloader</strong> in the tray below to buy one. Downloaders collect data files that you can sell for money!",
        target: () => document.querySelector('.shop-item'),
        position: 'top',
        action: 'node_created',
        actionValue: 'dl_file',
        icon: 'fa-solid fa-file-code'
    },
    {
        id: 'connect_downloader',
        title: 'Connect with a Cable',
        message: "Now <strong>drag</strong> from one node's <span style='color:#10b981'>green port</span> (right side) to another's <span style='color:#3b82f6'>blue port</span> (left side) to connect them. Cables cost $10 each. Nodes must be connected to your Router to work!",
        target: null,
        position: 'center',
        action: 'cable_created',
        icon: 'fa-solid fa-plug'
    },
    {
        id: 'upload_tab',
        title: 'Time to Sell Data!',
        message: "Your downloader is collecting files. Now let's sell them! Switch to the <strong>Upload & Security</strong> tab.",
        target: () => document.querySelector('.tab[data-tab="upload"]'),
        position: 'top',
        action: 'tab_changed',
        actionValue: 'upload',
        icon: 'fa-solid fa-cloud-arrow-up'
    },
    {
        id: 'buy_uploader',
        title: 'Buy an Uploader',
        message: "Click an <strong>Uploader</strong> to buy one. Uploaders sell your downloaded data for <strong style='color:#fbbf24'>money</strong>!",
        target: () => document.querySelector('.shop-item'),
        position: 'top',
        action: 'node_created',
        actionValue: 'uploader',
        icon: 'fa-solid fa-cloud-arrow-up'
    },
    {
        id: 'connect_uploader',
        title: 'Connect the Uploader',
        message: "Connect your new Uploader to the Router with a cable. Once connected, watch the <strong style='color:#fbbf24'>money</strong> start flowing in!",
        target: null,
        position: 'center',
        action: 'cable_created',
        icon: 'fa-solid fa-link'
    },
    {
        id: 'research_intro',
        title: 'Research & Development',
        message: "Earning <strong style='color:#a78bfa'>Research Points (RP)</strong> lets you unlock new node types. Click the <strong>Research</strong> button in the sidebar to explore the tech tree!",
        target: () => document.querySelector('.btn-research'),
        position: 'right',
        action: 'click_target',
        icon: 'fa-solid fa-flask'
    },
    {
        id: 'complete',
        title: 'You\'re Ready!',
        message: "That's the basics! Here are some tips:\n\u2022 <strong>Labs</strong> convert files to Research Points\n\u2022 <strong>Firewalls</strong> protect from viruses\n\u2022 <strong>Coder Nodes</strong> generate code for Drivers\n\u2022 <strong>Right-click</strong> nodes to upgrade or delete them\n\u2022 Press <strong>?</strong> anytime for the full help guide\n\nGo build your data empire! \uD83D\uDE80",
        target: null,
        position: 'center',
        action: 'click_next',
        icon: 'fa-solid fa-graduation-cap'
    }
];

class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.highlight = null;
        this.boundHandlers = {};
    }

    start() {
        if (typeof game === 'undefined' || game.tutorialCompleted) return;
        
        // Wait for welcome modal to be dismissed
        this._waitForWelcomeClose(() => {
            this.currentStep = game.tutorialStep || 0;
            this.isActive = true;
            this._createDOM();
            this._showStep();
        });
    }

    _waitForWelcomeClose(callback) {
        const welcomeModal = document.getElementById('welcomeModal');
        if (!welcomeModal || welcomeModal.style.display === 'none') {
            // Small delay to let the game settle after welcome close
            setTimeout(callback, 500);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            if (welcomeModal.style.display === 'none') {
                observer.disconnect();
                setTimeout(callback, 500);
            }
        });
        observer.observe(welcomeModal, { attributes: true, attributeFilter: ['style'] });
    }

    _createDOM() {
        // Remove existing DOM if present
        this._removeDOM();

        // Overlay (dims background)
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.id = 'tutorialOverlay';

        // Highlight ring
        this.highlight = document.createElement('div');
        this.highlight.className = 'tutorial-highlight';
        this.highlight.id = 'tutorialHighlight';

        // Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        this.tooltip.id = 'tutorialTooltip';

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.highlight);
        document.body.appendChild(this.tooltip);
    }

    _removeDOM() {
        ['tutorialOverlay', 'tutorialHighlight', 'tutorialTooltip'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    _showStep() {
        if (!this.isActive || this.currentStep >= TUTORIAL_STEPS.length) {
            this.complete();
            return;
        }

        const step = TUTORIAL_STEPS[this.currentStep];
        const totalSteps = TUTORIAL_STEPS.length;

        // Build progress dots
        let progressDots = '';
        for (let i = 0; i < totalSteps; i++) {
            progressDots += `<div class="tutorial-dot ${i < this.currentStep ? 'done' : ''} ${i === this.currentStep ? 'active' : ''}"></div>`;
        }

        // Build tooltip HTML
        const showNext = step.action === 'click_next';
        const isLast = step.id === 'complete';
        const messageHtml = step.message.replace(/\n/g, '<br>');

        this.tooltip.innerHTML = `
            <div class="tutorial-tooltip-header">
                <div class="tutorial-tooltip-title">
                    <i class="${step.icon}"></i> ${step.title}
                </div>
                <div class="tutorial-step-count">${this.currentStep + 1}/${totalSteps}</div>
            </div>
            <div class="tutorial-tooltip-body">${messageHtml}</div>
            <div class="tutorial-tooltip-footer">
                <div class="tutorial-progress">${progressDots}</div>
                <div class="tutorial-tooltip-actions">
                    <button class="tutorial-btn tutorial-btn-skip" id="tutorialSkipBtn">${isLast ? '' : 'Skip Tutorial'}</button>
                    ${showNext ? `<button class="tutorial-btn tutorial-btn-next" id="tutorialNextBtn">${isLast ? "Let's Go!" : 'Next'}</button>` : ''}
                </div>
            </div>
        `;

        // Position tooltip and highlight
        this._positionElements(step);

        // Attach action listeners
        this._attachListeners(step);

        // Show overlay (allow clicks through to highlighted target)
        this.overlay.style.display = 'block';
        this.tooltip.style.display = 'block';

        // Animate in
        requestAnimationFrame(() => {
            this.tooltip.classList.add('show');
        });

        // Save progress
        if (typeof game !== 'undefined') {
            game.tutorialStep = this.currentStep;
        }
    }

    _positionElements(step) {
        const targetEl = typeof step.target === 'function' ? step.target() : null;

        // Always ensure tooltip captures its own clicks
        this.tooltip.style.pointerEvents = 'auto';

        if (targetEl && step.position !== 'center') {
            // Show highlight around target
            const rect = targetEl.getBoundingClientRect();
            const padding = 8;

            this.highlight.style.display = 'block';
            this.highlight.style.left = (rect.left - padding) + 'px';
            this.highlight.style.top = (rect.top - padding) + 'px';
            this.highlight.style.width = (rect.width + padding * 2) + 'px';
            this.highlight.style.height = (rect.height + padding * 2) + 'px';

            // Position tooltip relative to target
            this.tooltip.classList.remove('pos-center', 'pos-top', 'pos-right', 'pos-bottom', 'pos-left');
            this.tooltip.classList.add(`pos-${step.position}`);
            // Clear any leftover inline transform from center positioning
            this.tooltip.style.transform = 'none';

            // Calculate tooltip position
            requestAnimationFrame(() => {
                const tooltipRect = this.tooltip.getBoundingClientRect();
                const margin = 20;
                let tx, ty;

                switch (step.position) {
                    case 'top':
                        tx = rect.left + rect.width / 2 - tooltipRect.width / 2;
                        ty = rect.top - tooltipRect.height - margin;
                        // Fallback: if off top, put below
                        if (ty < 10) ty = rect.bottom + margin;
                        break;
                    case 'bottom':
                        tx = rect.left + rect.width / 2 - tooltipRect.width / 2;
                        ty = rect.bottom + margin;
                        // Fallback: if off bottom, put above
                        if (ty + tooltipRect.height > window.innerHeight - 10) ty = rect.top - tooltipRect.height - margin;
                        break;
                    case 'left':
                        tx = rect.left - tooltipRect.width - margin;
                        ty = rect.top + rect.height / 2 - tooltipRect.height / 2;
                        // Fallback: if off left, put right
                        if (tx < 10) tx = rect.right + margin;
                        break;
                    case 'right':
                        tx = rect.right + margin;
                        ty = rect.top + rect.height / 2 - tooltipRect.height / 2;
                        // Fallback: if off right, put left; if still off, center on screen
                        if (tx + tooltipRect.width > window.innerWidth - 10) {
                            tx = rect.left - tooltipRect.width - margin;
                            if (tx < 10) tx = (window.innerWidth - tooltipRect.width) / 2;
                        }
                        break;
                }

                // Final clamp to viewport
                tx = Math.max(10, Math.min(window.innerWidth - tooltipRect.width - 10, tx));
                ty = Math.max(10, Math.min(window.innerHeight - tooltipRect.height - 10, ty));

                this.tooltip.style.left = tx + 'px';
                this.tooltip.style.top = ty + 'px';
            });

            // KEY FIX: Let clicks pass through the overlay to reach game elements
            this.overlay.style.pointerEvents = 'none';
            this.overlay.onclick = null;
            this.highlight.style.pointerEvents = 'none';

        } else {
            // Center tooltip, no highlight — block game interaction
            this.highlight.style.display = 'none';
            this.tooltip.classList.remove('pos-top', 'pos-right', 'pos-bottom', 'pos-left');
            this.tooltip.classList.add('pos-center');
            this.tooltip.style.left = '50%';
            this.tooltip.style.top = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';

            // For cable steps (center + cable_created), let clicks through so user can drag ports
            if (step.action === 'cable_created') {
                this.overlay.style.pointerEvents = 'none';
                this.overlay.onclick = null;
            } else {
                // Block game interaction for pure "Next" steps
                this.overlay.style.pointerEvents = 'auto';
                this.overlay.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                };
            }
        }
    }

    _attachListeners(step) {
        // Clean up previous listeners
        this._cleanupListeners();

        const nextBtn = document.getElementById('tutorialNextBtn');
        const skipBtn = document.getElementById('tutorialSkipBtn');

        if (skipBtn) {
            this.boundHandlers.skip = () => this.skip();
            skipBtn.addEventListener('click', this.boundHandlers.skip);
        }

        switch (step.action) {
            case 'click_next':
                if (nextBtn) {
                    this.boundHandlers.next = () => this.next();
                    nextBtn.addEventListener('click', this.boundHandlers.next);
                }
                break;

            case 'click_target':
                // Listen for click on the target element
                const targetEl = typeof step.target === 'function' ? step.target() : null;
                if (targetEl) {
                    this.boundHandlers.targetClick = (e) => {
                        this.next();
                    };
                    targetEl.addEventListener('mousedown', this.boundHandlers.targetClick);
                    this.boundHandlers._targetEl = targetEl;
                }
                break;

            case 'tab_changed':
                // Listen via the global callback
                window._tutorialOnTabChanged = (tabName) => {
                    if (!step.actionValue || tabName === step.actionValue) {
                        window._tutorialOnTabChanged = null;
                        setTimeout(() => this.next(), 300);
                    }
                };
                break;

            case 'node_created':
                window._tutorialOnNodeCreated = (nodeType) => {
                    if (!step.actionValue || nodeType === step.actionValue) {
                        window._tutorialOnNodeCreated = null;
                        setTimeout(() => this.next(), 300);
                    }
                };
                break;

            case 'cable_created':
                window._tutorialOnCableCreated = () => {
                    window._tutorialOnCableCreated = null;
                    setTimeout(() => this.next(), 300);
                };
                break;
        }
    }

    _cleanupListeners() {
        if (this.boundHandlers._targetEl && this.boundHandlers.targetClick) {
            this.boundHandlers._targetEl.removeEventListener('mousedown', this.boundHandlers.targetClick);
        }
        window._tutorialOnTabChanged = null;
        window._tutorialOnNodeCreated = null;
        window._tutorialOnCableCreated = null;
        this.boundHandlers = {};
    }

    next() {
        if (!this.isActive) return;

        this.tooltip.classList.remove('show');

        setTimeout(() => {
            this.currentStep++;
            this._showStep();
        }, 200);
    }

    skip() {
        if (!this.isActive) return;
        if (confirm('Skip the tutorial? You can restart it anytime from the Help menu.')) {
            this.complete();
        }
    }

    complete() {
        this.isActive = false;
        this._cleanupListeners();

        // Fade out
        if (this.tooltip) this.tooltip.classList.remove('show');

        setTimeout(() => {
            this._removeDOM();
        }, 300);

        if (typeof game !== 'undefined') {
            game.tutorialCompleted = true;
            game.tutorialStep = TUTORIAL_STEPS.length;
        }

        if (typeof logEvent === 'function') {
            logEvent('Tutorial completed! Enjoy the game!', 'good');
        }
        if (typeof showFloat === 'function') {
            showFloat('\uD83C\uDF93 Tutorial Complete!', window.innerWidth / 2, window.innerHeight / 2, '#00d4aa');
        }
    }

    restart() {
        if (typeof game !== 'undefined') {
            game.tutorialCompleted = false;
            game.tutorialStep = 0;
        }
        this.currentStep = 0;
        this.isActive = true;
        this._createDOM();
        this._showStep();
    }
}

// Create global instance
const tutorialManager = new TutorialManager();

window.Tutorial = {
    start: () => tutorialManager.start(),
    skip: () => tutorialManager.skip(),
    restart: () => tutorialManager.restart(),
    next: () => tutorialManager.next()
};

        // RANDOM EVENTS CONFIGURATION
        const RANDOM_EVENTS = [
            // Good Events
            { id: 'market_boom', name: 'Market Boom', desc: 'Data prices are surging!', effectDesc: '2x Money from all Data Sales', type: 'good', duration: 60, effect: () => { eventMultipliers.money = 2; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'research_grant', name: 'Research Grant', desc: 'Government funding boost!', effectDesc: '2x RP from Research Labs', type: 'good', duration: 45, effect: () => { eventMultipliers.rp = 2; }, cleanup: () => { eventMultipliers.rp = 1; } },
            { id: 'code_rush', name: 'Code Rush', desc: 'Developers are inspired!', effectDesc: '3x Code Generation Speed', type: 'good', duration: 30, effect: () => { eventMultipliers.code = 3; }, cleanup: () => { eventMultipliers.code = 1; } },
            { id: 'fiber_upgrade', name: 'Fiber Upgrade', desc: 'ISP upgraded your connection!', effectDesc: '1.5x Global Network Speed', type: 'good', duration: 120, effect: () => { eventMultipliers.speed = 1.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'investment', name: 'Angel Investment', desc: 'An investor believes in you!', effectDesc: 'Instantly gain $5,000', type: 'good', instant: true, effect: (g) => { g.money += 5000; showFloat('+ $5,000 (Investment)', window.innerWidth/2, window.innerHeight/2, '#10b981'); } },
            { id: 'bonus_rp', name: 'Research Breakthrough', desc: 'Sudden insight!', effectDesc: 'Instantly gain 500 RP', type: 'good', instant: true, effect: (g) => { g.rp += 500; showFloat('+ 500 RP (Breakthrough!)', window.innerWidth/2, window.innerHeight/2, '#8b5cf6'); } },
            { id: 'crypto_surge', name: 'Crypto Surge', desc: 'Cryptocurrency values skyrocketing!', effectDesc: '2.5x Money from Crypto Miners', type: 'good', duration: 90, effect: () => { eventMultipliers.money = 2.5; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'open_source', name: 'Open Source Contribution', desc: 'Community code contributions!', effectDesc: 'Instantly gain 500 Code Bits', type: 'good', instant: true, effect: (g) => { g.codeBits = (g.codeBits || 0) + 500; showFloat('+ 500 Code Bits (Open Source)', window.innerWidth/2, window.innerHeight/2, '#00d4aa'); } },
            { id: 'bandwidth_bonus', name: 'Bandwidth Bonus', desc: 'ISP doubled your bandwidth!', effectDesc: '2x Global Network Speed', type: 'good', duration: 60, effect: () => { eventMultipliers.speed = 2; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'tax_refund', name: 'Tax Refund', desc: 'Government tax refund received!', effectDesc: 'Gain 1% of your Total Earnings', type: 'good', instant: true, effect: (g) => { const refund = Math.floor(g.stats.totalMoney * 0.01); g.money += refund; showFloat(`+ $${fmt(refund)} (Tax Refund)`, window.innerWidth/2, window.innerHeight/2, '#10b981'); } },
            
            // Bad Events
            { id: 'market_crash', name: 'Market Crash', desc: 'Data prices are plummeting!', effectDesc: '0.5x Money from all Data Sales', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.5; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'power_outage', name: 'Power Outage', desc: 'Reduced efficiency!', effectDesc: '0.5x Global Network Speed', type: 'bad', duration: 30, effect: () => { eventMultipliers.speed = 0.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'ddos_attack', name: 'DDoS Attack', desc: 'Network under attack!', effectDesc: '0.3x Global Network Speed', type: 'bad', duration: 45, effect: () => { eventMultipliers.speed = 0.3; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'maintenance', name: 'Emergency Maintenance', desc: 'Servers need repairs!', effectDesc: 'Instantly lose $2,000', type: 'bad', instant: true, effect: (g) => { g.money = Math.max(0, g.money - 2000); showFloat('- $2,000 (Maintenance)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
            { id: 'data_breach', name: 'Data Breach', desc: 'Security incident!', effectDesc: 'Instantly lose 200 RP', type: 'bad', instant: true, effect: (g) => { g.rp = Math.max(0, g.rp - 200); showFloat('- 200 RP (Breach)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
            { id: 'hardware_failure', name: 'Hardware Failure', desc: 'A component overheated!', effectDesc: '0.6x Global Network Speed', type: 'bad', duration: 40, effect: () => { eventMultipliers.speed = 0.6; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'isp_throttle', name: 'ISP Throttling', desc: 'Your ISP is throttling bandwidth!', effectDesc: '0.7x Global Network Speed', type: 'bad', duration: 90, effect: () => { eventMultipliers.speed = 0.7; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'crypto_crash', name: 'Crypto Crash', desc: 'Cryptocurrency values plummeting!', effectDesc: '0.4x Money from Crypto Miners', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.4; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'ransomware', name: 'Ransomware Alert', desc: 'Ransomware detected! Pay to recover!', effectDesc: 'Instantly lose 10% of current Money', type: 'bad', instant: true, effect: (g) => { const loss = Math.floor(g.money * 0.1); g.money = Math.max(0, g.money - loss); showFloat(`- $${fmt(loss)} (Ransomware)`, window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
        ];


        // ==================== RANDOM EVENTS SYSTEM ====================
        function triggerRandomEvent() {
            if (game.activeEvent) return;
            if (Math.random() > 0.30) return; // 30% chance when checked (every 10 minutes)
            
            const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            
            if (event.instant) {
                event.effect(game);
                showEventNotification(event);
                logEvent(`Event: ${event.name}`, event.type === 'good' ? 'good' : 'bad');
            } else {
                game.activeEvent = event;
                game.eventTimeLeft = event.duration;
                event.effect();
                showEventNotification(event);
                logEvent(`Event started: ${event.name} (${event.duration}s)`, event.type === 'good' ? 'good' : 'bad');
            }
        }

        function showEventNotification(event) {
            const notif = document.getElementById('eventNotification');
            document.getElementById('eventTitle').innerText = event.name;
            document.getElementById('eventDesc').innerText = event.desc;
            
            let effectText = event.effectDesc ? `Effect: ${event.effectDesc}` : 'Effect applied!';
            if (event.duration) {
                effectText += ` (${event.duration}s)`;
            } else if (event.instant) {
                effectText += ` (Instant)`;
            }
            document.getElementById('eventEffect').innerText = effectText;
            
            notif.style.display = 'block';
            notif.className = `event-notification ${event.type} show`;
            setTimeout(() => {
                notif.classList.remove('show');
                setTimeout(() => notif.style.display = 'none', 500);
            }, event.instant ? 4000 : 6000);
        }

        function updateEvents(dt) {
            if (game.activeEvent) {
                game.eventTimeLeft -= dt;
                if (game.eventTimeLeft <= 0) {
                    game.activeEvent.cleanup();
                    logEvent(`Event ended: ${game.activeEvent.name}`);
                    game.activeEvent = null;
                }
            }
        }

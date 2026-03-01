        // ==================== SINGULARITY / PRESTIGE SYSTEM ====================
        function getTotalNetworkValue() {
            let tnv = game.money + (game.stats?.moneySpent || 0); // Include spent money so we don't punish spending
            // But if spent money isn't accurate, fallback to node values.
            // Actually, calculating from node value directly is safer against old saves:
            let nodeTNV = game.money;
            game.nodes.forEach(n => {
                const def = NODE_DEFS[n.type];
                if (def && def.cost) {
                    let val = def.cost;
                    for (let i = 1; i < n.level; i++) {
                        val += def.cost * Math.pow(1.5, i);
                    }
                    nodeTNV += val;
                }
            });
            return Math.max(tnv, nodeTNV); // Use whichever is higher
        }

        function getSingularityShards(tnv) {
            if (tnv < 50000) return 0;
            return Math.max(1, Math.floor(Math.cbrt(tnv / 50000)));
        }

        function getSkill(id) {
            return game.singularity?.skills?.[id] || 0;
        }

        const SINGULARITY_SKILLS = [
            { id: 'quantum', name: 'Quantum Burst', desc: '+100% global speed per level.', icon: 'fa-microchip', maxLevel: 999, cost: () => 1 },
            { id: 'absolute_zero', name: 'Absolute Zero', desc: 'Router heat generation is reduced to 0. Overheating is impossible.', icon: 'fa-snowflake', maxLevel: 1, cost: () => 10 },
            { id: 'golden', name: 'Golden Ticket', desc: 'All contract payouts (Money & RP) increased by +50% per level.', icon: 'fa-ticket', maxLevel: 10, cost: () => 2 },
            { id: 'self_aware', name: 'Self-Aware Code', desc: '+1% chance per second to auto-upgrade a random active node.', icon: 'fa-brain', maxLevel: 5, cost: () => 3 },
            { id: 'wireless', name: 'Wireless Protocol', desc: 'Nodes no longer require cables to function. Placed nodes are automatically active.', icon: 'fa-wifi', maxLevel: 1, cost: () => 15 }
        ];

        function openSingularityCore() {
            document.getElementById('singularityModal').style.display = 'flex';
            renderSingularityTree();
        }

        function renderSingularityTree() {
            const container = document.getElementById('singularityTreeContainer');
            if (!container) return;
            container.innerHTML = '';
            
            const shardsEl = document.getElementById('singularityShardCount');
            if (shardsEl) shardsEl.innerText = `${fmt(game.singularity?.shards || 0)} Shards`;
            
            SINGULARITY_SKILLS.forEach(skill => {
                const currentLevel = getSkill(skill.id);
                const isMax = currentLevel >= skill.maxLevel;
                const cost = skill.cost(currentLevel);
                const canAfford = (game.singularity?.shards || 0) >= cost;
                
                const card = document.createElement('div');
                card.className = `singularity-skill-card ${isMax ? 'maxed' : ''}`;
                
                card.innerHTML = `
                    <i class="fa-solid ${skill.icon} singularity-skill-icon"></i>
                    <div class="singularity-skill-name">${skill.name}</div>
                    <div class="singularity-skill-level">Lvl ${currentLevel} ${isMax ? '(MAX)' : `/ ${skill.maxLevel}`}</div>
                    <div class="singularity-skill-desc">${skill.desc}</div>
                    <button class="singularity-btn" 
                        onclick="buySingularitySkill('${skill.id}')"
                        ${(isMax || !canAfford) ? 'disabled' : ''}>
                        ${isMax ? 'MAXED' : `Buy (${cost} Shard${cost>1?'s':''})`}
                    </button>
                `;
                container.appendChild(card);
            });
        }

        function buySingularitySkill(id) {
            const skill = SINGULARITY_SKILLS.find(s => s.id === id);
            if (!skill) return;
            
            if (!game.singularity) game.singularity = { shards: 0, skills: {} };
            
            const currentLevel = getSkill(id);
            if (currentLevel >= skill.maxLevel) return;
            
            const cost = skill.cost(currentLevel);
            if (game.singularity.shards >= cost) {
                game.singularity.shards -= cost;
                game.singularity.skills[id] = currentLevel + 1;
                
                logEvent(`Singularity Upgraded: ${skill.name}`, 'good');
                renderSingularityTree();
                updatePrestigeUI();
            }
        }

        function updatePrestigeUI() {
            const currentBonus = getSkill('quantum') * 100; // was game.prestige * 50
            const tnv = getTotalNetworkValue();
            const shardsToGain = getSingularityShards(tnv);
            
            const currentBonusEl = document.getElementById('currentPrestigeBonus');
            const nextBonusEl = document.getElementById('nextPrestigeBonus');
            if (currentBonusEl) currentBonusEl.innerText = `${game.singularity?.shards || 0}`;
            if (nextBonusEl) nextBonusEl.innerText = `+${shardsToGain}`;
            
            const nodeCount = game.nodes.length;
            const moneyReq = 50000;
            const canPrestige = nodeCount >= 20 && game.money >= moneyReq;
            
            const reqText = document.getElementById('prestigeRequirements');
            if (reqText) {
                reqText.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 8px; color: #a855f7;">Total Network Value: $${fmt(tnv)}</div>
                    <span style="color: ${nodeCount >= 20 ? '#10b981' : '#ef4444'}">${nodeCount}/20 nodes</span> | 
                    <span style="color: ${game.money >= moneyReq ? '#10b981' : '#ef4444'}">$${fmt(game.money)}/$50,000</span>
                `;
            }
            
            const btn = document.getElementById('prestigeBtn');
            if (btn) {
                btn.disabled = !canPrestige;
                btn.style.opacity = canPrestige ? 1 : 0.5;
            }
        }

        function performPrestige() {
            if (game.nodes.length < 20 || game.money < 50000) return;
            
            const tnv = getTotalNetworkValue();
            const shardsEarned = getSingularityShards(tnv);
            
            game.prestige++;
            game.stats.prestigeCount++;
            
            if (!game.singularity) game.singularity = { shards: 0, skills: {} };
            game.singularity.shards += shardsEarned;
            
            // Reset game state
            game.money = 5000; // Starting bonus
            game.rp = 0;
            game.res = { files: 0, images: 0, videos: 0, audio: 0 };
            game.nodes = [];
            game.conns = [];
            game.routerLevel = 1;
            game.routerHeat = 0;
            game.overheatMode = false;
            game.activeContract = null;
            game.codeBits = 0;
            game.optimizationCode = 0;
            game.currentSubnet = null;
            
            // Reset stats that should be reset
            game.stats.nodesCreated = 0;
            game.stats.nodesDeleted = 0;
            game.stats.cablesPlaced = 0;
            game.stats.upgrades = 0;
            game.stats.filesDownloaded = 0;
            game.stats.virusesCleaned = 0;
            game.stats.contractsCompleted = 0;
            
            activeNodes.clear();
            selectedNode = null;
            
            // Spawn new router
            spawnNode('router', 2500, 2500);
            renderWorld();
            
            document.getElementById('prestigeModal').style.display = 'none';
            logEvent(`Entered the Singularity! Earned ${shardsEarned} Shards.`, 'good');
            showFloat(`+${shardsEarned} Shards!`, window.innerWidth/2, window.innerHeight/2, '#a855f7');
            
            checkAchievements();
        }


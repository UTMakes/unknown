// DAILY REWARDS CONFIGURATION
const DAILY_REWARDS = [
    { day: 1, money: 500, rp: 50, label: "Day 1: Starter Pack" },
    { day: 2, money: 750, rp: 75, label: "Day 2: Booster" },
    { day: 3, money: 1000, rp: 100, label: "Day 3: Data Bundle" },
    { day: 4, money: 1500, rp: 150, label: "Day 4: Server Upgrade" },
    { day: 5, money: 2000, rp: 200, label: "Day 5: Premium Access" },
    { day: 6, money: 3000, rp: 300, label: "Day 6: Elite Status" },
    { day: 7, money: 5000, rp: 500, codeBits: 500, label: "Day 7: Weekly Jackpot!" }
];

// MILESTONES CONFIGURATION
const MILESTONES = [
    // Early game milestones
    { id: 'first_node', name: 'First Steps', desc: 'Place your first node', check: () => game.stats.nodesCreated >= 1, reward: { money: 100 } },
    { id: 'first_cable', name: 'Connected', desc: 'Place your first cable', check: () => game.conns.length >= 1, reward: { money: 50 } },
    { id: 'first_download', name: 'Data Collector', desc: 'Place a downloader node', check: () => game.nodes.some(n => n.type.startsWith('dl_')), reward: { money: 200 } },
    { id: 'first_upload', name: 'Data Seller', desc: 'Place an uploader node', check: () => game.nodes.some(n => n.type === 'uploader'), reward: { money: 300 } },
    
    // Mid game milestones
    { id: 'network_builder', name: 'Network Builder', desc: 'Have 10 nodes at once', check: () => game.nodes.length >= 10, reward: { money: 1000 } },
    { id: 'connected_25', name: 'Fully Connected', desc: 'Have 25 cables at once', check: () => game.conns.length >= 25, reward: { money: 2500 } },
    { id: 'first_tech', name: 'Researcher', desc: 'Unlock your first technology', check: () => game.unlocked.length >= 1, reward: { rp: 200 } },
    { id: 'first_contract', name: 'Contractor', desc: 'Complete your first contract', check: () => game.stats.contractsCompleted >= 1, reward: { money: 1000 } },
    
    // Late game milestones
    { id: 'data_empire', name: 'Data Empire', desc: 'Have 50 nodes at once', check: () => game.nodes.length >= 50, reward: { money: 10000, rp: 500 } },
    { id: 'first_million', name: 'First Million', desc: 'Earn $1,000,000 total', check: () => game.stats.totalMoney >= 1000000, reward: { money: 100000 } },
    { id: 'tech_master', name: 'Tech Master', desc: 'Unlock 10 technologies', check: () => game.unlocked.length >= 10, reward: { rp: 1000 } },
    { id: 'coder', name: 'Programmer', desc: 'Generate your first code bits', check: () => (game.codeBits || 0) > 0 || (game.stats.totalCodeBits || 0) > 0, reward: { money: 500 } },
    
    // Endgame milestones
    { id: 'mega_network', name: 'Mega Network', desc: 'Have 100 nodes at once', check: () => game.nodes.length >= 100, reward: { money: 50000, rp: 5000 } },
    { id: 'all_tech', name: 'Omniscient', desc: 'Unlock all technologies', check: () => game.unlocked.length >= TECH_TREE.length, reward: { money: 500000, rp: 50000 } },
    { id: 'first_prestige', name: 'Migration', desc: 'Prestige for the first time', check: () => (game.prestigeLevel || 0) >= 1, reward: { money: 100000 } },
];

// ACHIEVEMENTS CONFIGURATION
const ACHIEVEMENTS = [
    // Money Achievements
    { id: 'money_1', name: 'First Profits', desc: 'Earn $1,000 total', icon: 'fa-solid fa-coins', condition: (s) => s.totalMoney >= 1000, reward: 100 },
    { id: 'money_2', name: 'Entrepreneur', desc: 'Earn $10,000 total', icon: 'fa-solid fa-sack-dollar', condition: (s) => s.totalMoney >= 10000, reward: 500 },
    { id: 'money_3', name: 'Millionaire', desc: 'Earn $1,000,000 total', icon: 'fa-solid fa-vault', condition: (s) => s.totalMoney >= 1000000, reward: 5000 },
    { id: 'peak_1', name: 'Saving Up', desc: 'Have $5,000 at once', icon: 'fa-solid fa-piggy-bank', condition: (s) => s.peakMoney >= 5000, reward: 200 },
    { id: 'peak_2', name: 'Wealthy', desc: 'Have $100,000 at once', icon: 'fa-solid fa-crown', condition: (s) => s.peakMoney >= 100000, reward: 1000 },
    
    // Node Achievements
    { id: 'nodes_1', name: 'Network Starter', desc: 'Create 10 nodes', icon: 'fa-solid fa-network-wired', condition: (s) => s.nodesCreated >= 10, reward: 50 },
    { id: 'nodes_2', name: 'Network Engineer', desc: 'Create 50 nodes', icon: 'fa-solid fa-server', condition: (s) => s.nodesCreated >= 50, reward: 300 },
    { id: 'nodes_3', name: 'Data Center', desc: 'Create 100 nodes', icon: 'fa-solid fa-building', condition: (s) => s.nodesCreated >= 100, reward: 1000 },
    { id: 'nodes_4', name: 'Tech Giant', desc: 'Create 250 nodes', icon: 'fa-solid fa-city', condition: (s) => s.nodesCreated >= 250, reward: 5000 },
    
    // Research Achievements
    { id: 'research_1', name: 'Scientist', desc: 'Earn 1,000 RP total', icon: 'fa-solid fa-flask', condition: (s) => s.totalRP >= 1000, reward: 200 },
    { id: 'research_2', name: 'Research Lab', desc: 'Earn 10,000 RP total', icon: 'fa-solid fa-microscope', condition: (s) => s.totalRP >= 10000, reward: 1000 },
    { id: 'tech_1', name: 'Innovator', desc: 'Unlock 10 technologies', icon: 'fa-solid fa-lightbulb', condition: (s) => s.techsUnlocked >= 10, reward: 300 },
    { id: 'tech_2', name: 'Tech Master', desc: 'Unlock all technologies', icon: 'fa-solid fa-graduation-cap', condition: (s) => s.techsUnlocked >= TECH_TREE.length, reward: 2000 },
    
    // Coding Achievements
    { id: 'code_1', name: 'Hello World', desc: 'Generate 1,000 code bits', icon: 'fa-solid fa-terminal', condition: (s) => s.totalCodeBits >= 1000, reward: 150 },
    { id: 'code_2', name: 'Code Monkey', desc: 'Generate 100,000 code bits', icon: 'fa-solid fa-laptop-code', condition: (s) => s.totalCodeBits >= 100000, reward: 800 },
    { id: 'driver_1', name: 'Driver Update', desc: 'Install 5 drivers', icon: 'fa-solid fa-microchip', condition: (s) => s.totalDrivers >= 5, reward: 250 },
    { id: 'driver_2', name: 'Supercomputer', desc: 'Install 25 drivers', icon: 'fa-solid fa-computer', condition: (s) => s.totalDrivers >= 25, reward: 1500 },
    
    // Action Achievements
    { id: 'contracts_1', name: 'Contractor', desc: 'Complete 5 contracts', icon: 'fa-solid fa-file-contract', condition: (s) => s.contractsCompleted >= 5, reward: 200 },
    { id: 'contracts_2', name: 'Business Partner', desc: 'Complete 25 contracts', icon: 'fa-solid fa-handshake', condition: (s) => s.contractsCompleted >= 25, reward: 1000 },
    { id: 'upgrades_1', name: 'Upgrader', desc: 'Upgrade nodes 20 times', icon: 'fa-solid fa-arrow-up', condition: (s) => s.upgrades >= 20, reward: 150 },
    { id: 'cables_1', name: 'Cable Manager', desc: 'Place 50 cables', icon: 'fa-solid fa-plug', condition: (s) => s.cablesPlaced >= 50, reward: 100 },
    
    // Special Achievements
    { id: 'prestige_1', name: 'Fresh Start', desc: 'Migrate your data center once', icon: 'fa-solid fa-rotate', condition: (s) => s.prestigeCount >= 1, reward: 500 },
    { id: 'prestige_2', name: 'Serial Entrepreneur', desc: 'Migrate 5 times', icon: 'fa-solid fa-rotate-right', condition: (s) => s.prestigeCount >= 5, reward: 3000 },
    { id: 'security_1', name: 'Virus Hunter', desc: 'Clean 10 viruses', icon: 'fa-solid fa-shield-virus', condition: (s) => s.virusesCleaned >= 10, reward: 200 },
    { id: 'time_1', name: 'Dedicated', desc: 'Play for 1 hour', icon: 'fa-solid fa-clock', condition: (s) => s.playTime >= 3600, reward: 500 },
    { id: 'time_2', name: 'Addicted', desc: 'Play for 10 hours', icon: 'fa-solid fa-hourglass-half', condition: (s) => s.playTime >= 36000, reward: 3000 },
    
    // Synergy Achievements (New in v11)
    { id: 'synergy_1', name: 'Synergy Starter', desc: 'Activate your first node synergy', icon: 'fa-solid fa-link', condition: (s) => s.synergyBonus >= 15, reward: 300 },
    { id: 'synergy_2', name: 'Synergy Master', desc: 'Activate 3+ synergies at once', icon: 'fa-solid fa-project-diagram', condition: (s) => s.synergyBonus >= 50, reward: 1000 },
    { id: 'synergy_3', name: 'Full Stack', desc: 'Activate all 5 synergy bonuses', icon: 'fa-solid fa-layer-group', condition: (s) => s.synergyBonus >= 100, reward: 2500 },
    
    // Expanded Achievements (New in v12)
    { id: 'money_4', name: 'Billionaire', desc: 'Earn $1,000,000,000 total', icon: 'fa-solid fa-gem', condition: (s) => s.totalMoney >= 1000000000, reward: 50000 },
    { id: 'peak_3', name: 'Tycoon', desc: 'Have $1,000,000 at once', icon: 'fa-solid fa-money-bill-trend-up', condition: (s) => s.peakMoney >= 1000000, reward: 5000 },
    { id: 'contracts_3', name: 'Enterprise Client', desc: 'Complete 100 contracts', icon: 'fa-solid fa-building-columns', condition: (s) => s.contractsCompleted >= 100, reward: 5000 },
    { id: 'cables_2', name: 'Network Architect', desc: 'Place 200 cables', icon: 'fa-solid fa-diagram-project', condition: (s) => s.cablesPlaced >= 200, reward: 500 },
    { id: 'upgrades_2', name: 'Maxed Out', desc: 'Upgrade nodes 100 times', icon: 'fa-solid fa-arrow-up-right-dots', condition: (s) => s.upgrades >= 100, reward: 1000 },
    { id: 'code_3', name: 'Senior Developer', desc: 'Generate 1,000,000 code bits', icon: 'fa-solid fa-code', condition: (s) => s.totalCodeBits >= 1000000, reward: 5000 },
    { id: 'driver_3', name: 'Driver Collector', desc: 'Install 50 drivers', icon: 'fa-solid fa-hard-drive', condition: (s) => s.totalDrivers >= 50, reward: 5000 },
    { id: 'research_3', name: 'Nobel Prize', desc: 'Earn 1,000,000 RP total', icon: 'fa-solid fa-award', condition: (s) => s.totalRP >= 1000000, reward: 10000 },
    { id: 'prestige_3', name: 'Empire Builder', desc: 'Migrate 10 times', icon: 'fa-solid fa-crown', condition: (s) => s.prestigeCount >= 10, reward: 10000 },
    { id: 'security_2', name: 'Antivirus Pro', desc: 'Clean 50 viruses', icon: 'fa-solid fa-shield-virus', condition: (s) => s.virusesCleaned >= 50, reward: 1000 },
    { id: 'time_3', name: 'No Life', desc: 'Play for 100 hours', icon: 'fa-solid fa-infinity', condition: (s) => s.playTime >= 360000, reward: 25000 },
    { id: 'nodes_5', name: 'Megacorp', desc: 'Create 500 nodes', icon: 'fa-solid fa-globe', condition: (s) => s.nodesCreated >= 500, reward: 10000 },
];

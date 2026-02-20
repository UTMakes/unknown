
// Money Bug Reproduction & Regression Test
function runMoneyTest() {
    console.log("Starting Money Bug Regression Test...");
    
    // Test 1: Precision Loss Check
    let bigMoney = 1e20;
    let smallGain = 1;
    let result = bigMoney + smallGain;
    if (result === bigMoney) {
        console.warn("Confirmed: Small gains are lost at 1e20 due to IEEE 754 precision limits.");
    }

    // Test 2: Infinity Reset Check (The suspected "Bug")
    let nearLimit = 1e308;
    let gain = 1e308;
    let overflow = nearLimit + gain;
    console.log("Value after overflow:", overflow); // Should be Infinity
    
    if (!isFinite(overflow)) {
        console.log("Confirmed: Adding values can result in Infinity.");
    }

    // Mocking the game's current "Critical Fix" logic
    let mockMoney = overflow;
    if (!isFinite(mockMoney)) {
        console.error("Critical Fix Triggered: Money reset to 2000!");
        mockMoney = 2000;
    }
    
    if (mockMoney === 2000) {
        console.log("Confirmed: The current game logic resets progress to $2000 if it hits Infinity.");
    }
}

runMoneyTest();

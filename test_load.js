const fs = require('fs');

global.window = {
    innerWidth: 1000,
    innerHeight: 1000,
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    location: {},
    document: {
        getElementById: () => ({ style: {}, appendChild: () => {}, classList: { add:()=>{} }, innerHTML: '', innerText: '' }),
        createElement: () => ({ style: {}, classList: { add:()=>{} } }),
        addEventListener: () => {}
    },
    requestAnimationFrame: () => {},
    cancelAnimationFrame: () => {},
    setInterval: () => {}
};
global.document = window.document;
global.localStorage = window.localStorage;
global.navigator = { userAgent: '' };

try {
    require('./js/game.js');
    fs.writeFileSync('err.txt', "SUCCESS");
} catch(e) {
    fs.writeFileSync('err.txt', "ERROR:\n" + e.stack);
}

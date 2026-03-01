const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        page.on('requestfailed', request =>
            console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
        );

        console.log("Navigating...");
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
        console.log("Waiting 2 secs...");
        await new Promise(r => setTimeout(r, 2000));
        
        await browser.close();
        console.log("Done");
    } catch (e) {
        console.error(e);
    }
})();

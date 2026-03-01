const fs = require('fs');
const files = ['TODO.md', 'js/tutorial.js'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const originalCount = (content.match(/—/g) || []).length;
        if (originalCount > 0) {
            content = content.replace(/—/g, '-');
            fs.writeFileSync(file, content);
            console.log(`Replaced ${originalCount} em-dashes in ${file}`);
        } else {
            console.log(`No em-dashes found in ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});

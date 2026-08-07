const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'admin.html');
const outPath = path.join(__dirname, 'extracted.js');
let html = fs.readFileSync(htmlPath, 'utf8');
let scripts = [];
let re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  scripts.push(m[1]);
}
fs.writeFileSync(outPath, scripts.join('\n\n'), 'utf8');
console.log('Wrote', outPath);

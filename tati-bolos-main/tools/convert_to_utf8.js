const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'admin.html');
const txt = fs.readFileSync(file, 'latin1');
fs.writeFileSync(file, txt, 'utf8');
console.log('Rewrote', file, 'as UTF-8');

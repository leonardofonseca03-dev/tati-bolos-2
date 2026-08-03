const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'admin.html');
const txt = fs.readFileSync(file, 'utf8');
const lines = txt.split(/\r?\n/);
const start = 780-1; // zero-based index
const end = 800-1;
for (let i = start; i <= end && i < lines.length; i++) {
  const line = lines[i];
  process.stdout.write((i+1).toString().padStart(4,' ') + ': ' + line + '\n');
  let codes = [];
  for (let j = 0; j < line.length; j++) codes.push(line.charCodeAt(j));
  process.stdout.write('      codes: ' + codes.join(' ') + '\n');
}

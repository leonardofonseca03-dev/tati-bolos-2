const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'admin.html');
const data = fs.readFileSync(file);
let problems = [];
for (let i = 0; i < data.length; i++) {
  const code = data[i];
  if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
    problems.push({i,code});
  }
}
if (problems.length === 0) {
  console.log('No control chars found');
} else {
  console.log('Found', problems.length, 'control chars');
  problems.slice(0,50).forEach(p => console.log(p));
}

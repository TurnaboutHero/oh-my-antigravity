const os = require('os');
const path = require('path');

console.log("Home Dir:", os.homedir());
console.log("OMA Home:", path.join(os.homedir(), '.oma'));
console.log("CWD:", process.cwd());

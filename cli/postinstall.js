const path = require('path');
const { execSync } = require('child_process');

console.log('Running Oh My Antigravity post-install setup...');

// Run the installer
try {
    const installer = path.join(__dirname, 'install.js');
    require(installer);
} catch (error) {
    console.error('Post-install failed:', error.message);
}

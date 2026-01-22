#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(`
   ____  __  __    _      
  / __ \\|  \\/  |  / \\     Oh My Antigravity Installer
 | |  | | \\  / | / _ \\    
 | |  | | |\\/| |/ ___ \\   
 |_|  |_|_|  |_/_/   \\_\\  
`);

console.log('Installing Oh My Antigravity...\n');

const omaHome = path.join(os.homedir(), '.oma');
const antigravityHome = path.join(os.homedir(), '.gemini', 'antigravity');

// Create directories
[omaHome, path.join(antigravityHome, 'skills'), path.join(antigravityHome, 'workflows')].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✓ Created ${dir}`);
    }
});

// Copy OMA files
// Copy OMA files
const sourceDir = path.join(__dirname, '..');
const directories = ['skills', 'subagents', 'workflows', 'bin', 'docs'];

directories.forEach(dir => {
    const src = path.join(sourceDir, dir);
    const dest = path.join(omaHome, dir);
    
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`✓ Installed ${dir}/`);
    } else {
        // Create empty dir if source doesn't exist (e.g., initial install)
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    }
});

// Make CLI executable on Unix
if (os.platform() !== 'win32') {
    const omaScript = path.join(omaHome, 'bin', 'oma');
    if (fs.existsSync(omaScript)) {
        fs.chmodSync(omaScript, '755');
    }
}

console.log(`
╔════════════════════════════════════════════════════╗
║  ✅ Oh My Antigravity installed successfully!     ║
╚════════════════════════════════════════════════════╝

OMA Home: ${omaHome}

Try these commands:
  npx oh-my-antigravity list              # List plugins
  npx oh-my-antigravity install <name>    # Install plugin
  npx oh-my-antigravity help              # Show help

Or use the 'oma' command if you installed globally:
  npm install -g oh-my-antigravity
  oma list

Visit: https://github.com/oh-my-antigravity
`);

#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const omaHome = path.join(os.homedir(), '.oma');
const command = process.argv.slice(2).join(' ');

// Determine which OMA script to use
let omaScript;
if (os.platform() === 'win32') {
    omaScript = path.join(omaHome, 'bin', 'oma.ps1');
    execSync(`powershell -ExecutionPolicy Bypass -File "${omaScript}" ${command}`, { stdio: 'inherit' });
} else {
    omaScript = path.join(omaHome, 'bin', 'oma');
    execSync(`bash "${omaScript}" ${command}`, { stdio: 'inherit' });
}

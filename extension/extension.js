const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');

// Plugin manager panel
let pluginManagerPanel = undefined;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Oh My Antigravity extension is now active!');

    // Register commands
    let openManager = vscode.commands.registerCommand('oma.openManager', () => {
        if (pluginManagerPanel) {
            pluginManagerPanel.reveal(vscode.ViewColumn.One);
        } else {
            pluginManagerPanel = vscode.window.createWebviewPanel(
                'omaPluginManager',
                'OMA Plugin Manager',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            pluginManagerPanel.webview.html = getWebviewContent(context, pluginManagerPanel.webview);

            // Handle messages from webview
            pluginManagerPanel.webview.onDidReceiveMessage(
                message => handleWebviewMessage(message, pluginManagerPanel.webview),
                undefined,
                context.subscriptions
            );

            pluginManagerPanel.onDidDispose(
                () => { pluginManagerPanel = undefined; },
                undefined,
                context.subscriptions
            );
        }
    });

    let refreshPlugins = vscode.commands.registerCommand('oma.refreshPlugins', () => {
        if (pluginManagerPanel) {
            refreshPluginsList(pluginManagerPanel.webview);
        }
        vscode.window.showInformationMessage('Plugins refreshed!');
    });

    // Register tree data providers
    const pluginsProvider = new PluginsProvider();
    vscode.window.registerTreeDataProvider('oma.pluginsView', pluginsProvider);

    const commandsProvider = new CommandsProvider();
    vscode.window.registerTreeDataProvider('oma.commandsView', commandsProvider);

    const themesProvider = new ThemesProvider();
    vscode.window.registerTreeDataProvider('oma.themesView', themesProvider);

    context.subscriptions.push(openManager, refreshPlugins);
}

// Tree Data Providers
class PluginsProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    async getChildren() {
        const omaHome = getOmaHome();
        const pluginsPath = path.join(omaHome, 'plugins');
        
        if (!fs.existsSync(pluginsPath)) {
            return [];
        }

        const plugins = fs.readdirSync(pluginsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                const skillMd = path.join(pluginsPath, dirent.name, 'SKILL.md');
                let description = 'No description';
                
                if (fs.existsSync(skillMd)) {
                    const content = fs.readFileSync(skillMd, 'utf8');
                    const match = content.match(/description:\s*(.+)/);
                    if (match) {
                        description = match[1].trim();
                    }
                }

                const item = new vscode.TreeItem(dirent.name, vscode.TreeItemCollapsibleState.None);
                item.description = description;
                item.contextValue = 'plugin';
                item.iconPath = new vscode.ThemeIcon('package');
                return item;
            });

        return plugins;
    }
}

class CommandsProvider {
    getTreeItem(element) {
        return element;
    }

    async getChildren() {
        const omaHome = getOmaHome();
        const commandsPath = path.join(omaHome, 'commands');
        
        if (!fs.existsSync(commandsPath)) {
            return [];
        }

        const commands = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const name = path.basename(file, '.md');
                const item = new vscode.TreeItem(`/${name}`, vscode.TreeItemCollapsibleState.None);
                item.iconPath = new vscode.ThemeIcon('symbol-method');
                return item;
            });

        return commands;
    }
}

class ThemesProvider {
    getTreeItem(element) {
        return element;
    }

    async getChildren() {
        const omaHome = getOmaHome();
        const themesPath = path.join(omaHome, 'themes');
        
        if (!fs.existsSync(themesPath)) {
            return [];
        }

        const themes = fs.readdirSync(themesPath)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const name = path.basename(file, '.md');
                const item = new vscode.TreeItem(name, vscode.TreeItemCollapsibleState.None);
                item.iconPath = new vscode.ThemeIcon('symbol-color');
                return item;
            });

        return themes;
    }
}

// Helper functions
function getOmaHome() {
    // Try to find OMA home from workspace or default location
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        const localOma = path.join(workspaceFolder.uri.fsPath, 'oma');
        if (fs.existsSync(localOma)) {
            return localOma;
        }
    }
    
    // Check Desktop
    const desktop = path.join(os.homedir(), 'Desktop', 'oma');
    if (fs.existsSync(desktop)) {
        return desktop;
    }

    return path.join(os.homedir(), 'oma');
}

function getOmaCommand() {
    const omaHome = getOmaHome();
    if (process.platform === 'win32') {
        return path.join(omaHome, 'bin', 'oma.ps1');
    } else {
        return path.join(omaHome, 'bin', 'oma');
    }
}

async function handleWebviewMessage(message, webview) {
    switch (message.command) {
        case 'install':
            await installPlugin(message.plugin, message.scope, webview);
            break;
        case 'remove':
            await removePlugin(message.plugin, message.scope, webview);
            break;
        case 'refresh':
            await refreshPluginsList(webview);
            break;
    }
}

async function installPlugin(pluginName, scope, webview) {
    const omaCmd = getOmaCommand();
    const scopeFlag = scope === 'project' ? '--project' : '';
    const cmd = process.platform === 'win32'
        ? `powershell -ExecutionPolicy Bypass -File "${omaCmd}" install ${pluginName} ${scopeFlag}`
        : `bash "${omaCmd}" install ${pluginName} ${scopeFlag}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Failed to install ${pluginName}: ${stderr}`);
        } else {
            vscode.window.showInformationMessage(`Successfully installed ${pluginName}!`);
            refreshPluginsList(webview);
        }
    });
}

async function removePlugin(pluginName, scope, webview) {
    const omaCmd = getOmaCommand();
    const scopeFlag = scope === 'project' ? '--project' : '';
    const cmd = process.platform === 'win32'
        ? `powershell -ExecutionPolicy Bypass -File "${omaCmd}" remove ${pluginName} ${scopeFlag}`
        : `bash "${omaCmd}" remove ${pluginName} ${scopeFlag}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Failed to remove ${pluginName}: ${stderr}`);
        } else {
            vscode.window.showInformationMessage(`Successfully removed ${pluginName}!`);
            refreshPluginsList(webview);
        }
    });
}

async function refreshPluginsList(webview) {
    const omaHome = getOmaHome();
    const pluginsPath = path.join(omaHome, 'plugins');
    
    const availablePlugins = [];
    if (fs.existsSync(pluginsPath)) {
        fs.readdirSync(pluginsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .forEach(dirent => {
                const skillMd = path.join(pluginsPath, dirent.name, 'SKILL.md');
                let description = 'No description';
                let version = '1.0.0';
                
                if (fs.existsSync(skillMd)) {
                    const content = fs.readFileSync(skillMd, 'utf8');
                    const descMatch = content.match(/description:\s*(.+)/);
                    const versionMatch = content.match(/version:\s*(.+)/);
                    
                    if (descMatch) description = descMatch[1].trim();
                    if (versionMatch) version = versionMatch[1].trim();
                }

                availablePlugins.push({
                    name: dirent.name,
                    description,
                    version,
                    installed: false
                });
            });
    }

    // Check installed plugins
    const antigravitySkills = path.join(os.homedir(), '.gemini', 'antigravity', 'skills');
    if (fs.existsSync(antigravitySkills)) {
        const installed = fs.readdirSync(antigravitySkills);
        availablePlugins.forEach(p => {
            if (installed.includes(p.name)) {
                p.installed = true;
            }
        });
    }

    webview.postMessage({
        command: 'updatePlugins',
        plugins: availablePlugins
    });
}

function getWebviewContent(context, webview) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OMA Plugin Manager</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        
        h1 {
            color: var(--vscode-foreground);
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .scope-selector {
            display: flex;
            gap: 10px;
        }
        
        .scope-btn {
            padding: 8px 16px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        
        .scope-btn.active {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .plugin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }
        
        .plugin-card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 16px;
            transition: all 0.2s;
        }
        
        .plugin-card:hover {
            border-color: var(--vscode-focusBorder);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .plugin-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 8px;
        }
        
        .plugin-name {
            font-size: 16px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        
        .plugin-version {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        
        .plugin-description {
            color: var(--vscode-descriptionForeground);
            margin: 8px 0;
            font-size: 14px;
        }
        
        .plugin-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: opacity 0.2s;
        }
        
        .btn:hover {
            opacity: 0.8;
        }
        
        .btn-install {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .btn-remove {
            background: var(--vscode-errorForeground);
            color: white;
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        
        .status-installed {
            background: var(--vscode-terminal-ansiGreen);
            color: var(--vscode-editor-background);
        }
        
        .status-available {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Oh My Antigravity Plugin Manager</h1>
        <div class="scope-selector">
            <button class="scope-btn active" data-scope="global">Global</button>
            <button class="scope-btn" data-scope="project">Project</button>
        </div>
    </div>
    
    <div class="plugin-grid" id="pluginGrid">
        <p>Loading plugins...</p>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentScope = 'global';

        // Scope selector
        document.querySelectorAll('.scope-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.scope-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentScope = btn.dataset.scope;
            });
        });

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'updatePlugins') {
                renderPlugins(message.plugins);
            }
        });

        function renderPlugins(plugins) {
            const grid = document.getElementById('pluginGrid');
            
            if (plugins.length === 0) {
                grid.innerHTML = '<p>No plugins available.</p>';
                return;
            }

            grid.innerHTML = plugins.map(plugin => `
                <div class="plugin-card">
                    <div class="plugin-header">
                        <div>
                            <div class="plugin-name">${plugin.name}</div>
                            <div class="plugin-version">v${plugin.version}</div>
                        </div>
                        <span class="status-badge ${plugin.installed ? 'status-installed' : 'status-available'}">
                            ${plugin.installed ? 'Installed' : 'Available'}
                        </span>
                    </div>
                    <div class="plugin-description">${plugin.description}</div>
                    <div class="plugin-actions">
                        ${!plugin.installed ? `
                            <button class="btn btn-install" onclick="installPlugin('${plugin.name}')">
                                Install
                            </button>
                        ` : `
                            <button class="btn btn-remove" onclick="removePlugin('${plugin.name}')">
                                Remove
                            </button>
                        `}
                    </div>
                </div>
            `).join('');
        }

        function installPlugin(name) {
            vscode.postMessage({
                command: 'install',
                plugin: name,
                scope: currentScope
            });
        }

        function removePlugin(name) {
            vscode.postMessage({
                command: 'remove',
                plugin: name,
                scope: currentScope
            });
        }

        // Request initial data
        vscode.postMessage({ command: 'refresh' });
    </script>
</body>
</html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}

const fs = require('fs');
const path = require('path');

/**
 * TodoEnforcer Hook
 * Scans code for TODO/FIXME comments and ensures they're addressed
 * 
 * This is the core of the Ralph Loop functionality
 */

module.exports = async function todoEnforcer(context) {
    const { workspaceRoot, changedFiles } = context;
    
    const todos = [];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go'];
    
    // Scan changed files
    for (const file of changedFiles || []) {
        const ext = path.extname(file);
        if (!extensions.includes(ext)) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            const todoMatch = line.match(/(TODO|FIXME|HACK|XXX):\s*(.+)/i);
            if (todoMatch) {
                todos.push({
                    file,
                    line: index + 1,
                    type: todoMatch[1].toUpperCase(),
                    message: todoMatch[2].trim(),
                    content: line.trim()
                });
            }
            
            // Check for incomplete implementations
            if (line.includes('throw new Error("Not implemented")') ||
                line.includes('raise NotImplementedError')) {
                todos.push({
                    file,
                    line: index + 1,
                    type: 'NOT_IMPLEMENTED',
                    message: 'Function not implemented',
                    content: line.trim()
                });
            }
        });
    }
    
    if (todos.length > 0) {
        // Store TODOs for Ralph Loop
        const todoFile = path.join(workspaceRoot, '.oma', 'todos.json');
        const dir = path.dirname(todoFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
        
        // Check if Ralph Loop is active
        const config = loadConfig(workspaceRoot);
        if (config.ralph?.enabled) {
            console.log(`\n[Ralph Loop] Found ${todos.length} incomplete tasks:`);
            todos.forEach(todo => {
                console.log(`  ${todo.type} ${todo.file}:${todo.line} - ${todo.message}`);
            });
            
            // Ralph will iterate until these are resolved
            context.ralphTodos = todos;
            context.requiresRalphLoop = true;
        }
    } else {
        // No TODOs found - Ralph Loop can complete
        const todoFile = path.join(workspaceRoot, '.oma', 'todos.json');
        if (fs.existsSync(todoFile)) {
            fs.unlinkSync(todoFile);
        }
        
        console.log('\n[Ralph Loop] ✓ All tasks complete!');
        context.requiresRalphLoop = false;
    }
    
    return context;
};

function loadConfig(workspaceRoot) {
    const configPath = path.join(workspaceRoot, '.oma', 'config.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return { ralph: { enabled: false } };
}

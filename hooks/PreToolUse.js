const fs = require('fs');
const path = require('path');

/**
 * PreToolUse Hook
 * Runs before any tool execution
 * 
 * Use cases:
 * - Logging tool usage
 * - Validating tool parameters
 * - Context injection
 * - Permission checks
 */

module.exports = async function preToolUse(context) {
    const { toolName, parameters, agent } = context;
    
    // Log tool usage
    const logEntry = {
        timestamp: new Date().toISOString(),
        agent: agent.name,
        tool: toolName,
        params: sanitizeParams(parameters)
    };
    
    logToFile('.oma/logs/tool-usage.jsonl', JSON.stringify(logEntry));
    
    // Context injection for specific tools
    if (toolName === 'view_file') {
        // Auto-inject related files (imports, tests)
        const filePath = parameters.AbsolutePath;
        const relatedFiles = findRelatedFiles(filePath);
        
        if (relatedFiles.length > 0) {
            context.metadata = context.metadata || {};
            context.metadata.relatedFiles = relatedFiles;
        }
    }
    
    // Validate parameters
    if (toolName === 'run_command') {
        const command = parameters.CommandLine;
        
        // Block dangerous commands
        const dangerousPatterns = [
            /rm\s+-rf\s+\//,
            /sudo\s+rm/,
            /format\s+c:/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(command)) {
                throw new Error(`Dangerous command blocked: ${command}`);
            }
        }
    }
    
    return context;
};

function sanitizeParams(params) {
    // Remove sensitive data from logs
    const sanitized = { ...params };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    
    for (const key of sensitiveKeys) {
        if (sanitized[key]) {
            sanitized[key] = '[REDACTED]';
        }
    }
    
    return sanitized;
}

function findRelatedFiles(filePath) {
    // Find test file
    const testPath = filePath.replace(/\.(ts|js)$/, '.test.$1');
    const related = [];
    
    if (fs.existsSync(testPath)) {
        related.push({ type: 'test', path: testPath });
    }
    
    // Find type definition file
    const dtsPath = filePath.replace(/\.ts$/, '.d.ts');
    if (fs.existsSync(dtsPath)) {
        related.push({ type: 'types', path: dtsPath });
    }
    
    return related;
}

function logToFile(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(filePath, data + '\n');
}

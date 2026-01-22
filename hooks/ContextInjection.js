const fs = require('fs');
const path = require('path');

/**
 * ContextInjection Hook
 * Auto-injects relevant context before agent execution
 * 
 * Injected content:
 * - AGENTS.md (available agents and their specialties)
 * - README.md (project overview)
 * - Conditional rules based on task type
 */

module.exports = async function contextInjection(context) {
    const { workspaceRoot, agent, userMessage } = context;
    
    const injectedContext = [];
    
    // 1. Inject AGENTS.md if orchestrator or planner
    if (['sisyphus', 'prometheus', 'metis'].includes(agent.name)) {
        const agentsPath = path.join(workspaceRoot, 'AGENTS.md');
        if (fs.existsSync(agentsPath)) {
            const agentsDoc = fs.readFileSync(agentsPath, 'utf8');
            injectedContext.push({
                type: 'agents',
                content: agentsDoc,
                priority: 'high'
            });
        }
    }
    
    // 2. Inject README.md for context about project
    const readmePath = path.join(workspaceRoot, 'README.md');
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf8');
        injectedContext.push({
            type: 'readme',
            content: readme,
            priority: 'medium'
        });
    }
    
    // 3. Conditional rules based on task
    if (userMessage.toLowerCase().includes('security') || 
        userMessage.toLowerCase().includes('auth')) {
        injectedContext.push({
            type: 'security-rules',
            content: getSecurityRules(),
            priority: 'high'
        });
    }
    
    if (userMessage.toLowerCase().includes('test')) {
        injectedContext.push({
            type: 'testing-standards',
            content: getTestingStandards(),
            priority: 'high'
        });
    }
    
    // 4. Inject project-specific conventions
    const conventionsPath = path.join(workspaceRoot, '.oma', 'conventions.md');
    if (fs.existsSync(conventionsPath)) {
        const conventions = fs.readFileSync(conventionsPath, 'utf8');
        injectedContext.push({
            type: 'conventions',
            content: conventions,
            priority: 'medium'
        });
    }
    
    // Add to context
    context.injectedContext = injectedContext;
    
    // Log injection
    if (injectedContext.length > 0) {
        console.log(`[Context] Injected ${injectedContext.length} context items`);
    }
    
    return context;
};

function getSecurityRules() {
    return `
# Security Rules

## MUST Follow:
- Never store passwords in plain text (use bcrypt/Argon2)
- Always use parameterized queries (prevent SQL injection)
- Validate and sanitize ALL user input
- Use HTTPS for ALL external communication
- Implement proper CORS policies
- Use environment variables for secrets (never hardcode)
- Implement rate limiting on APIs
- Add CSRF protection for state-changing operations

## Security Checklist:
- [ ] Input validation
- [ ] Output encoding (XSS prevention)
- [ ] Authentication properly implemented
- [ ] Authorization checks on all endpoints
- [ ] Secrets in environment variables
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Dependencies scanned for vulnerabilities
`;
}

function getTestingStandards() {
    return `
# Testing Standards

## Coverage Requirements:
- Minimum 80% code coverage
- 100% coverage for critical paths
- All public APIs must have tests

## Test Structure:
- Use AAA pattern (Arrange, Act, Assert)
- One assertion per test when possible
- Clear, descriptive test names
- Independent tests (no shared state)

## What to Test:
- Happy path
- Edge cases
- Error scenarios
- Boundary values
- Async behavior

## Mock External Dependencies:
- Database calls
- API requests
- File system operations
- Time-dependent code
`;
}

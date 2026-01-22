# Oh My Antigravity - Complete Agent & Skill List

## 📋 28 Agents (Delegation-First Architecture)

### Core Orchestration
1. **Sisyphus** - Master orchestrator, task delegation
2. **Prometheus** - Strategic planner, workflow decomposition
3. **Metis** - Plan consultant, quality assurance

### Architecture & Strategy
4. **Oracle** - System architect, debugging expert
5. **Architect** - Database schema, API design
6. **Strategist** - Technical decision-making

### Development & Implementation
7. **CodeSmith** - Backend implementation expert
8. **Frontend Engineer** - UI/UX specialist (Pixel)
9. **Full Stack** - End-to-end development
10. **Refactorer** - Code optimization, restructuring

### Testing & Quality
11. **Tester** - Unit/integration testing
12. **QA Engineer** - Quality assurance
13. **Security Guard** - Security analysis, OWASP

### Research & Documentation
14. **Librarian** - Documentation lookup, examples
15. **Explorer** - Codebase navigation, grep search
16. **Scribe** - Technical writing, README
17. **Researcher** - Multi-repository analysis

### Data & Analysis
18. **Scientist (Low)** - Basic data analysis (Haiku-tier)
19. **Scientist (Mid)** - Standard analysis (Sonnet-tier)
20. **Scientist (High)** - Complex research (Opus-tier)
21. **Data Wizard** - Data processing, visualization
22. **SQL Master** - Database queries, optimization

### Specialized Tasks
23. **Debugger** - Bug hunting and fixing
24. **Git Master** - Version control, atomic commits
25. **DevOps Engineer** - CI/CD, deployment
26. **Performance Expert** - Optimization, profiling
27. **Multimodal Looker** - Image/video analysis
28. **Playwright Master** - Browser automation, E2E tests

---

## 🎯 28 Skills (SKILL.md format)

Each agent has a corresponding skill with:
- YAML frontmatter (name, description, version, specialty)
- Detailed instructions
- Code examples
- Best practices
- Anti-patterns to avoid

---

## 🔧 Command-Line Commands

### Core Commands
- `/omc-setup` - Initial setup
- `/research <goal>` - Multi-agent research
- `/ultrawork` (or `/ulw`) - Full autonomous mode
- `/ralph` - Ralph Loop (relentless task completion)
- `/ralplan` - Ralph + Planning mode
- `/plan` - Strategic planning mode
- `/autopilot` (or `/ap`) - Autonomous execution

### Research Commands
- `/research AUTO: <goal>` - Fully autonomous research
- `/research status` - Check current session
- `/research resume` - Resume interrupted session
- `/research list` - List all sessions
- `/research report <id>` - Generate report

### Agent Control
- `/delegate <agent> <task>` - Explicitly delegate
- `/parallel <agents> <task>` - Parallel execution
- `/background <task>` - Background task

---

## 🪝 Hooks System (25+ hooks)

### Lifecycle Hooks
- `PreToolUse` - Before any tool execution
- `PostToolUse` - After tool execution
- `PreModelCall` - Before LLM call
- `PostModelCall` - After LLM response
- `PreAgentSpawn` - Before spawning subagent
- `PostAgentSpawn` - After subagent completes

### Context Hooks
- `ContextInjection` - Auto-inject AGENTS.md, README
- `ContextPruning` - Token optimization
- `SessionStart` - Session initialization
- `SessionEnd` - Session cleanup

### Task Hooks
- `TaskDecomposition` - Break down complex tasks
- `TaskValidation` - Verify task requirements
- `TaskCompletion` - Confirm completion
- `TodoEnforcer` - Ensure all todos completed
- `CommentChecker` - Verify no TODO/FIXME left

### Code Quality Hooks
- `LintCheck` - Run linters
- `FormatCheck` - Code formatting
- `SecurityScan` - Security analysis
- `TestRunner` - Auto-run tests
- `TypeCheck` - Type validation

### Productivity Hooks
- `ThinkMode` - Extended reasoning before action
- `ReviewMode` - Code review before submission
- `ExplainMode` - Explain approach before coding
- `AutoCommit` - Atomic git commits

---

## 🌐 MCP Servers (Built-in)

### Search & Research
1. **websearch** (Exa) - Web search capability
2. **grep_app** - GitHub code search
3. **context7** - Documentation lookup

### Code Analysis
4. **lsp-server** - Language Server Protocol
5. **ast-server** - AST-aware code analysis

### Data & Files
6. **filesystem** - Enhanced file operations
7. **python_repl** - Persistent Python REPL
8. **session-tools** - Session history management

---

## 🎨 Workflows

### Built-in Workflows
1. **Brainstorm → Plan → Implement**
2. **Research → Validate → Execute**
3. **Prototype → Test → Refactor**
4. **Design → Develop → Deploy**
5. **Debug → Fix → Verify**

### Parallel Workflows
- Multi-agent concurrent execution
- Background task orchestration
- Dependency-aware scheduling

---

## 📂 Directory Structure

```
~/.gemini/antigravity/
├── skills/
│   ├── sisyphus/
│   ├── oracle/
│   ├── codesmith/
│   ├── pixel/
│   ├── tester/
│   ├── librarian/
│   ├── scientist-low/
│   ├── scientist/
│   ├── scientist-high/
│   ├── debugger/
│   ├── security-guard/
│   ├── prometheus/
│   ├── metis/
│   ├── explorer/
│   ├── git-master/
│   ├── playwright-master/
│   ├── devops-engineer/
│   ├── performance-expert/
│   ├── multimodal-looker/
│   ├── data-wizard/
│   ├── sql-master/
│   ├── refactorer/
│   ├── qa-engineer/
│   ├── scribe/
│   ├── researcher/
│   ├── strategist/
│   ├── architect/
│   └── fullstack/
├── workflows/
│   ├── brainstorm-plan-implement.md
│   ├── research-validate-execute.md
│   ├── prototype-test-refactor.md
│   ├── design-develop-deploy.md
│   └── debug-fix-verify.md
├── hooks/
│   ├── PreToolUse.js
│   ├── PostToolUse.js
│   ├── ContextInjection.js
│   ├── TodoEnforcer.js
│   └── [... 25+ hooks]
├── mcp/
│   ├── websearch/
│   ├── grep_app/
│   ├── context7/
│   ├── lsp-server/
│   └── python_repl/
└── agents/
    └── AGENTS.md
```

---

This is the complete specification matching Oh My Claude Code's 28 agents + 28 skills architecture.

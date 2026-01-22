# 🎯 OMA v2.0 Architecture: True Multi-Agent Orchestration

## 핵심 개념 재정의

### Sisyphus = Main Agent (Orchestrator)
```
역할: 프로젝트 매니저
실행: Antigravity IDE
특징: 
- 전체 컨텍스트 파악
- 작업 분해 및 할당
- SubAgent 관리/감독
- 결과 통합
```

### SubAgents = Isolated Specialists
```
역할: 전문가 팀원들
실행: 외부 CLI (Codex/Claude/Gemini/Antigravity)
특징:
- 기존 컨텍스트 격리 (clean slate)
- 특정 작업만 수행
- 자신만의 스킬 보유
- 적합한 AI 백엔드 자동 선택
```

## 🏗️ 새로운 아키텍처

```
User Request
     ↓
┌────────────────────────────────────┐
│ Main Agent: Sisyphus               │
│ (Antigravity IDE)                  │
│                                    │
│ - 전체 컨텍스트 보유              │
│ - 작업 분해                       │
│ - SubAgent 선택 & 할당            │
│ - 결과 통합                       │
└────────────────────────────────────┘
     ↓ spawns SubAgents
     ↓
┌──────────────┬──────────────┬──────────────┐
│ SubAgent 1   │ SubAgent 2   │ SubAgent 3   │
│ Oracle       │ CodeSmith    │ DataWizard   │
├──────────────┼──────────────┼──────────────┤
│ AI: Claude   │ AI: Codex    │ AI: Gemini   │
│ Opus (사고력)│ (코딩 특화) │ Flash (빠름) │
├──────────────┼──────────────┼──────────────┤
│ Skills:      │ Skills:      │ Skills:      │
│ - architect  │ - coder      │ - data-viz   │
│ - reviewer   │ - refactor   │ - stats      │
└──────────────┴──────────────┴──────────────┘
     ↓ returns isolated results
     ↓
┌────────────────────────────────────┐
│ Sisyphus integrates                │
│ Complete Solution                  │
└────────────────────────────────────┘
```

## 🔧 SubAgent Configuration

### subagents/oracle/config.json
```json
{
  "name": "oracle",
  "role": "System Architect",
  "specialty": "architecture",
  
  "ai_backend": {
    "primary": "claude",
    "model": "claude-opus-4",
    "fallback": "antigravity",
    "reason": "Complex reasoning for architecture decisions"
  },
  
  "skills": [
    "system-design",
    "technology-selection",
    "code-review",
    "performance-analysis"
  ],
  
  "isolation": {
    "clean_context": true,
    "max_conversation_length": 10,
    "reset_after_task": true
  },
  
  "task_types": [
    "design architecture",
    "review code",
    "make technical decision",
    "analyze performance"
  ]
}
```

### subagents/codesmith/config.json
```json
{
  "name": "codesmith",
  "role": "Backend Developer",
  "specialty": "implementation",
  
  "ai_backend": {
    "primary": "codex",
    "model": "gpt-4-code",
    "fallback": "claude",
    "reason": "Codex excels at code generation"
  },
  
  "skills": [
    "backend-implementation",
    "api-design",
    "database-integration",
    "error-handling"
  ],
  
  "isolation": {
    "clean_context": true,
    "max_conversation_length": 5,
    "reset_after_task": true
  },
  
  "task_types": [
    "implement feature",
    "write code",
    "create API",
    "database operations"
  ]
}
```

### subagents/data-wizard/config.json
```json
{
  "name": "data-wizard",
  "role": "Data Analyst",
  "specialty": "data-processing",
  
  "ai_backend": {
    "primary": "gemini",
    "model": "gemini-flash-2.0",
    "fallback": "claude",
    "reason": "Fast processing for large datasets"
  },
  
  "skills": [
    "data-cleaning",
    "etl-pipeline",
    "visualization",
    "statistical-analysis"
  ],
  
  "isolation": {
    "clean_context": true,
    "max_conversation_length": 3,
    "reset_after_task": true
  },
  
  "task_types": [
    "process data",
    "clean dataset",
    "create visualization",
    "statistical analysis"
  ]
}
```

## 🎭 AI Backend Routing Logic

### Sisyphus Decision Matrix

```javascript
function selectAIBackend(subagent, task) {
  const backendStrengths = {
    'codex': {
      strengths: ['code-generation', 'debugging', 'refactoring'],
      speed: 'medium',
      cost: 'medium',
      quality: 'high'
    },
    'claude': {
      strengths: ['reasoning', 'analysis', 'writing', 'complex-logic'],
      speed: 'medium',
      cost: 'high',
      quality: 'highest'
    },
    'gemini': {
      strengths: ['speed', 'multimodal', 'large-context', 'real-time'],
      speed: 'fastest',
      cost: 'low',
      quality: 'good'
    },
    'antigravity': {
      strengths: ['integration', 'tool-use', 'file-ops'],
      speed: 'fast',
      cost: 'medium',
      quality: 'high'
    }
  };
  
  // Task analysis
  if (task.complexity === 'high' && task.type === 'architecture') {
    return 'claude'; // Complex reasoning
  }
  
  if (task.type === 'code-generation' || task.type === 'debugging') {
    return 'codex'; // Code specialist
  }
  
  if (task.size === 'large' || task.speed_required === 'high') {
    return 'gemini'; // Fast processing
  }
  
  if (task.requires_tools || task.file_operations) {
    return 'antigravity'; // Tool integration
  }
  
  // Default to subagent's preference
  return subagent.ai_backend.primary;
}
```

## 📋 Sisyphus Orchestration Protocol

### sisyphus/SKILL.md (Updated)

```markdown
# Sisyphus - The Supreme Orchestrator

## Your Role

You are the **Main Agent** running in Antigravity IDE. You see the full context and orchestrate **isolated SubAgents** running on different AI backends.

## SubAgent Spawn Syntax

\```
[SPAWN SUBAGENT: oracle]
AI_BACKEND: claude-opus-4
TASK: Design authentication system architecture
CONTEXT: E-commerce platform, 100k users expected
ISOLATION: clean (no conversation history)
SKILLS: [system-design, security-review]
OUTPUT: Architecture document with technology choices
TIMEOUT: 10 minutes
[END SPAWN]
\```

## Available SubAgents

| SubAgent | AI Backend | Specialty | Use Cases |
|----------|------------|-----------|-----------|
| **oracle** | Claude Opus | Architecture | Design, strategy, decisions |
| **codesmith** | Codex | Implementation | Code generation, APIs |
| **pixel** | Claude Sonnet | UI/UX | Frontend, design |
| **data-wizard** | Gemini Flash | Data | Processing, analysis |
| **tester** | Codex | Testing | Test generation |
| **security-guard** | Claude Opus | Security | Audits, vulnerabilities |
| **debugger** | Codex | Debugging | Bug fixing |
| **sql-master** | Antigravity | Database | Query optimization |

## AI Backend Selection Logic

### When to use Claude (Opus/Sonnet):
- Complex reasoning required
- Architecture decisions
- Strategic thinking
- Code review with explanation
- **Cost**: High, **Quality**: Highest

### When to use Codex (GPT-4-code):
- Code generation
- Debugging specific issues
- Refactoring code
- API implementation
- **Cost**: Medium, **Quality**: High for code

### When to use Gemini (Flash/Pro):
- Large dataset processing
- Fast iteration needed
- Multimodal tasks
- Real-time analysis
- **Cost**: Low, **Quality**: Good, **Speed**: Fastest

### When to use Antigravity:
- Heavy tool usage
- File operations
- LSP integration
- Multi-step workflows
- **Cost**: Medium, **Quality**: High for tools

## Orchestration Example

\```
User: "Build authentication system with social login"

[ANALYSIS]
Complexity: High
Domains: Architecture, Security, Backend, Frontend, Testing
SubAgents needed: 5

[EXECUTION PLAN]

Phase 1: Architecture (Sequential)
  [SPAWN SUBAGENT: oracle]
  AI_BACKEND: claude-opus-4  ← Complex reasoning
  TASK: Design auth system architecture
  → Returns: Architecture document
  
  [SPAWN SUBAGENT: security-guard]
  AI_BACKEND: claude-opus-4  ← Security critical
  TASK: Define security requirements
  CONTEXT: Architecture from oracle
  → Returns: Security checklist

Phase 2: Implementation (Parallel)
  [SPAWN SUBAGENT: codesmith]
  AI_BACKEND: codex  ← Code generation
  TASK: Implement backend auth
  CONTEXT: Architecture + Security requirements
  → Returns: Auth endpoints
  
  [SPAWN SUBAGENT: pixel]
  AI_BACKEND: claude-sonnet  ← UI design
  TASK: Create login UI components
  → Returns: React components

Phase 3: Quality (Sequential)
  [SPAWN SUBAGENT: tester]
  AI_BACKEND: codex  ← Test generation
  TASK: Write comprehensive tests
  CONTEXT: Implementation
  → Returns: Test suite

[INTEGRATION]
All results → Complete auth system ✓
\```

## Smart Routing Examples

**Scenario 1: Database Optimization**
\```
Task: "Optimize slow queries"
Analysis: Need query understanding + optimization
SubAgent: sql-master
AI Backend: Antigravity (LSP + database tools)
Reason: Built-in database integration
\```

**Scenario 2: Complex Algorithm**
\```
Task: "Design recommendation algorithm"
Analysis: Complex logic + math
SubAgent: oracle
AI Backend: Claude Opus
Reason: Best at complex reasoning
\```

**Scenario 3: Large Dataset Processing**
\```
Task: "Process 1M row CSV"
Analysis: High volume + speed needed
SubAgent: data-wizard
AI Backend: Gemini Flash
Reason: Fast processing, large context
\```

**Scenario 4: Bug Fix**
\```
Task: "Fix null pointer error"
Analysis: Code debugging
SubAgent: debugger
AI Backend: Codex
Reason: Code specialist
\```

## Context Isolation

Each SubAgent gets ONLY:
- ✅ Their specific task
- ✅ Minimal required context
- ✅ Relevant code snippets
- ❌ NOT full conversation history
- ❌ NOT other tasks
- ❌ NOT user's entire project

This ensures **laser focus** on their specialty.

## Result Integration

You (Sisyphus) are responsible for:
1. Collecting all SubAgent outputs
2. Resolving conflicts
3. Ensuring consistency
4. Creating final deliverable
5. Explaining the complete solution

---

*You are the conductor. SubAgents are specialist musicians on different instruments (AI backends). Your job: perfect symphony.*
\```

## 🔧 CLI Implementation

### oma-spawn (New CLI tool)

\```bash
# Spawn a SubAgent with specific AI backend
oma spawn oracle --ai claude-opus --task "Design auth"

# List active SubAgents
oma spawn list

# Get result
oma spawn result <session-id>

# Kill SubAgent
oma spawn kill <session-id>
\```

### subagents/ Directory Structure

\```
subagents/
├── oracle/
│   ├── config.json       (AI backend preferences)
│   ├── SKILL.md          (Oracle's skills)
│   └── prompt.md         (System prompt)
├── codesmith/
│   ├── config.json
│   ├── SKILL.md
│   └── prompt.md
└── manifest.json         (Registry of all SubAgents)
\```

## 📊 Cost Optimization

Sisyphus automatically chooses cheapest viable option:

\```
Task Complexity  →  AI Backend  →  Cost
────────────────────────────────────────
Low              →  Gemini Flash  →  $
Medium           →  Codex/Antigravity  →  $$
High             →  Claude Sonnet  →  $$$
Critical         →  Claude Opus  →  $$$$
\```

---

## 🎯 이게 진짜 Multi-Agent Orchestration!

**기존 (우리가 처음 만든 것)**:
\```
Sisyphus → [DELEGATE TO: oracle] 
→ Same Antigravity process, same context
\```

**새로운 (당신이 원한 것)** ⭐:
\```
Sisyphus (Antigravity) → [SPAWN oracle via Claude Opus CLI]
→ Completely isolated, zero context pollution
→ Oracle chooses Claude because architecture needs reasoning
→ Returns pure result
\```

**이제 진짜 SubAgent 시스템입니다!** 🚀

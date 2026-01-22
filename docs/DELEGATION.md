# OMA Delegation Protocol

## 🎯 Purpose

Defines how OMA skills delegate tasks to each other for collaborative problem-solving.

## 🏗️ Architecture

```
Orchestrator (Sisyphus)
  ↓ analyzes task
  ↓ identifies specialists
  ↓
  ├─→ Oracle (architecture)
  ├─→ CodeSmith (implementation)  
  ├─→ Pixel (UI/UX)
  ├─→ Tester (testing)
  └─→ Scribe (documentation)
  ↓
  ↓ integrates results
  ↓
Final Solution
```

## 📋 Delegation Syntax

### Format

```
[DELEGATE TO: <skill-name>]
TASK: <clear, focused task description>
CONTEXT: <relevant background information>
REQUIREMENTS: <specific deliverables>
OUTPUT: <expected format>
[END DELEGATION]
```

### Example

```
[DELEGATE TO: oracle]
TASK: Design authentication system architecture
CONTEXT: 
- E-commerce platform
- 100k users expected
- Need JWT-based auth
REQUIREMENTS:
- Secure password storage
- Token expiration strategy
- Refresh token handling
OUTPUT: Architecture diagram + technology choices with rationale
[END DELEGATION]
```

## 🎭 Specialist Registry

### Orchestrators

| Skill | Role | Can Delegate To |
|-------|------|-----------------|
| **sisyphus** | Master Orchestrator | All specialists |
| **prometheus** | Strategic Planner | metis, all specialists |
| **metis** | Plan Validator | None (reviewonly) |

### Specialists by Domain

#### **Architecture & Design**
- **oracle** - System architecture, design patterns
  - Accepts: `design`, `architecture`, `review`, `strategy`
  - Model: Claude Opus 4
  
- **architect** - Database/API schema
  - Accepts: `schema`, `api-design`, `database`
  - Model: Claude Sonnet 3.5

- **strategist** - Technical decisions
  - Accepts: `decision`, `comparison`, `evaluation`
  - Model: Claude Sonnet 3.5

#### **Development**
- **codesmith** - Backend implementation
  - Accepts: `implement`, `code`, `backend`
  - Model: Claude Sonnet 3.5

- **pixel** - UI/UX development
  - Accepts: `ui`, `component`, `frontend`, `design`
  - Model: Claude Sonnet 3.5

- **refactorer** - Code improvement
  - Accepts: `refactor`, `cleanup`, `improve`
  - Model: Claude Sonnet 3.5

#### **Testing & Quality**
- **tester** - Automated testing
  - Accepts: `test`, `unit`, `integration`
  - Model: Claude Sonnet 3.5

- **qa-engineer** - Manual testing
  - Accepts: `manual-test`, `test-plan`
  - Model: Claude Haiku

- **security-guard** - Security audit
  - Accepts: `security`, `audit`, `vulnerability`
  - Model: Claude Opus 4

#### **Research & Documentation**
- **librarian** - Research & examples
  - Accepts: `research`, `example`, `documentation`
  - Model: Claude Haiku

- **explorer** - Code navigation
  - Accepts: `find`, `search`, `locate`
  - Model: Claude Haiku

- **scribe** - Technical writing
  - Accepts: `document`, `readme`, `guide`
  - Model: Claude Sonnet 3.5

- **researcher** - Multi-repo analysis
  - Accepts: `analyze`, `compare`, `research`
  - Model: Claude Sonnet 3.5

#### **Data & Analysis**
- **scientist-low** - Quick data exploration
  - Accepts: `data-explore`, `stats`
  - Model: Claude Haiku

- **scientist** - Standard analysis
  - Accepts: `analyze-data`, `statistics`
  - Model: Claude Sonnet 3.5

- **scientist-high** - Advanced research
  - Accepts: `ml`, `research`, `complex-analysis`
  - Model: Claude Opus 4

- **data-wizard** - ETL pipelines
  - Accepts: `etl`, `pipeline`, `transform`
  - Model: Claude Sonnet 3.5

- **sql-master** - Database queries
  - Accepts: `query`, `optimize-sql`
  - Model: Claude Sonnet 3.5

#### **Specialized Tools**
- **debugger** - Bug fixing
  - Accepts: `debug`, `fix`, `troubleshoot`
  - Model: Claude Sonnet 3.5

- **git-master** - Version control
  - Accepts: `commit`, `branch`, `git`
  - Model: Claude Haiku

- **devops-engineer** - Deployment
  - Accepts: `deploy`, `cicd`, `infrastructure`
  - Model: Claude Opus 4

- **performance-expert** - Optimization
  - Accepts: `optimize`, `performance`, `profile`
  - Model: Claude Opus 4

- **playwright-master** - E2E testing
  - Accepts: `e2e`, `browser-test`, `automation`
  - Model: Claude Sonnet 3.5

- **multimodal-looker** - Visual analysis
  - Accepts: `analyze-image`, `screenshot`, `diagram`
  - Model: Claude Opus 4 (Vision)

## 🔄 Delegation Workflow

### 1. Task Analysis (Orchestrator)

```markdown
User Request: "Build user authentication system"

Sisyphus analyzes:
- Complexity: High (requires multiple specialists)
- Domains: Architecture, Security, Implementation, Testing, Docs
- Specialists needed: 6
```

### 2. Specialist Selection

```markdown
Based on task domains:
✓ oracle (architecture design)
✓ security-guard (security requirements)
✓ architect (database schema)
✓ codesmith (implementation)
✓ tester (test suite)
✓ scribe (documentation)
```

### 3. Sequential Delegation

```markdown
Round 1 (Design):
[DELEGATE TO: oracle]
TASK: Design authentication system architecture
→ Returns: Architecture diagram

Round 2 (Security):
[DELEGATE TO: security-guard]
TASK: Define security requirements
CONTEXT: Architecture from Round 1
→ Returns: Security checklist

Round 3 (Schema):
[DELEGATE TO: architect]
TASK: Design user database schema
CONTEXT: Architecture + Security requirements
→ Returns: SQL schema

Round 4 (Implementation):
[DELEGATE TO: codesmith]
TASK: Implement auth endpoints
CONTEXT: All previous outputs
→ Returns: Working code

Round 5 (Testing):
[DELEGATE TO: tester]
TASK: Write comprehensive tests
CONTEXT: Implementation
→ Returns: Test suite

Round 6 (Documentation):
[DELEGATE TO: scribe]
TASK: Document API
CONTEXT: Implementation + Tests
→ Returns: API docs
```

### 4. Result Integration

```markdown
Sisyphus combines all results:
- Architecture (from oracle)
- Security checklist (from security-guard)
- Database schema (from architect)
- Implementation (from codesmith)
- Tests (from tester)
- Documentation (from scribe)

→ Delivers complete authentication system
```

## 📊 Parallel Delegation

For independent tasks:

```markdown
User: "Optimize application performance"

Sisyphus delegates in parallel:

[PARALLEL START]
  ├─→ performance-expert: Profile CPU/memory
  ├─→ sql-master: Optimize database queries
  └─→ pixel: Optimize frontend assets
[PARALLEL END]

Wait for all results → Integrate → Report
```

## 🎯 Context Isolation

Each specialist receives ONLY:

✅ **Included:**
- Task description
- Relevant context
- Required inputs
- Output format

❌ **Excluded:**
- Full conversation history
- Other specialists' tasks
- Unrelated user messages
- General chat

This ensures **focused execution** without distraction.

## 📝 Result Format

```markdown
[RESULT FROM: oracle]
STATUS: Complete
DELIVERABLE:
# Authentication System Architecture

## Technology Stack
- JWT for stateless auth
- bcrypt for password hashing (cost: 12)
- Redis for token blacklist

## Components
1. Auth Service (Node.js + Express)
2. User Database (PostgreSQL)
3. Token Cache (Redis)

## Flow
[Diagram]

RATIONALE:
- JWT chosen for scalability
- bcrypt for security
- Redis for fast token invalidation

NEXT STEPS:
- Implement schema (→ architect)
- Define security policies (→ security-guard)
[END RESULT]
```

## 🔧 Implementation in SKILL.md

Each orchestrator's SKILL.md should include:

```markdown
## Available Specialists

(List from registry above)

## How to Delegate

Use [DELEGATE TO: skill-name] syntax.

## Delegation Examples

(Show common patterns)
```

---

**This protocol enables OMA skills to work together seamlessly!** 🎯

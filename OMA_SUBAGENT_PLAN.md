# OMA SubAgent Integration Plan

## 🎯 목표

**Oh My Antigravity 내부에서 서브에이전트 개념을 도입**하여 skills 간 delegation을 명시적으로 만들기

## 🏗️ 아키텍처

### Antigravity-SubAgents 방식 (외부 CLI):
```
Main Agent → spawns → External CLI → returns result
(Antigravity)         (Codex/Claude)
```

### OMA SubAgent 방식 (내부 Delegation):
```
Orchestrator Skill → delegates → Specialist Skill → returns result
(Sisyphus)                        (Oracle/CodeSmith)
```

## 📁 제안하는 구조

```
oma/
├── skills/                      ← Main Skills (28 agents)
│   ├── sisyphus/
│   │   └── SKILL.md            (Orchestrator)
│   ├── oracle/
│   │   └── SKILL.md            (Specialist)
│   └── codesmith/
│       └── SKILL.md            (Specialist)
│
├── delegation/                  ← NEW! Delegation Protocol
│   ├── protocol.md             (How skills call each other)
│   ├── registry.json           (Which skills are available)
│   └── examples/
│       └── sisyphus-to-oracle.md
│
└── workflows/
    └── orchestration.md        (Orchestration patterns)
```

## 🔧 Delegation Protocol

### 1. Registry (delegation/registry.json)

```json
{
  "orchestrators": [
    {
      "name": "sisyphus",
      "role": "master-orchestrator",
      "canDelegate": true,
      "delegates": ["all"]
    },
    {
      "name": "prometheus",
      "role": "planner",
      "canDelegate": true,
      "delegates": ["metis"]
    }
  ],
  "specialists": [
    {
      "name": "oracle",
      "specialty": "architecture",
      "accepts": ["design", "review", "strategy"],
      "model": "claude-opus-4"
    },
    {
      "name": "codesmith",
      "specialty": "implementation",
      "accepts": ["code", "implement", "build"],
      "model": "claude-sonnet-3.5"
    },
    {
      "name": "pixel",
      "specialty": "ui-ux",
      "accepts": ["design-ui", "component", "frontend"],
      "model": "claude-sonnet-3.5"
    }
  ]
}
```

### 2. Protocol (delegation/protocol.md)

```markdown
# OMA Delegation Protocol

## How Orchestrators Delegate

### Step 1: Task Analysis
Orchestrator analyzes the user request and identifies required specialists.

### Step 2: Specialist Selection
```
IF task requires architecture:
  SELECT oracle
ELSE IF task requires implementation:
  SELECT codesmith
ELSE IF task requires UI:
  SELECT pixel
```

### Step 3: Delegation Syntax
```
[DELEGATE TO: oracle]
Task: Design authentication system
Context: User authentication with JWT
Requirements:
- Secure password hashing
- Token expiration
- Refresh token logic
[END DELEGATION]
```

### Step 4: Specialist Execution
Oracle receives ONLY:
- Task description
- Context
- Requirements

NOT:
- Full conversation history
- Other tasks
- Unrelated context

### Step 5: Result Integration
```
[RESULT FROM: oracle]
Architecture:
- Use bcrypt for hashing
- JWT with 15min expiry
- Refresh token in httpOnly cookie
[END RESULT]
```

Orchestrator integrates this into overall plan.
```

## 💡 실제 구현 방법

### Option 1: SKILL.md Instructions (Simple) ⭐

**Sisyphus SKILL.md에 명시적 delegation 지침 추가**:

```markdown
# Sisyphus - Master Orchestrator

## Delegation Syntax

When you need to delegate, use this format:

\```
[SPAWN SUBAGENT: oracle]
TASK: Design database schema for e-commerce
CONTEXT: PostgreSQL, 100k users
OUTPUT: SQL schema + explanation
[END SPAWN]
\```

## Available Specialists

### Architecture
- **oracle**: System design, architecture decisions
- **architect**: Database/API schema design
- **stitch**: UI/UX Design (Gemini Stitch) [NEW]

### Development
- **codesmith**: Backend implementation
- **pixel**: UI/UX development

### Quality
- **tester**: Test writing
- **security-guard**: Security audit

## Delegation Workflow

1. Analyze user request
2. Identify specialists needed
3. For each specialist:
   - Spawn with TASK, CONTEXT, OUTPUT
   - Wait for result
   - Integrate into plan
4. Return complete solution
```

### Option 2: Dedicated SubAgent System (Advanced)

```
oma/
├── skills/              ← 28 specialists
│
├── subagents/           ← Delegation metadata
│   ├── manifest.json   (Registry)
│   ├── protocol.md     (How to delegate)
│   └── sessions/       (Delegation logs)
│
└── bin/
    └── oma-delegate.ps1  ← CLI tool for delegation
```

**oma-delegate.ps1**:
```powershell
# Spawn a subagent
oma delegate oracle --task "Design auth system" --context "JWT, bcrypt"

# List active delegations
oma delegate list

# Get result
oma delegate result <session-id>
```

### Option 3: Hybrid (Recommended!) 🎯

```
oma/
├── skills/              ← Main skills (unchanged)
│   ├── sisyphus/
│   │   └── SKILL.md    (includes delegation instructions)
│   └── oracle/
│
├── docs/
│   ├── AGENTS.md       (Agent catalog)
│   └── DELEGATION.md   (How delegation works)
│
└── workflows/
    └── delegation-examples.md
```

**delegation-examples.md**:
```markdown
# OMA Delegation Examples

## Example 1: Complex Feature

User: "Build user authentication"

Sisyphus delegates:
1. Oracle → Architecture design
2. SecurityGuard → Security requirements
3. Architect → Database schema
4. CodeSmith → Implementation
5. Tester → Tests
6. Scribe → Documentation

Each receives focused task, returns result.

## Example 2: Bug Fix

User: "Login button not working"

Sisyphus delegates:
1. Debugger → Find root cause
2. CodeSmith → Fix implementation
3. Tester → Regression tests
```

## 🚀 실용적 구현 단계

### Phase 1: Documentation (즉시 가능)

1. **DELEGATION.md 작성**
   ```
   docs/
   └── DELEGATION.md  (프로토콜 설명)
   ```

2. **Sisyphus SKILL.md 업데이트**
   ```
   skills/sisyphus/SKILL.md
   → Delegation syntax 추가
   → Available specialists 명시
   ```

3. **Examples 추가**
   ```
   workflows/
   └── delegation-examples.md
   ```

### Phase 2: Registry (선택사항)

1. **Registry 생성**
   ```json
   delegation/registry.json
   {
     "specialists": [...],
     "capabilities": [...]
   }
   ```

2. **Protocol 문서화**
   ```
   delegation/protocol.md
   ```

### Phase 3: Tooling (미래)

1. **CLI 도구**
   ```bash
   oma delegate oracle --task "..."
   ```

2. **Session 관리**
   ```bash
   oma delegation list
   oma delegation result <id>
   ```

## 📊 비교

| | Antigravity-SubAgents | **OMA SubAgents** |
|--|----------------------|------------------|
| **실행 위치** | 외부 CLI 프로세스 | Antigravity 내부 |
| **대상** | Codex/Claude CLI | OMA Skills |
| **격리** | 완전 격리 (별도 프로세스) | 컨텍스트 격리 (지침으로) |
| **통신** | Shell 실행 | Delegation syntax |
| **용도** | 외부 도구 통합 | Skills 간 협업 |

## ✅ 권장 사항

### 지금 당장 (Phase 1):

1. **`docs/DELEGATION.md` 작성** ✅
   - Delegation 프로토콜 문서화
   - Syntax 정의
   - Examples 제공

2. **Sisyphus SKILL.md 개선** ✅
   - Delegation instructions 추가
   - Specialist catalog 포함
   - Workflow examples

3. **`workflows/delegation-examples.md`** ✅
   - 실제 사용 패턴
   - 복잡한 시나리오

### 나중에 (Phase 2-3):

- Registry system
- CLI tooling
- Session management

---

## 🎯 결론

**예, 서브에이전트 개념을 도입하면 매우 좋습니다!**

**실용적 접근**:
1. 문서화로 시작 (DELEGATION.md)
2. SKILL.md에 instructions 추가
3. Examples로 패턴 보여주기
4. 나중에 tooling 추가

**장점**:
- ✅ Delegation이 명시적
- ✅ Skills 간 협업 명확
- ✅ Orchestration 패턴 표준화
- ✅ 확장 가능

**지금 바로 만들까요?** 🚀

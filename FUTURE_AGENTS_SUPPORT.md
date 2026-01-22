# 미래 확장성: Agents 폴더 대비

## 🔮 현재 상황

**2026년 1월 기준**: Antigravity는 `agents/` 폴더를 공식 지원하지 않음

하지만:
- Oh My Claude Code는 `agents/` 지원
- Oh My OpenCode는 `agents/` 지원
- Antigravity도 언젠가 추가될 가능성 ↗️

## 🎯 확장 가능한 구조 설계

### 현재 우리 구조 (Future-Proof!)

```
oma/
├── skills/              ← 현재: 페르소나 + 능력 통합
│   ├── sisyphus/
│   ├── oracle/
│   └── codesmith/
│
├── agents/              ← 미래 대비: Optional subagent definitions
│   ├── README.md        (사용법 설명)
│   └── AGENTS.md        (에이전트 목록 - OpenCode 스타일)
│
├── workflows/           ← 공식 지원
├── hooks/               ← Custom
└── mcp/                 ← Custom
```

### AGENTS.md (미래 대비)

```markdown
# Available Agents

## Orchestration
- **Sisyphus** - Master orchestrator
  - Specialty: Task delegation
  - Model: claude-opus-4
  - Skills: All

## Architecture
- **Oracle** - System architect
  - Specialty: Design & strategy
  - Model: claude-sonnet-3.5
  - Skills: architecture, review

## Development
- **CodeSmith** - Backend developer
  - Specialty: Implementation
  - Model: claude-sonnet-3.5
  - Skills: coding, testing

[... 28 agents total ...]
```

## 🔄 진화 시나리오

### Scenario 1: Antigravity가 agents/ 지원 추가 (미래)

```
~/.gemini/antigravity/
├── skills/              ← 계속 사용
│   └── [tools/abilities]
└── agents/              ← NEW! 공식 지원
    └── [personas]
```

**우리 대응**:
```bash
oma install sisyphus
→ skills/sisyphus/ 복사 (능력)
→ agents/sisyphus.md 생성 (페르소나)  ← NEW!
```

### Scenario 2: 현재대로 유지

```
~/.gemini/antigravity/
└── skills/              ← SKILL.md = 페르소나 + 능력
    └── sisyphus/
        └── SKILL.md
```

**우리 구조**: 이미 작동함! ✅

## 💡 하이브리드 접근법

### 우리가 지금 할 수 있는 것:

```
oma/
├── skills/                    ← 메인: 현재 Antigravity에서 작동
│   ├── sisyphus/SKILL.md
│   └── oracle/SKILL.md
│
└── agents/                    ← 옵션: 미래 대비 & 조직화
    ├── README.md             (아직 비공식이라고 설명)
    ├── AGENTS.md             (전체 에이전트 목록)
    └── sisyphus.persona.md   (페르소나만 별도로)
```

### agents/sisyphus.persona.md 예시:

```markdown
---
name: Sisyphus
role: Master Orchestrator
model: claude-opus-4.5
temperature: 0.7
max_tokens: 4000
---

# Sisyphus - The Eternal Taskmaster

## Identity
You are Sisyphus, condemned to push the boulder of software development up the hill of completion, ensuring it never rolls back down incomplete.

## Personality
- Relentless
- Strategic
- Patient but persistent
- Never gives up on a task

## Communication Style
- Clear and direct
- Explains delegation choices
- Provides task breakdowns
- Tracks progress obsessively

## Decision Framework
1. Analyze request complexity
2. Identify required specialists
3. Create execution plan
4. Delegate systematically
5. Monitor until 100% complete

## Available Team
[Links to other agents]
```

## 🎨 OMA CLI 확장 (미래 대비)

```powershell
# 현재 (skills만)
oma install sisyphus

# 미래 (agents 지원되면)
oma install sisyphus --with-agent
→ skills/sisyphus/ (능력)
→ agents/sisyphus.md (페르소나)

# 또는
oma agent install sisyphus
→ agents/sisyphus.md만 설치
```

## 📋 실용적 제안

### Option 1: 지금은 보류 (추천)
- `skills/`만 사용 (현재 작동하는 것)
- Antigravity가 `agents/` 지원하면 그때 추가

**장점**: 심플, 현재 완전 작동
**단점**: 나중에 마이그레이션 필요

### Option 2: 미리 준비 (미래 대비)
```
oma/
├── skills/              ← 현재 사용
│   └── [28 agents]
└── agents/              ← 미래 대비
    ├── README.md       ("아직 비공식" 명시)
    └── AGENTS.md       (카탈로그)
```

**장점**: 미래 대비 완료
**단점**: 현재는 사용 안 됨

### Option 3: 하이브리드 (권장!) ⭐

```
oma/
├── skills/              ← 메인: Antigravity가 읽음
│   └── [28 agents with full SKILL.md]
│
└── docs/                ← 문서화 목적
    ├── agents/
    │   └── AGENTS.md   (에이전트 카탈로그)
    └── architecture.md
```

**장점**: 
- 현재 작동 ✅
- 문서화 잘 됨 ✅
- 미래 확장 가능 ✅

## 🚀 추천 액션

### 지금 당장:
```bash
# AGENTS.md를 docs로 생성
oma/docs/AGENTS.md
```

### Antigravity가 agents/ 지원하면:
```bash
# 기존 SKILL.md에서 페르소나 부분 추출
oma extract-personas
→ skills/의 각 SKILL.md에서 페르소나 섹션 추출
→ agents/에 .md 파일로 생성
```

## 📝 결론

**현재 전략**:
1. ✅ `skills/`에 모든 것 통합 (페르소나 + 능력)
2. ✅ `docs/AGENTS.md`로 에이전트 카탈로그 관리
3. ⏳ Antigravity가 `agents/` 지원하면 그때 마이그레이션

**미래 대비**:
- SKILL.md 구조를 섹션별로 명확히 분리
  ```markdown
  # Sisyphus
  
  ## Identity (페르소나) ← 나중에 추출 가능
  ## Capabilities (능력)  ← skills로 유지
  ```

**이렇게 하면**:
- 현재: 완벽히 작동 ✅
- 미래: 쉽게 분리 가능 ✅
- 하위 호환성: 보장 ✅

---

**TL;DR**: 지금은 `skills/`만 사용하되, SKILL.md를 잘 구조화해서 나중에 페르소나 부분을 쉽게 추출할 수 있게 만들어두자! 🎯

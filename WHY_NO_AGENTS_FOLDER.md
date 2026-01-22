# Antigravity vs Claude Code vs OpenCode 구조 차이

## 🔍 핵심 차이점

### Oh My Claude Code 구조
```
~/.claude/
├── agents/          ← 에이전트 페르소나 정의
│   ├── sisyphus.md
│   ├── oracle.md
│   └── codesmith.md
└── skills/          ← 능력/도구 정의
    ├── playwright.md
    └── git-master.md
```

### Oh My OpenCode 구조
```
~/.opencode/
├── agents/          ← 에이전트 페르소나 정의
│   └── AGENTS.md    (모든 에이전트 나열)
└── skills/          ← 능력/도구 정의
    ├── websearch/
    └── python-repl/
```

### ⚡ Antigravity 구조 (통합!)
```
~/.gemini/antigravity/
├── skills/          ← 에이전트 + 능력 통합!
│   ├── sisyphus/
│   │   └── SKILL.md  (페르소나 + 능력 모두)
│   ├── oracle/
│   │   └── SKILL.md
│   └── codesmith/
│       └── SKILL.md
└── workflows/       ← Slash commands
    └── ultrawork.md
```

## 💡 왜 Antigravity는 agents 폴더가 없나?

### Antigravity의 철학: "Everything is a Skill"

**Antigravity는 `agents`와 `skills`를 구분하지 않습니다.**

#### Claude/OpenCode 방식:
```
agents/sisyphus.md:
  "You are Sisyphus, the orchestrator..."

skills/playwright.md:
  "Use Playwright to automate browsers..."
```

#### Antigravity 방식:
```
skills/sisyphus/SKILL.md:
  ---
  name: sisyphus
  description: Master orchestrator
  ---
  
  # Sisyphus
  
  You are Sisyphus, the orchestrator...
  
  ## Capabilities
  - Task delegation
  - Workflow coordination
  
  ## Tools
  - Can spawn other agents
  - Access to all skills
```

**즉, SKILL.md 안에 "누구인가(페르소나)" + "무엇을 할 수 있는가(능력)"가 모두 들어갑니다.**

## 📋 각 프레임워크 비교

| 항목 | Claude Code | OpenCode | **Antigravity** |
|------|-------------|----------|-----------------|
| **에이전트 정의** | `agents/` | `agents/` | **`skills/`** |
| **능력 정의** | `skills/` | `skills/` | **`skills/`** |
| **분리 여부** | ✅ 분리 | ✅ 분리 | ❌ **통합** |
| **자동 로드** | ✅ | ✅ | ✅ |
| **철학** | 역할과 능력 분리 | 역할과 능력 분리 | **모든 것은 스킬** |

## ✅ Oh My Antigravity의 올바른 구조

```
oma/
├── skills/                    ← 28 agents, 모두 SKILL.md로
│   ├── sisyphus/
│   │   └── SKILL.md          (오케스트레이터 페르소나 + 능력)
│   ├── oracle/
│   │   └── SKILL.md          (아키텍트 페르소나 + 능력)
│   ├── codesmith/
│   │   └── SKILL.md          (코더 페르소나 + 능력)
│   ├── pixel/
│   │   └── SKILL.md          (UI 전문가 페르소나 + 능력)
│   └── [... 24 more ...]
│
├── workflows/                 ← Slash commands
│   ├── ultrawork.md
│   ├── ralph.md
│   └── research.md
│
├── hooks/                     ← Custom (비공식)
│   ├── PreToolUse.js
│   └── TodoEnforcer.js
│
└── mcp/                       ← Custom MCP servers
    └── websearch/
```

## 🎯 실제 예시

### ❌ 틀린 방법 (Claude Code 스타일)
```
agents/sisyphus.md:
  You are Sisyphus...

skills/sisyphus-delegation.md:
  How to delegate tasks...
```

### ✅ 올바른 방법 (Antigravity 스타일)
```
skills/sisyphus/SKILL.md:
  ---
  name: sisyphus
  description: Master orchestrator
  specialty: orchestration
  ---
  
  # Sisyphus - The Master Orchestrator
  
  You are **Sisyphus**, the primary orchestrator.
  
  ## Core Responsibilities
  - Task analysis
  - Agent selection
  - Workflow coordination
  
  ## Available Specialists
  - Oracle (architecture)
  - CodeSmith (implementation)
  - Pixel (UI/UX)
  ...
```

## 📝 SKILL.md 구조

```yaml
---
name: agent-name
description: Short description
version: 1.0.0
specialty: domain
---

# Agent Name - Tagline

You are **AgentName**, the specialist.

## Who You Are (페르소나)
- Your role
- Your philosophy
- Your approach

## What You Do (능력)
- Capability 1
- Capability 2
- Capability 3

## How You Do It (방법)
- Tool 1
- Tool 2
- Pattern examples
```

## 🚀 결론

**Antigravity는 `agents/` 폴더를 공식 지원하지 않습니다.**

이유:
1. **단순성**: 하나의 통일된 구조 (`skills/`)
2. **명확성**: SKILL.md = 페르소나 + 능력
3. **일관성**: 모든 것이 "스킬"로 취급됨

**우리 구조가 맞습니다!** ✅

- ✅ `skills/sisyphus/SKILL.md` (에이전트 페르소나 포함)
- ✅ `skills/oracle/SKILL.md` (에이전트 페르소나 포함)
- ✅ `skills/codesmith/SKILL.md` (에이전트 페르소나 포함)

Antigravity가 이들을 읽고 각각을 독립적인 "페르소나를 가진 스킬"로 인식합니다.

---

**TL;DR**: Antigravity는 agents와 skills를 구분하지 않고 모두 `skills/`에 통합했습니다. 
SKILL.md 안에 "누구인가"와 "무엇을 하는가"를 모두 작성하면 됩니다! 🎯

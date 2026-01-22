# 🚨 중요 발견! Antigravity SubAgents 공식 지원!

## 📌 요약

**Antigravity는 이미 SubAgents를 지원합니다!**

GitHub: https://github.com/OleynikAleksandr/antigravity-subagents

## 🎯 핵심 내용

### Antigravity SubAgents란?

Antigravity IDE가 **전문화된 서브 에이전트**를 사용할 수 있게 해주는 인프라입니다.

### 작동 방식:

```
Main Agent (Orchestrator in Antigravity)
  ↓ delegates task
SubAgent (runs via Codex CLI or Claude Code CLI)
  ↓ returns result
Main Agent (receives final answer)
```

### 핵심 기능:

1. **Orchestration**
   - Antigravity의 Main Agent가 Orchestrator로 작동
   - 작업을 SubAgent에게 위임

2. **SubAgent Vendors**
   - Codex CLI로 실행
   - Claude Code CLI로 실행

3. **Focused Execution**
   - SubAgent는 **오직 특정 지시사항만** 받음
   - 일반 채팅 히스토리 없음
   - 집중된 실행

4. **Isolation**
   - Codex: 별도 `CODEX_HOME` 사용
   - Claude: `--setting-sources ""` 플래그로 격리

5. **Auto-Routing**
   - `.agent/rules/subagent-delegation-protocol.md` 자동 생성
   - Orchestrator가 라우팅 지침 받음

6. **Workflow Generation**
   - Global: `~/.gemini/antigravity/global_workflows/`
   - Project: `<project>/.agent/workflows/`

## 📁 구조

```
~/.subagents/              # Global SubAgents Storage
├── manifest.json          # Registry of deployed agents
└── {agent}/               # Agent Directory

~/.gemini/
├── GEMINI.md             # Auto-Routing Instructions
└── antigravity/
    └── global_workflows/  # Global Slash Commands
        └── subagent-{name}.md

<ProjectRoot>/
├── .subagents/            # Project SubAgents
└── .agent/
    └── workflows/         # Project Slash Commands
        └── subagent-{name}.md
```

## 💡 Oh My Antigravity와의 관계

### 우리가 만든 것:
```
skills/
  └── sisyphus/SKILL.md    (Antigravity native skill)
```

### antigravity-subagents가 하는 것:
```
~/.subagents/
  └── translator/          (External CLI tool as subagent)
      └── instructions.md
```

### 차이점:

| 항목 | OMA Skills | Antigravity SubAgents |
|------|-----------|----------------------|
| **실행 위치** | Antigravity 내부 | 외부 CLI (Codex/Claude) |
| **용도** | Antigravity 에이전트 능력 | 외부 도구 통합 |
| **격리** | Antigravity context | 완전 격리됨 |
| **예시** | Sisyphus, Oracle | Translator (via Codex) |

## 🎯 통합 전략

### Option 1: OMA Skills (현재)
```
oma/skills/sisyphus/SKILL.md
→ Antigravity가 직접 실행
→ 빠름, 통합적
```

### Option 2: SubAgents (외부 도구)
```
~/.subagents/translator/
→ Codex CLI로 실행
→ 격리됨, 전문화
```

### Option 3: 하이브리드 (추천!) ⭐

```
OMA에서:
1. Orchestrator Skills (Sisyphus) → Antigravity native
2. Specialist Skills (Oracle, CodeSmith) → Antigravity native
3. External Tools → SubAgents로 래핑

oma/
├── skills/              ← Antigravity native agents
│   ├── sisyphus/
│   └── oracle/
│
└── subagents/           ← External tool wrappers
    ├── codex-expert/    (runs via Codex CLI)
    └── claude-researcher/ (runs via Claude CLI)
```

## 🔧 OMA에 통합 방법

### 1. SubAgent 지원 추가

```bash
# OMA CLI 확장
oma subagent create translator --vendor codex
→ ~/.subagents/translator/ 생성
→ GEMINI.md 업데이트
→ workflow 생성
```

### 2. 기존 Skills와 조화

```
Sisyphus (OMA Skill)
  → 여러 Claude 모델 중 선택
  
Translator (SubAgent)
  → Codex CLI로 실행
  → 완전히 격리된 환경
```

## 📊 실제 사용 예시

### Antigravity SubAgents 방식:

```yaml
Name: translator
Vendor: Codex
Instructions: |
  You are a professional translator.
  Translate to the requested language.
  Save next to original files.
```

사용:
```
User: "Translate README.md to Russian"
  ↓
Orchestrator (reads GEMINI.md)
  ↓ finds translator agent
SubAgent (Codex CLI starts with ONLY translator instructions)
  ↓
Perfect focused result ✅
```

## 🎉 결론

**Antigravity는 이미 SubAgent 시스템을 가지고 있습니다!**

### 우리가 해야 할 것:

1. ✅ **OMA Skills 유지** (Antigravity native)
   - Sisyphus, Oracle, CodeSmith 등
   - Antigravity 내에서 직접 실행

2. 🆕 **SubAgent 통합 추가** (선택사항)
   - 외부 CLI 도구 래퍼
   - Codex/Claude CLI 활용
   - 완전 격리 필요한 작업

3. 🔄 **OMA CLI 확장**
   ```bash
   oma skill install sisyphus      # Antigravity skill
   oma subagent create translator   # External subagent
   ```

### 실용적 접근:

**현재 (Phase 1)**:
- OMA Skills만 집중 ✅
- 28개 에이전트 모두 skills로

**미래 (Phase 2)**:
- SubAgents 통합 추가
- 외부 도구 래핑
- Codex/Claude CLI 활용

---

**TL;DR**: 
- Antigravity-SubAgents = 외부 CLI 도구를 SubAgent로 사용
- OMA Skills = Antigravity native 에이전트
- 둘 다 필요! 상호보완적! 🎯

우리 구조는 정확합니다! ✅

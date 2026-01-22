# 🧩 OMA 개념 완전 정리

## 헷갈리는 용어들 명확히 구분

### 1. Skills vs Agents vs SubAgents vs Plugins

#### **Skills** (Antigravity 공식 용어)
```
~/.gemini/antigravity/skills/sisyphus/SKILL.md
```
- **정의**: Antigravity IDE가 인식하는 능력 단위
- **형식**: `SKILL.md` 파일 (YAML frontmatter + instructions)
- **역할**: Antigravity에게 "이렇게 행동하라"는 지시사항
- **예시**: Sisyphus, Oracle, CodeSmith

#### **Agents** (개념적 용어)
```
비유: Skills = "악보", Agents = "연주자"
```
- **정의**: Skills를 실행하는 AI 페르소나
- **실제**: Antigravity가 SKILL.md를 읽고 그 페르소나로 행동
- **예시**: "Sisyphus처럼 행동하는 Antigravity"

#### **SubAgents**
```
2가지 의미가 있음!
```

**의미 1: Antigravity-SubAgents (외부 CLI)**
```
~/.subagents/translator/
→ Codex CLI 또는 Claude CLI로 실행
→ 완전히 별도 프로세스
```
- **정의**: 외부 CLI 도구를 SubAgent로 래핑
- **실행**: 별도 프로세스 spawn
- **격리**: 완전 격리 (환경변수까지 분리)
- **용도**: 외부 도구 통합

**의미 2: OMA SubAgents (내부 Delegation)**
```
[DELEGATE TO: oracle]
→ Antigravity 내에서 oracle skill 실행
→ 같은 프로세스, 다른 context
```
- **정의**: Skills 간 delegation
- **실행**: 같은 Antigravity 프로세스
- **격리**: Context-level (지시사항으로)
- **용도**: Skills 협업

#### **Plugins** (비공식/혼용)
```
❌ 틀린 용어 (우리가 초반에 잘못 씀)
✅ 올바른 용어: Skills
```
- Antigravity는 "plugins" 폴더를 인식 안 함
- "skills" 폴더만 인식

---

### 2. Global vs Project Scope

#### **Global Scope**
```
~/.gemini/antigravity/skills/
```
- **언제 적용**: 모든 프로젝트
- **설치**: `oma install sisyphus`
- **사용 예**: 범용 스킬 (git-master, debugger)

#### **Project Scope**
```
<workspace>/.agent/skills/
```
- **언제 적용**: 이 프로젝트만
- **설치**: `oma install pixel --project`
- **사용 예**: 프로젝트 특화 스킬

#### **우선순위**
```
Project > Global

.agent/skills/oracle/    ← 이게 있으면
~/.gemini/.../oracle/    ← 이건 무시됨
```

---

### 3. Skills vs Commands vs Workflows

#### **Skills** (`skills/`)
```markdown
skills/sisyphus/SKILL.md

---
name: sisyphus
---

You are Sisyphus, the orchestrator...
```
- **정의**: Agent 페르소나 + 능력
- **형식**: `SKILL.md`
- **위치**: `skills/`
- **예시**: Sisyphus, Oracle, CodeSmith

#### **Commands** (우리가 처음에 만든 것, 사실 Workflows임)
```markdown
commands/ultrawork.md  ← 틀림!
workflows/ultrawork.md ← 맞음!
```
- **정의**: Slash command 정의
- **형식**: Markdown
- **위치**: `workflows/` (Antigravity 공식)
- **예시**: `/ultrawork`, `/ralph`

#### **Workflows** (`workflows/`)
```markdown
workflows/ultrawork.md

---
description: Full autonomous mode
---

# /ultrawork

When user says /ultrawork...
```
- **정의**: Slash command 구현
- **형식**: YAML frontmatter + markdown
- **위치**: `~/.gemini/antigravity/workflows/` (공식)
- **트리거**: `/ultrawork`, `/research`

---

### 4. MCP vs Hooks

#### **MCP (Model Context Protocol)**
```json
~/.gemini/antigravity/mcp_config.json
{
  "mcpServers": {
    "websearch": {
      "command": "npx",
      "args": ["exa-mcp-server"]
    }
  }
}
```
- **정의**: 외부 도구 통합 프로토콜 (Anthropic 표준)
- **예시**: Websearch, Python REPL, LSP server
- **역할**: Antigravity에게 새로운 "도구" 제공
- **공식**: Antigravity 지원

#### **Hooks**
```javascript
hooks/PreToolUse.js

module.exports = async function(context) {
  // 도구 사용 전 실행
}
```
- **정의**: 이벤트 리스너 (우리가 만든 extension)
- **예시**: PreToolUse, TodoEnforcer, ContextInjection
- **역할**: Antigravity 동작 중간에 끼어들기
- **비공식**: OMA의 custom extension

---

### 5. Delegation vs Orchestration

#### **Delegation** (위임)
```
Sisyphus → "Oracle, design this!"
         → [DELEGATE TO: oracle]
```
- **정의**: 한 skill이 다른 skill에게 작업 맡김
- **수준**: Micro (작은 작업 단위)
- **예시**: Architecture 설계 위임

#### **Orchestration** (조율)
```
Sisyphus → 전체 계획 수립
         → Oracle (design)
         → CodeSmith (implement)
         → Tester (test)
         → 통합
```
- **정의**: 여러 delegation을 조율하여 완성
- **수준**: Macro (전체 프로젝트)
- **예시**: 인증 시스템 전체 구축

---

### 6. 실제 동작 흐름

#### **Case 1: Simple Task**
```
User: "Fix button CSS"
  ↓
Antigravity reads: skills/pixel/SKILL.md
  ↓
Antigravity acts as: Pixel (UI specialist)
  ↓
Pixel fixes CSS
  ↓
Done!
```

#### **Case 2: Complex Task (Delegation)**
```
User: "Build auth system"
  ↓
Antigravity reads: skills/sisyphus/SKILL.md
  ↓
Sisyphus (orchestrator):
  [DELEGATE TO: oracle]
    ↓
    Antigravity reads: skills/oracle/SKILL.md
    Oracle designs architecture
    Returns result
  
  [DELEGATE TO: codesmith]
    ↓
    Antigravity reads: skills/codesmith/SKILL.md
    CodeSmith implements
    Returns result
    
  Sisyphus integrates all results
  ↓
Done!
```

---

## 📊 한눈에 보는 비교표

| 용어 | 위치 | 형식 | 공식 지원 | 역할 |
|------|------|------|----------|------|
| **Skills** | `skills/` | `SKILL.md` | ✅ | Agent 페르소나 + 능력 |
| **Workflows** | `workflows/` | `.md` | ✅ | Slash commands |
| **MCP** | `mcp_config.json` | JSON | ✅ | 외부 도구 통합 |
| **Hooks** | `hooks/` | `.js` | ❌ | 이벤트 리스너 (OMA) |
| **SubAgents (외부)** | `~/.subagents/` | various | ⚠️ | 외부 CLI 래핑 |
| **SubAgents (내부)** | N/A | Syntax | ❌ | Skills 간 delegation |

---

## 🎯 OMA 아키텍처 정리

```
Oh My Antigravity (OMA)
├── Skills (28개)                    ← Antigravity가 읽음
│   ├── sisyphus/SKILL.md          ← Orchestrator
│   ├── oracle/SKILL.md            ← Specialist
│   └── codesmith/SKILL.md         ← Specialist
│
├── Workflows (4개)                  ← Slash commands
│   ├── ultrawork.md               ← /ultrawork
│   └── ralph.md                   ← /ralph
│
├── Delegation Protocol             ← Skills 협업 방법
│   └── [DELEGATE TO: ...] syntax
│
├── Hooks (3개)                      ← OMA extension
│   ├── PreToolUse.js
│   └── TodoEnforcer.js
│
├── MCP (optional)                   ← 외부 도구
│   └── mcp_config.json
│
└── CLI Tools                        ← 설치/관리
    ├── oma.ps1
    └── oma
```

---

## 💡 실전 예시

### Q: "Sisyphus는 뭐야?"
**A**: Sisyphus는 **skill**입니다.
- 파일: `skills/sisyphus/SKILL.md`
- 역할: Orchestrator (다른 skills에게 delegation)
- Antigravity가 이 파일을 읽고 "Sisyphus처럼" 행동

### Q: "/ultrawork는 뭐야?"
**A**: `/ultrawork`는 **workflow**입니다.
- 파일: `workflows/ultrawork.md`
- 역할: Slash command (사용자가 `/ulw` 타이핑하면 실행)
- Full autonomous mode 활성화

### Q: "SubAgent는 뭐야?"
**A**: 2가지 의미:
1. **Antigravity-SubAgents**: Codex/Claude CLI를 외부에서 실행
2. **OMA SubAgents**: Skills 간 delegation (우리가 만든 개념)

### Q: "Delegation은 뭐야?"
**A**: Skills 간 작업 위임:
```
Sisyphus: "Oracle, 아키텍처 설계해줘"
         [DELEGATE TO: oracle]
Oracle: "여기 있습니다: [architecture.md]"
Sisyphus: "좋아, 이제 CodeSmith한테 구현 맡길게"
```

### Q: "Hooks는 뭐야?"
**A**: OMA가 추가한 이벤트 시스템 (비공식):
- PreToolUse: 도구 사용 전
- TodoEnforcer: TODO 체크
- ContextInjection: Context 자동 추가

### Q: "MCP는 뭐야?"
**A**: 외부 도구 통합 (Anthropic 공식):
- Websearch: Exa API
- Python REPL: Python 실행
- LSP: 코드 인텔리전스

---

## 🔑 핵심 정리

1. **Skills = Agent 정의 파일** 
   - Antigravity가 읽고 그 역할 수행

2. **Workflows = Slash commands**
   - `/ultrawork` 같은 명령어

3. **Delegation = Skills 간 협업**
   - `[DELEGATE TO: oracle]`

4. **SubAgents = 2가지**
   - 외부 CLI (Antigravity-SubAgents)
   - 내부 delegation (OMA)

5. **MCP = 외부 도구 통합**
   - Websearch, Python 등

6. **Hooks = OMA 추가 기능**
   - 이벤트 리스너

---

**핵심**: 
- Antigravity가 공식 지원하는 건: **Skills, Workflows, MCP**
- OMA가 추가한 건: **Delegation protocol, Hooks, CLI tools**

이제 명확한가요? 😊

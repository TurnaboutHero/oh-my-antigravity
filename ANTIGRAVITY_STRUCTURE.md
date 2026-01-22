# Antigravity 공식 구조 설명

## ✅ 올바른 구조

Antigravity는 다음 경로를 **자동으로** 인식합니다:

### Skills (자동 로드됨)
```
Global:  ~/.gemini/antigravity/skills/
Project: <workspace>/.agent/skills/
```

### Workflows (자동 로드됨)
```
Global:  ~/.gemini/antigravity/workflows/
Project: <workspace>/.agent/workflows/
```

### MCP Config
```
~/.gemini/antigravity/mcp_config.json
```

## 📦 OMA 프로젝트 구조 (수정됨)

```
oh-my-antigravity/
├── skills/              ← (변경됨: plugins → skills)
│   ├── sisyphus/
│   ├── oracle/
│   ├── codesmith/
│   └── ... (28 agents)
├── workflows/           ← (변경됨: commands → workflows)
│   ├── ultrawork.md
│   ├── ralph.md
│   └── research.md
├── hooks/               ← (Custom, OMA가 관리)
│   ├── PreToolUse.js
│   └── TodoEnforcer.js
├── mcp/                 ← (Custom MCP servers)
│   └── README.md
├── bin/
│   ├── oma.ps1          ← (수정됨: skills 경로 사용)
│   └── oma
├── lib/
│   ├── install.ps1
│   └── install.sh
└── extension/           ← (VS Code GUI)
```

## 🔄 변경 사항

### 1. plugins → skills ✅
```bash
# Before (틀림)
oma/plugins/sisyphus/

# After (맞음)
oma/skills/sisyphus/
```

### 2. 설치 경로
```bash
# Global 설치
oma install sisyphus
→ ~/.gemini/antigravity/skills/sisyphus/

# Project 설치
oma install pixel --project
→ .agent/skills/pixel/
```

### 3. CLI 명령어
```powershell
# 사용 가능한 스킬 보기
.\bin\oma.ps1 list

# 설치 (Global)
.\bin\oma.ps1 install sisyphus

# 설치 (Project)
.\bin\oma.ps1 install oracle --project

# 설치된 스킬 확인
.\bin\oma.ps1 installed
```

## ⚠️ Custom vs Official

| Directory | Official | Auto-loaded? | Purpose |
|-----------|----------|--------------|---------|
| `skills/` | ✅ Yes | ✅ Yes | Agent capabilities |
| `workflows/` | ✅ Yes | ✅ Yes | Slash commands |
| `hooks/` | ❌ Custom | ❌ No | Event handlers (OMA extension) |
| `themes/` | ❌ Custom | ❌ No | Agent personas (future) |
| `mcp/` | ⚠️ Partial | Via config | Custom MCP servers |

## 🎯 올바른 사용법

### Antigravity가 자동으로 읽는 것:
```
~/.gemini/antigravity/skills/sisyphus/SKILL.md    ← 읽음!
~/.gemini/antigravity/workflows/ultrawork.md      ← 읽음!
```

### Antigravity가 읽지 않는 것:
```
~/Desktop/oma/skills/sisyphus/                    ← 안 읽음
~/Desktop/oma/hooks/PreToolUse.js                 ← 안 읽음
```

## 💡 해결책

**OMA CLI가 하는 일:**
1. `oma install sisyphus` 실행
2. `~/Desktop/oma/skills/sisyphus/` → `~/.gemini/antigravity/skills/sisyphus/` 복사
3. Antigravity가 자동으로 인식! ✅

---

**이제 Antigravity 공식 구조에 완벽히 맞춰졌습니다!** 🎉

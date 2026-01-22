# 🎯 OMA AI Backend Mapping (Based on Real Experience)

## 실전 검증된 AI 모델 강점

### Codex (OpenAI GPT-4 Code)
**강점**:
- 복잡한 작업 처리
- 꼼꼼하고 디테일한 작업
- 깊은 사고가 필요한 설계
- 버그 추적 및 수정

**약점**:
- 속도가 상대적으로 느림
- 비용이 높음

### Claude Code (Anthropic Sonnet)
**강점**:
- 빠른 코드 작성
- 깔끔한 톤앤매너
- 읽기 좋은 코드
- 커뮤니케이션

**약점**:
- 초복잡한 로직은 Codex보다 약함

### Gemini 3.0 Pro (Google)
**강점**:
- 프론트엔드 디자인 ⭐
- UI/UX 구현
- 기능 구현 능력
- 빠른 속도

**약점**:
- 백엔드 복잡 로직은 약함

### Claude Opus 4.5 (Anthropic)
**강점**:
- 백엔드 로직 설계
- PRD 작성
- 계획 수립
- 전략적 사고
- (디자인도 잘함)

**약점**:
- 비용이 가장 높음
- 속도가 느림

---

## 🎭 SubAgent → AI Backend Mapping

### Phase 1: Planning & Architecture

#### 1. Prometheus (Planner)
```json
{
  "name": "prometheus",
  "role": "Strategic Planner",
  "ai_backend": {
    "primary": "claude-opus-4.5",
    "reason": "PRD 작성 및 전략적 계획에 최적"
  },
  "tasks": [
    "PRD 작성",
    "프로젝트 계획 수립",
    "요구사항 분석",
    "실행 전략 수립"
  ]
}
```

#### 2. Oracle (Architect)
```json
{
  "name": "oracle",
  "role": "System Architect",
  "ai_backend": {
    "primary": "codex",
    "reason": "복잡하고 디테일한 아키텍처 설계에 강함"
  },
  "tasks": [
    "시스템 아키텍처 설계",
    "기술 스택 선정",
    "데이터베이스 스키마 설계",
    "마이크로서비스 구조 설계"
  ]
}
```

### Phase 2: Implementation

#### 3. Pixel (Frontend)
```json
{
  "name": "pixel",
  "role": "Frontend Developer & Designer",
  "ai_backend": {
    "primary": "gemini-3.0-pro",
    "fallback": "claude-opus-4.5",
    "reason": "프론트엔드 디자인과 구현 모두 뛰어남"
  },
  "tasks": [
    "UI/UX 디자인",
    "React/Vue 컴포넌트 구현",
    "반응형 레이아웃",
    "CSS/Styling",
    "프론트엔드 기능 구현"
  ]
}
```

#### 4. CodeSmith (Backend)
```json
{
  "name": "codesmith",
  "role": "Backend Developer",
  "ai_backend": {
    "primary": "claude-code",
    "fallback": "claude-opus-4.5",
    "reason": "빠른 백엔드 코드 작성, 좋은 톤앤매너"
  },
  "tasks": [
    "백엔드 로직 구현",
    "API 엔드포인트 작성",
    "비즈니스 로직",
    "데이터베이스 연동"
  ]
}
```

**복잡한 백엔드 로직**:
```json
{
  "name": "codesmith-complex",
  "ai_backend": {
    "primary": "claude-opus-4.5",
    "reason": "복잡한 백엔드 로직은 Opus가 더 강함"
  },
  "tasks": [
    "복잡한 알고리즘",
    "트랜잭션 처리",
    "동시성 제어",
    "성능 최적화"
  ]
}
```

### Phase 3: Quality Assurance

#### 5. Debugger (Bug Hunter)
```json
{
  "name": "debugger",
  "role": "Debugging Specialist",
  "ai_backend": {
    "primary": "codex",
    "reason": "꼼꼼한 버그 추적 및 수정"
  },
  "tasks": [
    "버그 원인 분석",
    "스택 트레이스 읽기",
    "버그 수정",
    "edge case 처리"
  ]
}
```

#### 6. Tester (QA)
```json
{
  "name": "tester",
  "role": "Test Engineer",
  "ai_backend": {
    "primary": "codex",
    "reason": "꼼꼼한 테스트 케이스 작성"
  },
  "tasks": [
    "단위 테스트 작성",
    "통합 테스트",
    "E2E 테스트",
    "테스트 커버리지 확보"
  ]
}
```

---

## 📊 Complete Workflow Mapping

### Example: "Build E-commerce Platform"

```
User Request: "Build e-commerce platform with React + Node.js"
     ↓
┌────────────────────────────────────────────────┐
│ Sisyphus (Main Agent - Antigravity)            │
│ Analyzes → Creates execution plan              │
└────────────────────────────────────────────────┘
     ↓
     
Phase 1: Planning (Sequential)
├─→ [SPAWN: prometheus via Claude Opus 4.5]
│   TASK: Write PRD and project plan
│   OUTPUT: PRD.md, PLAN.md
│   ↓ 15 minutes
│   RESULT: ✅ Complete project specification
│
└─→ [SPAWN: oracle via Codex]
    TASK: Design system architecture
    CONTEXT: PRD from prometheus
    OUTPUT: Architecture diagram, tech stack
    ↓ 20 minutes
    RESULT: ✅ Detailed architecture

Phase 2: Implementation (Parallel)
├─→ [SPAWN: pixel via Gemini 3.0 Pro]
│   TASK: Implement frontend (React)
│   CONTEXT: Architecture + PRD
│   OUTPUT: React components, UI
│   ↓ 45 minutes
│   RESULT: ✅ Complete frontend
│
└─→ [SPAWN: codesmith via Claude Code]
    TASK: Implement backend (Node.js)
    CONTEXT: Architecture + PRD
    OUTPUT: API endpoints, business logic
    ↓ 60 minutes
    RESULT: ✅ Complete backend
    
    ↓ (Complex logic detected)
    
    [SPAWN: codesmith-complex via Claude Opus 4.5]
    TASK: Implement payment processing
    CONTEXT: Backend from codesmith
    OUTPUT: Payment integration
    ↓ 30 minutes
    RESULT: ✅ Secure payment system

Phase 3: Quality (Sequential)
├─→ [SPAWN: tester via Codex]
│   TASK: Write comprehensive tests
│   CONTEXT: Frontend + Backend
│   OUTPUT: Test suite (Jest, Playwright)
│   ↓ 30 minutes
│   RESULT: ✅ 85% coverage
│
└─→ [SPAWN: debugger via Codex]
    TASK: Fix failing tests and bugs
    CONTEXT: Test results
    OUTPUT: Bug fixes
    ↓ 20 minutes
    RESULT: ✅ All tests passing

┌────────────────────────────────────────────────┐
│ Sisyphus Integration                           │
│ → Complete E-commerce Platform                 │
│ → Frontend (React) ✓                           │
│ → Backend (Node.js) ✓                          │
│ → Tests (85% coverage) ✓                       │
│ → Documentation ✓                              │
└────────────────────────────────────────────────┘
```

---

## 🎯 Smart AI Selection Logic

### Sisyphus Decision Algorithm

```python
def select_ai_backend(subagent, task, context):
    """
    실전 경험 기반 AI 백엔드 선택
    """
    
    # PRD & Planning
    if task.type in ['prd', 'planning', 'strategy']:
        return {
            'ai': 'claude-opus-4.5',
            'reason': 'PRD 작성 및 전략적 사고 최고'
        }
    
    # Architecture & Design
    if task.type in ['architecture', 'system-design', 'database-schema']:
        return {
            'ai': 'codex',
            'reason': '복잡하고 디테일한 아키텍처 설계'
        }
    
    # Frontend
    if task.type in ['frontend', 'ui', 'design', 'react', 'vue']:
        # 디자인 중심인가 기능 중심인가?
        if task.focus == 'design':
            return {
                'ai': 'gemini-3.0-pro',
                'reason': 'UI/UX 디자인 최고'
            }
        else:
            return {
                'ai': 'gemini-3.0-pro',
                'fallback': 'claude-opus-4.5',
                'reason': '프론트엔드 기능 구현'
            }
    
    # Backend
    if task.type in ['backend', 'api', 'server']:
        # 복잡도 판단
        if task.complexity in ['high', 'critical']:
            return {
                'ai': 'claude-opus-4.5',
                'reason': '복잡한 백엔드 로직'
            }
        else:
            return {
                'ai': 'claude-code',
                'reason': '빠른 백엔드 코드 작성'
            }
    
    # Debugging
    if task.type in ['debug', 'fix', 'troubleshoot']:
        return {
            'ai': 'codex',
            'reason': '꼼꼼한 버그 추적'
        }
    
    # Testing
    if task.type in ['test', 'qa', 'coverage']:
        return {
            'ai': 'codex',
            'reason': '디테일한 테스트 작성'
        }
    
    # Default
    return subagent.config.ai_backend.primary
```

---

## 💰 Cost vs Quality Trade-off

| AI Backend | Cost | Speed | Quality | Best For |
|------------|------|-------|---------|----------|
| **Claude Opus 4.5** | $$$$  | 😐 | ⭐⭐⭐⭐⭐ | PRD, 복잡 백엔드 |
| **Codex** | $$$   | 😐 | ⭐⭐⭐⭐ | 아키텍처, 디버깅, 테스트 |
| **Claude Code** | $$    | 😊 | ⭐⭐⭐⭐ | 백엔드 코드, 빠른 작성 |
| **Gemini 3.0 Pro** | $     | 😃 | ⭐⭐⭐⭐ | 프론트엔드, 디자인 |

**최적화 전략**:
- 계획 단계: Opus (비싸지만 한 번만)
- 구현 단계: Code/Gemini (빠르고 저렴)
- QA 단계: Codex (꼼꼼함이 중요)

---

## 🏆 실전 매핑 요약

```
프로젝트 생명주기별 AI 백엔드:

1. Planning      → Claude Opus 4.5  (PRD, 전략)
2. Architecture  → Codex            (설계, 스키마)
3. Frontend      → Gemini 3.0 Pro   (UI/UX, 디자인)
4. Backend       → Claude Code      (빠른 구현)
   (복잡한 로직) → Claude Opus 4.5  (알고리즘)
5. Debugging     → Codex            (버그 추적)
6. Testing       → Codex            (꼼꼼한 테스트)
```

**이 매핑은 실전 검증됨!** ✅

# 🚀 Oh My Antigravity (OMA)

> **Multi-Agent Orchestration Framework for Google Antigravity IDE**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-orange.svg)](#)
[![Agents: 28](https://img.shields.io/badge/Agents-28-blue.svg)](#)

**⚠️ Status: Early Beta - Core features working, contributions welcome!**

## 🎯 What Is This?

Oh My Antigravity is a **multi-agent orchestration framework** that transforms Antigravity IDE into a powerful AI development environment with specialized agents.

### Key Features

- 🧠 **28 Specialized Agents** - Oracle, CodeSmith, Pixel, Tester, and more
- 🎭 **Smart AI Routing** - Auto-selects best AI backend (Codex/Claude/Gemini)
- ⚡ **Delegation Protocol** - Clear syntax for agent collaboration  
- 🔧 **Cross-Platform CLI** - Works on Windows, macOS, Linux
- 📦 **One-Command Install** - `npx oh-my-antigravity`

## 🚀 Quick Start

### Installation

```bash
# NPM (recommended)
npx oh-my-antigravity

# Or clone and install
git clone https://github.com/YOUR_USERNAME/oh-my-antigravity.git
cd oh-my-antigravity

# Windows
.\lib\install.ps1

# macOS/Linux
bash lib/install.sh
```

### Basic Usage

```bash
# List available skills
oma list

# Install skills globally
oma install sisyphus
oma install oracle

# Install to project
oma install pixel --project

# See installed skills
oma installed
```

## 🧠 Core Agents

### Orchestrator
- **Sisyphus** - Master orchestrator, delegates complex tasks

### Architecture & Planning
- **Prometheus** - Strategic planner (Claude Opus)
- **Oracle** - System architect (Codex)
- **Architect** - Database/API designer

### Development
- **CodeSmith** - Backend developer (Claude Code)
- **Pixel** - Frontend/UI specialist (Gemini 3.0 Pro)
- **Refactorer** - Code quality improver

### Quality Assurance
- **Tester** - Test writer (Codex)
- **Debugger** - Bug hunter (Codex)
- **Security Guard** - Security auditor

### Data & Research
- **Scientist** (Low/Mid/High) - Data analysis tiers
- **Data Wizard** - ETL pipelines
- **SQL Master** - Database expert
- **Librarian** - Research & documentation

**[See all 28 agents →](docs/AGENTS.md)**

## 🎯 AI Backend Routing

OMA automatically selects the best AI for each task:

| Task | Agent | AI Backend | Why |
|------|-------|------------|-----|
| **Planning** | Prometheus | Claude Opus 4.5 | Strategic thinking |
| **Architecture** | Oracle | Codex | Complex design |
| **Frontend** | Pixel | Gemini 3.0 Pro | UI/UX excellence |
| **Backend** | CodeSmith | Claude Code | Fast implementation |
| **Debugging** | Debugger | Codex | Detailed analysis |
| **Testing** | Tester | Codex | Thorough coverage |

## 📖 Documentation

- [Agent Catalog](docs/AGENTS.md) - All 28 agents and their specialties
- [Delegation Protocol](docs/DELEGATION.md) - How agents work together
- [AI Backend Mapping](AI_BACKEND_MAPPING.md) - When to use which AI
- [CLI Integration](CLI_INTEGRATION.md) - SubAgent spawning guide

## 🏗️ Project Status

### ✅ Working
- ✅ 28 agent skill definitions
- ✅ CLI tools (oma, oma-spawn, oma-session)
- ✅ Delegation protocol
- ✅ Documentation

### 🚧 In Progress
- 🚧 SubAgent config files (5/28 complete)
- 🚧 External CLI integration (Codex/Claude/Gemini)
- 🚧 VS Code extension
- 🚧 NPM package

### 📋 Planned
- Long-term memory
- Auto-update system
- Community skill sharing

## 🤝 Contributing

We welcome contributions! This project is in early beta and needs:

- SubAgent configuration files
- CLI integration testing
- Documentation improvements
- Bug reports and feature requests

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📁 Structure

```
oh-my-antigravity/
├── skills/              28 specialized agent definitions
│   ├── sisyphus/
│   ├── oracle/
│   └── ...
├── subagents/          SubAgent configurations (WIP)
├── workflows/          Slash commands
├── docs/               Documentation
├── bin/                CLI tools
│   ├── oma.ps1        Windows CLI
│   ├── oma            Unix CLI
│   ├── oma-spawn.ps1  SubAgent spawner
│   └── oma-session.ps1 Session manager
└── lib/               Installers
```

## 🆚 Comparison

| Feature | OMA | Others |
|---------|-----|--------|
| **Agents** | 28 | 4-12 |
| **AI Routing** | ✅ Multi-backend | ❌ Single |
| **Delegation** | ✅ Explicit syntax | ⚠️ Implicit |
| **Documentation** | ✅ Complete | ⚠️ Partial |
| **GUI** | 🚧 VS Code ext | ❌ |

## 🙏 Acknowledgements

This project stands on the shoulders of giants. We deeply admire and have drawn inspiration from:

- **[Oh My Zsh](https://ohmyz.sh/)**: The grandfather of "Oh My" frameworks. We adopted their philosophy of a delightful, community-driven configuration manager.
- **[Oh My Claude Code](https://github.com/Yeachan-Heo/oh-my-claudecode)**: Pioneered the concept of agent personas in AI coding tools. Our agent structure is heavily influenced by their work.
- **[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)**: Demonstrated excellent orchestration patterns for open-source LLMs.
- **[Antigravity SubAgents](https://github.com/OleynikAleksandr/antigravity-subagents)**: Provided the foundational idea for wrapping external CLI tools as isolated sub-agents.
- **[namtoppro's Sisyphus](https://github.com/namtoppro/oh-my-antigravity-sisyphus)**: We learned valuable lessons about intelligent skill activation and auto-updates from their implementation.

We aim to contribute back to this ecosystem by pushing the boundaries of multi-agent orchestration.

## 📜 License

MIT © Oh My Antigravity Team

## 🔗 Links

- [Issues](https://github.com/YOUR_USERNAME/oh-my-antigravity/issues)
- [Discussions](https://github.com/YOUR_USERNAME/oh-my-antigravity/discussions)

---

<div align="center">

**Made with ❤️ for the Antigravity community**

⭐ Star us on GitHub • 🐛 Report bugs • 💡 Request features

</div>

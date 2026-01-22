# Contributing to Oh My Antigravity

Thank you for your interest in contributing to Oh My Antigravity! 🎉

## How to Contribute

### 1. Creating a Plugin

Plugins are skills that extend Antigravity's capabilities.

1. Fork this repository
2. Create a new folder in `plugins/` (e.g., `plugins/your-plugin/`)
3. Add a `SKILL.md` file with the required frontmatter:

```yaml
---
name: your-plugin
description: A brief description of what your plugin does
version: 1.0.0
author: Your Name
---

# Your Plugin Name

Instructions for Antigravity on how to use this plugin...
```

4. Optionally add:
   - `scripts/` - Helper scripts
   - `examples/` - Usage examples
   - `resources/` - Additional files

5. Test your plugin locally with `oma install your-plugin`
6. Submit a pull request

### 2. Creating a Command

Commands are slash commands (like `/fix` or `/review`).

1. Create a `.md` file in `commands/`
2. Include YAML frontmatter with `name` and `description`
3. Write clear instructions for what the command should do
4. Submit a pull request

### 3. Creating a Theme

Themes define agent personas and response styles.

1. Create a `.md` file in `themes/`
2. Define the personality and response style
3. Submit a pull request

## Code Style

- Use clear, descriptive names
- Comment complex logic
- Follow existing patterns in the codebase

## Pull Request Process

1. Ensure your code works on Windows, macOS, and Linux
2. Update documentation if needed
3. Test with both `oma.ps1` and `oma` (bash)
4. Submit your PR with a clear description

## Questions?

Open an issue if you have any questions!

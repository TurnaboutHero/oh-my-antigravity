# Custom Directory

This directory is for your personal customizations that won't be tracked by git.

## Structure

Place your custom files here:

```
custom/
├── plugins/     # Your personal plugins
├── commands/    # Your personal slash commands
├── themes/      # Your personal themes
└── config.json  # Your personal configuration
```

## Usage

Files in this directory will **override** the official plugins, commands, and themes with the same name.

This allows you to:
- Modify existing plugins without affecting the original
- Create private plugins you don't want to share
- Customize themes to your liking

## Note

This folder is gitignored by default. Your customizations stay on your machine.

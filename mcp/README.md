# MCP Servers

This directory contains Model Context Protocol (MCP) server implementations.

## What is MCP?

MCP (Model Context Protocol) allows AI agents to interact with external tools and services through a standardized interface.

## Structure

```
mcp/
├── example-server/
│   ├── server.py      # Python MCP server
│   └── README.md      # Server documentation
└── ...
```

## Creating an MCP Server

1. Create a new directory for your server
2. Implement the MCP protocol (see Anthropic's documentation)
3. Register it in `~/.gemini/antigravity/mcp_config.json`

## Example Configuration

```json
{
  "servers": {
    "my-server": {
      "command": "python",
      "args": ["path/to/server.py"]
    }
  }
}
```

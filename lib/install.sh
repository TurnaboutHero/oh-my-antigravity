#!/bin/bash
# Oh My Antigravity Installer - macOS/Linux
# This script sets up OMA for your system

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

OMA_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_PATH="${OMA_HOME}/bin"

echo -e "${MAGENTA}"
echo "   ____  __  __    _      "
echo "  / __ \|  \/  |  / \     Oh My Antigravity Installer"
echo " | |  | | \  / | / _ \    "
echo " | |  | | |\/| |/ ___ \   "
echo " |_|  |_|_|  |_/_/   \_\  "
echo -e "${NC}"

echo ""
echo -e "${CYAN}Installing Oh My Antigravity...${NC}"
echo ""

# Make CLI executable
chmod +x "${BIN_PATH}/oma"
echo -e "${GREEN}✓ Made OMA CLI executable${NC}"

# Create necessary directories in Antigravity global path
ANTIGRAVITY_HOME="$HOME/.gemini/antigravity"
SKILLS_PATH="${ANTIGRAVITY_HOME}/skills"
WORKFLOWS_PATH="${ANTIGRAVITY_HOME}/workflows"

mkdir -p "$SKILLS_PATH"
echo -e "${GREEN}✓ Created skills directory${NC}"

mkdir -p "$WORKFLOWS_PATH"
echo -e "${GREEN}✓ Created workflows directory${NC}"

# Detect shell and config file
SHELL_NAME=$(basename "$SHELL")
case "$SHELL_NAME" in
    zsh)
        SHELL_RC="$HOME/.zshrc"
        ;;
    bash)
        if [[ "$(uname)" == "Darwin" ]]; then
            SHELL_RC="$HOME/.bash_profile"
        else
            SHELL_RC="$HOME/.bashrc"
        fi
        ;;
    *)
        SHELL_RC="$HOME/.profile"
        ;;
esac

EXPORT_LINE="export PATH=\"${BIN_PATH}:\$PATH\"  # Oh My Antigravity"

echo ""
echo -e "${YELLOW}Add OMA to your PATH permanently?${NC}"
read -p "Update $SHELL_RC? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! grep -q "Oh My Antigravity" "$SHELL_RC" 2>/dev/null; then
        echo "" >> "$SHELL_RC"
        echo "# Oh My Antigravity" >> "$SHELL_RC"
        echo "$EXPORT_LINE" >> "$SHELL_RC"
        echo -e "${GREEN}✓ Added OMA to $SHELL_RC${NC}"
        echo -e "${YELLOW}Please run: source $SHELL_RC${NC}"
    else
        echo -e "${YELLOW}✓ OMA already in $SHELL_RC${NC}"
    fi
fi

# Add to current session
export PATH="${BIN_PATH}:$PATH"
echo -e "${GREEN}✓ Added OMA to current session PATH${NC}"

echo ""
echo -e "\033[90m════════════════════════════════════════════════════\033[0m"
echo -e "${GREEN}✅ Oh My Antigravity installed successfully!${NC}"
echo ""
echo -e "${CYAN}Try these commands:${NC}"
echo "  oma help              # Show help"
echo "  oma list              # List available plugins"
echo "  oma install <plugin>  # Install a plugin"
echo ""
echo -e "\033[90mOMA Home: ${OMA_HOME}\033[0m"
echo -e "\033[90m════════════════════════════════════════════════════\033[0m"

#!/bin/bash

# Hackura Sentinel CLI - Installer
# Usage: curl -fsSL https://sentinel.hackura.app/install.sh | bash

set -e

# Configuration
REPO_URL="https://github.com/hackura/sentinel-cli"
BINARY_NAME="sentinel"
INSTALL_DIR="/usr/local/bin"

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}--- Hackura Sentinel CLI Installation ---${NC}"

# Detect OS
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

# Map architecture
case "${ARCH}" in
    x86_64) ARCH="amd64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *) echo -e "${RED}Unsupported architecture: ${ARCH}${NC}"; exit 1 ;;
esac

# Construct download URL (matching GoReleaser naming: sentinel_linux_amd64.tar.gz)
DOWNLOAD_URL="${REPO_URL}/releases/latest/download/${BINARY_NAME}_${OS}_${ARCH}.tar.gz"
TMP_DIR=$(mktemp -d)

echo -e "Checking system: ${OS}/${ARCH}..."

# Download archive
echo -e "Downloading ${BINARY_NAME}..."
curl -L -o "${TMP_DIR}/${BINARY_NAME}.tar.gz" "${DOWNLOAD_URL}" || {
    echo -e "${RED}Error: Failed to download binary. Please check if the release exists.${NC}"
    exit 1
}

# Extract binary
echo -e "Extracting ${BINARY_NAME}..."
tar -xzf "${TMP_DIR}/${BINARY_NAME}.tar.gz" -C "${TMP_DIR}"

# Make executable
chmod +x "${TMP_DIR}/${BINARY_NAME}"

# Move to bin directory
echo -e "Installing to ${INSTALL_DIR}..."
if [ -w "${INSTALL_DIR}" ]; then
    mv "${TMP_DIR}/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
else
    echo -e "${CYAN}Root privileges required to install to ${INSTALL_DIR}${NC}"
    sudo mv "${TMP_DIR}/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
fi

# Cleanup
rm -rf "${TMP_DIR}"

echo -e "${GREEN}✓ Installation complete!${NC}"
echo -e "Run ${CYAN}${BINARY_NAME} status${NC} to verify your installation."


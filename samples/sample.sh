#!/usr/bin/env bash
set -euo pipefail
THEME="Obsidian Cream"
function show_theme() { printf 'Theme: %s\n' "$THEME"; }
if [[ -n "$THEME" ]]; then show_theme; fi

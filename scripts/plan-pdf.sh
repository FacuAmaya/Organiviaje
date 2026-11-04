#!/usr/bin/env bash
# Regenera docs/plan/plan-desarrollo.pdf a partir de docs/plan/plan-desarrollo.md.
# Requiere: uv y Google Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
uv run --quiet --with markdown python -I scripts/md_to_html.py docs/plan/plan-desarrollo.md "$TMP/plan.html"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/docs/plan/plan-desarrollo.pdf" "file://$TMP/plan.html" 2>/dev/null
rm -rf "$TMP"
echo "PDF generado en docs/plan/plan-desarrollo.pdf"

"""Exporta el contrato OpenAPI de la API a un archivo JSON, sin levantar el servidor.

Uso (desde backend/): uv run python -m scripts.exportar_openapi <destino.json>
Lo usa `pnpm api:generate` en el frontend y el job "contrato" del CI.
"""

import json
import sys
from pathlib import Path

from app.main import app

destino = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("openapi.json")
destino.write_text(json.dumps(app.openapi(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"OpenAPI exportado en {destino}")

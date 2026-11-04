import sys, markdown
src, out = sys.argv[1], sys.argv[2]
body = markdown.markdown(open(src, encoding="utf-8").read(), extensions=["tables", "fenced_code", "sane_lists", "toc"])
css = """
@page { size: A4; margin: 16mm 14mm; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #1f2328; }
h1 { font-size: 22pt; border-bottom: 3px solid #1f6feb; padding-bottom: 6px; margin-top: 0; }
h2 { font-size: 15pt; color: #1f6feb; border-bottom: 1px solid #d0d7de; padding-bottom: 3px; margin-top: 22px; page-break-after: avoid; }
h3 { font-size: 12pt; margin-top: 16px; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 9pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th, td { border: 1px solid #d0d7de; padding: 4px 7px; text-align: left; vertical-align: top; }
th { background: #f0f4fa; }
tr:nth-child(even) td { background: #fafbfc; }
code { font-family: 'SF Mono', Menlo, monospace; font-size: 8.8pt; background: #f2f4f7; padding: 1px 4px; border-radius: 3px; }
pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 8px 10px; font-size: 8.5pt; line-height: 1.35; page-break-inside: avoid; white-space: pre-wrap; }
pre code { background: none; padding: 0; }
hr { border: none; border-top: 1px solid #d0d7de; margin: 18px 0; }
li { margin: 2px 0; }
.meta { color: #57606a; font-size: 9pt; margin-bottom: 14px; }
"""
html = f"<!DOCTYPE html><html lang='es'><head><meta charset='utf-8'><title>Plan de desarrollo — Organiviaje</title><style>{css}</style></head><body><div class='meta'>Organiviaje · github.com/FacuAmaya/Organiviaje · Plan de desarrollo · 2026-11-04</div>{body}</body></html>"
open(out, "w", encoding="utf-8").write(html)

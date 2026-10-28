"""Compatibility entry point for the static site builder."""
from pathlib import Path

from site_builder import build


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    files = build(root, root / "dist")
    print(f"Build concluído: {len(files)} arquivos em dist/")

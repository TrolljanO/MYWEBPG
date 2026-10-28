"""Build the static portfolio into a selected output directory."""
import argparse
from pathlib import Path
import sys

from site_builder import build


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=root / "dist", help="diretório de saída (padrão: dist)")
    parser.add_argument("--site-url", help="URL pública base, incluindo eventual subpath")
    parser.add_argument("--production", action="store_true", help="exige URL HTTPS e emite metadados públicos")
    args = parser.parse_args()
    output = args.output if args.output.is_absolute() else root / args.output
    try:
        emitted = build(root, output, site_url=args.site_url, production=args.production)
    except (ValueError, OSError) as exc:
        print(f"Build abortado: {exc}", file=sys.stderr)
        return 1
    print(f"Build concluído: {len(emitted)} arquivos em {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

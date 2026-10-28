import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERO_DESKTOP = ROOT / "assets/hero-desktop.svg"
HERO_MOBILE = ROOT / "assets/hero-mobile.svg"
ISOLADA = ROOT / "docs/design/hero-preview/nuvem-isolada.svg"
RENDER = ["node", str(ROOT / "scripts/render-engraving.mjs")]


class HeroNuvensAsset(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        for preset, out in (
            ("hero-nuvens-desktop", HERO_DESKTOP),
            ("hero-nuvens-mobile", HERO_MOBILE),
            ("hero-nuvens-isolada", ISOLADA),
        ):
            if not out.is_file():
                subprocess.run([*RENDER, preset, "2718"], check=True, cwd=ROOT)

    def _read(self, path: Path) -> str:
        if not path.is_file():
            self.skipTest(f"{path.name} missing")
        return path.read_text(encoding="utf-8")

    def test_five_folhas_per_nuvem_desktop(self):
        svg = self._read(HERO_DESKTOP)
        for nuvem in range(5):
            for folha in range(5):
                self.assertIn(f'id="hero-nuvem-{nuvem}-folha-{folha}"', svg)

    def test_no_raster_or_hex_fills(self):
        svg = self._read(HERO_DESKTOP)
        self.assertEqual(svg.count("linearGradient"), 0)
        self.assertEqual(svg.count("<image"), 0)
        self.assertNotIn('fill="#', svg)

    def test_deterministic_render(self):
        before = HERO_DESKTOP.read_text(encoding="utf-8")
        subprocess.run([*RENDER, "hero-nuvens-desktop", "2718"], check=True, cwd=ROOT)
        after = HERO_DESKTOP.read_text(encoding="utf-8")
        self.assertEqual(before, after)

    def test_paths_finite(self):
        svg = self._read(HERO_MOBILE)
        for match in re.finditer(r'\sd="([^"]*)"', svg):
            d = match.group(1)
            self.assertNotIn("NaN", d)
            self.assertNotIn("Infinity", d)


if __name__ == "__main__":
    unittest.main()

import os
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RENDER = ["node", str(ROOT / "scripts/render-engraving.mjs")]


class HeroNuvensAsset(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.output_dir = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.output_dir.cleanup)
        cls.output_path = Path(cls.output_dir.name)
        cls.hero_desktop = cls.output_path / "hero-desktop.svg"
        cls.hero_mobile = cls.output_path / "hero-mobile.svg"
        cls.isolada = cls.output_path / "nuvem-isolada.svg"
        cls.render_env = {**os.environ, "OUT_DIR": str(cls.output_path)}
        for preset in (
            "hero-nuvens-desktop",
            "hero-nuvens-mobile",
            "hero-nuvens-isolada",
        ):
            subprocess.run(RENDER + [preset, "2718"], check=True, cwd=ROOT, env=cls.render_env)

    def _read(self, path: Path) -> str:
        return path.read_text(encoding="utf-8")

    def test_five_folhas_per_nuvem_desktop(self):
        svg = self._read(self.hero_desktop)
        for nuvem in range(5):
            for folha in range(5):
                self.assertIn(f'id="hero-nuvem-{nuvem}-folha-{folha}"', svg)

    def test_no_raster_or_hex_fills(self):
        svg = self._read(self.hero_desktop)
        self.assertEqual(svg.count("linearGradient"), 0)
        self.assertEqual(svg.count("<image"), 0)
        self.assertNotIn('fill="#', svg)

    def test_deterministic_render(self):
        before = self.hero_desktop.read_text(encoding="utf-8")
        subprocess.run(
            RENDER + ["hero-nuvens-desktop", "2718"],
            check=True,
            cwd=ROOT,
            env=self.render_env,
        )
        after = self.hero_desktop.read_text(encoding="utf-8")
        self.assertEqual(before, after)

    def test_paths_finite(self):
        svg = self._read(self.hero_mobile)
        for match in re.finditer(r'\sd="([^"]*)"', svg):
            d = match.group(1)
            self.assertNotIn("NaN", d)
            self.assertNotIn("Infinity", d)


if __name__ == "__main__":
    unittest.main()

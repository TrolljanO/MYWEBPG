import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RENDER = ["node", str(ROOT / "scripts/render-engraving.mjs")]


class EngravingAsset(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.output_dir = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.output_dir.cleanup)
        cls.engraving = Path(cls.output_dir.name) / "engraving.svg"
        env = {**os.environ, "OUT_DIR": cls.output_dir.name}
        subprocess.run(RENDER + ["gravura", "2718"], check=True, cwd=ROOT, env=env)
        cls.svg = cls.engraving.read_text(encoding="utf-8")

    def test_wave_print_id_present(self):
        self.assertIn('id="wave-print"', self.svg)

    def test_layer_count_in_range(self):
        self.assertTrue(5 <= self.svg.count('class="art-layer"') <= 12)

    def test_no_hex_fills_or_gradients(self):
        self.assertEqual(self.svg.count("linearGradient"), 0)
        self.assertNotIn('fill="#', self.svg)

    def test_koi_cutouts_are_local_layers(self):
        self.assertIn('data-tipo="onda"', self.svg)
        self.assertGreaterEqual(self.svg.count("<use"), 8)
        self.assertNotIn('href="http', self.svg)
        self.assertNotIn('href="/assets/', self.svg)

    def test_size_under_limit(self):
        self.assertLess(self.engraving.stat().st_size, 100_000)


if __name__ == "__main__":
    unittest.main()

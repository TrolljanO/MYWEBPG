import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGRAVING = ROOT / "assets/engraving.svg"


class EngravingAsset(unittest.TestCase):
    def setUp(self):
        if not ENGRAVING.is_file():
            self.skipTest("assets/engraving.svg missing; run node scripts/render-engraving.mjs gravura 2718")
        self.svg = ENGRAVING.read_text(encoding="utf-8")

    def test_wave_print_id_present(self):
        self.assertIn('id="wave-print"', self.svg)

    def test_layer_count_in_range(self):
        self.assertTrue(5 <= self.svg.count('class="art-layer"') <= 12)

    def test_no_hex_fills_or_gradients(self):
        self.assertEqual(self.svg.count("linearGradient"), 0)
        self.assertNotIn('fill="#', self.svg)

    def test_koi_cutouts_are_local_layers(self):
        self.assertGreaterEqual(self.svg.count("<image"), 9)
        self.assertNotIn('href="http', self.svg)
        self.assertIn("assets/gravura/koi/", self.svg)

    def test_size_under_limit(self):
        self.assertLess(ENGRAVING.stat().st_size, 100_000)


if __name__ == "__main__":
    unittest.main()

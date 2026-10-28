"""Isolated behavioral checks for generated site validation."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
CHECKER_PATH = ROOT / "scripts" / "check-site.py"
SPEC = importlib.util.spec_from_file_location("site_checker", CHECKER_PATH)
CHECKER = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = CHECKER
SPEC.loader.exec_module(CHECKER)


class SiteCheckerContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.output = self.root / "dist"
        self.output.mkdir()

    def tearDown(self):
        self.temp.cleanup()

    def write_manifest(self, files):
        (self.output / "manifest.json").write_text(
            json.dumps({"files": files}), encoding="utf-8"
        )

    def test_missing_manifest_is_an_error(self):
        (self.output / "index.html").write_text("<h1>Home</h1>", encoding="utf-8")
        (self.output / "secret.txt").write_text("private", encoding="utf-8")
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("manifest.json" in error.lower() for error in errors), errors)

    def test_unlisted_private_file_is_reported(self):
        (self.output / "index.html").write_text("<h1>Home</h1>", encoding="utf-8")
        (self.output / "secret.txt").write_text("private", encoding="utf-8")
        self.write_manifest(["index.html", "manifest.json"])
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("secret.txt" in error for error in errors), errors)

    def test_missing_fragment_is_reported(self):
        (self.output / "index.html").write_text('<a href="#missing">jump</a>', encoding="utf-8")
        self.write_manifest(["index.html", "manifest.json"])
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("missing fragment" in error for error in errors), errors)

    def test_valid_base_subpath_links_resolve_inside_output(self):
        (self.output / "index.html").write_text(
            '<a href="/portfolio/page.html#ready">open</a>', encoding="utf-8"
        )
        (self.output / "page.html").write_text('<h1 id="ready">Ready</h1>', encoding="utf-8")
        self.write_manifest(["index.html", "page.html", "manifest.json"])
        _, errors = CHECKER.check(self.root, self.output, "/portfolio")
        self.assertEqual([], errors)

    def test_empty_manifest_file_list_is_invalid(self):
        (self.output / "index.html").write_text("<h1>Home</h1>", encoding="utf-8")
        self.write_manifest([])
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("manifest.json" in error.lower() for error in errors), errors)

    def test_manifest_file_entries_must_be_paths_as_strings(self):
        (self.output / "index.html").write_text("<h1>Home</h1>", encoding="utf-8")
        self.write_manifest([{"path": "index.html"}])
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("must be a string" in error for error in errors), errors)

    def test_unsafe_manifest_paths_are_rejected(self):
        (self.output / "index.html").write_text("<h1>Home</h1>", encoding="utf-8")
        self.write_manifest(["../secret.txt", "manifest.json"])
        _, errors = CHECKER.check(self.root, self.output)
        self.assertTrue(any("unsafe output path" in error.lower() for error in errors), errors)


if __name__ == "__main__":
    unittest.main()

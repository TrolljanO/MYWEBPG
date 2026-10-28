"""Regressions for unsafe output trees, reserved routes, and frontmatter parsing."""
from pathlib import Path
import importlib.util
import json
import os
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("site_builder_regressions", ROOT / "scripts/site_builder.py")
BUILDER_MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = BUILDER_MODULE
SPEC.loader.exec_module(BUILDER_MODULE)


class BuildRegressions(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.root = self.base / "source"
        self.root.mkdir()
        (self.root / "site.config.json").write_text(
            json.dumps({"name": "Test", "language": "pt-BR", "site_url": ""}), encoding="utf-8"
        )
        (self.root / "templates").mkdir()
        for name, body in {
            "home.html": '<main id="conteudo">{{ archive_preview }}</main>',
            "header.html": '<header><a href="{{ base_path }}/">Home</a></header>',
            "footer.html": '<footer><a href="{{ base_path }}/">Home</a></footer>',
            "article.html": '<main class="reading"><a class="back-link" href="{{ base_path }}/">Voltar</a><h1>{{ title }}</h1><p class="lead">{{ summary }}</p><div class="reading-meta">{{ meta }}</div>{{ body }}</main>',
            "page.html": '<main class="reading"><a class="back-link" href="{{ base_path }}/">Voltar</a><h1>{{ title }}</h1><p class="lead">{{ summary }}</p>{{ body }}</main>',
            "cv.html": '<main class="reading"><a class="back-link" href="{{ base_path }}/">Voltar</a><div class="cv-heading"><h1>{{ name }}</h1><button id="print-cv">Imprimir / salvar PDF</button></div><p class="lead">{{ summary }}</p>{{ body }}</main>',
        }.items():
            (self.root / "templates" / name).write_text(body, encoding="utf-8")
        for kind in ("projects", "posts", "pages"):
            (self.root / "content" / kind).mkdir(parents=True)

    def tearDown(self):
        self.temp.cleanup()

    def post(self, slug, summary="Uma nota"):
        return (self.root / "content/posts" / f"{slug}.md").write_text(
            f'---\ntitle: Nota\nslug: {slug}\nsummary: {summary}\nstatus: published\ndate: 2026-10-26\ntags: []\n---\n\nTexto.\n',
            encoding="utf-8",
        )

    def test_rejects_output_symlink_ancestor_without_writing_through_it(self):
        outside = self.base / "outside"
        outside.mkdir()
        sentinel = outside / "sentinel.txt"
        sentinel.write_text("preserve", encoding="utf-8")
        link = self.base / "output-link"
        link.symlink_to(outside, target_is_directory=True)

        with self.assertRaisesRegex(ValueError, "symlink"):
            BUILDER_MODULE.build(self.root, link / "public")

        self.assertEqual(sentinel.read_text(encoding="utf-8"), "preserve")
        self.assertFalse((outside / "public/index.html").exists())

    def test_rejects_symlink_in_output_tree_before_any_write(self):
        output = self.base / "public"
        output.mkdir()
        outside = self.base / "assets-outside"
        outside.mkdir()
        sentinel = outside / "sentinel.txt"
        sentinel.write_text("preserve", encoding="utf-8")
        (output / "assets").symlink_to(outside, target_is_directory=True)

        with self.assertRaisesRegex(ValueError, "symlink"):
            BUILDER_MODULE.build(self.root, output)

        self.assertEqual(sentinel.read_text(encoding="utf-8"), "preserve")
        self.assertFalse((output / "index.html").exists())

    def test_rejects_manifest_symlink_without_overwriting_its_target(self):
        output = self.base / "public"
        output.mkdir()
        sentinel = self.base / "sentinel.txt"
        sentinel.write_text("preserve", encoding="utf-8")
        (output / "manifest.json").symlink_to(sentinel)

        with self.assertRaisesRegex(ValueError, "symlink"):
            BUILDER_MODULE.build(self.root, output)

        self.assertEqual(sentinel.read_text(encoding="utf-8"), "preserve")
        self.assertFalse((output / "index.html").exists())

    def test_rejects_output_that_is_source_root_or_contains_source(self):
        for output in (self.root, self.base):
            with self.subTest(output=output), self.assertRaisesRegex(ValueError, "source"):
                BUILDER_MODULE.build(self.root, output)
        self.assertFalse((self.root / "index.html").exists())

    def test_rejects_post_slug_that_collides_with_archive_index(self):
        self.post("index")
        output = self.base / "public"

        with self.assertRaises(ValueError):
            BUILDER_MODULE.build(self.root, output)

        self.assertFalse(output.exists())

    def test_frontmatter_delimiter_must_be_a_line_by_itself(self):
        self.post("delimiter", summary="Before --- after")
        output = self.base / "public"

        BUILDER_MODULE.build(self.root, output)

        page = (output / "arquivo/delimiter.html").read_text(encoding="utf-8")
        self.assertIn("Before --- after", page)

    def test_inlines_self_contained_engraving_for_same_page_use(self):
        home = self.root / "templates/home.html"
        home.write_text('<main>{{ engraving }}<svg><use href="#wave-print"/></svg></main>', encoding="utf-8")
        asset = self.root / "assets/engraving.svg"
        asset.parent.mkdir()
        svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="wave-print"><path d="M0 0"/></g></defs></svg>'
        asset.write_text(svg, encoding="utf-8")
        output = self.base / "public"

        BUILDER_MODULE.build(self.root, output)

        rendered = (output / "index.html").read_text(encoding="utf-8")
        manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
        self.assertNotIn("{{ engraving }}", rendered)
        self.assertIn(svg, rendered)
        self.assertIn('href="#wave-print"', rendered)
        self.assertEqual((output / "assets/engraving.svg").read_text(encoding="utf-8"), svg)
        self.assertIn("assets/engraving.svg", manifest["files"])
        self.assertNotIn("assets/onda-gravura.png", manifest["files"])

    def test_curriculum_print_heading_uses_configured_name(self):
        page = self.root / "content/pages/curriculo.md"
        page.write_text(
            "---\ntitle: Trajetória\nslug: curriculo\nsummary: Perfil\nstatus: published\ntags: []\n---\n\n## Perfil\n",
            encoding="utf-8",
        )
        output = self.base / "public"

        BUILDER_MODULE.build(self.root, output)

        rendered = (output / "curriculo.html").read_text(encoding="utf-8")
        self.assertIn("<h1>Test</h1>", rendered)
        self.assertIn('id="print-cv"', rendered)


if __name__ == "__main__":
    unittest.main()

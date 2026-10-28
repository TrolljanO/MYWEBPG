"""Behavioral contract for the static content builder (all inputs are temporary)."""
from pathlib import Path
import importlib.util
import json
import shutil
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
BUILDER = ROOT / "scripts" / "site_builder.py"


def load_build():
    if not BUILDER.is_file():
        raise ModuleNotFoundError("scripts/site_builder.py is not integrated yet")
    spec = importlib.util.spec_from_file_location("site_builder", BUILDER)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module.build


class SiteBuilderContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.root = self.base / "source"
        self.output = self.base / "public"
        self.root.mkdir()
        (self.root / "site.config.json").write_text(
            '{"name":"Guilherme Trajano","language":"pt-BR","site_url":""}',
            encoding="utf-8",
        )
        (self.root / "content" / "posts").mkdir(parents=True)
        (self.root / "content" / "projects").mkdir(parents=True)
        (self.root / "content" / "pages").mkdir(parents=True)
        shutil.copytree(ROOT / "templates", self.root / "templates")
        self.build = load_build()

    def tearDown(self):
        self.temp.cleanup()

    def write(self, area, name, body):
        path = self.root / "content" / area / name
        path.write_text(body, encoding="utf-8")
        return path

    @staticmethod
    def post(slug, status="published", title="Post", extra=""):
        return (f"---\ntitle: {json.dumps(title, ensure_ascii=False)}\nslug: {slug}\nsummary: Resumo\n"
                f"status: {status}\ndate: 2026-10-26\ntags: []\n---\n\nTexto.\n{extra}")

    def test_empty_content_builds_without_inventing_archive_entries(self):
        outputs = self.build(self.root, self.output)
        self.assertTrue((self.output / "arquivo" / "index.html").is_file())
        archive = (self.output / "arquivo" / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("Post inventado", archive)
        self.assertIn("manifest.json", [Path(p).name for p in outputs])

    def test_only_published_posts_are_rendered_and_exported(self):
        self.write("posts", "publicado.md", self.post("publicado", title="Visível"))
        self.write("posts", "rascunho.md", self.post("rascunho", "draft", "Segredo"))
        self.build(self.root, self.output)
        archive = (self.output / "arquivo" / "publicado.html").read_text(encoding="utf-8")
        all_html = "\n".join(p.read_text(encoding="utf-8") for p in self.output.rglob("*.html"))
        self.assertIn("Visível", archive)
        self.assertNotIn("Segredo", all_html)

    def test_duplicate_identifiers_fail_instead_of_overwriting_a_page(self):
        self.write("posts", "one.md", self.post("mesmo"))
        self.write("projects", "two.md", "---\ntitle: Projeto\nslug: mesmo\nsummary: x\nstatus: published\nstack: []\ncategory: ai\n---\n")
        with self.assertRaises((ValueError, RuntimeError)):
            self.build(self.root, self.output)

    def test_title_is_escaped_as_text(self):
        self.write("posts", "escape.md", self.post("escape", title='"<script>alert(1)</script>&'))
        self.build(self.root, self.output)
        page = (self.output / "arquivo" / "escape.html").read_text(encoding="utf-8")
        self.assertNotIn("<script>alert(1)</script>", page)
        self.assertIn("&lt;script&gt;", page)

    def test_unsafe_editorial_link_is_rejected_or_neutralized(self):
        self.write("posts", "unsafe.md", self.post("unsafe", extra="\n[clique](javascript:alert%281%29)\n"))
        try:
            self.build(self.root, self.output)
        except (ValueError, RuntimeError):
            return
        page = (self.output / "arquivo" / "unsafe.html").read_text(encoding="utf-8")
        self.assertNotRegex(page.lower(), r'href=["\']javascript:')

    def test_production_requires_an_explicit_https_domain(self):
        with self.assertRaises((ValueError, RuntimeError)):
            self.build(self.root, self.output, production=True)

    def test_canonical_feed_and_sitemap_keep_domain_and_subpath(self):
        self.write("posts", "hello.md", self.post("hello", title="Olá"))
        site = "https://portfolio.example/base"
        self.build(self.root, self.output, site_url=site, production=True)
        page = (self.output / "arquivo" / "hello.html").read_text(encoding="utf-8")
        self.assertIn('https://portfolio.example/base/arquivo/hello.html', page)
        sitemap = (self.output / "sitemap.xml").read_text(encoding="utf-8")
        self.assertIn("https://portfolio.example/base/arquivo/hello.html", sitemap)
        feeds = list(self.output.glob("*.xml"))
        self.assertTrue(feeds, "published posts should produce an RSS XML feed")
        self.assertTrue(any("https://portfolio.example/base/arquivo/hello.html" in f.read_text(encoding="utf-8") for f in feeds))

    def test_existing_unexpected_output_file_is_rejected(self):
        self.output.mkdir()
        (self.output / "stale.html").write_text("stale", encoding="utf-8")
        with self.assertRaises((ValueError, RuntimeError)):
            self.build(self.root, self.output)


if __name__ == "__main__":
    unittest.main()

"""Build the portfolio as a small, dependency-light static site."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html import escape
import json
import os
from pathlib import Path, PurePosixPath
import re
from urllib.parse import unquote, urlsplit, quote
import xml.etree.ElementTree as ET

import yaml
from markdown_it import MarkdownIt


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
CONTENT_TYPES = ("projects", "posts", "pages")
ALLOWED_PAGE_SLUGS = {"curriculo", "privacidade"}
DEFAULT_PREVIEW_URL = "http://localhost:4173"
MD = MarkdownIt("commonmark", {"html": False, "linkify": False, "typographer": False})


@dataclass(frozen=True)
class Entry:
    kind: str
    path: Path
    meta: dict
    body: str

    @property
    def slug(self) -> str:
        return self.meta["slug"]


def _lexical_absolute(path: Path) -> Path:
    """Normalize a path without resolving symlinks so they can be rejected."""
    return Path(os.path.abspath(os.fspath(path)))


def _reject_symlinked_ancestors(output: Path) -> Path:
    absolute = _lexical_absolute(output)
    for component in (*reversed(absolute.parents), absolute):
        if component.is_symlink():
            raise ValueError(f"output contém symlink em caminho ancestral: {component}")
    return absolute


def _reject_symlinks_in_tree(absolute: Path) -> None:
    if not absolute.exists():
        return
    if not absolute.is_dir():
        raise ValueError(f"output não é diretório: {absolute}")
    for directory, subdirectories, files in os.walk(absolute, followlinks=False):
        for name in (*subdirectories, *files):
            item = Path(directory) / name
            if item.is_symlink():
                raise ValueError(f"output contém symlink: {item.relative_to(absolute)}")


def _ensure_output_disjoint(root: Path, output: Path) -> tuple[Path, Path]:
    root = Path(root).resolve()
    output_lexical = _reject_symlinked_ancestors(Path(output))
    output = output_lexical.resolve()
    if output == root or output in root.parents:
        raise ValueError("output não pode ser a raiz nem conter a árvore source")
    _reject_symlinks_in_tree(output)
    return root, output


def _read_config(root: Path) -> dict:
    path = root / "site.config.json"
    if not path.exists():
        return {"name": "Guilherme Trajano", "language": "pt-BR", "site_url": ""}
    try:
        config = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"site.config.json inválido: {exc}") from exc
    if not isinstance(config, dict):
        raise ValueError("site.config.json deve conter um objeto JSON")
    for key, default in (("name", "Guilherme Trajano"), ("language", "pt-BR"), ("site_url", "")):
        config.setdefault(key, default)
    if not all(isinstance(config[k], str) for k in ("name", "language", "site_url")):
        raise ValueError("name, language e site_url devem ser texto")
    return config


def _parse_url(value: str, *, production: bool = False) -> tuple[str, str]:
    parts = urlsplit(value)
    if parts.scheme not in (("https",) if production else ("http", "https")) or not parts.netloc:
        requirement = "HTTPS" if production else "HTTP ou HTTPS"
        raise ValueError(f"site_url deve ser uma URL absoluta {requirement}")
    if parts.username or parts.password or parts.query or parts.fragment:
        raise ValueError("site_url não pode conter credenciais, query ou fragmento")
    decoded_path = unquote(parts.path)
    path_parts = PurePosixPath(decoded_path).parts
    if ".." in path_parts or "\\" in decoded_path:
        raise ValueError("site_url contém um subpath inválido")
    path = quote(decoded_path.rstrip("/"), safe="/-._~")
    origin = f"{parts.scheme}://{parts.netloc}"
    return origin, path


def _parse_entries(root: Path) -> list[Entry]:
    entries: list[Entry] = []
    slugs: dict[str, Path] = {}
    for kind in CONTENT_TYPES:
        directory = root / "content" / kind
        if not directory.exists():
            continue
        for path in sorted(directory.glob("*.md")):
            raw = path.read_text(encoding="utf-8")
            lines = raw.splitlines(keepends=True)
            if not lines or lines[0].rstrip("\r\n") != "---":
                raise ValueError(f"{path}: cabeçalho YAML ausente")
            closing = next((index for index, line in enumerate(lines[1:], start=1)
                            if line.rstrip("\r\n") == "---"), None)
            if closing is None:
                raise ValueError(f"{path}: delimitador de fechamento do YAML ausente")
            header = "".join(lines[1:closing])
            body = "".join(lines[closing + 1:])
            try:
                meta = yaml.safe_load(header)
            except yaml.YAMLError as exc:
                raise ValueError(f"{path}: YAML inválido: {exc}") from exc
            if not isinstance(meta, dict):
                raise ValueError(f"{path}: cabeçalho deve ser um objeto YAML")
            required = {"title", "slug", "summary", "status", "tags"}
            if kind == "projects":
                required |= {"stack", "category"}
            if kind == "posts":
                required.add("date")
            missing = sorted(required - meta.keys())
            if missing:
                raise ValueError(f"{path}: campos obrigatórios ausentes: {', '.join(missing)}")
            if not all(isinstance(meta[k], str) and meta[k].strip() for k in ("title", "slug", "summary")):
                raise ValueError(f"{path}: title, slug e summary devem ser textos não vazios")
            if not SLUG_RE.fullmatch(meta["slug"]):
                raise ValueError(f"{path}: slug inválido: {meta['slug']!r}")
            if meta["status"] not in ("draft", "published"):
                raise ValueError(f"{path}: status deve ser draft ou published")
            if not isinstance(meta["tags"], list) or not all(isinstance(tag, str) for tag in meta["tags"]):
                raise ValueError(f"{path}: tags deve ser uma lista de textos")
            if kind == "projects":
                if not isinstance(meta["stack"], list) or not all(isinstance(item, str) for item in meta["stack"]):
                    raise ValueError(f"{path}: stack deve ser uma lista de textos")
                if meta["category"] not in ("ai", "design"):
                    raise ValueError(f"{path}: category deve ser ai ou design")
                if "repository" in meta:
                    _validate_http_url(meta["repository"], path, "repository")
            if kind == "posts":
                try:
                    parsed_date = meta["date"]
                    if isinstance(parsed_date, date):
                        meta["date"] = parsed_date.isoformat()
                    else:
                        if not isinstance(parsed_date, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", parsed_date):
                            raise ValueError("date deve usar YYYY-MM-DD")
                        date.fromisoformat(parsed_date)
                except (TypeError, ValueError) as exc:
                    raise ValueError(f"{path}: date deve usar YYYY-MM-DD") from exc
            if kind == "pages" and meta["slug"] not in ALLOWED_PAGE_SLUGS:
                raise ValueError(f"{path}: slug de página deve ser curriculo ou privacidade")
            if "source_url" in meta:
                _validate_http_url(meta["source_url"], path, "source_url")
            slug = meta["slug"]
            if slug in slugs:
                raise ValueError(f"slug duplicado {slug!r}: {slugs[slug]} e {path}")
            slugs[slug] = path
            _validate_markdown_urls(body, path)
            entries.append(Entry(kind, path, meta, body.strip()))
    return entries


def _validate_http_url(value: object, path: Path, field: str) -> None:
    if not isinstance(value, str):
        raise ValueError(f"{path}: {field} deve ser uma URL HTTP(S)")
    parts = urlsplit(value)
    if parts.scheme not in ("http", "https") or not parts.netloc or parts.username or parts.password:
        raise ValueError(f"{path}: {field} deve ser uma URL HTTP(S) segura")


def _validate_markdown_urls(body: str, path: Path) -> None:
    if re.search(r"(?i)(?:\]\(\s*(?:javascript|data)\s*:|\b(?:href|src)\s*=\s*['\"]?\s*(?:javascript|data)\s*:)", body):
        raise ValueError(f"{path}: URLs javascript: e data: são proibidas")

    def walk(tokens):
        for token in tokens:
            yield token
            if token.children:
                yield from walk(token.children)

    for token in walk(MD.parse(body)):
        if token.type not in ("link_open", "image"):
            continue
        attr = "href" if token.type == "link_open" else "src"
        value = token.attrGet(attr) or ""
        parts = urlsplit(value.strip())
        if parts.scheme and parts.scheme not in ("http", "https"):
            raise ValueError(f"{path}: esquema de URL proibido em Markdown: {parts.scheme}")
        if value.strip().startswith("//") or "\\" in value:
            raise ValueError(f"{path}: URL protocol-relative ou com barra invertida é proibida")
        if ".." in PurePosixPath(unquote(parts.path)).parts:
            raise ValueError(f"{path}: URL Markdown não pode sair da raiz do site")
        if parts.scheme and (not parts.netloc or parts.username or parts.password):
            raise ValueError(f"{path}: URL HTTP(S) inválida")


def _render_markdown(body: str, base_path: str) -> str:
    tokens = MD.parse(body)
    def walk(items):
        for item in items:
            yield item
            if item.children:
                yield from walk(item.children)

    for token in walk(tokens):
        if token.type not in ("link_open", "image"):
            continue
        attr = "href" if token.type == "link_open" else "src"
        value = token.attrGet(attr)
        if not value:
            continue
        parts = urlsplit(value)
        if not parts.scheme and not value.startswith(("#", "/")):
            token.attrSet(attr, f"{base_path}/{value}" if base_path else f"/{value}")
        elif value.startswith("/") and not value.startswith("//") and base_path:
            token.attrSet(attr, f"{base_path}{value}")
    return MD.renderer.render(tokens, MD.options, {})


def _load_template(root: Path, name: str) -> str:
    path = root / "templates" / name
    try:
        return path.read_text(encoding="utf-8")
    except OSError as exc:
        raise ValueError(f"template obrigatório ausente: {path}") from exc


def _safe_meta(value: object) -> str:
    return escape(str(value), quote=True)


def _page_shell(*, config: dict, title: str, description: str, body: str,
                header: str, footer: str, base_path: str, page_path: str,
                site_url: str, production: bool, canonical: bool = True,
                og_image_url: str | None = None, font_file: str = "cormorant.woff2") -> str:
    prefix = f"{base_path}/" if base_path else "/"
    public_url = site_url.rstrip("/")
    canonical_path = "" if page_path == "index.html" else page_path.lstrip("/")
    canonical_url = f"{public_url}/{canonical_path}" if canonical_path else f"{public_url}/"
    canonical_link = f'<link rel="canonical" href="{_safe_meta(canonical_url)}">' if production and canonical else ""
    robots = "" if production else '<meta name="robots" content="noindex, nofollow">'
    og = "" if not production else (
        f'<meta property="og:title" content="{_safe_meta(title)}">'
        f'<meta property="og:description" content="{_safe_meta(description)}">'
        f'<meta property="og:url" content="{_safe_meta(canonical_url)}">'
        '<meta property="og:type" content="website">'
    ) + (f'<meta property="og:image" content="{_safe_meta(og_image_url)}">' if production and og_image_url else "")
    html_header = header.replace("{{ base_path }}", base_path)
    html_footer = footer.replace("{{ base_path }}", base_path)
    return (f'<!doctype html>\n<html lang="{_safe_meta(config["language"])}" data-theme="light">\n<head>\n'
            '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
            f'<title>{_safe_meta(config["name"])}</title>\n'
            f'<meta name="description" content="{_safe_meta(description)}">{robots}{canonical_link}{og}\n'
            '<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#FAF9F6">\n'
            f'<link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">'
            f'<link rel="alternate" type="application/rss+xml" title="RSS" href="{prefix}rss.xml">\n'
            f'<link rel="preload" href="{prefix}assets/fonts/{font_file}" as="font" type="font/{"woff2" if font_file.endswith("woff2") else "ttf"}" crossorigin>\n'
            f'<link rel="stylesheet" href="{prefix}index.css"><script src="{prefix}theme.js"></script>'
            f'<script src="{prefix}assets/vendor/gsap.min.js" defer></script>'
            f'<script src="{prefix}assets/vendor/ScrollTrigger.min.js" defer></script>'
            f'<script src="{prefix}assets/vendor/lenis.min.js" defer></script>'
            f'<script src="{prefix}index.js" defer></script>\n'
            '<noscript><style>.work-filters,.theme-toggle,#unfold,#motion-toggle{display:none}</style></noscript>\n'
            f'</head><body{" class=\"home\"" if page_path == "index.html" else ""}>\n'
            f'{html_header}\n{body}\n{html_footer}\n</body></html>\n')


def _article_body(entry: Entry, base_path: str) -> str:
    meta = entry.meta
    details = list(meta.get("tags", []))
    if entry.kind == "projects":
        details = list(meta["stack"])
    elif entry.kind == "posts":
        details.insert(0, meta["date"])
    meta_html = "".join(f"<span>{_safe_meta(item)}</span>" for item in details)
    source = ""
    if meta.get("source_url"):
        _validate_http_url(meta["source_url"], entry.path, "source_url")
        source = f'<a href="{_safe_meta(meta["source_url"])}" rel="noopener noreferrer">Fonte</a>'
    template = _load_template(entry.path.parents[2], "article.html")
    body = _render_markdown(entry.body, base_path)
    return (template.replace("{{ base_path }}", base_path or "")
            .replace("{{ title }}", _safe_meta(meta["title"]))
            .replace("{{ summary }}", _safe_meta(meta["summary"]))
            .replace("{{ meta }}", meta_html + source)
            .replace("{{ body }}", body))


def _page_body(entry: Entry, base_path: str, config: dict[str, str]) -> str:
    template_name = "cv.html" if entry.slug == "curriculo" else "page.html"
    template = _load_template(entry.path.parents[2], template_name)
    body = _render_markdown(entry.body, base_path)
    return (template.replace("{{ base_path }}", base_path or "")
            .replace("{{ name }}", _safe_meta(config["name"]))
            .replace("{{ title }}", _safe_meta(entry.meta["title"]))
            .replace("{{ summary }}", _safe_meta(entry.meta["summary"]))
            .replace("{{ body }}", body))


def _archive_preview(posts: list[Entry], base_path: str) -> str:
    rss = f"{base_path}/rss.xml"
    archive = f"{base_path}/arquivo/index.html"
    if posts:
        recent = sorted(posts, key=lambda entry: entry.meta["date"], reverse=True)[:3]
        cards = []
        for entry in recent:
            cards.append(
                f'<article><p class="reading-meta"><time datetime="{_safe_meta(entry.meta["date"])}">{_safe_meta(entry.meta["date"])}</time></p>'
                f'<h3><a href="{base_path}/arquivo/{_safe_meta(entry.slug)}.html">{_safe_meta(entry.meta["title"])}</a></h3>'
                f'<p>{_safe_meta(entry.meta["summary"])}</p></article>'
            )
        return '<div class="archive-preview">' + ''.join(cards) + \
            f'<div class="inline-links"><a href="{archive}">Todo o arquivo ↗</a><a href="{rss}">RSS ↗</a></div></div>'
    return ('<div class="archive-empty"><div class="archive-paper" aria-hidden="true">'
            '<svg viewBox="0 0 300 210"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="1">'
            '<path d="M58 30L237 47L222 188L44 171Z"/><path d="M42 41L234 29L244 174L51 187Z"/>'
            '<path d="M57 20H238V174H57Z"/><path d="M79 49H181M79 61H212M79 73H204" fill="none"/>'
            '</g></svg></div><div><h3>O caderno está abrindo.</h3>'
            '<p>Ainda não há textos publicados. Quando novas notas estiverem prontas, elas aparecerão aqui e no arquivo.</p>'
            f'<div class="inline-links"><a href="{archive}">Abrir o arquivo</a><a href="{rss}">RSS</a>'
            '<a href="https://x.com/Gui_Trajano" target="_blank" rel="noopener noreferrer">X ↗</a>'
            '<a href="https://www.linkedin.com/in/trajanogui/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>'
            '</div></div></div>')


def _rss(posts: list[Entry], site_url: str, base_path: str, config: dict) -> bytes:
    root = ET.Element("rss", version="2.0")
    channel = ET.SubElement(root, "channel")
    ET.SubElement(channel, "title").text = config["name"]
    ET.SubElement(channel, "link").text = site_url.rstrip("/") + (f"{base_path}/" if base_path else "/")
    ET.SubElement(channel, "description").text = config["name"]
    for post in sorted(posts, key=lambda e: e.meta["date"], reverse=True):
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = post.meta["title"]
        link = f'{site_url.rstrip("/")}{base_path}/arquivo/{post.slug}.html'
        ET.SubElement(item, "link").text = link
        ET.SubElement(item, "guid", isPermaLink="true").text = link
        ET.SubElement(item, "description").text = post.meta["summary"]
        day = date.fromisoformat(post.meta["date"])
        ET.SubElement(item, "pubDate").text = format_datetime(datetime.combine(day, datetime.min.time(), tzinfo=timezone.utc))
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def _sitemap(site_url: str, base_path: str, page_paths: list[str]) -> bytes:
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for path in page_paths:
        item = ET.SubElement(urlset, "url")
        suffix = "/" if path == "index.html" else f'/{path.lstrip("/")}'
        ET.SubElement(item, "loc").text = f'{site_url.rstrip("/")}{base_path}{suffix}'
    return ET.tostring(urlset, encoding="utf-8", xml_declaration=True)


def build(root: Path, output: Path, site_url: str | None = None, production: bool = False) -> list[Path]:
    """Validate all inputs, render in memory, then write only the explicit public manifest."""
    root, output = _ensure_output_disjoint(Path(root), Path(output))
    config = _read_config(root)
    configured_url = site_url if site_url is not None else config["site_url"]
    if production and not configured_url:
        raise ValueError("production exige site_url HTTPS explícito por argumento ou site.config.json")
    effective_url = configured_url or DEFAULT_PREVIEW_URL
    origin, base_path = _parse_url(effective_url, production=production)
    site_url = origin + base_path
    og_image_url = f"{site_url.rstrip('/')}/assets/social-card.png" if (root / "assets/social-card.png").is_file() else None
    font_file = "cormorant.woff2" if (root / "assets/fonts/cormorant.woff2").is_file() else "cormorant.ttf"

    entries = _parse_entries(root)
    published = [entry for entry in entries if entry.meta["status"] == "published"]
    projects = [entry for entry in published if entry.kind == "projects"]
    posts = [entry for entry in published if entry.kind == "posts"]
    pages = [entry for entry in published if entry.kind == "pages"]
    reserved_routes = {"index.html", "404.html", "arquivo/index.html", "rss.xml", "sitemap.xml"}
    content_routes = [
        *(f"projetos/{entry.slug}.html" for entry in projects),
        *(f"arquivo/{entry.slug}.html" for entry in posts),
        *(f"{entry.slug}.html" for entry in pages),
    ]
    seen_routes = set(reserved_routes)
    for route in content_routes:
        if route in seen_routes:
            raise ValueError(f"rota de conteúdo reservada ou duplicada: {route}")
        seen_routes.add(route)
    home = _load_template(root, "home.html")
    header = _load_template(root, "header.html")
    footer = _load_template(root, "footer.html")
    if "{{ engraving }}" in home:
        engraving_path = root / "assets/engraving.svg"
        if engraving_path.is_file():
            engraving = engraving_path.read_text(encoding="utf-8")
        else:
            engraving = ""
        home = home.replace("{{ engraving }}", engraving)
    for placeholder, asset in (("{{ hero_desktop }}", "assets/hero-desktop.svg"),
                               ("{{ hero_mobile }}", "assets/hero-mobile.svg")):
        if placeholder in home:
            path = root / asset
            home = home.replace(placeholder, path.read_text(encoding="utf-8") if path.is_file() else "")
    if "{{ archive_preview }}" in home:
        home = home.replace("{{ archive_preview }}", _archive_preview(posts, base_path))
    home = home.replace('href="./"', f'href="{base_path or ""}/"')

    generated: dict[str, bytes] = {}
    home_header = header.replace(
        '<span class="signature-name">Guilherme Trajano</span>',
        '<h1 class="signature-name">Guilherme Trajano</h1>',
        1)
    generated["index.html"] = _page_shell(config=config, title=config["name"],
        description=config["name"],
        body=home, header=home_header, footer=footer, base_path=base_path, page_path="index.html",
        site_url=site_url, production=production, og_image_url=og_image_url, font_file=font_file)
    generated["404.html"] = _page_shell(config=config, title=config["name"],
        description=config["name"],
        body='<main class="reading" id="conteudo"></main>',
        header=header, footer=footer, base_path=base_path, page_path="404.html", site_url=site_url,
        production=production, canonical=False, font_file=font_file)
    generated["arquivo/index.html"] = _page_shell(config=config, title=config["name"],
        description=config["name"],
        body='<main class="reading" id="conteudo"></main>',
        header=header, footer=footer, base_path=base_path, page_path="arquivo/index.html", site_url=site_url,
        production=production, og_image_url=og_image_url, font_file=font_file)
    for entry in projects + posts:
        route = f"projetos/{entry.slug}.html" if entry.kind == "projects" else f"arquivo/{entry.slug}.html"
        generated[route] = _page_shell(config=config, title=config["name"], description=config["name"],
            body=_article_body(entry, base_path), header=header, footer=footer, base_path=base_path,
            page_path=route, site_url=site_url, production=production, og_image_url=og_image_url, font_file=font_file)
    for entry in pages:
        route = f'{entry.slug}.html'
        generated[route] = _page_shell(config=config, title=config["name"], description=config["name"],
            body=_page_body(entry, base_path, config),
            header=header, footer=footer, base_path=base_path, page_path=route, site_url=site_url,
            production=production, og_image_url=og_image_url, font_file=font_file)

    public_files = ["index.html", "404.html", "arquivo/index.html", *sorted(p for p in generated if p not in {"index.html", "404.html", "arquivo/index.html"})]
    sitemap_paths = ["index.html", "arquivo/index.html", *[p for p in public_files if p.startswith(("projetos/", "arquivo/")) and p != "arquivo/index.html"], *[p for p in public_files if p in ("curriculo.html", "privacidade.html")]]
    generated["rss.xml"] = _rss(posts, origin, base_path, config)
    generated["sitemap.xml"] = _sitemap(origin, base_path, sitemap_paths)

    # Public assets are an explicit allowlist. Fonts prefer woff2 when available.
    assets = ["assets/favicon.svg", "assets/engraving.svg", "assets/hero-desktop.svg",
              "assets/hero-mobile.svg", "assets/social-card.png",
              "assets/case-sdd.svg", "assets/case-rag.svg",
              "assets/fonts/cormorantgaramond-OFL.txt", "assets/fonts/manrope-OFL.txt"]
    for font in ("cormorant", "manrope"):
        woff = f"assets/fonts/{font}.woff2"
        ttf = f"assets/fonts/{font}.ttf"
        assets.append(woff if (root / woff).is_file() else ttf)
    assets.append("assets/fonts/cormorant-ext.woff2")
    sheets = root / "assets/gravura"
    if sheets.is_dir():
        assets.extend(str(path.relative_to(root)) for path in sorted(sheets.rglob("*.webp")))
    for vendor in ("gsap.min.js", "ScrollTrigger.min.js", "lenis.min.js"):
        assets.append(f"assets/vendor/{vendor}")
    for name in assets:
        source = root / name
        if source.is_file():
            generated[name] = source.read_bytes()
    # These source assets are referenced by the supplied home/CSS where present.
    for name in ("index.css", "index.js", "theme.js"):
        source = root / name
        if source.is_file():
            data = source.read_bytes()
            if name == "index.css":
                css = data.decode("utf-8")
                def fix_font_face(match):
                    block = match.group(0)
                    family_name = re.search(r"font-family\s*:\s*([^;]+)", block, re.I)
                    if not family_name:
                        return block
                    family = family_name.group(1).strip(" '\"\r\n").lower()
                    if (family in ("cormorant", "manrope")
                            and not (root / f"assets/fonts/{family}.woff2").is_file()
                            and (root / f"assets/fonts/{family}.ttf").is_file()):
                        block = block.replace(f"{family}.woff2", f"{family}.ttf")
                        block = block.replace("format('woff2')", "format('truetype')")
                    return block

                css = re.sub(r"@font-face\s*\{[^}]*\}", fix_font_face, css, flags=re.I)
                data = css.encode("utf-8")
            generated[name] = data

    generated = {name: value.encode("utf-8") if isinstance(value, str) else value
                 for name, value in generated.items()}

    expected = set(generated) | {"manifest.json"}
    if output.exists():
        if not output.is_dir():
            raise ValueError(f"output não é diretório: {output}")
        extras = sorted(str(path.relative_to(output)) for path in output.rglob("*")
                        if path.is_file() and str(path.relative_to(output)) not in expected)
        if extras:
            raise ValueError("Arquivos inesperados no output; inspecione antes do build: " + ", ".join(extras))
        for relative in generated:
            destination = output / relative
            if destination.exists() and not destination.is_file():
                raise ValueError(f"caminho de saída esperado não é arquivo: {relative}")
            parent = destination.parent
            while parent != output and output in parent.parents:
                if parent.exists() and not parent.is_dir():
                    raise ValueError(f"diretório de saída bloqueado por arquivo: {parent.relative_to(output)}")
                parent = parent.parent
    manifest = json.dumps({"base_path": base_path, "files": sorted(expected)}, ensure_ascii=False, indent=2) + "\n"
    generated["manifest.json"] = manifest.encode("utf-8")

    output.mkdir(parents=True, exist_ok=True)
    emitted: list[Path] = []
    for relative, data in generated.items():
        destination = output / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        emitted.append(destination)
    return emitted

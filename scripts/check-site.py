"""Validate links, fragments, RSS, and manifest contents in a built site."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from pathlib import PurePosixPath
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.refs = []
        self.ids = set()
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        for name in ("href", "src"):
            if attributes.get(name) is not None:
                self.refs.append((name, attributes[name]))


def base_path_from(root, output, override):
    if override is not None:
        value = override
    else:
        value = ""
        manifest = output / "manifest.json"
        if manifest.is_file():
            try:
                data = json.loads(manifest.read_text(encoding="utf-8"))
                value = data.get("base_path", "") if isinstance(data, dict) else ""
            except (OSError, ValueError):
                pass
        if not value:
            config = root / "site.config.json"
            if config.is_file():
                try:
                    site_url = json.loads(config.read_text(encoding="utf-8")).get("site_url", "")
                    value = urlsplit(site_url).path if site_url else ""
                except (OSError, ValueError, AttributeError):
                    pass
    return "/" + unquote(str(value).strip("/")) if value and str(value).strip("/") else ""


def manifest_files(output, errors):
    path = output / "manifest.json"
    if not path.is_file():
        errors.append("manifest.json: required public file allowlist is missing")
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        errors.append(f"manifest.json: invalid JSON ({exc})")
        return None
    if not isinstance(data, dict) or not isinstance(data.get("files"), list):
        errors.append('manifest.json: expected an object with a "files" list')
        return None
    entries = data["files"]
    if not entries:
        errors.append("manifest.json: files list must not be empty")
        return None
    result = set()
    invalid = False
    for name in entries:
        if not isinstance(name, str):
            errors.append(f"manifest.json: file entry must be a string, got {name!r}")
            invalid = True
            continue
        if (not name or name.startswith("/") or "\\" in name or "\0" in name
                or re.match(r"^[A-Za-z]:", name)
                or any(part in ("", ".", "..") for part in name.split("/"))):
            errors.append(f"manifest.json: unsafe output path {name!r}")
            invalid = True
            continue
        normalized = PurePosixPath(name).as_posix()
        if normalized in result:
            errors.append(f"manifest.json: duplicate output path {name!r}")
            invalid = True
        result.add(normalized)
    if invalid:
        return None
    return result


def ids_in(path):
    if path.suffix.lower() in {".html", ".htm"}:
        return Document(path.read_text(encoding="utf-8")).ids
    if path.suffix.lower() == ".svg":
        tree = ET.parse(path)
        return {node.attrib["id"] for node in tree.iter() if "id" in node.attrib}
    return set()


def check(root, output, base_path=""):
    errors = []
    count = 0
    if not output.is_dir():
        return 0, [f"output directory does not exist: {output}"]
    output = output.resolve()
    pages = sorted(output.rglob("*.html")) + sorted(output.rglob("*.htm"))
    parsed = {}
    for page in pages:
        try:
            parsed[page.resolve()] = Document(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as exc:
            errors.append(f"{page.relative_to(output)}: cannot read HTML ({exc})")

    for source, doc in parsed.items():
        for attribute, ref in doc.refs:
            count += 1
            if not ref or ref.startswith("//"):
                continue
            url = urlsplit(ref.strip())
            scheme = url.scheme.lower()
            if scheme:
                if scheme in {"http", "https", "mailto", "tel"}:
                    continue
                errors.append(f"{source.relative_to(output)}: unsafe {attribute} URL {ref!r}")
                continue
            raw_path = unquote(url.path)
            if raw_path == base_path and base_path:
                raw_path = ""
            elif raw_path.startswith(base_path + "/") and base_path:
                raw_path = raw_path[len(base_path):]
            if raw_path.startswith("/"):
                target = (output / raw_path.lstrip("/"))
            elif raw_path:
                target = source.parent / raw_path
            else:
                target = source
            target = target.resolve()
            try:
                target.relative_to(output)
            except ValueError:
                errors.append(f"{source.relative_to(output)}: URL escapes output: {ref!r}")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{source.relative_to(output)}: missing {attribute} target {ref!r}")
                continue
            if url.fragment:
                try:
                    target_ids = ids_in(target)
                except (OSError, ET.ParseError, UnicodeError) as exc:
                    errors.append(f"{source.relative_to(output)}: cannot inspect fragment target {ref!r}: {exc}")
                else:
                    if unquote(url.fragment) not in target_ids:
                        errors.append(f"{source.relative_to(output)}: missing fragment {ref!r}")

    for feed in output.rglob("*.xml"):
        try:
            tree = ET.parse(feed)
        except (OSError, ET.ParseError) as exc:
            errors.append(f"{feed.relative_to(output)}: invalid XML ({exc})")
            continue
        root_tag = tree.getroot().tag.rsplit("}", 1)[-1].lower()
        if root_tag in {"rss", "feed"}:
            count += 1
            if root_tag == "rss" and tree.find("channel") is None:
                errors.append(f"{feed.relative_to(output)}: RSS document has no channel")

    allowed = manifest_files(output, errors)
    if allowed is not None:
        actual = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}
        for extra in sorted(actual - allowed):
            errors.append(f"unexpected output file: {extra}")
        for absent in sorted(allowed - actual):
            errors.append(f"manifest file is missing: {absent}")
    return count, errors


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=Path(__file__).resolve().parent.parent,
                        help="source repository root (default: checker parent)")
    parser.add_argument("output", nargs="?", type=Path, help="built site directory (default: ROOT/dist)")
    parser.add_argument("--base-path", help="URL path prefix such as /portfolio; inferred from manifest/config when omitted")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    output = (args.output or root / "dist").resolve()
    base_path = base_path_from(root, output, args.base_path)
    count, errors = check(root, output, base_path)
    print(f"{count} local references and feeds checked; {len(errors)} errors.")
    for error in errors:
        print(error)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
